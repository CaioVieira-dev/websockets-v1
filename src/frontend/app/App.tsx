import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [room, setRoom] = useState("");
  const [roomId, setRoomId] = useState("");

  const entrar = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { room, name, roomId } = e.target as EventTarget & {
        name: { value: string };
        room: { value: string };
        roomId: { value: string };
      };

      const res = await fetch("http://localhost:3000/entrar", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.value,
          room: room.value,
          roomId: roomId.value,
        }),
      });

      const result = await res.json();

      if (result?.error) {
        return setError(result.error);
      }

      return navigate(`/poker/${result.roomId}`, { state: result });
    },
    [navigate],
  );

  return (
    <>
      <div className="flex min-h-screen flex-col gap-4 bg-slate-900 px-16 py-16">
        <h2 className="text-9xl text-slate-200">Entre em uma sala!!</h2>

        {/* <Form method="post" onSubmit={entrar} className="flex flex-col gap-2"> */}
        <form method="post" className="flex flex-col gap-2" onSubmit={entrar}>
          <label htmlFor="name" className="text-slate-200">
            Nome:
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Seu nome na sala..."
            className="rounded-md p-1"
          />
          <label htmlFor="roomId" className="text-slate-200">
            Jogo em andamento:
          </label>
          <input
            name="roomId"
            type="text"
            required={!room}
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            placeholder="Digite identificador de uma sala em andamento..."
            className="rounded-md p-1"
          />
          <label htmlFor="room" className="text-slate-200">
            Sala:
          </label>
          <select
            name="room"
            id="room"
            required={!roomId}
            onChange={(e) => setRoom(e.target.value)}
            value={room}
            className="rounded-md p-1"
          >
            <option value=""></option>
            <option value="poker">Poker planing</option>
          </select>

          <button
            className="rounded-md bg-slate-500 p-2 text-slate-200"
            type="submit"
          >
            Entrar
          </button>
        </form>
        {error && <div className="bg-red-300 p-2">{error}</div>}
      </div>
    </>
  );
}

export default App;
