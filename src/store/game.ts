import { create } from "zustand";

export const WIDTH = 400;
export const HEIGHT = 400;
const THICKNESS = 10;
const FOOD_THICKNESS = THICKNESS * 1.5;

export interface ISnakeSegment {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  dir?: "up" | "right" | "down" | "left";
}

const crawl = (segment: ISnakeSegment, head?: boolean) => {
  if (head) {
    switch (segment.dir) {
      case "up":
        if (segment.y - THICKNESS < 0) return true;
        segment.y -= THICKNESS;
        segment.h += THICKNESS;
        break;
      case "right":
        if (segment.x + segment.w + THICKNESS > WIDTH) return true;
        segment.w += THICKNESS;
        break;
      case "down":
        if (segment.y + segment.h + THICKNESS > HEIGHT) return true;
        // segment.y += THICKNESS;
        segment.h += THICKNESS;
        break;
      default:
        if (segment.x - THICKNESS < 0) return true;
        segment.x -= THICKNESS;
        segment.w += THICKNESS;
    }
  } else {
    switch (segment.dir) {
      case "up":
        // segment.y -= THICKNESS;
        segment.h -= THICKNESS;
        if (segment.h <= 0) return true;
        break;
      case "right":
        segment.x += THICKNESS;
        segment.w -= THICKNESS;
        if (segment.w <= 0) return true;
        break;
      case "down":
        segment.y += THICKNESS;
        segment.h -= THICKNESS;
        if (segment.h <= 0) return true;
        break;
      default: {
        // segment.x -= THICKNESS;
        segment.w -= THICKNESS;
        if (segment.w <= 0) return true;
      }
    }
  }

  return false;
};

const getX = () => {
  const x = Math.floor(Math.random() * WIDTH);

  if (x < THICKNESS * 2) return getX();
  if (x > WIDTH - THICKNESS * 2) return getX();

  return x;
};

const getY = () => {
  const y = Math.floor(Math.random() * HEIGHT);

  if (y < THICKNESS * 2) return getY();
  if (y > HEIGHT - THICKNESS * 2) return getY();

  return y;
};

const spawnFood = (snakeSegments: ISnakeSegment[]) => {
  const food = {
    x: getX(),
    y: getY(),
    w: FOOD_THICKNESS,
    h: FOOD_THICKNESS,
  } as ISnakeSegment;

  const shift = FOOD_THICKNESS / 3;

  const topL = {
    ...food,
    x: food.x - shift,
    y: food.y - shift,
  };
  const topR = {
    ...food,
    x: food.x + shift,
    y: food.y - shift,
  };
  const botL = {
    ...food,
    x: food.x - shift,
    y: food.y + shift,
  };
  const botR = {
    ...food,
    x: food.x + shift,
    y: food.y + shift,
  };

  for (let i = 0; i < snakeSegments.length; i++) {
    const segment = snakeSegments[i];

    if (
      inBounds(topL, segment) ||
      inBounds(topR, segment) ||
      inBounds(botL, segment) ||
      inBounds(botR, segment)
    )
      return spawnFood(snakeSegments);
  }

  return food;
};

const inBounds = (source: ISnakeSegment, target: ISnakeSegment) => {
  let minX, maxX, minY, maxY;

  switch (target.dir) {
    case "up":
    case "down":
      minX = target.x;
      maxX = target.x + target.w;
      minY = target.y;
      maxY = target.y + target.h;
      break;
    case "right":
    case "left":
      minX = target.x;
      maxX = target.x + target.w;
      minY = target.y;
      maxY = target.y + target.h;
      break;
    default: // food
      minX = target.x - target.w / 3;
      maxX = target.x + target.w / 3;
      minY = target.y - target.h / 3;
      maxY = target.y + target.h / 3;
  }

  let x, y;

  switch (source.dir) {
    case "up":
      x = source.x;
      y = source.y;
      break;
    case "right":
      x = source.x + source.w;
      y = source.y;
      break;
    case "down":
      x = source.x;
      y = source.y + source.h;
      break;
    default: // left
      x = source.x;
      y = source.y;
  }

  const b = x >= minX && x <= maxX && y >= minY && y <= maxY;

  return b;
};

const eat = (
  head: ISnakeSegment,
  snakeSegments: ISnakeSegment[],
  food: ISnakeSegment
) => {
  let b1, b2;

  b1 = inBounds(head, food);

  switch (head.dir) {
    case "up":
      b2 = inBounds({ ...head, x: head.x + head.w }, food);
      break;
    case "right":
      b2 = inBounds({ ...head, y: head.y + head.h }, food);
      break;
    case "down":
      b2 = inBounds({ ...head, x: head.x + head.w }, food);
      break;
    default: // left
      b2 = inBounds({ ...head, y: head.y + head.h }, food);
  }

  const grow = () => {
    const growth = THICKNESS * 3;
    const tail = snakeSegments[0];

    switch (tail.dir) {
      case "up":
        tail.h += growth;
        break;
      case "right":
        tail.x -= growth;
        tail.w += growth;
        break;
      case "down":
        tail.y -= growth;
        tail.h += growth;
        break;
      default: // left
        tail.w += growth;
    }

    return true;
  };

  if (b1 || b2) return grow();

  return false;
};

const bite = (head: ISnakeSegment, snakeSegments: ISnakeSegment[]) => {
  for (let i = 0; i < snakeSegments.length - 2; i++) {
    const segment = snakeSegments[i];

    if (inBounds(head, segment)) return true;
  }

  return false;
};

const DEFAULT_SNAKE_SEGMENTS = [
  // { x: WIDTH / 2, y: HEIGHT - 200, w: THICKNESS, h: 200, dir: "up" },
  { x: 0, y: HEIGHT / 2, w: 200, h: THICKNESS, dir: "right" },
  // { x: WIDTH / 2, y: 0, w: THICKNESS, h: 200, dir: "down" },
  // { x: WIDTH - 200, y: HEIGHT / 2, w: 200, h: THICKNESS, dir: "left" },
] as ISnakeSegment[];

const useGameStore = create<{
  snakeSegments: ISnakeSegment[];
  food: ISnakeSegment;
  gameOver?: boolean;
  score: number;
  crawl: () => void;
  turnTo: (direction: "up" | "right" | "down" | "left") => void;
  start: () => void;
}>()((set, get) => ({
  snakeSegments: DEFAULT_SNAKE_SEGMENTS.map((s) => ({ ...s })),
  food: spawnFood(DEFAULT_SNAKE_SEGMENTS),
  gameOver: false,
  score: 0,
  crawl: () => {
    if (get().gameOver) return;

    const snakeSegments = [...get().snakeSegments];

    const head = snakeSegments[snakeSegments.length - 1];
    const tail = snakeSegments[0];

    if (crawl(head, true)) {
      switch (head.dir) {
        case "up":
          snakeSegments.push({
            x: head.x,
            y: HEIGHT,
            w: THICKNESS,
            h: THICKNESS,
            dir: "up",
          });
          break;
        case "right":
          snakeSegments.push({
            x: 0,
            y: head.y,
            w: THICKNESS,
            h: THICKNESS,
            dir: "right",
          });
          break;
        case "down":
          snakeSegments.push({
            x: head.x,
            y: 0,
            w: THICKNESS,
            h: THICKNESS,
            dir: "down",
          });
          break;
        default:
          snakeSegments.push({
            x: WIDTH,
            y: head.y,
            w: 0,
            h: THICKNESS,
            dir: "left",
          });
      }
    }

    if (crawl(tail)) {
      snakeSegments.shift();
    }

    if (bite(head, snakeSegments)) {
      set({ snakeSegments, gameOver: true });
      return;
    }

    const food = get().food;
    const eaten = eat(head, snakeSegments, food);

    set({
      snakeSegments,
      food: eaten ? spawnFood(snakeSegments) : food,
      score: get().score + (eaten ? THICKNESS : 0),
    });
  },
  turnTo: (direction) => {
    const snakeSegments = [...get().snakeSegments];
    const head = snakeSegments[snakeSegments.length - 1];

    if (head.dir === direction) return;
    if (head.dir === "up" && direction === "down") return;
    if (head.dir === "down" && direction === "up") return;
    if (head.dir === "right" && direction === "left") return;
    if (head.dir === "left" && direction === "right") return;

    let newHead: ISnakeSegment;

    switch (direction) {
      case "up":
        newHead = {
          x: head.dir === "right" ? head.x + head.w - THICKNESS : head.x,
          y: head.y,
          w: THICKNESS,
          h: 0,
          dir: "up",
        };
        break;
      case "right":
        newHead = {
          x: head.x + THICKNESS,
          y: head.dir === "down" ? head.y + head.h - THICKNESS : head.y,
          w: 0,
          h: THICKNESS,
          dir: "right",
        };
        break;
      case "down":
        newHead = {
          x: head.dir === "right" ? head.x + head.w - THICKNESS : head.x,
          y: head.y + THICKNESS,
          w: THICKNESS,
          h: 0,
          dir: "down",
        };
        break;
      default:
        newHead = {
          x: head.x,
          y: head.dir === "down" ? head.y + head.h - THICKNESS : head.y,
          w: 0,
          h: THICKNESS,
          dir: "left",
        };
    }

    snakeSegments.push(newHead);

    set({ snakeSegments });
  },
  start: () => {
    set({
      snakeSegments: DEFAULT_SNAKE_SEGMENTS.map((s) => ({ ...s })),
      food: spawnFood(DEFAULT_SNAKE_SEGMENTS),
      gameOver: false,
      score: 0,
    });
  },
}));

export default useGameStore;
