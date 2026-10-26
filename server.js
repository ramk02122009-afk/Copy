const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  const filePath = pathname === "/" ? path.join(publicDir, "index.html") : path.join(publicDir, pathname);
  if (!filePath.startsWith(publicDir)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    const ext = path.extname(filePath);
    const type = ext === ".html" ? "text/html; charset=utf-8" : "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
    res.end(data);
  });
});
const wss = new WebSocket.Server({ server });
const clients = new Map();
wss.on("connection", socket => {
  socket.room = null;
  socket.on("message", raw => {
    if (raw.length > 200000) return;
    let msg; try { msg = JSON.parse(raw.toString()); } catch { return; }
    if (msg.type === "join" && typeof msg.room === "string" && msg.room.length <= 80) {
      socket.room = msg.room;
      socket.send(JSON.stringify({ type: "joined", room: socket.room }));
      return;
    }
    if (msg.type === "text" && socket.room && msg.room === socket.room && typeof msg.text === "string" && msg.text.length <= 100000) {
      const payload = JSON.stringify({ type: "text", text: msg.text });
      for (const peer of wss.clients) {
        if (peer !== socket && peer.readyState === WebSocket.OPEN && peer.room === socket.room) peer.send(payload);
      }
      socket.send(payload);
    }
  });
});
server.listen(PORT, "0.0.0.0", () => console.log(`TextBridge Live listening on ${PORT}`));
