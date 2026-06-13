import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const puzzlesDir = path.join(__dirname, 'puzzles');

app.get('/api/puzzles', (req, res) => {
  const file = path.join(puzzlesDir, 'example.json');
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);
    res.json([data]);
  } catch (e) {
    res.status(500).json({ error: 'failed to load puzzles' });
  }
});

// In production serve frontend built files if present
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
