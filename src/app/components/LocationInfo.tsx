import React, { useEffect, useState } from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

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
		<div className="h-full flex flex-col">
			<div className="mb-10 flex-shrink-0">
				<h1 className="text-4xl font-bold uppercase">Welcome to Kyiv</h1>
				<p>Current time: {currentTime?.toLocaleTimeString()}</p>
			</div>
			<Accordion
				type="single"
				collapsible
				className="w-full overflow-y-auto"
				onValueChange={(value) => {
					onCategorySelect(value);
				}}
			>
				<AccordionItem value="cafes">
					<div className="flex items-center justify-between">
						<AccordionTrigger className="text-lg uppercase">
							Cafes
						</AccordionTrigger>
						<p className="text-md text-gray-500">
							{openCafes}/{cafeData.length}
						</p>
					</div>
					{cafeData.map((cafe: Place, id: number) => (
						<div key={id} className="flex items-center">
							<AccordionContent key={id} className="px-6">
								<div className="flex items-center gap-2">
									<p className="uppercase text-md">{cafe.name}</p>
									{cafe.isOpen ? (
										<div className="h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)"></div>
									) : (
										<div className="h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.7)]"></div>
									)}
								</div>
							</AccordionContent>
						</div>
					))}
				</AccordionItem>
				<AccordionItem value="restaurants">
					<div className="flex items-center justify-between">
						<AccordionTrigger className="text-lg uppercase">
							Restaurants
						</AccordionTrigger>
						<p className="text-md text-gray-500">
							{openRestaurants}/{restaurantData.length}
						</p>
					</div>
					{restaurantData.map((restaurant: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center  gap-2">
								<p className="uppercase text-md">{restaurant.name}</p>
								{restaurant.isOpen ? (
									<div className="h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)"></div>
								) : (
									<div className="h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]"></div>
								)}
							</div>
						</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="parks">
					<div className="flex items-center justify-between">
						<AccordionTrigger className="text-lg uppercase">
							Parks
						</AccordionTrigger>
						<p className="text-md text-gray-500">
							{openParks}/{parkData.length}
						</p>
					</div>
					{parkData.map((park: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center gap-2">
								<p className="uppercase text-md	">{park.name}</p>
								{park.isOpen ? (
									<div className="h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)"></div>
								) : (
									<div className="h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]"></div>
								)}
							</div>
						</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="bars">
					<div className="flex items-center justify-between">
						<AccordionTrigger className="text-lg uppercase">
							Bars
						</AccordionTrigger>
						<p className="text-md text-gray-500">
							{openBars}/{barData.length}
						</p>
					</div>
					{barData.map((bar: Place, id: number) => (
						<AccordionContent key={id}>
							<div className="flex items-center gap-2">
								<p className="uppercase text-md">{bar.name}</p>
								{bar.isOpen ? (
									<div className="h-2 w-2 rounded-full bg-green-400 shadow-[0px_0px_4px_2px_rgba(34,197,94,0.7)"></div>
								) : (
									<div className="h-2 w-2 rounded-full bg-red-400 shadow-[0px_0px_4px_2px_rgba(239,68,68,0.9)]"></div>
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
