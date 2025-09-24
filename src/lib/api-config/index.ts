"use client";

import { createApiClient } from "./src/client";
import { APIService } from "./src/config";
export * from "axios";
export { ENDPOINTS } from "./src/endpoints";

export const apiClient = createApiClient(APIService.AUTH);
