import { create } from "zustand";

export const WIDTH = 500;
export const HEIGHT = 500;
const THICKNESS = 10;
const FOOD_THICKNESS = THICKNESS * 1.5;

export interface ISnakeSegment {
  x: number;
  y: number;
  w: number;
  h: number;
  dir: "up" | "right" | "down" | "left";
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

const spawnFood = () => {
  return {
    x: getX(),
    y: getY(),
    w: FOOD_THICKNESS,
    h: FOOD_THICKNESS,
    dir: "up",
  } as ISnakeSegment;
};

const eat = (head: ISnakeSegment, food: ISnakeSegment) => {
  switch (head.dir) {
    case "up":
      if (
        (head.x >= food.x &&
          head.x <= food.x + FOOD_THICKNESS &&
          head.y >= food.y &&
          head.y <= food.y + FOOD_THICKNESS) ||
        (head.x + THICKNESS >= food.x &&
          head.x + THICKNESS <= food.x + FOOD_THICKNESS &&
          head.y >= food.y &&
          head.y <= food.y + FOOD_THICKNESS)
      ) {
        head.h += THICKNESS;
        return true;
      }
      break;
    case "right":
      if (
        (head.x + head.w >= food.x &&
          head.x + head.w <= food.x + FOOD_THICKNESS &&
          head.y >= food.y &&
          head.y <= food.y + FOOD_THICKNESS) ||
        (head.x + head.w >= food.x &&
          head.x + head.w <= food.x + FOOD_THICKNESS &&
          head.y + THICKNESS >= food.y &&
          head.y + THICKNESS <= food.y + FOOD_THICKNESS)
      ) {
        head.w += THICKNESS;
        return true;
      }
      break;
    case "down":
      if (
        (head.x >= food.x &&
          head.x <= food.x + FOOD_THICKNESS &&
          head.y + head.h >= food.y &&
          head.y + head.h <= food.y + FOOD_THICKNESS) ||
        (head.x + THICKNESS >= food.x &&
          head.x + THICKNESS <= food.x + FOOD_THICKNESS &&
          head.y + head.h >= food.y &&
          head.y + head.h <= food.y + FOOD_THICKNESS)
      ) {
        head.h += THICKNESS;
        return true;
      }
      break;
    default:
      if (
        (head.x >= food.x &&
          head.x <= food.x + FOOD_THICKNESS &&
          head.y >= food.y &&
          head.y <= food.y + FOOD_THICKNESS) ||
        (head.x >= food.x &&
          head.x <= food.x + FOOD_THICKNESS &&
          head.y + THICKNESS >= food.y &&
          head.y + THICKNESS <= food.y + FOOD_THICKNESS)
      ) {
        head.w += THICKNESS;
        return true;
      }
  }

  return false;
};

const bite = (head: ISnakeSegment, snakeSegments: ISnakeSegment[]) => {
  for (let i = 0; i < snakeSegments.length - 2; i++) {
    const segment = snakeSegments[i];

    let minX, maxX, minY, maxY;

    switch (segment.dir) {
      case "up":
      case "down":
        minX = segment.x;
        maxX = segment.x + THICKNESS;
        minY = segment.y;
        maxY = segment.y + segment.h;
        break;
      case "right":
      default: // left
        minX = segment.x;
        maxX = segment.x + segment.w;
        minY = segment.y;
        maxY = segment.y + THICKNESS;
    }

    let x, y;

    switch (head.dir) {
      case "up":
        x = head.x;
        y = head.y;
        break;
      case "right":
        x = head.x + head.w;
        y = head.y;
        break;
      case "down":
        x = head.x;
        y = head.y + head.h;
        break;
      default: // left
        x = head.x;
        y = head.y;
    }

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) return true;
  }

  return false;
};

const useGameStore = create<{
  snakeSegments: ISnakeSegment[];
  food: ISnakeSegment;
  gameOver?: boolean;
  crawl: () => void;
  turnTo: (direction: "up" | "right" | "down" | "left") => void;
}>()((set, get) => ({
  snakeSegments: [{ x: 0, y: HEIGHT / 2, w: 200, h: THICKNESS, dir: "right" }],
  food: spawnFood(),
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
    const eatean = eat(head, food);

    set({ snakeSegments, food: eatean ? spawnFood() : food });
  },
  turnTo: (direction) => {
    const snakeSegments = [...get().snakeSegments];
    const head = snakeSegments[snakeSegments.length - 1];

    if (head.dir === direction) return;
    if (head.dir === "up" && direction === "down") return;
    if (head.dir === "down" && direction === "up") return;
    if (head.dir === "right" && direction === "left") return;
    if (head.dir === "left" && direction === "right") return;

    switch (direction) {
      case "up":
        snakeSegments.push({
          x: head.dir === "right" ? head.x + head.w - THICKNESS : head.x,
          y: head.y,
          w: THICKNESS,
          h: 0,
          dir: "up",
        });
        break;
      case "right":
        snakeSegments.push({
          x: head.x + THICKNESS,
          y: head.dir === "down" ? head.y + head.h - THICKNESS : head.y,
          w: 0,
          h: THICKNESS,
          dir: "right",
        });
        break;
      case "down":
        snakeSegments.push({
          x: head.dir === "right" ? head.x + head.w - THICKNESS : head.x,
          y: head.y + THICKNESS,
          w: THICKNESS,
          h: 0,
          dir: "down",
        });
        break;
      default:
        snakeSegments.push({
          x: head.x,
          y: head.dir === "down" ? head.y + head.h - THICKNESS : head.y,
          w: 0,
          h: THICKNESS,
          dir: "left",
        });
    }

    set({ snakeSegments });
  },
}));

export default useGameStore;
