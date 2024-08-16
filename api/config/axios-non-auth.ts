import { BACKEND_URL } from "@/lib/constants";
import axios from "axios";

export const httpNoAuth = axios.create({
	baseURL: BACKEND_URL,
});
