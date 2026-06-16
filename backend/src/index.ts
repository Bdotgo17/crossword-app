import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

type Puzzle = {
  id?: string;
  title?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  width: number;
  height: number;
  grid: string[];
  clues?: {
    across?: Array<{ num: number; row: number; col: number; len: number; clue: string }>;
    down?: Array<{ num: number; row: number; col: number; len: number; clue: string }>;
  };
};

function getPuzzlesDir() {
  const candidateDirs = [
    path.join(__dirname, 'puzzles'),
    path.join(__dirname, '..', 'src', 'puzzles'),
  ];

  const puzzlesDir = candidateDirs.find((dir) => fs.existsSync(dir));
  if (!puzzlesDir) {
    throw new Error('puzzles directory not found');
  }

  return puzzlesDir;
}

function loadPuzzles(): Puzzle[] {
  const puzzlesDir = getPuzzlesDir();
  const files = fs
    .readdirSync(puzzlesDir)
    .filter((file) => file.endsWith('.json'))
    .sort();

  if (files.length === 0) {
    throw new Error('no puzzle files found');
  }

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(puzzlesDir, file), 'utf8');
    return JSON.parse(raw) as Puzzle;
  });
}

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/puzzles', (_req, res) => {
    try {
      res.json(loadPuzzles());
    } catch (_error) {
      res.status(500).json({ error: 'failed to load puzzles' });
    }
  });

  // In production serve frontend built files if present
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
  }

  return app;
}

export const app = createApp();

const port = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(port, () => console.log(`Server listening on ${port}`));
}
