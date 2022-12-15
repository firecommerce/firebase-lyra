import type {Request, Response} from "firebase-functions";
import {create, insert, search} from "@lyrasearch/lyra";
import {getFirestore} from "firebase-admin/firestore";

const db = create({
  schema: {
    "date": "string",
    "description": "string",
    "lang": "string",
    "category1": "string",
    "category2": "string",
    "granularity": "string",
  },
});

const firestore = getFirestore();
const inserting = firestore.collection("demoEvents").get().then((snapshot) => {
  snapshot.docs.forEach((doc) => {
    insert(db, doc.data() as any);
  });
});

export default async (req: Request, res: Response) => {
  const startAt = Date.now();
  inserting.then(async () => {
    const insertedAt = Date.now();
    res.setHeader("X-Insert-Took", insertedAt - startAt);
    let {term} = req.query;
    if (!term || typeof term !== "string") {
      term = "sample";
    }
    res.send(search(db, {
      term,
      properties: ["description"],
    }));
  });
};
