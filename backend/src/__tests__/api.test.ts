import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
app.get('/api/puzzles', (_req, res) => {
  const file = path.join(__dirname, '..', 'puzzles', 'example.json');
  const raw = fs.readFileSync(file, 'utf8');
  res.json([JSON.parse(raw)]);
});

describe('GET /api/puzzles', () => {
  it('returns puzzles array', async () => {
    const res = await request(app).get('/api/puzzles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].width).toBeGreaterThan(0);
  });
});
