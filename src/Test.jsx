import { useEffect, useRef, useState } from "react";
import Client from "./Services/Client";
// import WebSocket from 'ws';

let client = Client.shared;

function connect() {
  const wsUrl = "ws://localhost:1236";
  const ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    console.log("WebSocket connection opened");

    ws.send(
      JSON.stringify({
        type: "message",
        data: "Hello, server!",
      })
    );
  };

  ws.onmessage = (event) => {
    // console.log("Message received:", event.data);
    let obj = JSON.parse(event.data);
    console.log("Message received:", obj);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };
}

export default function Test() {
  const decks2 = useRef([]);

  // const [decks, setDecks] = useState([]); // [deck1, deck2, deck3, ...

  const [loaded, setLoaded] = useState(false);

  function loadDecks() {
    console.log("loadDecks");
    client.getDecks().then((decks) => {
      console.log(decks);
      // setDecks(decks);
      decks2.current = decks;
      setLoaded(true);
    });
  }

  console.log(decks2);
  if (decks2.current.length === 0) {
    loadDecks();
  }

  console.log("Test.jsx");

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      <h1>{decks2.current.length}</h1>
      <h1>Test</h1>
      <h1>Test</h1>
    </div>
  );
}
