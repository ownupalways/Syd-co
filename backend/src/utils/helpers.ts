import bcryptjs from "bcryptjs";

export const hashPassword = async (
	password: string,
): Promise<string> => {
	const salt = await bcryptjs.genSalt(10);
	return bcryptjs.hash(password, salt);
};

export const comparePassword = async (
	password: string,
	hashedPassword: string,
): Promise<boolean> => {
	return bcryptjs.compare(
		password,
		hashedPassword,
	);
};

export const isValidEmail = (
	email: string,
): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const generateRandomString = (
	length: number = 10,
): string => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(
			Math.floor(Math.random() * chars.length),
		);
	}
	return result;
};

export const formatCurrency = (
	amount: number,
	currency = "USD",
): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
};
