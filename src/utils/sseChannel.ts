import type { Request, Response } from "express";

export function sseChannel(event: string, data: Record<string, unknown>) {
  return (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(": Connected\n\n");

    res.write(`event: ${event}\n\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    res.on("close", () => {
      res.end();
    });
  };
}
