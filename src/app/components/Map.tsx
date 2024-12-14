"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface OpeningHours {
	openNow: boolean;
	periods: OpeningPeriod[];
	weekdayDescription: string[];
}

interface OpeningHoursTime {
	day: number;
	hour: number;
	minute: number;
}

interface OpeningPeriod {
	open: OpeningHoursTime;
	close?: OpeningHoursTime;
}

interface Place {
	name: string;
	id: string;
	openingHours: OpeningHours;
	isOpen: boolean;
	coords: [number, number];
}

interface MapProps {
	selectedCategory: string | null;
	placeData: Place[];
}

const Map = ({ selectedCategory, placeData }: MapProps) => {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const markersRef = useRef<mapboxgl.Marker[]>([]);

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

	// Initial map setup
	useEffect(() => {
		if (!mapContainerRef.current) return;

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

		return () => {
			mapRef.current?.remove();
		};
	}, []);

	// Handle markers updates
	useEffect(() => {
		if (!mapRef.current) return;

		// Remove existing markers
		markersRef.current.forEach((marker) => marker.remove());
		markersRef.current = [];

		// Add new markers
		placeData.forEach((place) => {
			// Verify that coords exist and are in the correct format
			if (
				place.coords &&
				Array.isArray(place.coords) &&
				place.coords.length === 2
			) {
				const element = document.createElement("div");
				element.className = place.isOpen
					? getColorByStatus("open")
					: getColorByStatus("closed");

				const [lng, lat] = place.coords;

				const marker = new mapboxgl.Marker(element)
					.setLngLat([lng, lat])
					.addTo(mapRef.current!);

				markersRef.current.push(marker);
			}
		});

		return () => {
			markersRef.current.forEach((marker) => marker.remove());
			markersRef.current = [];
		};
	}, [selectedCategory, placeData]);

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
};

export default Map;
