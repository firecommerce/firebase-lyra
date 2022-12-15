import {initializeApp} from "firebase-admin/app";
import {onRequest} from "firebase-functions/v2/https";
import fillDemo from "./demo/fill";

initializeApp();

export const fill = onRequest({
  timeoutSeconds: 1800,
}, fillDemo);
