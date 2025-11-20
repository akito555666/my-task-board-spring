import express from 'express';
import cors from 'cors';
import boardsRouter from './routes/boards';
import tasksRouter from './routes/tasks';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/boards', boardsRouter);
app.use('/api/tasks', tasksRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
