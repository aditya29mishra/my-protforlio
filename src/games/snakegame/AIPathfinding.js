let learningFactor = 0.1; // AI learning factor (adjusts pathfinding strategy over time)

function heuristic(a, b) {
  return (1 - learningFactor) * (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
}

export function findPath(start, target, snake, opponent, snakeGrid) {
  const directions = [
    { x: 0, y: -1 }, { x: 0, y: 1 },
    { x: -1, y: 0 }, { x: 1, y: 0 }
  ];

  if (!snakeGrid || snakeGrid.length === 0) {
    console.error("⚠️ Warning: `snakeGrid` is undefined or empty!");
    return [];
  }

  let depth = Math.max(snake.length, 5); // 🔥 Future path depth depends on snake length
  let openSet = [{ pos: start, path: [], g: 0, f: heuristic(start, target) }];
  let visited = new Map();
  visited.set(`${start.x},${start.y}`, 0);
  let pathsFound = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    let { pos, path, g } = openSet.shift();

    if (path.length >= depth) {
      pathsFound.push(path);
      continue;
    }

    for (let dir of directions) {
      let nextPos = { x: pos.x + dir.x, y: pos.y + dir.y };
      let key = `${nextPos.x},${nextPos.y}`;

      if (
        nextPos.x >= 0 && nextPos.x < 20 &&
        nextPos.y >= 0 && nextPos.y < 20 &&
        !snake.some(seg => seg.x === nextPos.x && seg.y === nextPos.y) &&
        !opponent.some(seg => seg.x === nextPos.x && seg.y === nextPos.y) &&
        snakeGrid[nextPos.y]?.[nextPos.x] !== "snake" &&
        snakeGrid[nextPos.y]?.[nextPos.x] !== "opponent"
      ) {
        let newG = g + 1;
        let newF = newG + heuristic(nextPos, target);

        if (!visited.has(key) || newG < visited.get(key)) {
          visited.set(key, newG);
          openSet.push({ pos: nextPos, path: [...path, nextPos], g: newG, f: newF });

          if (nextPos.x === target.x && nextPos.y === target.y) {
            return [...path, nextPos];
          }
        }
      }
    }
  }
  return pathsFound.length > 0 ? pathsFound[0] : [];
}

export function avoidCollision(snake1, snake2, nextMove1, nextMove2) {
  if (!nextMove1 || !nextMove2) return { newMove1: nextMove1, newMove2: nextMove2 };

  if (nextMove1.x === nextMove2.x && nextMove1.y === nextMove2.y) {
    let distance1 = Math.abs(nextMove1.x - snake1[0].x) + Math.abs(nextMove1.y - snake1[0].y);
    let distance2 = Math.abs(nextMove2.x - snake2[0].x) + Math.abs(nextMove2.y - snake2[0].y);

    return distance1 < distance2
      ? { newMove1: nextMove1, newMove2: null }
      : { newMove1: null, newMove2: nextMove2 };
  }

  return { newMove1: nextMove1, newMove2: nextMove2 };
}

export function increaseLearningFactor() {
  learningFactor = Math.min(learningFactor + 0.05, 0.9);
}
