export class Vacation {
    id: number;
    locationid: number;
    user: string;
    startdate: string;
    isactive: boolean;
    country: string;
    city: string;
    image: string;
    tripadvisor: string;
    latitude: number;
    longitude: number;
    weather: any[] = [];
    loadingweather = true;
}
