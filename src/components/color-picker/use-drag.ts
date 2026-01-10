"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseDragOptions {
	onDrag: (x: number, y: number) => void;
	onDragEnd?: () => void;
}

/**
 * Hook for handling drag interactions on color picker elements
 * Returns handlers to attach to the draggable element
 */
export function useDrag({ onDrag, onDragEnd }: UseDragOptions) {
	const isDragging = useRef(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const calculatePosition = useCallback(
		(clientX: number, clientY: number) => {
			if (!containerRef.current) return;

			const rect = containerRef.current.getBoundingClientRect();
			const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)); // prettier-ignore
			const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)); // prettier-ignore

			onDrag(x, y);
		},
		[onDrag]
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			isDragging.current = true;
			calculatePosition(e.clientX, e.clientY);
		},
		[calculatePosition]
	);

	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			isDragging.current = true;
			const touch = e.touches[0];
			calculatePosition(touch.clientX, touch.clientY);
		},
		[calculatePosition]
	);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging.current) return;
			e.preventDefault();
			calculatePosition(e.clientX, e.clientY);
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!isDragging.current) return;
			const touch = e.touches[0];
			calculatePosition(touch.clientX, touch.clientY);
		};

		const handleEnd = () => {
			if (isDragging.current) {
				isDragging.current = false;
				onDragEnd?.();
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleEnd);
		document.addEventListener("touchmove", handleTouchMove, { passive: true }); // prettier-ignore
		document.addEventListener("touchend", handleEnd);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleEnd);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleEnd);
		};
	}, [calculatePosition, onDragEnd]);

	return {
		containerRef,
		handleMouseDown,
		handleTouchStart,
	};
}
