import { useState } from "react";
import axios from "../lib/axios";
import { useAuth } from "../hooks/use-auth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export default function Profile() {
  const { authData, logout, updateAuthData } = useAuth();
  const [name, setName] = useState<string>(authData!.name);
  const [email, setEmail] = useState<string>(authData!.email);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    authData!.notificationsEnabled
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteAccountConfirmation, setShowDeleteAccountConfirmation] =
    useState<boolean>(false);

  async function updateProfile() {
    try {
      setLoading(true);

      await axios.put(
        "/user",
        { name, email },
        { headers: { Authorization: `Bearer ${authData!.token}` } }
      );

      updateAuthData({
        ...authData!,
        name,
        email,
        emailVerified: authData!.emailVerified && authData!.email === email,
      });

      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      if (error instanceof AxiosError && error.status === 409) {
        toast.error(`O email ${email} já está em uso.`);
        return;
      }

      console.error(error);
      toast.error("Ocorreu um erro ao atualizar seus dados.");
    } finally {
      setLoading(false);
    }
  }

  async function sendVerificationEmail() {
    try {
      setLoading(true);

      await axios.post(
        "/auth/request-verification",
        {},
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      toast.success(
        `O email de verificação foi enviado para ${authData!.email}.`
      );
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao enviar o email de verificação.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleNotifications() {
    const previousValue = notificationsEnabled;

    try {
      setNotificationsEnabled(!previousValue);
      setLoading(true);

      await axios.put("/user/toggle-notifications", {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      updateAuthData({ ...authData!, notificationsEnabled: !previousValue });
      toast.success(
        `Notificações ${
          previousValue ? "desativadas" : "ativadas"
        } com sucesso!`
      );
    } catch (error) {
      console.error(error);
      setNotificationsEnabled(previousValue);
      toast.error("Ocorreu um erro ao excluir sua conta.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAccount() {
    try {
      setLoading(true);

      await axios.delete("/user", {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });

      logout();
      toast.success("Conta excluída com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao excluir sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-white max-w-xl mx-auto mt-10 p-5 bg-zinc-800 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold mb-2 text-center">Perfil</h1>

        <form onSubmit={updateProfile} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Nome
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md border bg-white text-black"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border bg-white text-black"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={updateProfile}
            className={`px-4 py-2 bg-white text-black rounded-md w-1/3 mx-auto mt-2 ${
              loading ? "opacity-70" : "cursor-pointer hover:opacity-70"
            }`}
          >
            Salvar alterações
          </button>
        </form>

        <hr className="border-gray-600 my-5" />

        <div className="flex items-center justify-between">
          <label htmlFor="notifications" className="text-lg">
            {authData!.emailVerified
              ? "Notificações por email"
              : "Verificação de Email"}
          </label>

          {authData!.emailVerified ? (
            <button
              type="button"
              role="switch"
              aria-checked={notificationsEnabled}
              onClick={toggleNotifications}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                notificationsEnabled ? "bg-green-500" : "bg-zinc-400"
              } ${loading ? "opacity-70" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ${
                  notificationsEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={sendVerificationEmail}
              disabled={loading}
              className={`px-4 py-2 bg-white text-black rounded-md ${
                loading ? "opacity-70" : "cursor-pointer hover:opacity-70"
              }`}
            >
              Solicitar
            </button>
          )}
        </div>

        <hr className="border-gray-600 my-5" />

        <div className="text-center">
          <button
            onClick={() => setShowDeleteAccountConfirmation(true)}
            disabled={loading}
            className={`px-4 py-2 bg-red-600 text-white rounded-md ${
              loading ? "bg-red-700" : "cursor-pointer hover:bg-red-700"
            }`}
          >
            Excluir conta
          </button>
        </div>
      </div>

      {showDeleteAccountConfirmation && (
        <>
          <div className="absolute inset-0 bg-black opacity-80 z-0"></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-black">
              <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
              <p className="mb-6">
                Tem certeza que deseja excluir sua conta? Essa ação não pode ser
                desfeita.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteAccountConfirmation(false)}
                  className={`px-4 py-2 rounded-md bg-gray-300 text-black ${
                    loading ? "opacity-70" : "cursor-pointer hover:opacity-70"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={deleteAccount}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md bg-red-600 text-white ${
                    loading ? "bg-red-700" : "cursor-pointer hover:bg-red-700"
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
