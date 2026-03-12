import axios from "axios"
const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

const http = axios.create({
	baseURL,
	timeout: 15000,
});
http.interceptors.request.use((config) => {
	config.headers = config.headers ?? {};
	const token =
		typeof window !== "undefined" ? localStorage.getItem("token") : null;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	if (
		config.data &&
		typeof window !== "undefined" &&
		typeof FormData !== "undefined" &&
		config.data instanceof FormData
	) {
		delete config.headers["Content-Type"];
	} else {
		config.headers["Content-Type"] = "application/json";
	}

	return config;
});

export { http };
export default http;
