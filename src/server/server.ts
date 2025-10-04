import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import cookiParser from 'cookie-parser';
const { api } = require('./api');
const { auth } = require('./auth');

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app: express.Application = express();
const commonEngine = new CommonEngine();

// Ajoute le middleware express.json() pour parser le corps des requêtes JSON
app.use(express.json()); // Cela permet d'accéder à req.body
app.use(cookiParser());

// Routes de l'API
app.use('/api', api);
app.use('/auth', auth);
// Servir le dossier 'uploads' en tant que ressource statique
app.use('/uploads', express.static('uploads'));

// Serveur les fichiers statiques depuis /browser
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  })
);

// Gère toutes les autres requêtes avec SSR Angular
app.get('**', (req: Request, res: Response, next: NextFunction) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

// Démarre le serveur si ce module est l'entrée principale
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
