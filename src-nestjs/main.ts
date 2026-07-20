// Polyfill WebSocket for Supabase Realtime in Node.js < 22
(global as any).WebSocket = require('ws');
require('ejs'); // Force Vercel to bundle EJS engine

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as path from 'path';
import * as fs from 'fs';
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

let server: any;

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp)
  );

  // Setup cookie-parser for session management
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  // Setup urlencoded parsing for EJS form submissions
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Setup static assets (CSS, JS, images)
  app.useStaticAssets(path.join(process.cwd(), 'public'));

  // Ensure uploads directory exists (only locally, Vercel has read-only filesystem)
  if (!process.env.VERCEL) {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  // Setup EJS views engine
  app.setBaseViewsDir(path.join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  await app.init();
  return expressApp;
}

// For local running (only runs if not in a Vercel serverless environment)
if (!process.env.VERCEL) {
  bootstrap().then((expressInstance) => {
    const port = process.env.PORT || 3000;
    expressInstance.listen(port, () => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  });
}

// Export the serverless handler
export default async (req: any, res: any) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
};
