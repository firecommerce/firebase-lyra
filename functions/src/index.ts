import {initializeApp} from "firebase-admin/app";
import {onRequest} from "firebase-functions/v2/https";

initializeApp();

import demoFill from "./demo/fill";
import demoCount from "./demo/count";
import demoSearch from "./demo/search";

export const fill = onRequest({
  timeoutSeconds: 1800,
}, demoFill);

export const count = onRequest(demoCount);

export const search = onRequest(demoSearch);
