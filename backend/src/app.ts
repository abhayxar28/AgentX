import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import { requestLogger } from './middleware/requestLogger';
import { sendError } from './utils/apiResponse';
import path from 'path/win32';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(requestLogger);

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use(express.static(path.join(__dirname, '../public')));


// 404
app.use((_req, res) => {
  sendError(res, 'NOT_FOUND', 'Route not found', 404);
});

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
  
// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  sendError(res, 'INTERNAL_ERROR', 'An unexpected error occurred', 500);
});

export default app;
