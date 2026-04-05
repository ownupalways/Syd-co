import { create } from "zustand";

export interface Notification {
	id: string;
	type:
		| "new-registration"
		| "action-reviewed"
		| "pending-action";
	title: string;
	message: string;
	read: boolean;
	createdAt: Date;
}

interface NotificationState {
	notifications: Notification[];
	unreadCount: number;
	addNotification: (
		n: Omit<
			Notification,
			"id" | "read" | "createdAt"
		>,
	) => void;
	markAllRead: () => void;
	markRead: (id: string) => void;
}

export const useNotificationStore =
	create<NotificationState>((set, get) => ({
		notifications: [],
		unreadCount: 0,
		addNotification: (n) => {
			const notification: Notification = {
				...n,
				id: crypto.randomUUID(),
				read: false,
				createdAt: new Date(),
			};
			set({
				notifications: [
					notification,
					...get().notifications,
				].slice(0, 50),
				unreadCount: get().unreadCount + 1,
			});
		},
		markAllRead: () =>
			set({
				notifications: get().notifications.map(
					(n) => ({ ...n, read: true }),
				),
				unreadCount: 0,
			}),
		markRead: (id) => {
			const notifications =
				get().notifications.map((n) =>
					n.id === id ? { ...n, read: true } : n,
				);
			set({
				notifications,
				unreadCount: notifications.filter(
					(n) => !n.read,
				).length,
			});
		},
	}));
