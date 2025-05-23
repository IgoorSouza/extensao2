import { useEffect, useState } from "react";
import { Game } from "../types/game";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/use-auth";
import axios from "../lib/axios";
import GameCard from "../components/game-card";

export default function Wishlist() {
  const [games, setGames] = useState<Game[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { authData } = useAuth();

  useEffect(() => {
    async function getGames() {
      try {
        const headers = { Authorization: `Bearer ${authData?.token}` };
        const response = await axios.get(`/wishlist`, { headers });
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

  async function removeGameFromWishlist(game: Game) {
    try {
      const headers = {
        Authorization: `Bearer ${authData!.token}`,
        "Content-Type": "application/json",
      };

      await axios.delete("/wishlist", {
        data: { platformIdentifier: game.identifier, platform: game.platform },
        headers,
      });

      setGames((prev) =>
        prev?.filter((stateGame) => stateGame.identifier !== game.identifier)
      );

      toast.success(`${game.title} foi removido da sua lista de desejos.`);
    } catch (error) {
      console.error(error);
      toast.error(
        `Ocorreu um erro ao remover ${game.title} da sua lista de desejos.`
      );
    }
  }

  return (
    <div className="flex flex-col gap-y-5 items-center">
      <h1 className="text-white text-3xl mt-5">Lista de desejos</h1>

      {loading ? (
        <p className="text-white text-xl">Carregando jogos...</p>
      ) : (
        games?.map((game) => (
          <GameCard
            game={game}
            gameStore={game.platform === "STEAM" ? "Steam" : "Epic Games Store"}
            wishlistButtonText="Remover da lista de desejos"
            wishlistButtonFunction={() => removeGameFromWishlist(game)}
            key={game.identifier}
          />
        ))
      )}
    </div>
  );
}
