import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import authRoutes from './server/routes/auth';
import workersRoutes from './server/routes/workers';
import bookingsRoutes from './server/routes/bookings';
import adminRoutes from './server/routes/admin';
import miscRoutes from './server/routes/misc';

import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Request parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static downloads directory (serves APK directly)
  const downloadsPath = path.resolve(__dirname, 'public/downloads');
  app.use('/downloads', express.static(downloadsPath));

  // Direct APK download route
  app.get('/api/download/apk', (req, res) => {
    const apkFile = path.join(downloadsPath, 'kaam-wala-pakistan.apk');
    if (fs.existsSync(apkFile)) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.download(apkFile, 'kaam-wala-pakistan.apk');
    } else {
      res.status(404).json({ error: 'APK build not found' });
    }
  });

  // Check APK build status / info
  app.get('/api/download/apk/info', (req, res) => {
    const apkFile = path.join(downloadsPath, 'kaam-wala-pakistan.apk');
    if (fs.existsSync(apkFile)) {
      const stats = fs.statSync(apkFile);
      res.json({
        exists: true,
        filename: 'kaam-wala-pakistan.apk',
        version: '1.0.0',
        versionCode: 1,
        package: 'com.kaamwalapakistan.app',
        sizeBytes: stats.size,
        sizeMb: (stats.size / 1024).toFixed(1) + ' KB',
        downloadUrl: '/api/download/apk',
        updatedAt: stats.mtime.toISOString(),
      });
    } else {
      res.json({ exists: false });
    }
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/workers', workersRoutes);
  app.use('/api/bookings', bookingsRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', miscRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Kaam Wala Pakistan API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Vite middleware in dev or static files in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Kaam Wala Pakistan server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
