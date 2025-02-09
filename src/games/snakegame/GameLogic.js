import { findPath, avoidCollision, increaseLearningFactor } from "./AIPathfinding";

let stuckCounter1 = 0;
let stuckCounter2 = 0;

export function updateGameState(snake1, snake2, apple, setSnake1, setSnake2, setScore1, setScore2, setApple, setGameOver, tileCount, setSpeed) {
    let newGrid = Array.from({ length: tileCount }, () => Array(tileCount).fill(null));

    snake1.forEach((seg) => (newGrid[seg.y][seg.x] = "snake1"));
    snake2.forEach((seg) => (newGrid[seg.y][seg.x] = "snake2"));

    let depth1 = Math.max(snake1.length, 5);
    let depth2 = Math.max(snake2.length, 5);

    let futurePath1 = findPath(snake1[0], apple, snake1, snake2, newGrid, depth1);
    let futurePath2 = findPath(snake2[0], apple, snake2, snake1, newGrid, depth2);

    let nextMove1 = futurePath1.length > 0 ? futurePath1[0] : null;
    let nextMove2 = futurePath2.length > 0 ? futurePath2[0] : null;

    ({ newMove1: nextMove1, newMove2: nextMove2 } = avoidCollision(snake1, snake2, nextMove1, nextMove2));

    let newSnake1 = [...snake1];
    let newSnake2 = [...snake2];

    let hasFuturePath1 = futurePath1.length > 0;
    let hasFuturePath2 = futurePath2.length > 0;

    // 🛑 Handle Snakes Getting Stuck
    if (!nextMove1 && hasFuturePath1) {
        stuckCounter1 = 0;
    } else if (!nextMove1) {
        stuckCounter1++;
        if (stuckCounter1 >= 3) {
            if (newSnake1.length > 1) newSnake1.pop();
            stuckCounter1 = 0;
        }
    } else {
        newSnake1.unshift(nextMove1);
        stuckCounter1 = 0;
    }

    if (!nextMove2 && hasFuturePath2) {
        stuckCounter2 = 0;
    } else if (!nextMove2) {
        stuckCounter2++;
        if (stuckCounter2 >= 3) {
            if (newSnake2.length > 1) newSnake2.pop();
            stuckCounter2 = 0;
        }
    } else {
        newSnake2.unshift(nextMove2);
        stuckCounter2 = 0;
    }

    // 🍏 Apple Collection
    if (newSnake1[0]?.x === apple.x && newSnake1[0]?.y === apple.y) {
        setApple(getRandomApple(tileCount, snake1, snake2));
        setSpeed((prevSpeed) => Math.max(prevSpeed - 20, 100)); // Speed up
    } else if (nextMove1) {
        newSnake1.pop();
    }

    if (newSnake2[0]?.x === apple.x && newSnake2[0]?.y === apple.y) {
        setApple(getRandomApple(tileCount, snake1, snake2));
        setSpeed((prevSpeed) => Math.max(prevSpeed - 20, 100)); // Speed up
    } else if (nextMove2) {
        newSnake2.pop();
    }

    // 🏆 Update Score (Score = Snake Length)
    setScore1(newSnake1.length);
    setScore2(newSnake2.length);

    // 🛑 Game Over ONLY if both snakes are completely stuck for multiple turns
    if (stuckCounter1 >= 3 && stuckCounter2 >= 3) {
        increaseLearningFactor();
        setGameOver(true);
        return;
    }

    setSnake1(newSnake1);
    setSnake2(newSnake2);
}

// 🍏 Generate a new apple position ensuring it doesn't collide with snakes
export function getRandomApple(tileCount, snake1, snake2) {
    let newApple;
    do {
        newApple = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
    } while (
        snake1.some((seg) => seg.x === newApple.x && seg.y === newApple.y) ||
        snake2.some((seg) => seg.x === newApple.x && seg.y === newApple.y)
    );
    return newApple;
}
