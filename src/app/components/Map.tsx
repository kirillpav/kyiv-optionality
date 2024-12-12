"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map() {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);

	const [zoom, setZoom] = useState(13.5);
	const [center, setCenter] = useState<[number, number]>([
		30.52151862352623, 50.44238028491744,
	]);
	const [pitch, setPitch] = useState(52);

	useEffect(() => {
		if (!mapContainerRef.current) return; // Add guard clause

		mapboxgl.accessToken = process.env
			.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

		if (!mapboxgl.accessToken) {
			console.error("Mapbox access token is not set");
			return;
		}

		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/dark-v11",
			center: center,
			zoom: zoom,
			pitch: pitch,
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
		<div className="flex-1 relative h-full min-h-[300px]">
			<div
				id="map-container"
				ref={mapContainerRef}
				className="absolute inset-0 rounded-[20px] overflow-hidden"
				style={{ width: "100%", height: "100%" }}
			/>
		</div>
	);
}
