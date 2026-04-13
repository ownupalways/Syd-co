import React from "react";
import {
	motion,
	AnimatePresence,
} from "framer-motion";
import {
	Trash2,
	X,
} from "lucide-react";
import {
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { deleteProductApi } from "../../../api/products";
import toast from "react-hot-toast";
import type { Product } from "../../../types";

interface Props {
	target: Product | null;
	onClose: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({
	target,
	onClose,
}) => {
	const qc = useQueryClient();

	const { mutate: deleteProduct, isPending } =
		useMutation({
			mutationFn: (id: string) =>
				deleteProductApi(id),
			onSuccess: () => {
				toast.success(
					"Product removed successfully",
				);
				qc.invalidateQueries({
					queryKey: ["admin-products-list"],
				});
				onClose();
			},
			onError: () =>
				toast.error("Could not delete product"),
		});

	return (
		<AnimatePresence>
			{target && (
				<div className="fixed inset-0 z-1100 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
					/>

					{/* Modal Card */}
					<motion.div
						initial={{
							scale: 0.9,
							opacity: 0,
							y: 10,
						}}
						animate={{
							scale: 1,
							opacity: 1,
							y: 0,
						}}
						exit={{
							scale: 0.9,
							opacity: 0,
							y: 10,
						}}
						className="relative w-full max-w-md bg-slate-900 border border-red-500/20 rounded-3xl p-8 shadow-2xl shadow-red-500/10 text-center">
						{/* Close Button */}
						<button
							onClick={onClose}
							className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors">
							<X size={20} />
						</button>

						{/* Warning Icon */}
						<div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
							<div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
								<Trash2
									size={32}
									className="text-red-500"
								/>
							</div>
						</div>

						{/* Content */}
						<h3 className="text-xl font-bold text-white mb-2">
							Delete Product?
						</h3>
						<p className="text-slate-400 text-sm leading-relaxed mb-8">
							You are about to delete{" "}
							<span className="text-white font-semibold">
								"{target.name}"
							</span>
							. This action will remove it from
							the SydneyShopping storefront and
							cannot be undone.
						</p>

						{/* Actions */}
						<div className="flex flex-col sm:flex-row gap-3">
							<button
								onClick={onClose}
								className="flex-1 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-all text-sm">
								Keep Product
							</button>
							<button
								disabled={isPending}
								onClick={() =>
									deleteProduct(target._id)
								}
								className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50">
								{isPending ? (
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								) : (
									"Yes, Delete"
								)}
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default DeleteConfirmModal;
