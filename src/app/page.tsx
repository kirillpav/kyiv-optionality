"use client";

import { Flex, Text, Button } from "@radix-ui/themes";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// places imports
import parks from "../../places/park.json";
import cafes from "../../places/cafe.json";
import bars from "../../places/bar.json";
import restaurants from "../../places/restaraunt.json";

import LocationInfo from "./components/LocationInfo";
import Map from "./components/Map";
import { useEffect, useRef, useState } from "react";

interface OpeningHoursTime {
	day: number;
	hour: number;
	minute: number;
}

interface OpeningPeriod {
	open: OpeningHoursTime;
	close?: OpeningHoursTime;
}
interface OpeningHours {
	openNow: boolean;
	periods: OpeningPeriod[];
	weekdayDescription: string[];
}
interface Place {
	name: string;
	id: string;
	openingHours: OpeningHours;
	isOpen: boolean;
	coords: [number, number];
}

const isOpenAtTime = (
	openingHours: OpeningHours,
	currentDate: Date
): boolean => {
	const currentDay = currentDate.getDay();
	const currentHour = currentDate.getHours();
	const currentMinute = currentDate.getMinutes();

	const currentDayPeriod = openingHours?.periods?.find(
		(period) => period.open.day === currentDay
	);

	if (currentDayPeriod) {
		const { open, close } = currentDayPeriod;

		if (!close) return true;

		if (
			open.hour !== undefined &&
			open.minute !== undefined &&
			close?.hour !== undefined &&
			close?.minute !== undefined
		) {
			const { hour: startHour, minute: startMinute } = open;
			const { hour: endHour, minute: endMinute } = close;

			if (
				(currentHour > startHour ||
					(currentHour === startHour && currentMinute >= startMinute)) &&
				(currentHour < endHour ||
					(currentHour === endHour && currentMinute < endMinute))
			) {
				return true;
			}
		}
	}

	return false;
};

function Home() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [placeData, setPlaceData] = useState<Place[]>([]);
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	useEffect(() => {
		// Get current time in Kyiv
		const kyivTime = new Date();
		kyivTime.setHours(kyivTime.getHours() + 10);
		setCurrentTime(new Date(kyivTime));
	}, []);

	function getPlaceData(data: any): Place[] {
		return data.places
			.filter(
				(place: any) => place.coordinates && Array.isArray(place.coordinates)
			)
			.map((place: any) => ({
				name: place.displayName.text,
				id: place.id,
				openingHours: place.regularOpeningHours as OpeningHours,
				isOpen: isOpenAtTime(
					place.regularOpeningHours as OpeningHours,
					currentTime ?? new Date()
				),
				coords: [place.coordinates[1], place.coordinates[0]] as [
					number,
					number
				],
			}));
	}

	const cafeData = getPlaceData(cafes);
	const restaurantData = getPlaceData(restaurants);
	const parkData = getPlaceData(parks);
	const barData = getPlaceData(bars);

	useEffect(() => {
		if (selectedCategory === "cafes") {
			setPlaceData(cafeData);
		} else if (selectedCategory === "restaurants") {
			setPlaceData(restaurantData);
		} else if (selectedCategory === "parks") {
			setPlaceData(parkData);
		} else if (selectedCategory === "bars") {
			setPlaceData(barData);
		}
	}, [selectedCategory]);

	return (
		<main className="flex flex-row h-screen py-4 px-8 gap-4">
			<div className="basis-2/5 sm:h-full order-last sm:order-first py-4 sm:px-0 sm:py-2  sm:flex sm:flex-col overflow-hidden">
				<LocationInfo
					onCategorySelect={setSelectedCategory}
					cafeData={cafeData}
					restaurantData={restaurantData}
					parkData={parkData}
					barData={barData}
					currentTime={currentTime}
				/>
			</div>
			<Map selectedCategory={selectedCategory} placeData={placeData} />
		</main>
	);
}

export default Home;
