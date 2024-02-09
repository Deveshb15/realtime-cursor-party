import * as Party from "partykit/server";

type Cursor = {
  id: string;
  uri: string;
  country: string | null;
  x?: number;
  y?: number;
  pointer?: "mouse" | "touch";
  lastUpdate?: number;
};

type UpdateMessage = {
    type: "update";
    id: string; // websocket.id
  } & Cursor;
  
  type SyncMessage = {
    type: "sync";
    cursors: { [id: string]: Cursor };
  };
  
  type RemoveMessage = {
    type: "remove";
    id: string; // websocket.id
  };
  
  type ConnectionWithCursor = Party.Connection & { cursor?: Cursor };

export default class CursorParty implements Party.Server {
  constructor(public party: Party.Party) {}
  options: Party.ServerOptions = {
    hibernate: true,
  };

  onConnect(
    connection: Party.Connection<unknown>,
    { request }: Party.ConnectionContext
  ): void | Promise<void> {
    const country = request.cf?.country ?? null;

    connection.serializeAttachment({
      ...connection.deserializeAttachment(),
      country,
    });

    console.log("[connect]", this.party.id, connection.id, country);

    let cursors: { [id: string]: Cursor } = {};

    for (const ws of this.party.getConnections()) {
      const id = ws.id;
      let cursor =
        (ws as ConnectionWithCursor).cursor ?? ws.deserializeAttachment();
      if (
        id !== connection.id &&
        cursor !== null &&
        cursor.x !== undefined &&
        cursor.y !== undefined
      ) {
        cursors[id] = cursor;
      }
    }
    const msg = <SyncMessage>{
      type: "sync",
      cursors: cursors,
    };

    connection.send(JSON.stringify(msg));
  }

  onMessage(message: string, websocket: Party.Connection): void | Promise<void> {
    const position = JSON.parse(message as string);
    const prevCursor = this.getCursor(websocket) as Cursor;

    const cursor = <Cursor>{
        id: websocket.id,
        x: position.x,
        y: position.y,
        pointer: position.pointer,
        country: prevCursor.country,
        lastUpdate: Date.now(),
    }

    this.setCursor(websocket, cursor);

    const msg = 
        position.x && position.y ?
        <UpdateMessage>{
            type: "update",
            ...cursor,
            id: websocket.id,
        } : <RemoveMessage>{
            type: "remove",
            id: websocket.id,
        };

    this.party.broadcast(JSON.stringify(msg), [websocket.id]);
  }

  getCursor(connection: ConnectionWithCursor) {
    if(!connection.cursor) {
        connection.cursor = connection.deserializeAttachment();
    }

    return connection.cursor;
  }

  setCursor(connection: ConnectionWithCursor, cursor: Cursor) {
    let prevCursor = connection.cursor;
    connection.cursor = cursor;

    if(!prevCursor || !prevCursor.lastUpdate || (cursor.lastUpdate && cursor.lastUpdate - prevCursor.lastUpdate > 100)) {
        connection.serializeAttachment({
            ...cursor
        })
    }
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    const msg = <RemoveMessage>{
      type: "remove",
      id: connection.id,
    };
    this.party.broadcast(JSON.stringify(msg), [connection.id]);
  }
}
