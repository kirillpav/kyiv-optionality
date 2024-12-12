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

// Get current time in Kyiv
const kyivTime = new Date();
kyivTime.setHours(kyivTime.getHours() + 10);
const currentTime = new Date(kyivTime);
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

	return false;
};

function getPlaceData(data: any): Place[] {
	return data.places.map((place: any) => ({
		name: place.displayName.text,
		openingHours: place.openingHours,
		isOpen: isOpenAtTime(place.openingHours, new Date()),
	}));
}

const cafeData = getPlaceData(cafes);
const restaurantData = getPlaceData(restaurants);
const parkData = getPlaceData(parks);
const barData = getPlaceData(bars);

// TODO Accordion for each category of item (eq. Cafes, Restaurants ...)
// TODO In each frop down display name of place and status of it
export default function LocationInfo() {
	return (
		<div>
			<h1>Left Side</h1>
			<p>{kyivTime.toLocaleString()}</p>
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
								<div className="flex items-center justify-between">
									<p>{cafe.name}</p>
									{/* <p>{cafe.openingHours}</p> */}
								</div>
							</AccordionContent>
						</div>
					))}
				</AccordionItem>
				<AccordionItem value="restaurants">
					<AccordionTrigger>Restaurants</AccordionTrigger>
					{restaurantData.map((restaurant: Place, id: number) => (
						<AccordionContent key={id}>{restaurant.name}</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="parks">
					<AccordionTrigger>Parks</AccordionTrigger>
					{parkData.map((park: Place, id: number) => (
						<AccordionContent key={id}>{park.name}</AccordionContent>
					))}
				</AccordionItem>
				<AccordionItem value="bars">
					<AccordionTrigger>Bars</AccordionTrigger>
					{barData.map((bar: Place, id: number) => (
						<AccordionContent key={id}>{bar.name}</AccordionContent>
					))}
				</AccordionItem>
			</Accordion>
		</div>
	);
}
