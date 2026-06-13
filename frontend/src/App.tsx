import React, { useEffect, useState } from 'react';
import Crossword from './components/Crossword';

type Puzzle = {
  width: number;
  height: number;
  grid: string[]; // rows, '.' is black
};

export default function App() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    fetch('/api/puzzles')
      .then((r) => r.json())
      .then((data) => setPuzzle(data[0]))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="app">
      <h1>Crossword</h1>
      {puzzle ? <Crossword puzzle={puzzle} /> : <div>Loading puzzle...</div>}
    </div>
  );
}
