import { FormEvent, useState } from "react";
import axios from "../lib/axios";
import { Game } from "../types/game";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/use-auth";
import formatGamePrice from "../utils/format-game-price";

export default function Games() {
  const [games, setGames] = useState<Game[]>();
  const [search, setSearch] = useState<string>("");
  const [gameStore, setGameStore] = useState<string>("steam");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedGameStore, setSearchedGameStore] = useState<
    "Steam" | "Epic Games Store"
  >("Steam");
  const { authData } = useAuth();

  async function getGames(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      if (search.trim() === "") return;

      setLoading(true);

      const response = await axios.get(
        `/games/${gameStore}?gameName=${search}`
      );

      setGames(response.data);
      setSearchedGameStore(
        gameStore === "steam" ? "Steam" : "Epic Games Store"
      );
      setLoading(false);
    } catch (error) {
      console.error(error);

      setLoading(false);
      toast.error("Ocorreu um erro ao buscar os jogos.");
    }
  }

  async function addGameToWishlist(game: Game) {
    try {
      if (!authData) {
        toast.error(
          "Você deve estar autenticado(a) para adicionar jogos à sua lista de desejos."
        );
        return;
      }

      setLoading(true);

      const headers = {
        Authorization: `Bearer ${authData.token}`,
        "Content-Type": "application/json",
      };

      const body = {
        platformIdentifier: game.identifier,
        platform: searchedGameStore === "Steam" ? "STEAM" : "EPIC",
      };

      await axios.post("/games/wishlist", body, { headers });
      toast.success(`${game.title} foi adicionado à sua lista de desejos!`);
    } catch (error) {
      console.error(error);

      toast.error(
        `Ocorreu um erro ao adicionar ${game.title} à sua lista de desejos.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-white">
      <form
        className="flex justify-center items-center mt-10 text-xl"
        onSubmit={getGames}
      >
        <label htmlFor="gameName">Nome do Jogo: </label>
        <input
          id="gameName"
          name="gameName"
          className="border mx-3 p-2 rounded-md min-w-lg"
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          disabled={loading}
          className={`mx-4 border py-2 px-1 rounded-md ${
            loading && "opacity-30"
          }`}
          onChange={(event) => setGameStore(event.target.value)}
        >
          <option value="steam" className="text-black">
            Steam
          </option>
          <option value="epic" className="text-black">
            Epic Games Store
          </option>
        </select>

        <button
          disabled={loading}
          className={`px-3 py-2 rounded-md bg-white text-black font-semibold ${
            loading ? "opacity-30" : "cursor-pointer hover:bg-gray-300"
          }`}
        >
          Pesquisar
        </button>
      </form>

      <div className="text-center my-6">
        {searchedGameStore === "Epic Games Store" && (
          <p>
            ⚠️ Nota: Alguns links para jogos da{" "}
            <strong>Epic Games Store</strong> podem não funcionar corretamente.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-y-5 items-center">
        {games?.length === 0 ? (
          <p className="text-white text-2xl">
            {search} não foi encontrado na {searchedGameStore}.
          </p>
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
                    Acessar na {searchedGameStore}
                  </a>

                  {game.initialPrice > 0 && (
                    <button
                      disabled={loading}
                      onClick={() => addGameToWishlist(game)}
                      className={`mt-2 inline-block text-sm bg-cyan-500 text-white px-4 py-2 rounded-lg transition duration-300 ${
                        loading
                          ? "bg-cyan-600"
                          : "hover:bg-cyan-600 cursor-pointer"
                      }`}
                    >
                      Adicionar à lista de desejos
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
