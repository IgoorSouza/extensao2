import { useState } from "react";
import { Game } from "../types/game";
import formatGamePrice from "../utils/format-game-price";

interface Props {
  game: Game;
  gameStore: string;
  wishlistButtonText: string;
  wishlistButtonFunction: (game: Game) => Promise<void>;
}

export default function GameCard({
  game,
  gameStore,
  wishlistButtonText,
  wishlistButtonFunction,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const gameInitialPrice = formatGamePrice(game.initialPrice);
  const gameDiscountPrice = formatGamePrice(game.discountPrice);

  return (
    <div
      key={game.identifier}
      className="w-full max-w-md bg-[#1f2937] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <img
        src={game.image}
        alt={game.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-5 flex flex-col gap-2 text-center">
        <h2 className="text-white font-semibold text-xl">{game.title}</h2>

        {game.initialPrice === 0 ? (
          <p className="text-green-400 font-semibold">Gratuito</p>
        ) : (
          <>
            <p className="text-green-400 font-bold">
              Preço Atual: R$ {gameDiscountPrice}
            </p>

            {game.initialPrice > game.discountPrice && (
              <>
                <p className="text-gray-400 text-md">
                  Preço Original:{" "}
                  <span className="line-through">R$ {gameInitialPrice}</span>
                </p>

                {game.discountPercent > 0 && (
                  <span className="bg-yellow-500 text-black text-md font-semibold px-3 py-1 rounded-full mt-1">
                    {game.discountPercent}% de desconto!
                  </span>
                )}
              </>
            )}
          </>
        )}

        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Acessar na {gameStore}
        </a>

        {game.initialPrice > 0 && (
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await wishlistButtonFunction(game);
              setLoading(false);
            }}
            className={`mt-2 inline-block text-sm bg-cyan-500 text-white px-4 py-2 rounded-lg transition duration-300 ${
              loading ? "bg-cyan-600" : "hover:bg-cyan-600 cursor-pointer"
            }`}
          >
            {wishlistButtonText}
          </button>
        )}
      </div>
    </div>
  );
}
