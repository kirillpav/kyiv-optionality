"use client";

import { Flex, Text, Button } from "@radix-ui/themes";
// places imports
import parks from "../../places/park.json";
import cafes from "../../places/cafe.json";
import bars from "../../places/bar.json";
import restaurants from "../../places/restaraunt.json";

import LocationInfo from "./components/LocationInfo";

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
	const kyivTime = new Date();
	kyivTime.setHours(kyivTime.getHours() + 2);
	const currentTime = new Date(kyivTime);

	console.log(currentTime);

	return (
		<main className="flex flex-col sm:flex-row sm:gap-4 h-screen">
			<div className="basis-2/5 sm:h-full order-last sm:order-first py-4 sm:px-0 sm:py-2 overflow-hidden sm:flex sm:flex-col">
				<div className="w-full h-20 pl-8 pr-4 hidden sm:flex sm:justify-between items-center">
					<LocationInfo />
				</div>
			</div>

			<h1>Hello World</h1>
		</main>
	);
}

export default Home;
