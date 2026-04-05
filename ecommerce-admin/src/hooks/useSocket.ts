import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

let socket: Socket | null = null;

export const useSocket = () => {
	const { token, isAuthenticated } =
		useAuthStore();
	const addNotification = useNotificationStore(
		(s) => s.addNotification,
	);

	useEffect(() => {
		if (!isAuthenticated || !token) return;

		socket = io('/', {
			auth: { token },
			transports: ["websocket"],
		});

		socket.on("connect", () => {
			console.log("Socket connected");
		});

		socket.on(
			"new-registration",
			(data: { name: string; email: string }) => {
				addNotification({
					type: "new-registration",
					title: "New Sub-Admin Registration",
					message: `${data.name} (${data.email}) has requested access`,
				});
			},
		);

		socket.on(
			"action-reviewed",
			(data: {
				action: string;
				status: string;
				reviewedBy: string;
			}) => {
				addNotification({
					type: "action-reviewed",
					title: `Action ${data.status}`,
					message: `Your ${data.action} was ${data.status} by ${data.reviewedBy}`,
				});
			},
		);

		socket.on(
			"pending-action",
			(data: {
				adminName: string;
				action: string;
			}) => {
				addNotification({
					type: "pending-action",
					title: "New Pending Action",
					message: `${data.adminName} submitted: ${data.action}`,
				});
			},
		);

		return () => {
			socket?.disconnect();
			socket = null;
		};
	}, [isAuthenticated, token, addNotification]);

	return socket;
};
