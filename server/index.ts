import express from 'express';
import cors from 'cors';
import boardsRouter from './routes/boards.js';
import tasksRouter from './routes/tasks.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/boards', boardsRouter);
app.use('/api/tasks', tasksRouter);

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;
