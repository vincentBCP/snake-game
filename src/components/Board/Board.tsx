import { useEffect, useRef } from "react";
import useGameStore, { HEIGHT, WIDTH } from "../../store/game";

const Board = () => {
  const { snakeSegments, food, gameOver, crawl, turnTo } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<any>();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas?.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    snakeSegments.map((segment) => {
      ctx.fillRect(segment.x, segment.y, segment.w, segment.h);
    });

    ctx.fillStyle = food.fill || "red";
    // ctx.beginPath();
    // ctx.arc(food.x, food.y, food.w / 2, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.fillRect(food.x, food.y, food.w, food.h);

    ctx.beginPath();
    ctx.arc(food.x, food.y, food.w / 2, 0, 2 * Math.PI);
    ctx.fill();
  }, [food, snakeSegments]);

  useEffect(() => {
    if (gameOver) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      crawl();
    }, 60);

    return () => clearInterval(intervalRef.current);
  }, [gameOver]);

  useEffect(() => {
    const keyup = (ev: KeyboardEvent) => {
      switch (ev.code.toLowerCase()) {
        case "arrowup":
          turnTo("up");
          break;
        case "arrowright":
          turnTo("right");
          break;
        case "arrowdown":
          turnTo("down");
          break;
        case "arrowleft":
          turnTo("left");
          break;
      }
    };

    document.addEventListener("keyup", keyup);

    return () => document.removeEventListener("keyup", keyup);
  }, []);

  return (
    <div
      className="w-auto h-auto overflow-hidden border border-black"
      style={{ width: WIDTH, height: HEIGHT }}
    >
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

export default Board;
