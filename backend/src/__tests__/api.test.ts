import request from 'supertest';
import { app } from '../index';

describe('GET /api/puzzles', () => {
  it('returns all puzzles in the puzzles directory', async () => {
    const res = await request(app).get('/api/puzzles');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].width).toBeGreaterThan(0);
    expect(res.body.every((puzzle: { width: number; height: number; grid: string[] }) => (
      typeof puzzle.width === 'number'
      && typeof puzzle.height === 'number'
      && Array.isArray(puzzle.grid)
    ))).toBe(true);
  });
});
