import React, { useEffect, useState } from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import parks from "../../../places/park.json" assert { type: "json" };
import cafes from "../../../places/cafe.json" assert { type: "json" };
import bars from "../../../places/bar.json" assert { type: "json" };
import restaurants from "../../../places/restaraunt.json" assert { type: "json" };

interface LocationInfoProps {
	onCategorySelect: (category: string | null) => void;
	cafeData: Place[];
	restaurantData: Place[];
	parkData: Place[];
	barData: Place[];
	currentTime: Date | null;
}

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

function LocationInfo({
	onCategorySelect,
	cafeData,
	restaurantData,
	parkData,
	barData,
	currentTime,
}: LocationInfoProps) {
	const [category, setCategory] = useState<string | null>(null);

	const openCafes = cafeData.filter((cafe) => cafe.isOpen).length;
	const openRestaurants = restaurantData.filter(
		(restaurant) => restaurant.isOpen
	).length;
	const openParks = parkData.filter((park) => park.isOpen).length;
	const openBars = barData.filter((bar) => bar.isOpen).length;

	return (
		<div>
			<h1 className="text-2xl font-bold">Welcome to Kyiv</h1>
			<p>Current time: {currentTime?.toLocaleString()}</p>
			<Accordion
				type="single"
				collapsible
				className="w-full"
				onValueChange={(value) => {
					onCategorySelect(value);
				}}
			>
				<AccordionItem value="cafes">
					<AccordionTrigger className="text-lg uppercase">
						Cafes
						<p className="text-sm text-gray-500">
							{openCafes}/{cafeData.length}
						</p>
					</AccordionTrigger>
					{cafeData.map((cafe: Place, id: number) => (
						<div key={id} className="flex items-center">
							<AccordionContent key={id} className="px-6">
								<div className="flex items-center justify-between w-full py-2 gap-5">
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
					<AccordionTrigger className="text-lg uppercase">
						Restaurants
						<p className="text-sm text-gray-500">
							{openRestaurants}/{restaurantData.length}
						</p>
					</AccordionTrigger>
					{restaurantData.map((restaurant: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center  gap-2">
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
					<AccordionTrigger className="text-lg uppercase">
						Parks
						<p className="text-sm text-gray-500">
							{openParks}/{parkData.length}
						</p>
					</AccordionTrigger>
					{parkData.map((park: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center ">
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
					<AccordionTrigger className="text-lg uppercase">
						Bars
						<p className="text-sm text-gray-500">
							{openBars}/{barData.length}
						</p>
					</AccordionTrigger>
					{barData.map((bar: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center">
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

export default LocationInfo;
