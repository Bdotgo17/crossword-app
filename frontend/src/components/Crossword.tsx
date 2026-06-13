import React, { useMemo, useState } from 'react';

type Puzzle = {
  width: number;
  height: number;
  grid: string[]; // rows
};

export default function Crossword({ puzzle }: { puzzle: Puzzle }) {
  const { width, height, grid } = puzzle;
  const solution = useMemo(() => grid.join('\n'), [grid]);

  const [cells, setCells] = useState(() =>
    grid.map((row) => row.split(''))
  );

  function setChar(r: number, c: number, ch: string) {
    setCells((prev) => {
      const copy = prev.map((r) => r.slice());
      copy[r][c] = ch.toUpperCase();
      return copy;
    });
  }

  function check() {
    const wrong: [number, number][] = [];
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        if (grid[r][c] === '.') continue;
        if (cells[r][c] !== grid[r][c]) wrong.push([r, c]);
      }
    }
    if (wrong.length === 0) alert('All correct!');
    else alert(`Wrong letters: ${wrong.length}`);
  }

  function reveal() {
    setCells(grid.map((row) => row.split('')));
  }

  return (
    <div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${width}, 2.2rem)` }}>
        {cells.map((row, r) =>
          row.map((ch, c) => {
            if (grid[r][c] === '.') return <div key={`${r}-${c}`} className="cell black" />;
            return (
              <input
                key={`${r}-${c}`}
                className="cell"
                maxLength={1}
                value={cells[r][c]}
                onChange={(e) => setChar(r, c, e.target.value.replace(/[^a-zA-Z]/g, ''))}
                onKeyDown={(e) => {
                  const key = e.key;
                  if (key === 'ArrowRight') (e.target as HTMLInputElement).parentElement?.querySelectorAll('input')?.[0];
                }}
              />
            );
          })
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={check}>Check</button>
        <button onClick={reveal} style={{ marginLeft: 8 }}>
          Reveal
        </button>
      </div>
    </div>
  );
}
