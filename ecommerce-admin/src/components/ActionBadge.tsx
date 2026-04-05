import React from "react";

interface Props {
	adminName: string;
	action: string;
	timestamp?: string;
}

const ActionBadge: React.FC<Props> = ({
	adminName,
	action,
	timestamp,
}) => (
	<div
		style={{
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			padding: "3px 8px",
			borderRadius: "6px",
			background: "rgba(255,45,120,0.08)",
			border: "1px solid rgba(255,45,120,0.15)",
			fontSize: "11px",
			color: "var(--text-secondary)",
		}}>
		<span
			style={{
				width: "6px",
				height: "6px",
				borderRadius: "50%",
				background: "var(--pink)",
				flexShrink: 0,
			}}
		/>
		<span>{action} by </span>
		<span
			style={{
				color: "var(--pink-light)",
				fontWeight: 600,
			}}>
			{adminName}
		</span>
		{timestamp && (
			<span
				style={{ color: "var(--text-muted)" }}>
				·{" "}
				{new Date(timestamp).toLocaleDateString()}
			</span>
		)}
	</div>
);

export default ActionBadge;
