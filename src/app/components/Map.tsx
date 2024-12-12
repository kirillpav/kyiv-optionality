"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map() {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!mapContainerRef.current) return; // Add guard clause

		mapboxgl.accessToken = process.env
			.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/streets-v12",
			center: [30.52151862352623, 50.44238028491744],
			zoom: 12,
		});

		// Add error handling
		mapRef.current.on("error", (e) => {
			console.error("Mapbox error:", e);
		});

		return () => {
			mapRef.current?.remove();
		};
	}, []);

	return (
		<div className="flex-1 relative min-h-[300px]">
			<div
				id="map-container"
				ref={mapContainerRef}
				className="absolute inset-0 rounded-[20px] overflow-hidden"
				style={{ width: "100%", height: "100%" }}
			/>
		</div>
	);
}
