import React from "react";

interface Props {
	adminName: string;
	action: string;
	timestamp?: string;
}

/**
 * A compact badge to attribute actions to specific admins.
 * Designed to fit inside table cells or list items.
 */
const ActionBadge: React.FC<Props> = ({
	adminName,
	action,
	timestamp,
}) => (
	<div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 transition-colors hover:border-indigo-200 dark:hover:border-indigo-900">
		{/* Visual indicator dot */}
		<span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />

		<div className="flex items-center gap-1 text-[10px] sm:text-xs whitespace-nowrap">
			<span className="text-slate-500 dark:text-slate-400 font-medium">
				{action.toLowerCase()} by
			</span>

			<span className="text-slate-900 dark:text-slate-200 font-bold tracking-tight">
				{adminName}
			</span>

			{timestamp && (
				<>
					<span className="text-slate-300 dark:text-slate-700 mx-0.5">
						•
					</span>
					<time
						className="text-slate-400 dark:text-slate-500 font-medium"
						dateTime={new Date(
							timestamp,
						).toISOString()}>
						{new Date(
							timestamp,
						).toLocaleDateString([], {
							month: "short",
							day: "numeric",
						})}
					</time>
				</>
			)}
		</div>
	</div>
);

export default ActionBadge;
