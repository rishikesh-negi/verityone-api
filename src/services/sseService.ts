import type { SSESubscriberClient } from "../types/types.js";

class SSEService {
  clients: Map<string, Set<SSESubscriberClient>>;

  constructor() {
    this.clients = new Map();
  }

  addClient(client: SSESubscriberClient, classifierKey: string = "all") {
    if (!this.clients.has(classifierKey)) this.clients.set(classifierKey, new Set());
    this.clients.get(classifierKey)?.add(client);

    client.res.on("close", () => {
      this.clients.get(classifierKey)?.delete(client);
      if (this.clients.get(classifierKey)?.size === 0) this.clients.delete(classifierKey);
    });
  }

  sendToClients(data: Record<string, unknown>, classifierKey: string = "all", event?: string) {
    const clients = this.clients.get(classifierKey);
    if (clients) {
      const payload = `data: ${JSON.stringify(data)}\n\n`;
      clients.forEach((client) => {
        if (event) client.res.write(`event: ${event}\n\n`);
        client.res.write(payload);
      });
    }
  }
}

export const sseService = new SSEService();
