import { useEffect, useState } from "react";
import socket from "../Services/socket";
import Button from "../components/Button";
import { Wrapper } from "../models/websocket";

const Sockets = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onAuthEvent(value: Wrapper<any>) {
      if (value.type === "requestAuthentication") {
        socket.emit("matches", {
          type: "authentication",
          id: 0,
        });
      }
    }

    function onMatchesEvent(value: Wrapper<any>) {
      setFooEvents((previous: any) => [...previous, value]);

      switch (value.type) {
        case "authentication":
          console.log("auth", value.data);
          break;
        case "update":
          break;
        default:
          console.log("Unknown type: ", value.type);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("legacy", onAuthEvent);
    socket.on("matches", onMatchesEvent);

    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("legacy", onAuthEvent);
      socket.off("matches", onMatchesEvent);
    };
  }, []);

  return (
    <div className="App">
      <h1>Socket.io example</h1>
      <h2>Connection status: {isConnected ? "Connected" : "Disconnected"}</h2>
      <h2>Foo events:</h2>
      {fooEvents.map((event: any, index: number) => (
        <div key={index}>{JSON.stringify(event)}</div>
      ))}
      <Button
        title="update"
        onClick={() => socket.emit("matches", { type: "update" })}
      />

      {/* <ConnectionState isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <MyForm /> */}
    </div>
  );
};

export default Sockets;
