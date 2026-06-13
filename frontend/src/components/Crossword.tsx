import React, { useMemo, useState, useRef } from 'react';

type Clue = { num: number; row: number; col: number; len: number; clue: string };
type Puzzle = {
  width: number;
  height: number;
  grid: string[]; // rows
  clues?: { across?: Clue[]; down?: Clue[] };
};

export default function Crossword({ puzzle }: { puzzle: Puzzle }) {
  const { width, height, grid, clues } = puzzle;
  const solution = useMemo(() => grid.map((r) => r.split('')), [grid]);

  // initialize cells as empty for letter positions, null for black
  const [cells, setCells] = useState<string[][]>(() =>
    grid.map((row) => row.split('').map((ch) => (ch === '.' ? '.' : '')))
  );

  const inputsRef = useRef<HTMLInputElement[][]>([] as unknown as HTMLInputElement[][]);

  function setChar(r: number, c: number, ch: string) {
    setCells((prev) => {
      const copy = prev.map((rr) => rr.slice());
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
    setCells(grid.map((row) => row.split('').map((ch) => (ch === '.' ? '.' : ch))));
  }

  function focusNext(r: number, c: number) {
    // try move right, then next row
    for (let cc = c + 1; cc < width; cc++) {
      if (grid[r][cc] !== '.') {
        inputsRef.current[r][cc]?.focus();
        return;
      }
    }
    for (let rr = r + 1; rr < height; rr++) {
      for (let cc = 0; cc < width; cc++) if (grid[rr][cc] !== '.') {
        inputsRef.current[rr][cc]?.focus();
        return;
      }
    }
  }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${width}, 2.2rem)` }}>
          {cells.map((row, r) =>
            row.map((ch, c) => {
              if (grid[r][c] === '.') return <div key={`${r}-${c}`} className="cell black" />;
              return (
                <input
                  key={`${r}-${c}`}
                  ref={(el) => {
                    inputsRef.current[r] = inputsRef.current[r] || [];
                    if (el) inputsRef.current[r][c] = el;
                  }}
                  className="cell"
                  maxLength={1}
                  value={cells[r][c]}
                  onChange={(e) => setChar(r, c, e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (key === 'ArrowRight') focusNext(r, c);
                    if (key === 'Enter') focusNext(r, c);
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

      <div style={{ minWidth: 260 }}>
        <h3>Across</h3>
        <ul>
          {clues?.across?.map((c) => (
            <li key={`a-${c.num}`}>
              <strong>{c.num}.</strong> {c.clue} ({c.len})
            </li>
          ))}
        </ul>

        <h3>Down</h3>
        <ul>
          {clues?.down?.map((c) => (
            <li key={`d-${c.num}`}>
              <strong>{c.num}.</strong> {c.clue} ({c.len})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
