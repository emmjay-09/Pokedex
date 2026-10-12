import { useState } from "react";
import React from "react";
import { useEffect } from "react";
import "./App.css";

function Square({
  value,
  handleClick,
}: {
  value: string | null;
  handleClick: () => void;
}) {
  return (
    <button
      className={`text-[50px] m-1 w-[60px]  h-[60px]  flex border border-gray-300 justify-center items-center ${value === "X" ? "text-red-500" : "text-blue-500"}`}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

function Board() {
  const [value, setValue] = useState(true);
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null),
  );
  const [savedValue, setSavedValue] = useState<(string | null)[]>(
    Array(9).fill(null),
  );
  const [running, setRunning] = useState(true);
  useEffect(() => {
    checkWinner(squares);
  }, [squares]);
  const winningMoves: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWinner(squares: (string | null)[]) {
    const list = winningMoves.map((move, index) => {
      const [a, b, c] = move;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        setRunning(false);
        setValue(!value);
        setSavedValue(squares);
        setSquares(savedValue);
      }
      return null;
    });
  }

  function handleClick(i: number) {
    setSquares((currentSquares) => {
      if (currentSquares[i] !== null) return currentSquares;
      const newSquares = currentSquares.slice();
      setValue(!value);
      newSquares[i] = value ? "X" : "O";
      return newSquares;
    });
  }
  return (
    <>
      <div
        className={`flex text-xl font-bold mb-5 ${value ? "text-red-500" : "text-blue-500"}`}
      >
        {running ? (
          <div>Next player: {value ? "X" : "O"}</div>
        ) : (
          <div>Game Over: {value ? "X" : "O"} WINS</div>
        )}
      </div>
      <div className="flex flex-wrap">
        <Square value={squares[0]} handleClick={() => handleClick(0)} />
        <Square value={squares[1]} handleClick={() => handleClick(1)} />
        <Square value={squares[2]} handleClick={() => handleClick(2)} />
      </div>
      <div className="flex flex-wrap w-[300px]">
        <Square value={squares[3]} handleClick={() => handleClick(3)} />
        <Square value={squares[4]} handleClick={() => handleClick(4)} />
        <Square value={squares[5]} handleClick={() => handleClick(5)} />
      </div>
      <div className="flex flex-wrap w-[300px]">
        <Square value={squares[6]} handleClick={() => handleClick(6)} />
        <Square value={squares[7]} handleClick={() => handleClick(7)} />
        <Square value={squares[8]} handleClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default Board;
