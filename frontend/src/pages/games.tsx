import { FormEvent, useState } from "react";
import axios from "../lib/axios";
import { Game } from "../types/game";
import formatGamePrice from "../utils/format-game-price";

export default function Games() {
  const [games, setGames] = useState<Game[]>();
  const [search, setSearch] = useState<string>("");
  const [gameStore, setGameStore] = useState<string>("steam");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedGameStore, setSearchedGameStore] = useState<
    "Steam" | "Epic Games Store"
  >("Steam");

  async function getGames(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (search.trim() === "") return;

    setLoading(true);
    const response = await axios.get(`/games/${gameStore}?gameName=${search}`);
    setGames(response.data);
    setSearchedGameStore(gameStore === "steam" ? "Steam" : "Epic Games Store");
    setLoading(false);
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
          className={`px-3 py-2 rounded-md bg-white text-black ${
            loading ? "opacity-30" : "cursor-pointer hover:bg-gray-300"
          }`}
        >
          Pesquisar
        </button>
      </form>

      <div className="flex flex-col gap-y-5 items-center">
        <div className="text-center max-w-1/2">
          {games && (
            <h1 className="text-2xl mt-8 mb-2">
              {games.length > 0 ? "Resultados" : `Sem resultados.`}
            </h1>
          )}

          {searchedGameStore === "Epic Games Store" && (
            <p>
              Observação: devido a problemas com a API da Epic Games, os links
              para os jogos na Epic Games Store podem estar incorretos.{" "}
            </p>
          )}
        </div>

        {games?.map((game) => {
          const gameInitialPrice = formatGamePrice(game.initialPrice);
          const gameDiscountPrice = formatGamePrice(game.discountPrice);

          return (
            <div
              className="flex justify-between items-center px-4 py-6 bg-gray-800 w-full max-w-[640px]"
              key={game.title}
            >
              <img src={game.image} alt="Game Image" className="w-[300px]" />

              <div className="flex flex-col items-center justify-center ml-5 text-center w-full max-w-[300px]">
                <h2 className="text-xl mb-2 font-bold">{game.title}</h2>

                <div className="flex flex-col">
                  {game.discountPrice > 0 ? (
                    <>
                      <p>Preço Original: R$ {gameInitialPrice}</p>
                      <p>Preço Atual: R$ {gameDiscountPrice}</p>

                      {game.discountPercent > 0 && (
                        <p>Desconto: {game.discountPercent}%</p>
                      )}
                    </>
                  ) : (
                    <p>Gratuito</p>
                  )}
                </div>

                <a
                  href={game.url}
                  target="_blank"
                  rel="external"
                  className="mt-2 break-words text-blue-500 max-w-[80%]"
                >
                  Clique aqui para acessar o jogo na {searchedGameStore}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
