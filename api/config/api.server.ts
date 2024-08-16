import "server-only";

import { getAPI } from "./api";
import { http as httpServer } from "./axios.server";

export const serverAPI = getAPI(httpServer);
