import type {Request, Response} from "firebase-functions";
import {create, insert, search} from "@lyrasearch/lyra";
import {getFirestore} from "firebase-admin/firestore";

const nano = BigInt(1e3);
const milli = BigInt(1e6);
const second = BigInt(1e9);
const formatNanoseconds = (value: number | bigint): string => {
  if (typeof value === "number") {
    value = BigInt(value);
  }
  if (value < nano) {
    return `${value}ns`;
  } else if (value < milli) {
    return `${value / nano}μs`;
  } else if (value < second) {
    return `${value / milli}ms`;
  }
  return `${value / second}s`;
};

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
    const result = search(db, {
      term,
      properties: ["description"],
    });
    res.send({
      ...result,
      elapsed: formatNanoseconds(result.elapsed),
    });
  });
};
