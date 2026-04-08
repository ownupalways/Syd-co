export type AdminRole =
	| "super-admin"
	| "sub-admin";
export type AdminStatus =
	| "pending"
	| "active"
	| "rejected"
	| "suspended";

export interface AdminUser {
	id: string;
	name: string;
	email: string;
	role: AdminRole;
	status: AdminStatus;
	permissions: string[];
	lastLogin?: string;
	createdAt: string;
}

export interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	originalPrice?: number;
	category: string;
	image: string;
	images: string[];
	stock: number;
	rating: number;
	reviews: number;
	seller: string;
	isActive: boolean;
	createdAt: string;
	createdByName?: string;
	updatedByName?: string;
}

export interface Order {
	_id: string;
	user: { name: string; email: string };
	items: { product: Product; quantity: number }[];
	total: number;
	status:
		| "pending"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled";
	paymentStatus: "pending" | "paid" | "failed";
	createdAt: string;
	updatedByName?: string;
}

export interface PendingAction {
	_id: string;
	adminId: string;
	adminName: string;
	action: string;
	resource: string;
	resourceId?: string;
	payload: Record<string, unknown>;
	status: "pending" | "approved" | "rejected";
	reviewedByName?: string;
	reviewNote?: string;
	reviewedAt?: string;
	createdAt: string;
}

export interface AuditLog {
	_id: string;
	adminId: string;
	adminName: string;
	adminRole: string;
	action: string;
	resource: string;
	resourceId?: string;
	details: Record<string, unknown>;
	status:
		| "success"
		| "pending"
		| "rejected"
		| "failed";
	ipAddress: string;
	createdAt: string;
}

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	status: number;
	data?: T;
}

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
