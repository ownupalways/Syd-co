import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem(
		"admin-token",
	);
	if (token)
		config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(res) => res,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("admin-token");
			localStorage.removeItem("admin-auth");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

export default api;
