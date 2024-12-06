import { Flex, Text, Button } from "@radix-ui/themes";

// places imports
import parks from "../../places/park.json";
import cafes from "../../places/cafe.json";
import bars from "../../places/bar.json";
import restaurants from "../../places/restaraunt.json";

// const types for places
const PLACES = {
	Parks: parks,
	Cafes: cafes,
	Bars: bars,
	Restaurants: restaurants,
} as const;

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

async function Home() {
	const placesSet = Object.keys(PLACES).reduce((acc, label) => {});

	return (
		<div>
			<h1>Hello World</h1>
		</div>
	);
}

export default Home;
