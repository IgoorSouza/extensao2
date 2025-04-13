import { useState } from "react";
import axios from "./lib/axios";

interface Game {
  id: string;
  name: string;
  short_description: string;
  is_free: boolean;
  required_age: string;
  url: string;
  header_image: string;
  platforms: Platforms;
  price_overview?: PriceOverview;
}

interface Platforms {
  windows: boolean;
  mac: boolean;
  linux: boolean;
}

interface PriceOverview {
  currency: string;
  discount_percent: number;
  final: number;
  final_formatted: string;
  initial: number;
  initial_formatted: string;
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState<string>("");

  async function getGames() {
    if (search.trim() === "") return;

    const response = await axios.get(`/games?gameName=${search}`);
    setGames(response.data);
  }

  return (
    <div className="text-white">
      <div className="flex justify-center items-center mt-10 text-xl">
        <label htmlFor="gameName">Nome do Jogo: </label>
        <input
          id="gameName"
          name="gameName"
          className="border mx-3 p-2 rounded-md min-w-lg"
          onChange={(event) => setSearch(event.target.value)}
        />
        <button
          className="px-3 py-2 rounded-md cursor-pointer bg-white text-black hover:bg-gray-300"
          onClick={getGames}
        >
          Pesquisar
        </button>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-2xl my-8">Resultados</h1>

        {games?.map((game) => (
          <div
            className="flex justify-between items-center mb-5 min-w-1/2 p-2 bg-gray-800"
            key={game.id}
          >
            <img src={game.header_image} alt="Game Image" />

            <div className="flex flex-col items-center justify-center ml-5 text-center w-full max-w-[300px]">
              <h2 className="text-xl mb-2">{game.name}</h2>

              <div className="flex flex-col">
                {game.is_free || !game.price_overview ? (
                  <p>Gratuito</p>
                ) : (
                  <>
                    <p>
                      Preço Original:{" "}
                      {game.price_overview?.initial_formatted ||
                        game.price_overview?.final_formatted}
                    </p>

                    <p>Preço Atual: {game.price_overview?.final_formatted}</p>

                    {game.price_overview.discount_percent > 0 && (
                      <p>Desconto: {game.price_overview.discount_percent}%</p>
                    )}
                  </>
                )}
              </div>

              <a
                href={game.url}
                target="_blank"
                rel="external"
                className="mt-2 break-words text-blue-500 max-w-[80%]"
              >
                Clique aqui para acessar o jogo na Steam
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
