import Board from "./components/Board";
import useGameStore from "./store/game";

const App = () => {
  const { score } = useGameStore();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-md font-medium mb-4 text-gray-700 uppercase">
        Use arrows to turn
      </h1>
      <h1 className="text-2xl uppercase font-bold mb-6">SCORE: {score}</h1>
      <Board />
    </div>
  );
};

export default App;
