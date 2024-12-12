import { useEffect, useRef } from "react";
import useGameStore, { HEIGHT, WIDTH } from "./store/game";

const App = () => {
  const { snakeSegments, food, crawl, turnTo } = useGameStore();
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

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x, food.y, food.w / 2, 0, 2 * Math.PI);
    ctx.fill();
    //ctx.fillRect(food.x, food.y, food.w, food.h);
  }, [snakeSegments]);

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

    intervalRef.current = setInterval(() => {
      crawl();
    }, 60);

    document.addEventListener("keyup", keyup);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("keyup", keyup);
    };
  }, []);

  return (
    <div
      className="w-auto h-auto absolute left-[50%] top-[50%] border border-black"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

export default App;
