import React from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import parks from "../../../places/park.json" assert { type: "json" };
import cafes from "../../../places/cafe.json" assert { type: "json" };
import bars from "../../../places/bar.json" assert { type: "json" };
import restaurants from "../../../places/restaraunt.json" assert { type: "json" };

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

function openTime(status: string) {
	return (
		<div
			className={`rounded-lg px-2 py-1 text-sm w-[fit-content] ${
				status === "open" && "bg-green-700"
			} ${status === "closed" && "bg-red-700"}`}
		>
			{status}
		</div>
	);
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

function getPlaceNames(data: any): string[] {
	return data.places.map((place: any) => place.displayName.text);
}

const cafeNames = getPlaceNames(cafes);
const restarauntNames = getPlaceNames(restaurants);
const parkNames = getPlaceNames(parks);
const barNames = getPlaceNames(bars);

const kyivTime = new Date();
kyivTime.setHours(kyivTime.getHours() + 10);
const currentTime = new Date(kyivTime);

// TODO Accordion for each category of item (eq. Cafes, Restaurants ...)
// TODO In each frop down display name of place and status of it
export default function LocationInfo() {
	return (
		<div>
			<h1>Left Side</h1>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="cafes">
					<AccordionTrigger>Cafes</AccordionTrigger>
					{cafeNames.map((cafe, id) => (
						<AccordionContent key={id}>{cafe}</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="restaurants">
					<AccordionTrigger>Restaurants</AccordionTrigger>
					{restarauntNames.map((restaurant, id) => (
						<AccordionContent key={id}>{restaurant}</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="parks">
					<AccordionTrigger>Parks</AccordionTrigger>
					{parkNames.map((park, id) => (
						<AccordionContent key={id}>{park}</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="bars">
					<AccordionTrigger>Bars</AccordionTrigger>
					{barNames.map((bar, id) => (
						<AccordionContent key={id}>{bar}</AccordionContent>
					))}
				</AccordionItem>
			</Accordion>
		</div>
	);
}
