import React, { useEffect, useState } from "react";

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

// TODO Accordion for each category of item (eq. Cafes, Restaurants ...)
// TODO In each frop down display name of place and status of it
export default function LocationInfo() {
	const [currentTime, setCurrentTime] = useState<Date | null>(null);

	useEffect(() => {
		// Get current time in Kyiv
		const kyivTime = new Date();
		kyivTime.setHours(kyivTime.getHours() + 10);
		setCurrentTime(new Date(kyivTime));
	}, []);

	function getPlaceData(data: any): Place[] {
		return data.places.map((place: any) => ({
			name: place.displayName.text,
			openingHours: place.regularOpeningHours as OpeningHours,
			isOpen: isOpenAtTime(
				place.regularOpeningHours as OpeningHours,
				currentTime ?? new Date() // Provide default value if currentTime is null
			), // change to kyivTime later
		}));
	}

	const cafeData = getPlaceData(cafes);
	const restaurantData = getPlaceData(restaurants);
	const parkData = getPlaceData(parks);
	const barData = getPlaceData(bars);
	return (
		<div>
			<h1>Left Side</h1>
			<p>{currentTime?.toLocaleString()}</p>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="cafes">
					<AccordionTrigger className="text-lg uppercase">
						Cafes
					</AccordionTrigger>
					{cafeData.map((cafe: Place, id: number) => (
						<div key={id} className="flex items-center">
							<AccordionContent
								key={id}
								className="divide-y divide-dashed divide-zinc-600"
							>
								<div className="flex items-center justify-between gap-2">
									<p>{cafe.name}</p>
									{cafe.isOpen ? (
										<p className="text-green-500">Open</p>
									) : (
										<p className="text-red-500">Closed</p>
									)}
								</div>
							</AccordionContent>
						</div>
					))}
				</AccordionItem>
				<AccordionItem value="restaurants">
					<AccordionTrigger>Restaurants</AccordionTrigger>
					{restaurantData.map((restaurant: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center justify-between gap-2">
								<p>{restaurant.name}</p>
								{restaurant.isOpen ? (
									<p className="text-green-500">Open</p>
								) : (
									<p className="text-red-500">Closed</p>
								)}
							</div>
						</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="parks">
					<AccordionTrigger>Parks</AccordionTrigger>
					{parkData.map((park: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center justify-between gap-2">
								<p>{park.name}</p>
								{park.isOpen ? (
									<p className="text-green-500">Open</p>
								) : (
									<p className="text-red-500">Closed</p>
								)}
							</div>
						</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="bars">
					<AccordionTrigger>Bars</AccordionTrigger>
					{barData.map((bar: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center justify-between gap-2">
								<p>{bar.name}</p>
								{bar.isOpen ? (
									<p className="text-green-500">Open</p>
								) : (
									<p className="text-red-500">Closed</p>
								)}
							</div>
						</AccordionContent>
					))}
				</AccordionItem>
			</Accordion>
		</div>
	);
}
