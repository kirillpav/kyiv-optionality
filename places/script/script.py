import json
import requests

# Load the JSON file with locations
with open('../park.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Your Google Maps API key
# google_maps_api_key = 'AIzaSyAcfSlLDYeF3U1wJEVji6W6lF-kLvCK_us'

# Function to geocode an address
def geocode_address(address):
    url = f"https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        'address': address,
        'key': google_maps_api_key
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        response_data = response.json()
        if response_data['status'] == 'OK' and response_data['results']:
            lat = response_data['results'][0]['geometry']['location']['lat']
            lon = response_data['results'][0]['geometry']['location']['lng']
            return [lat, lon]
        else:
            print(f"API returned status {response_data['status']} for address: {address}")
    else:
        print(f"HTTP error {response.status_code} for address: {address}")
    return None

# Loop through places and add coordinates
for place in data['places']:
    address = place.get('formattedAddress')
    if address:
        coordinates = geocode_address(address)
        if coordinates:
            place['coordinates'] = coordinates
        else:
            print(f"Could not geocode address: {address}")
    else:
        print("No address found for this place.")

# Save the updated JSON with coordinates
with open('geocoded_locations.json', 'w', encoding='utf-8') as output_file:
    json.dump(data, output_file, indent=4, ensure_ascii=False)

print("Geocoding complete. Results saved in 'geocoded_locations.json'.")