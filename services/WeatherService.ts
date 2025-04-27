interface WeatherResponse {
    Temperature: {
        Metric: { Value: number; Unit: string };
        Imperial: { Value: number; Unit: string };
    };
    WeatherText: string;
    LocalObservationDateTime: string;
}

interface LocationResponse {
    Key: string;
    LocalizedName: string;
    Country: {
        ID: string;
        LocalizedName: string;
    };
}

export class WeatherService {
    private readonly API_KEY = process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY;
    private readonly BASE_URL = 'https://dataservice.accuweather.com';

    async getLocationKey(latitude: number, longitude: number): Promise<string> {
        try {
            const response = await fetch(
                `${this.BASE_URL}/locations/v1/cities/geoposition/search?apikey=${this.API_KEY}&q=${latitude},${longitude}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch location key');
            }

            const data: LocationResponse = await response.json();
            return data.Key;
        } catch (error) {
            console.error('Error fetching location key:', error);
            throw error;
        }
    }

    async getCurrentWeather(locationKey: string): Promise<WeatherResponse> {
        try {
            const response = await fetch(
                `${this.BASE_URL}/currentconditions/v1/${locationKey}?apikey=${this.API_KEY}&details=true`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            const data: WeatherResponse[] = await response.json();
            console.log("Weather Data: ", data);
            return data[0]; // API returns an array with single item
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    async getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherResponse> {
        const locationKey = await this.getLocationKey(latitude, longitude);
        console.log("Location Key: ", locationKey);
        return this.getCurrentWeather(locationKey);
    }
}
