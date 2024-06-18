import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";

const socket = io("http://localhost:3000", {
  path: "/messages/",
});

function App() {
  const [count, setCount] = useState(0);
  const [serverData, setServerData] = useState([]);
  const [v, setV] = useState("");

  const sendMessage = useCallback((e: string) => {
    socket.emit("message", e);
  }, []);

  useEffect(() => console.log("serverData: ", serverData), [serverData]);

  useEffect(() => {
    function onEnterRoom(data: []) {
      setServerData(data);
    }

    socket.on("enter", onEnterRoom);

    return () => {
      socket.off("enter", onEnterRoom);
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="bg-red-500 underline underline-offset-1">
        Tailwind instalado
      </p>
      <textarea
        name="message"
        id="message"
        value={v}
        onChange={(e) => {
          setV(e.target.value);
        }}
      ></textarea>
      <button onClick={() => sendMessage(v)}>Send it</button>
    </>
  );
}

export default App;
