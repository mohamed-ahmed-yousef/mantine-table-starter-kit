import "client-only";

import { getAPI } from "./api";
import { http as httpClient } from "./axios.client";

export const clientAPI = getAPI(httpClient);
