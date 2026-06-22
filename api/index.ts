import { handle } from 'hono/vercel';
import app from './boot';

// Vercel serverless function entrypoint
export default handle(app);
