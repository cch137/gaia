import { config as env } from "dotenv";

env();

import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const t0 = Date.now();

  const origin = "https://pi.cch137.link";
  const repoImageUrls: string[][] = await Promise.all(
    (
      await (await fetch(`${origin}/jet/gaia/outputs`)).json()
    ).map(async (repo: string) =>
      (
        (await (
          await fetch(`${origin}/jet/gaia/outputs/${repo}`)
        ).json()) as string[]
      ).map((file) => `${origin}/jet/gaia/outputs/${repo}/${file}`)
    )
  );

  console.log("starting completions...");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "user",
        content: [
          // {
          //   type: "image_url",
          //   image_url: { url: imagePath },
          // },
          ...repoImageUrls[0].map((url) => ({
            type: "image_url" as "image_url",
            image_url: { url },
          })),
          {
            type: "text",
            text: "Summarize all the formulas. Provide a brief introduction for each formula and explain the meaning of each symbol. (in zh-TW)",
          },
        ],
      },
    ],
  });

  fs.writeFileSync(
    `results/${Date.now()}.md`,
    response.choices[0].message.content || ""
  );

  console.log(`DONE. time used: ${Date.now() - t0}ms`);
  process.stdout.write("Press enter to run. ");
}

setTimeout(() => {
  process.stdout.write("\nWelcome to AI terminal.\n");
  process.stdout.write("Press enter to run. ");
}, 0);

process.stdin.on("data", (data) => {
  main();
});
