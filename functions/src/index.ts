import {initializeApp} from "firebase-admin/app";
import {onRequest} from "firebase-functions/v2/https";
import demoFill from "./demo/fill";
import demoCount from "./demo/count";

initializeApp();

export const fill = onRequest({
  timeoutSeconds: 1800,
}, demoFill);

export const count = onRequest(demoCount);
