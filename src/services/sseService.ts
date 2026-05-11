import type { Response } from "express";

class SSEService {
  clients: Map<string, Set<Response>>;

  constructor() {
    this.clients = new Map();
  }

  addClient(orgId: string, res: Response) {
    if (!this.clients.has(orgId)) this.clients.set(orgId, new Set());
    this.clients.get(orgId)?.add(res);

    res.on("close", () => {
      this.clients.get(orgId)?.delete(res);
      if (this.clients.get(orgId)?.size === 0) this.clients.delete(orgId);
    });
  }

  sendToEmployees(orgId: string, data: Record<string, unknown>, event?: string) {
    const orgEmployees = this.clients.get(orgId);
    if (orgEmployees) {
      const payload = `data: ${JSON.stringify(data)}\n\n`;
      orgEmployees.forEach((emp) => {
        if (event) emp.write(`event: ${event}\n\n`);
        emp.write(payload);
      });
    }
  }
}

export const sseService = new SSEService();
