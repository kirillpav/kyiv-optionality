"use client";

import { Flex, Text, Button } from "@radix-ui/themes";
// places imports
import parks from "../../places/park.json";
import cafes from "../../places/cafe.json";
import bars from "../../places/bar.json";
import restaurants from "../../places/restaraunt.json";

import LocationInfo from "./components/LocationInfo";
import Map from "./components/Map";
import { useEffect, useState } from "react";

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
}

async function getCoords(address: string): Promise<[number, number]> {
	const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.status === "OK") {
			const location = data.results[0].geometry.location;
			return [location.lat, location.lng];
		}
		return [0, 0]; // Default coordinates if geocoding fails
	} catch (error) {
		console.error("Error fetching coordinates:", error);
		return [0, 0]; // Default coordinates on error
	}
}

const isOpenAtTime = (
	openingHours: OpeningHours,
	currentDate: Date
): boolean => {
	const currentDay = currentDate.getDay();
	const currentHour = currentDate.getHours();
	const currentMinute = currentDate.getMinutes();

	const currentDayPeriod = openingHours.periods?.find(
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
	return (
		<main className="flex flex-row h-screen p-4 gap-4">
			<div className="basis-2/5 sm:h-full order-last sm:order-first py-4 sm:px-0 sm:py-2  sm:flex sm:flex-col w-1/3 px-4">
				<LocationInfo />
			</div>
			<Map />
		</main>
	);
}

export default Home;
