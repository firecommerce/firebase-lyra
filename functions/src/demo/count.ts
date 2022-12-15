import type {Request, Response} from "firebase-functions";
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
  const firestore = getFirestore();
  const snapshot = await firestore.collection("demoEvents").count().get();
  res.send(snapshot.data());
};
