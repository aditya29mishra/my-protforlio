import React, { useEffect, useState } from "react";
import "./SnakeGame.css";
import { updateGameState, getRandomApple } from "./GameLogic";

const tileCount = 20;

const SnakeRaceGame = () => {
  const [snake1, setSnake1] = useState([{ x: 1, y: 1 }]);
  const [snake2, setSnake2] = useState([{ x: 18, y: 18 }]);
  const [apple, setApple] = useState(getRandomApple(tileCount, snake1, snake2));
  const [gameOver, setGameOver] = useState(false);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [speed, setSpeed] = useState(300); // Initial speed

  // ✅ Define `resetGame` to properly restart the game
  const resetGame = () => {
    setSnake1([{ x: 1, y: 1 }]);
    setSnake2([{ x: 18, y: 18 }]);
    setApple(getRandomApple(tileCount, snake1, snake2));
    setScore1(0);
    setScore2(0);
    setSpeed(300); // ✅ Reset speed
    setGameOver(false);
  };

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        updateGameState(snake1, snake2, apple, setSnake1, setSnake2, setScore1, setScore2, setApple, setGameOver, tileCount, setSpeed);
      }, speed);
  
      return () => clearInterval(interval);
    } else {
      // 🔄 Automatically restart the game after 2 seconds
      const restartTimeout = setTimeout(() => {
        resetGame();
      }, 2000);
  
      return () => clearTimeout(restartTimeout); // Clean up timeout
    }
  }, [snake1, snake2, apple, gameOver, speed]);

  return (
    <div className="game-container">
      <h2>🐍 Snake Race</h2>
      {gameOver ? <h3 className="game-over">Game Over!</h3> : (
        <div className="score-board">
          <span className="score-green">Green: {score1}</span>
          <span className="score-yellow">Yellow: {score2}</span>
        </div>
      )}
      <div className="grid">
        {Array.from({ length: tileCount }).map((_, row) =>
          Array.from({ length: tileCount }).map((_, col) => {
            const isSnake1 = snake1.some((seg) => seg.x === col && seg.y === row);
            const isSnake2 = snake2.some((seg) => seg.x === col && seg.y === row);
            const isApple = apple.x === col && apple.y === row;

            return (
              <div
                key={`${row}-${col}`}
                className={`tile ${isSnake1 ? "snake1" : ""} ${isSnake2 ? "snake2" : ""} ${isApple ? "apple" : ""}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SnakeRaceGame;
