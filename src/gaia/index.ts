import Jet from "@cch137/jet";
import path from "path";
import fs from "fs";

const router = new Jet.Router();

router.get("/ping", (req, res) => {
  res.send("pong from GAIA");
});

router.get("/outputs", (req, res) => {
  res.json(fs.readdirSync("../gaia/outputs"));
});

router.get("/outputs/:i", (req, res) => {
  const i = parseInt(req.params.i);
  const outputDirname = path.resolve("../gaia/outputs");
  const output = fs.readdirSync(outputDirname).at(i);
  if (!output) return res.status(404).send("404: Not Found");
  const mergedImageFilepath = path.join(outputDirname, output, "output.jpg");
  if (!fs.existsSync(mergedImageFilepath))
    return res.status(404).send("404: Not Found");
  res.send(fs.readFileSync(mergedImageFilepath));
});

export default router;
