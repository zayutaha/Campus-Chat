import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients = []

html = """
<!DOCTYPE html>
<html>
  <body>
    <input id="msg" placeholder="Type a message" />
    <button onclick="send()" type='button'>Send</button>
    <pre id="chat"></pre>

    <script>
      const ws = new WebSocket(`ws://${location.host}/ws`);
      ws.onmessage = e => {
        document.getElementById("chat").textContent += e.data + "\\n";
      };
      let name = prompt("What do you want your username to be?: ")
      function send() {
        const msg = document.getElementById("msg").value;
        ws.send(`${name}: ${msg}`);
        document.getElementById("msg").value = "";
      }
    </script>
  </body>
</html>
"""


@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.append(ws)
    try:
        while True:
            data = await ws.receive_text()
            for client in clients:
                await client.send_text(data)
    except WebSocketDisconnect:
        clients.remove(ws)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)
