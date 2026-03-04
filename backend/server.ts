import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import db from './db.js';

const frontendRoot = fileURLToPath(new URL('../frontend', import.meta.url));

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 5173);
  const HOST = process.env.HOST ?? '127.0.0.1';

  app.use(express.json());

  // Haversine formula to calculate distance in meters
  function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Radius of the earth in m
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in m
    return d;
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  function logAuditoria(usuario_id: number | null, empresa_id: number | null, acao: string, detalhes: string) {
    const data_hora = new Date().toISOString();
    const insert = db.prepare('INSERT INTO auditoria (usuario_id, empresa_id, acao, detalhes, data_hora) VALUES (?, ?, ?, ?, ?)');
    insert.run(usuario_id, empresa_id, acao, detalhes, data_hora);
  }

  // API Routes
  app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    const user = db.prepare('SELECT * FROM usuarios WHERE email = ? AND senha = ?').get(email, senha) as any;
    
    if (user) {
      const { senha, ...userWithoutPassword } = user;
      logAuditoria(user.id, user.empresa_id, 'LOGIN_SUCESSO', `Usu�rio ${user.nome} logou no sistema`);
      res.json({ token: 'mock-jwt-token-' + user.id, user: userWithoutPassword });
    } else {
      logAuditoria(null, null, 'LOGIN_FALHA', `Tentativa de login falhou para o email/cpf: ${email}`);
      res.status(401).json({ error: 'Credenciais inv�lidas' });
    }
  });

  app.get('/api/empresas', (req, res) => {
    const empresas = db.prepare('SELECT id, nome FROM empresas').all();
    res.json(empresas);
  });

  app.post('/api/register', (req, res) => {
    const { nome, cpf, senha, empresa_id } = req.body;
    
    if (!nome || !cpf || !senha || !empresa_id) {
      return res.status(400).json({ error: 'Todos os campos s�o obrigat�rios' });
    }

    try {
      // Check if CPF (stored in email column) already exists
      const existingUser = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(cpf);
      if (existingUser) {
        return res.status(400).json({ error: 'CPF j� cadastrado' });
      }

      const insert = db.prepare('INSERT INTO usuarios (nome, email, senha, role, empresa_id) VALUES (?, ?, ?, ?, ?)');
      const result = insert.run(nome, cpf, senha, 'EMPLOYEE', empresa_id);
      
      logAuditoria(result.lastInsertRowid as number, empresa_id, 'CADASTRO_FUNCIONARIO', `Novo funcion�rio cadastrado: ${nome} (CPF: ${cpf})`);
      
      res.status(201).json({ message: 'Cadastro realizado com sucesso' });
    } catch (err) {
      console.error('Erro ao registrar usu�rio:', err);
      res.status(500).json({ error: 'Erro interno ao realizar cadastro' });
    }
  });

  app.post('/api/pontos', (req, res) => {
    try {
      console.log('Recebendo requisi��o de ponto:', req.body);
      const { usuario_id, tipo, latitude, longitude } = req.body;
      
      if (!usuario_id || !tipo || latitude === undefined || longitude === undefined) {
        console.error('Dados incompletos:', req.body);
        return res.status(400).json({ error: 'Dados incompletos para registrar ponto' });
      }

      const user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuario_id) as any;
      if (!user) {
        console.error('Usu�rio n�o encontrado:', usuario_id);
        return res.status(404).json({ error: 'Usu�rio n�o encontrado' });
      }

      const empresa = db.prepare('SELECT * FROM empresas WHERE id = ?').get(user.empresa_id) as any;
      if (!empresa) {
        console.error('Empresa n�o encontrada para o usu�rio:', user.empresa_id);
        return res.status(404).json({ error: 'Empresa n�o encontrada' });
      }
      
      const distance = getDistanceFromLatLonInM(latitude, longitude, empresa.latitude, empresa.longitude);
      console.log(`Dist�ncia calculada: ${distance}m. Raio permitido: ${empresa.raio_permitido}m`);
      
      let status = 'VALIDO';
      if (distance > empresa.raio_permitido) {
        status = 'FORA_DO_RAIO';
        logAuditoria(user.id, user.empresa_id, 'REGISTRO_PONTO_FALHA', `Tentativa de ponto (${tipo}) fora do raio permitido. Dist�ncia: ${Math.round(distance)}m`);
        // Remove the early return so it actually saves the point as FORA_DO_RAIO
        // return res.status(403).json({ error: 'Fora do raio permitido da empresa', distance, allowed: empresa.raio_permitido });
      }

      const data_hora = new Date().toISOString();
      
      const insert = db.prepare('INSERT INTO pontos (usuario_id, tipo, data_hora, latitude, longitude, status) VALUES (?, ?, ?, ?, ?, ?)');
      const result = insert.run(usuario_id, tipo, data_hora, latitude, longitude, status);
      
      logAuditoria(user.id, user.empresa_id, 'REGISTRO_PONTO', `Ponto de ${tipo} registrado com sucesso. Status: ${status}`);
      
      console.log('Ponto registrado com sucesso:', result.lastInsertRowid);
      
      if (status === 'FORA_DO_RAIO') {
        res.status(200).json({ warning: 'Ponto registrado, mas voc� est� fora do raio permitido da empresa.', distance, allowed: empresa.raio_permitido, status: 'success' });
      } else {
        res.json({ id: result.lastInsertRowid, status: 'success', data_hora });
      }
    } catch (error: any) {
      console.error('Erro detalhado na API /api/pontos:', error);
      res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  });

  app.get('/api/pontos/usuario/:id', (req, res) => {
    const pontos = db.prepare('SELECT * FROM pontos WHERE usuario_id = ? ORDER BY data_hora DESC LIMIT 50').all(req.params.id);
    res.json(pontos);
  });

  app.get('/api/pontos/empresa/:id', (req, res) => {
    const pontos = db.prepare(`
      SELECT p.*, u.nome as usuario_nome 
      FROM pontos p 
      JOIN usuarios u ON p.usuario_id = u.id 
      WHERE u.empresa_id = ? 
      ORDER BY p.data_hora DESC
    `).all(req.params.id);
    res.json(pontos);
  });

  app.get('/api/dashboard/stats/:empresa_id', (req, res) => {
    const empresa_id = req.params.empresa_id;
    const today = new Date().toISOString().split('T')[0];
    
    const ativos = db.prepare("SELECT COUNT(*) as count FROM usuarios WHERE empresa_id = ? AND role = 'EMPLOYEE'").get(empresa_id) as any;
    const registrosHoje = db.prepare(`
      SELECT COUNT(*) as count FROM pontos p 
      JOIN usuarios u ON p.usuario_id = u.id 
      WHERE u.empresa_id = ? AND p.data_hora LIKE ?
    `).get(empresa_id, `${today}%`) as any;

    res.json({
      funcionariosAtivos: ativos.count,
      registrosHoje: registrosHoje.count
    });
  });

  app.get('/api/auditoria/empresa/:id', (req, res) => {
    const logs = db.prepare(`
      SELECT a.*, u.nome as usuario_nome, u.email as usuario_email
      FROM auditoria a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.empresa_id = ? OR a.empresa_id IS NULL
      ORDER BY a.data_hora DESC
      LIMIT 100
    `).all(req.params.id);
    res.json(logs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: frontendRoot,
      configFile: path.join(frontendRoot, 'vite.config.ts'),
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }

      try {
        const indexHtmlPath = path.join(frontendRoot, 'index.html');
        const template = await readFile(indexHtmlPath, 'utf-8');
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  } else {
    const distPath = path.join(frontendRoot, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
