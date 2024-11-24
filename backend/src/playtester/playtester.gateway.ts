import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AccessToken } from "src/auth/entities/access-token";
import { Playtest } from "src/decks/entities/playtest.entity";
import { User } from "src/decks/entities/user.entity";
import { GameCard, GameState } from "src/decks/playtest.service";
import { Connection } from "./models/connection";
import { SettingsDto } from "./models/settings.dto";
import { Wrapper } from "./models/wrapper";
import { PlaytesterService } from "./playtester.service";

@WebSocketGateway(3100, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
  transports: ["websocket"],
  path: "/socket.io",
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients = new Map<string, Socket>();
  private connections = new Map<string, Connection>();

  private logger: Logger = new Logger("EventsGateway");

  constructor(private readonly playtesterService: PlaytesterService) {}

  afterInit(_server: Server) {
    const port = Number(process.env.WS_PORT ?? "3000");
    console.log("WebSocket server initialized on port " + port);
  }

  async handleConnection(client: Socket) {
    const clientId = client.id;
    const queryParams = client.handshake.query;
    this.log(`Client connected: ${client.id}`);
    console.log(`Client connected: ${client.id}`);

    const token = Array.isArray(queryParams.token)
      ? queryParams.token.shift()
      : queryParams.token;

    if (!token || !(await this.isAuthorized(token))) {
      this.log("Authentication failed");
      client.emit("legacy", {
        type: "error",
        id: clientId,
        message: "Authentication failed",
      });
      client.disconnect(true);
    }
    this.clients.set(clientId, client);
    this.connections.set(clientId, new Connection(clientId));

    client.emit("legacy", { type: "requestAuthentication", id: clientId });
    this.log("Sent requestAuthentication event to client");
  }

  private send(client: Socket | Socket[], event: string, data: any) {
    const clients = Array.isArray(client) ? client : [client];
    clients.forEach((c) => c.emit(event, data));
  }

  private log(message: string) {
    console.log(message);
    this.logger.log(message);
  }

  private async isAuthorized(token: string) {
    const accessToken = await AccessToken.findOne({
      where: { value: token },
      include: [User],
    });
    return accessToken !== null;
  }

  handleDisconnect(client: Socket) {
    this.log(`Client disconnected: ${client.id}`);
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
    this.connections.delete(client.id);
  }

  @SubscribeMessage("matches")
  async handleMessageMessages(
    client: Socket,
    wrapper: any & { data: { type: string } },
  ) {
    const type = wrapper.type;
    const connection = this.connections.get(client.id);
    if (!connection) {
      // ignore not authenticated connections
      console.error("Connection not found for client: ", client.id);
      return;
    }
    if (!type) {
      console.error("No type in message:", wrapper);
      return;
    }

    if (type === "authentication") {
      this.log("Authentication received");

      connection.hasAuthenticated = true;
      connection.event = "matches";
      client.emit("matches", {
        type: "authentication",
        data: { state: "success" },
      });
      return;
    }
    if (!connection.hasAuthenticated) {
      console.error("Not authenticated:", connection);
      client.disconnect(true);
      return;
    }

    // const allowedTypes = ["update", "update2"];

    // if (!allowedTypes.includes(type)) {
    //   console.error("Invalid type:", type);
    //   return;
    // }

    this.sendOthers(client.id, 0, "matches", {
      type: type,
      data: { what: "matches" },
    });
  }

  @SubscribeMessage("legacy")
  async handleMessageLegacy(
    client: Socket,
    wrapper: any & { data: { type: string } },
  ) {
    const type = wrapper.data.type;
    if (type !== "fieldCard") {
      this.log("Legacy message received from client: " + type);
    }
    const connection = this.connections.get(client.id);
    if (!connection) {
      // ignore not authenticated connections
      console.error("Connection not found for client: ", client.id);
      return;
    }
    if (!type) {
      console.error("No type in message:", wrapper);
      return;
    }
    if (type === "authentication") {
      const data: { type: string; id: number } = wrapper.data;
      this.log("Authentication received");

      const playtest = await Playtest.findByPk(data.id);
      if (!playtest) {
        console.error("Playtest not found:", data.id);
        this.send(client, "legacy", {
          type: "error",
          id: client.id,
          message: "Playtest not found",
        });
        client.disconnect(true);
        return;
      }
      connection.playtestId = playtest.id;
      connection.hasAuthenticated = true;
      connection.event = "legacy";
      const game = JSON.parse(playtest.game);
      this.send(client, "legacy", {
        type: "gameState",
        id: client.id,
        data: game,
      });
      return;
    }
    if (!connection.hasAuthenticated) {
      console.error("Not authenticated:", connection);
      client.disconnect(true);
      return;
    }

    const allowedTypes = ["gameState", "settings", "fieldCard"];

    if (!allowedTypes.includes(type)) {
      console.error("Invalid type:", type);
      return;
    }

    const playtest = await Playtest.findByPk(connection.playtestId);
    if (!playtest) {
      console.error("Playtest not found:", connection.playtestId);
      return;
    }

    if (type === "gameState") {
      const data = wrapper.data as Wrapper<GameState>;
      this.playtesterService.saveGameState(playtest, data);
      this.sendOthers(client.id, connection.playtestId, "legacy", data);
    }
    if (type == "settings") {
      const data = wrapper.data as Wrapper<SettingsDto>;
      this.playtesterService.saveSettings(playtest, data);
      this.sendOthers(client.id, connection.playtestId, "legacy", data);
    }
    if (type == "fieldCard") {
      const data = wrapper.data as Wrapper<GameCard>;
      this.playtesterService.saveFieldCard(playtest, data);
      this.sendOthers(client.id, connection.playtestId, "legacy", data);
    }
  }

  private sendOthers(
    clientId: string,
    playtestId: number,
    event: string,
    data: any,
  ) {
    for (const [id, client] of this.clients) {
      const connection = this.connections.get(id);
      if (
        id === clientId ||
        !connection ||
        !connection.hasAuthenticated ||
        connection.playtestId !== playtestId ||
        connection.event !== event
      ) {
        continue;
      }
      client.emit(event, data);
    }
  }
}
