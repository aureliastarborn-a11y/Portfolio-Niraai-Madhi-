import React, { useMemo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GridPattern } from '@/components/ui/grid-pattern';

export function GridCard({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) {
	const squares = useMemo(() => getRandomPattern(6), []);
	const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePos({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	}, []);

	const handleMouseLeave = useCallback(() => {
		setMousePos(null);
	}, []);

	return (
		<div
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className={cn(
				'group relative isolate z-0 flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.08] bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-100/95 hover:border-black/[0.16] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
				className,
			)}
			{...props}
		>
			<div className="absolute inset-0 pointer-events-none">
				{/* Darkening surface overlay on hover */}
				<div className="absolute inset-0 bg-transparent transition-colors duration-300 group-hover:bg-black/[0.045] dark:group-hover:bg-black/[0.25]" />

				{/* Dynamic cursor-following darkening shadow */}
				{mousePos && (
					<div
						className="absolute inset-0 transition-opacity duration-200"
						style={{
							background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.06), transparent 70%)`,
						}}
					/>
				)}

				{/* Grid Pattern that darkens when touched by cursor */}
				<div className="absolute -inset-[25%] -skew-y-12 [mask-image:linear-gradient(225deg,black,transparent)] opacity-45 transition-opacity duration-300 group-hover:opacity-95">
					<GridPattern
						width={30}
						height={30}
						x={0}
						y={0}
						squares={squares}
						className="fill-zinc-500/15 stroke-zinc-400/35 transition-colors duration-300 group-hover:fill-zinc-800/40 group-hover:stroke-zinc-700/70 absolute inset-0 size-full translate-y-2 transition-transform duration-200 ease-out group-hover:translate-y-0"
					/>
				</div>
			</div>

			{/* Foreground Content */}
			<div className="relative z-10 w-full">
				{children}
			</div>
		</div>
	);
}

function getRandomPattern(length?: number): [x: number, y: number][] {
	length = length ?? 6;
	return Array.from({ length }, () => [
		Math.floor(Math.random() * 4) + 7, // random x between 7 and 10
		Math.floor(Math.random() * 6) + 1, // random y between 1 and 6
	]);
}
