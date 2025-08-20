import React, { useState, useRef } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(''); // "", "easy", "hard"
  const titleRef = useRef(null);

  // Handle player move
  const handleClick = (index) => {
    if (board[index] !== '' || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);

    const gameOver = checkWin(newBoard);
    if (gameOver) return;

    setIsXTurn(!isXTurn);

    // If AI mode and player just played X, trigger AI
    if (mode && isXTurn) {
      setTimeout(() => aiMove(newBoard), 500);
    }
  };

  // AI move
  const aiMove = (newBoard) => {
    if (winner) return;

    let move;
    if (mode === 'easy') {
      // Random move
      const available = newBoard
        .map((v, i) => (v === '' ? i : null))
        .filter((v) => v !== null);
      move = available[Math.floor(Math.random() * available.length)];
    } else if (mode === 'hard') {
      // Minimax best move
      move = bestMove(newBoard, 'O').index;
    }

    if (move !== undefined) {
      newBoard[move] = 'O';
      setBoard([...newBoard]);
      const gameOver = checkWin(newBoard);
      if (!gameOver) setIsXTurn(true);
    }
  };

  // Minimax algorithm for Hard AI
  const bestMove = (newBoard, player) => {
    const availSpots = newBoard
      .map((v, i) => (v === '' ? i : null))
      .filter((v) => v !== null);

    if (checkWinner(newBoard, 'X')) return { score: -10 };
    if (checkWinner(newBoard, 'O')) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i of availSpots) {
      const move = {};
      move.index = i;
      newBoard[i] = player;

      if (player === 'O') {
        const result = bestMove(newBoard, 'X');
        move.score = result.score;
      } else {
        const result = bestMove(newBoard, 'O');
        move.score = result.score;
      }

      newBoard[i] = '';
      moves.push(move);
    }

    let best;
    if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          best = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          best = i;
        }
      }
    }
    return moves[best];
  };

  // Check winner helper
  const checkWinner = (newBoard, player) => {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return wins.some(
      ([a, b, c]) =>
        newBoard[a] === player &&
        newBoard[a] === newBoard[b] &&
        newBoard[b] === newBoard[c]
    );
  };

  // Game-over check
  const checkWin = (newBoard) => {
    if (checkWinner(newBoard, 'X')) {
      setWinner('X');
      return true;
    }
    if (checkWinner(newBoard, 'O')) {
      setWinner('O');
      return true;
    }
    if (!newBoard.includes('')) {
      setWinner('Draw');
      return true;
    }
    return false;
  };

  // Reset game
  const reset = () => {
    setBoard(Array(9).fill(''));
    setIsXTurn(true);
    setWinner(null);
  };

  return (
    <div className="container">
      <h1 className="title" ref={titleRef}>
        {winner === null && <>Tic Tac Toe <span>React</span></>}
        {winner === 'X' && <>🎉 Congratulations : <img src={cross_icon} alt="X" /></>}
        {winner === 'O' && <>🎉 Congratulations : <img src={circle_icon} alt="O" /></>}
        {winner === 'Draw' && <>🤝 It&apos;s a Draw!</>}
      </h1>

      {winner === null && (
        <div className="turn-indicator">
          Next Turn: {isXTurn ? <img src={cross_icon} alt="X" /> : <img src={circle_icon} alt="O" />}
        </div>
      )}

      <div className="mode-select">
        <button onClick={() => { reset(); setMode(''); }}>2 Player</button>
        <button onClick={() => { reset(); setMode('easy'); }}>AI Easy</button>
        <button onClick={() => { reset(); setMode('hard'); }}>AI Hard</button>
      </div>

      <div className="board">
        {board.map((value, index) => (
          <div key={index} className="boxes" onClick={() => handleClick(index)}>
            {value === 'X' && <img src={cross_icon} alt="X" />}
            {value === 'O' && <img src={circle_icon} alt="O" />}
          </div>
        ))}
      </div>

      <button className="reset" onClick={reset}>Reset</button>

      <footer className="credits">
        Created with ❤️ by <strong>Sarvagya Pathak</strong>
      </footer>
    </div>
  );
};

export default TicTacToe;
