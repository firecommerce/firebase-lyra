import {onRequest} from "firebase-functions/v2/https";
import fillDemo from "./demo/fill";

export const fill = onRequest({
  timeoutSeconds: 1800,
}, fillDemo);
