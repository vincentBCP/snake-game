import { useEffect, useState } from "react";
import useGameStore from "../../store/game";

const GameOver = () => {
  const { gameOver, score, start } = useGameStore();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!gameOver) return;

    setTimeout(() => setShow(true), 150);
  }, [gameOver]);

  if (!show) return null;

  return (
    <div className="fixed w-screen h-screen bg-[rgba(0,0,0,0.5)] top-0 left-0 flex flex-col items-center justify-center">
      <div className="w-[600px] h-[400px] rounded-lg border overflow-hidden shadow-lg bg-white flex flex-col items-center justify-center animate-backtofront">
        <h1 className="text-5xl uppercase font-bold mb-6">game over</h1>
        <p className="text-2xl uppercase font-medium mb-8">score: {score}</p>
        <button
          className="bg-gray-700 text-white font-bold uppercase px-6 py-4 active:bg-gray-500 duration-300 shadow-lg rounded-full"
          onClick={start}
        >
          play again
        </button>
      </div>
    </div>
  );
};

export default GameOver;
