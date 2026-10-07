import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import { processWasteImage } from './server/analyzeWasteHandler.ts';

// Custom Vite plugin to handle /api/analyze-waste locally during dev & preview
function ecoSnapApiPlugin() {
  return {
    name: 'ecosnap-api-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/analyze-waste', async (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              if (!data.imageBase64) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Missing imageBase64' }));
                return;
              }

              const result = await processWasteImage(data.imageBase64);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Server error' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ecoSnapApiPlugin()]
});
