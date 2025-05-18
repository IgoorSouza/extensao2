import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Game } from "../types/game";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/use-auth";
import formatGamePrice from "../utils/format-game-price";

export default function Wishlist() {
  const [games, setGames] = useState<Game[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { authData } = useAuth();

  useEffect(() => {
    async function getGames() {
      try {
        const headers = { Authorization: `Bearer ${authData?.token}` };
        const response = await axios.get(`/games/wishlist`, { headers });
        setGames(response.data);
      } catch (error) {
        console.error(error);

        toast.error(
          "Ocorreu um erro ao buscar os jogos da sua lista de desejos."
        );
      } finally {
        setLoading(false);
      }
    }

    if (authData) getGames();
  }, [authData]);

  return (
    <div className="flex flex-col gap-y-5 items-center">
      <h1 className="text-white text-3xl mt-5">Lista de desejos</h1>

      {loading ? (
        <p className="text-white text-xl">Carregando jogos...</p>
      ) : (
        games?.map((game) => {
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
                <h2 className="text-white font-semibold text-xl">
                  {game.title}
                </h2>

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
                          <span className="line-through">
                            R$ {gameInitialPrice}
                          </span>
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
                  Acessar na{" "}
                  {game.platform === "STEAM" ? "Steam" : "Epic Games Store"}
                </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
