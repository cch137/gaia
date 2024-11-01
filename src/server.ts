import Jet from "@cch137/jet";
import Shuttle from "@cch137/shuttle";
import WebSocket from "ws";

const jet = new Jet();

export default jet;

const router = new Jet.Router();

router.get("/hi", (req, res) => {
  res.send("Hello World!");
});

router.get("/test", (req, res) => {
  res.send("OK");
});

function parseRawData(data: WebSocket.RawData): Uint8Array {
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  else if (Array.isArray(data)) return Uint8Array.from(Buffer.concat(data));
  return Uint8Array.from(data);
}

const shuttleOptions = { salts: [137] };

router.ws("/ws", (soc) => {
  console.log("soc connected");
  soc.on("message", (data) => {
    console.log(
      "server receive:",
      Shuttle.parse(parseRawData(data), shuttleOptions)
    );
  });
});

jet.use("/jet/", router);

import("./gaia/index.js")
  .then(({ default: r }) => router.use("/gaia/", r))
  .catch((e) => console.error("failed to import gaia"));
