import React, { useState, useCallback, useId } from 'react';
import { cn } from '@/lib/utils';

export interface GridCardProps extends React.ComponentProps<'div'> {
	cellSize?: number;
}

export function GridCard({
	className,
	children,
	cellSize = 38,
	...props
}: GridCardProps) {
	const patternId = useId();
	const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null);
	const [trail, setTrail] = useState<Array<{ id: string; col: number; row: number }>>([]);

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const col = Math.floor(x / cellSize);
		const row = Math.floor(y / cellSize);

		setHoveredCell((prev) => {
			if (prev && prev.col === col && prev.row === row) {
				return prev;
			}
			if (prev) {
				const id = `${prev.col}-${prev.row}-${Date.now()}`;
				setTrail((current) => [...current.slice(-5), { id, col: prev.col, row: prev.row }]);
				setTimeout(() => {
					setTrail((current) => current.filter((item) => item.id !== id));
				}, 450);
			}
			return { col, row };
		});
	}, [cellSize]);

	const handleMouseLeave = useCallback(() => {
		if (hoveredCell) {
			const id = `${hoveredCell.col}-${hoveredCell.row}-${Date.now()}`;
			setTrail((current) => [...current.slice(-5), { id, col: hoveredCell.col, row: hoveredCell.row }]);
			setTimeout(() => {
				setTrail((current) => current.filter((item) => item.id !== id));
			}, 450);
		}
		setHoveredCell(null);
	}, [hoveredCell]);

	return (
		<div
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className={cn(
				'group relative isolate z-0 flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.08] bg-white/85 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]',
				className,
			)}
			{...props}
		>
			{/* Interactive Grid with Individual Box Darkening */}
			<svg
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 size-full"
			>
				<defs>
					<pattern
						id={patternId}
						width={cellSize}
						height={cellSize}
						patternUnits="userSpaceOnUse"
					>
						<path
							d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
							fill="none"
							stroke="rgba(0, 0, 0, 0.08)"
							strokeWidth="1"
						/>
					</pattern>
				</defs>

				{/* Base Grid Lines (Steady, Visible Grid) */}
				<rect width="100%" height="100%" fill={`url(#${patternId})`} />

				{/* Fading Trailing Boxes Recently Touched */}
				{trail.map((item) => (
					<rect
						key={item.id}
						x={item.col * cellSize}
						y={item.row * cellSize}
						width={cellSize}
						height={cellSize}
						fill="rgba(0, 0, 0, 0.08)"
						stroke="rgba(0, 0, 0, 0.16)"
						strokeWidth="1"
						className="transition-opacity duration-300 opacity-60"
					/>
				))}

				{/* Active Box Under Cursor (Darkened Box) */}
				{hoveredCell && (
					<rect
						x={hoveredCell.col * cellSize}
						y={hoveredCell.row * cellSize}
						width={cellSize}
						height={cellSize}
						fill="rgba(0, 0, 0, 0.20)"
						stroke="rgba(0, 0, 0, 0.40)"
						strokeWidth="1"
						className="transition-all duration-75"
					/>
				)}
			</svg>

			{/* Foreground Content */}
			<div className="relative z-10 w-full">
				{children}
			</div>
		</div>
	);
}
