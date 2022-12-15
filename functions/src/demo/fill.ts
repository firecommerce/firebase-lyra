import type {Request, Response} from "firebase-functions";
import {readFileSync} from "node:fs";
import {join as joinPath} from "node:path";
import {getFirestore} from "firebase-admin/firestore";

export default async (req: Request, res: Response) => {
  if (!process.env.OPERATOR_TOKEN) {
    res.sendStatus(403);
    return;
  }
  if (process.env.OPERATOR_TOKEN !== req.query.token) {
    res.sendStatus(401);
    return;
  }
  const startedAt = Date.now();
  const eventsFilepath = joinPath(process.cwd(), "__fixtures__/events.json");
  const data = JSON.parse(readFileSync(eventsFilepath).toString());
  const events: Record<string, string>[] = data.result.events;
  const parsedAt = Date.now();
  const firestore = getFirestore();
  for (let i = 0; i < events.length; i++) {
    await firestore.collection("demoEvents").add(events[i]);
  }
  res.send({
    status: "ok",
    parsedTook: parsedAt - startedAt,
    took: Date.now() - startedAt,
  });
};
