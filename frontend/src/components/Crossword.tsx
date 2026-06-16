import React, { useMemo, useRef, useState } from 'react';

type Clue = { num: number; row: number; col: number; len: number; clue: string };
type Puzzle = {
  width: number;
  height: number;
  grid: string[]; // rows
  clues?: { across?: Clue[]; down?: Clue[] };
};

type Direction = 'across' | 'down';
type Position = { row: number; col: number };

function inBounds(row: number, col: number, height: number, width: number) {
  return row >= 0 && row < height && col >= 0 && col < width;
}

function clueContainsCell(clue: Clue, direction: Direction, row: number, col: number) {
  if (direction === 'across') {
    return row === clue.row && col >= clue.col && col < clue.col + clue.len;
  }
  return col === clue.col && row >= clue.row && row < clue.row + clue.len;
}

function clueCells(clue: Clue, direction: Direction): Position[] {
  return Array.from({ length: clue.len }, (_, index) => ({
    row: clue.row + (direction === 'down' ? index : 0),
    col: clue.col + (direction === 'across' ? index : 0),
  }));
}

export default function Crossword({ puzzle }: { puzzle: Puzzle }) {
  const { width, height, grid, clues } = puzzle;

  // initialize cells as empty for letter positions, null for black
  const [cells, setCells] = useState<string[][]>(() =>
    grid.map((row) => row.split('').map((ch) => (ch === '.' ? '.' : '')))
  );
  const [activeCell, setActiveCell] = useState<Position | null>(null);
  const [direction, setDirection] = useState<Direction>('across');

  const acrossClues = clues?.across ?? [];
  const downClues = clues?.down ?? [];

  const inputsRef = useRef<Array<Array<HTMLInputElement | null>>>([]);

  const activeClue = useMemo(() => {
    if (!activeCell) return null;
    const candidates = direction === 'across' ? acrossClues : downClues;
    return (
      candidates.find((clue) =>
        clueContainsCell(clue, direction, activeCell.row, activeCell.col)
      ) ?? null
    );
  }, [activeCell, acrossClues, direction, downClues]);

  const activeClueCells = useMemo(() => {
    if (!activeClue) return new Set<string>();
    return new Set(clueCells(activeClue, direction).map((cell) => `${cell.row}-${cell.col}`));
  }, [activeClue, direction]);

  function focusCell(row: number, col: number) {
    inputsRef.current[row]?.[col]?.focus();
    setActiveCell({ row, col });
  }

  function moveInDirection(row: number, col: number, step: -1 | 1, nextDirection: Direction) {
    const rowStep = nextDirection === 'down' ? step : 0;
    const colStep = nextDirection === 'across' ? step : 0;
    const nextRow = row + rowStep;
    const nextCol = col + colStep;
    if (!inBounds(nextRow, nextCol, height, width)) return null;
    if (grid[nextRow][nextCol] === '.') return null;
    return { row: nextRow, col: nextCol };
  }

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

  function onCellInput(r: number, c: number, value: string) {
    const nextValue = value.replace(/[^a-zA-Z]/g, '').slice(0, 1);
    setChar(r, c, nextValue);
    if (!nextValue) return;

    const next = moveInDirection(r, c, 1, direction);
    if (next) {
      focusCell(next.row, next.col);
    }
  }

  function onBackspace(r: number, c: number) {
    if (cells[r][c]) {
      setChar(r, c, '');
      return;
    }

    const prev = moveInDirection(r, c, -1, direction);
    if (prev) {
      setChar(prev.row, prev.col, '');
      focusCell(prev.row, prev.col);
    }
  }

  function onArrow(r: number, c: number, key: string) {
    if (key === 'ArrowRight') {
      setDirection('across');
      const next = moveInDirection(r, c, 1, 'across');
      if (next) focusCell(next.row, next.col);
      return;
    }
    if (key === 'ArrowLeft') {
      setDirection('across');
      const prev = moveInDirection(r, c, -1, 'across');
      if (prev) focusCell(prev.row, prev.col);
      return;
    }
    if (key === 'ArrowDown') {
      setDirection('down');
      const next = moveInDirection(r, c, 1, 'down');
      if (next) focusCell(next.row, next.col);
      return;
    }
    if (key === 'ArrowUp') {
      setDirection('down');
      const prev = moveInDirection(r, c, -1, 'down');
      if (prev) focusCell(prev.row, prev.col);
    }
  }

  function activateFromCell(row: number, col: number) {
    if (activeCell && activeCell.row === row && activeCell.col === col) {
      const canToggleAcross = acrossClues.some((clue) =>
        clueContainsCell(clue, 'across', row, col)
      );
      const canToggleDown = downClues.some((clue) => clueContainsCell(clue, 'down', row, col));
      if (canToggleAcross && canToggleDown) {
        setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
      }
    }
    setActiveCell({ row, col });
  }

  function activateClue(clue: Clue, nextDirection: Direction) {
    setDirection(nextDirection);
    focusCell(clue.row, clue.col);
  }

  function isCurrentCell(row: number, col: number) {
    return !!activeCell && activeCell.row === row && activeCell.col === col;
  }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${width}, 2.2rem)` }}>
          {cells.map((row, r) =>
            row.map((ch, c) => {
              if (grid[r][c] === '.') return <div key={`${r}-${c}`} className="cell black" />;

              const isActive = activeClueCells.has(`${r}-${c}`);
              const classNames = [
                'cell',
                isActive ? 'active-cell' : '',
                isCurrentCell(r, c) ? 'current-cell' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <input
                  key={`${r}-${c}`}
                  ref={(el) => {
                    inputsRef.current[r] = inputsRef.current[r] || [];
                    if (el) inputsRef.current[r][c] = el;
                  }}
                  className={classNames}
                  maxLength={1}
                  value={cells[r][c]}
                  onClick={() => activateFromCell(r, c)}
                  onFocus={() => activateFromCell(r, c)}
                  onChange={(e) => onCellInput(r, c, e.target.value)}
                  onKeyDown={(e) => {
                    const key = e.key;
                    if (key.startsWith('Arrow')) {
                      e.preventDefault();
                      onArrow(r, c, key);
                      return;
                    }
                    if (key === 'Backspace') {
                      e.preventDefault();
                      onBackspace(r, c);
                      return;
                    }
                    if (key === 'Enter') {
                      e.preventDefault();
                      const next = moveInDirection(r, c, 1, direction);
                      if (next) focusCell(next.row, next.col);
                    }
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

      <div className="clues" style={{ minWidth: 260 }}>
        <h3>Across</h3>
        <ul>
          {clues?.across?.map((c) => (
            <li
              key={`a-${c.num}`}
              className={direction === 'across' && activeClue === c ? 'active-clue' : ''}
            >
              <button
                type="button"
                className="clue-button"
                onClick={() => activateClue(c, 'across')}
              >
                <strong>{c.num}.</strong> {c.clue} ({c.len})
              </button>
            </li>
          ))}
        </ul>

        <h3>Down</h3>
        <ul>
          {clues?.down?.map((c) => (
            <li
              key={`d-${c.num}`}
              className={direction === 'down' && activeClue === c ? 'active-clue' : ''}
            >
              <button type="button" className="clue-button" onClick={() => activateClue(c, 'down')}>
                <strong>{c.num}.</strong> {c.clue} ({c.len})
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
