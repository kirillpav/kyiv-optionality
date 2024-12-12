"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface dataFormat {
	address: string;
	coords: [number, number];
	status: string;
}

export default function Map({ data }: { data: dataFormat[] }) {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);

	const [zoom, setZoom] = useState(13.5);
	const [center, setCenter] = useState<[number, number]>([
		30.52151862352623, 50.44238028491744,
	]);
	const [pitch, setPitch] = useState(52);

	function getColorByStatus(status: string) {
		if (status === "open") {
			return "h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)]";
		} else {
			return "h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]";
		}
	}

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

		mapRef.current.on("move", () => {
			if (mapRef.current) {
				const mapCenter = mapRef.current.getCenter();
				const mapZoom = mapRef.current.getZoom();
				const mapPitch = mapRef.current.getPitch();

				setCenter([mapCenter.lng, mapCenter.lat]);
				setZoom(mapZoom);
				setPitch(mapPitch);
			}
		});

		// Adding markers
		data.map((data) => {
			const element = document.createElement("div");
			element.className = getColorByStatus(data.status);

			if (mapRef.current && data.coords) {
				new mapboxgl.Marker(element)
					.setLngLat([data.coords[0], data.coords[1]])
					.addTo(mapRef.current);
			}
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
