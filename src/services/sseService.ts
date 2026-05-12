import type { Response } from "express";

class SSEService {
  clients: Map<string, Set<Response>>;

  constructor() {
    this.clients = new Map();
  }

  addClient(res: Response, classifierKey: string = "all") {
    if (!this.clients.has(classifierKey)) this.clients.set(classifierKey, new Set());
    this.clients.get(classifierKey)?.add(res);

    res.on("close", () => {
      this.clients.get(classifierKey)?.delete(res);
      if (this.clients.get(classifierKey)?.size === 0) this.clients.delete(classifierKey);
    });
  }

  sendToClients(data: Record<string, unknown>, classifierKey: string = "all", event?: string) {
    const clients = this.clients.get(classifierKey);
    if (clients) {
      const payload = `data: ${JSON.stringify(data)}\n\n`;
      clients.forEach((clientRes) => {
        if (event) clientRes.write(`event: ${event}\n\n`);
        clientRes.write(payload);
      });
    }
  }
}

export const sseService = new SSEService();
