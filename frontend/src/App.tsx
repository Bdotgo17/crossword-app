import React, { useEffect, useState } from 'react';
import Crossword from './components/Crossword';

type Puzzle = {
  width: number;
  height: number;
  grid: string[]; // rows, '.' is black
};

export default function App() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [selectedPuzzleIndex, setSelectedPuzzleIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedPuzzleIndex');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/puzzles')
      .then((r) => r.json())
      .then((data: Puzzle[]) => {
        setPuzzles(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((e) => {
        console.error(e);
        setError('Failed to load puzzles.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('selectedPuzzleIndex', String(selectedPuzzleIndex));
    } catch {
      // localStorage write failed, ignore
    }
  }, [selectedPuzzleIndex]);

  const selectedPuzzle = puzzles[selectedPuzzleIndex] ?? null;

  return (
    <div className="app">
      <h1>Crossword</h1>
      {isLoading && <div>Loading puzzles...</div>}
      {!isLoading && error && <div>{error}</div>}
      {!isLoading && !error && puzzles.length === 0 && <div>No puzzles available.</div>}

      {!isLoading && !error && puzzles.length > 0 && (
        <>
          {puzzles.length > 1 && (
            <div className="puzzle-picker">
              <label htmlFor="puzzle-select">Puzzle:</label>
              <select
                id="puzzle-select"
                value={selectedPuzzleIndex}
                onChange={(e) => setSelectedPuzzleIndex(Number(e.target.value))}
              >
                {puzzles.map((puzzle, index) => (
                  <option key={`puzzle-${index}`} value={index}>
                    Puzzle {index + 1} ({puzzle.width}x{puzzle.height})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedPuzzle && (
            <Crossword
              key={`puzzle-${selectedPuzzleIndex}`}
              puzzle={selectedPuzzle}
              puzzleIndex={selectedPuzzleIndex}
            />
          )}
        </>
      )}
    </div>
  );
}
