import { config as env } from "dotenv";

env();

import jet from "./server.js";

const PRODUCTION = "pm_id" in process.env;
const PORT = PRODUCTION ? 13700 : 13701;

jet.listen(PORT, () => {
  console.log(
    `Server running at ` +
      `[${PRODUCTION ? "production" : "development"}]` +
      ` http://localhost:${PORT}/jet/`
  );
});

process.on("uncaughtException", (error) => console.error(error));
