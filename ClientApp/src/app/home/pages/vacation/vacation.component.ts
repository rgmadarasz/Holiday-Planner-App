import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Vacation } from '@app/_models';
import { Location } from '@app/_models';
import { User } from '@app/_models';
import { API_KEY } from '@app/_helpers';

@Component({
    templateUrl: 'vacation.component.html',
    styleUrls: ['vacation.component.scss']
})

export class VacationComponent implements OnInit {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    vacations: Vacation[] = [];
    locations: Location[] = [];
    countrylist: any[];
    citylist: any[];
    weather: any;

    selectedCountry: string;
    selectedCity: string;
    selectedDate: Date;

    loadingVacations: boolean;
    loadingWeather: boolean;
    loadingLocations: boolean;
    showAdd: boolean;
    showCalendar: boolean;
    showAddButton: boolean;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    ngOnInit() {
        this.loadingVacations = true;
        this.loadingWeather = true;
        this.loadingLocations = true;
        this.showAdd = false;
        this.showCalendar = false;
        this.showAddButton = false;
        this.getUserVacations(this.currentUserSubject.value[0].username);
    }

        getUserVacations(username) {
        this.http.get<Vacation[]>(`/api/Vacations/active/${username}`).subscribe(data => {
            this.vacations = data;
            // sort by date
            this.vacations.sort(function(a, b) {
                return ('' + a.startdate).localeCompare(b.startdate);
            });
            // format date, get image location
            for (let i = 0; i < this.vacations.length; i++) {
                const startdate = new Date(this.vacations[i].startdate);
                this.vacations[i].startdate = startdate.toLocaleString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                });
            }
            this.loadingVacations = false;
            for (let i = 0; i < this.vacations.length; i++) {
                this.getVacationWeathers(this.vacations[i].longitude, this.vacations[i].latitude, i);
            }
        },
        error => {
            this.loadingVacations = false;
            if (error.status === 404) {
                this.vacations = null;
            } else {
                alert(error.status);
            }
        });
    }


    getVacationWeathers(lon, lat, index) {
        this.http.get<any>(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`)
        .subscribe(data => {
            const currentdate = new Date(data.list[0].dt * 1000);
            this.vacations[index].weather = [];
            // get current weather
            data.list[0].dt = currentdate.toLocaleString(undefined, {
                month: 'short', day: 'numeric',
            });
            this.vacations[index].weather.push(data.list[0]);
            // get weather for next 4days at 12:00
            for (let i = 1; i < data.list.length; i++) {
                const weathdate = new Date(data.list[i].dt * 1000);
                if (currentdate.getDay() === weathdate.getDay() || weathdate.getHours() !== 14) {
                    continue;
                }
                data.list[i].dt = weathdate.toLocaleString(undefined, {
                    month: 'short', day: 'numeric',
                });
                if (this.vacations[index].weather.length === 5) {
                    break;
                }
                this.vacations[index].weather.push(data.list[i]);
            }
            this.vacations[index].loadingweather = true;
        },
        error => {
            alert('An error occured displaying weather. Please try again later!');
        });
    }

    getLocations() {
        this.loadingLocations = true;
        this.http.get<Location[]>(`/api/Locations`).subscribe(data => {
            this.locations = data;
            this.citylist = [...new Set(this.locations.map(item => item.city))];
            this.loadingLocations = false;
        },
        error => {
            alert('An error occured displaying locations. Please try again later!');
        });
    }

    selectCity(event) {
        this.selectedCity = event.value;
        if (this.selectedCity !== undefined) {
            this.showCalendar = true;
        }
    }

    selectDate(event) {
        const date = new Date(event.value);
        // var asd = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
        this.selectedDate = event.value;
        this.showAddButton = true;
    }

    addNewVacation() {
        const user = this.currentUserSubject.value[0].username;
        const location = this.selectedCity;
        const startdate = new Date(this.selectedDate.getTime() - this.selectedDate.getTimezoneOffset() * 60000).toISOString();
        this.http.post<any>('/api/Vacations', { user, location, startdate }).subscribe(data => {
            this.selectedCity = this.selectDate = this.selectedCountry = null;
            this.showAdder();
            this.getUserVacations(this.currentUserSubject.value[0].username);
        },
        error => {
            alert('An error occured while adding vacation. Please try again later!');
        });
    }

    openTripadvisor(tripid) {
        {
            const url = 'https://www.tripadvisor.com/' + tripid;
            const win = window.open(url, '_blank');
            win.focus();
        }
    }

    deleteVacation(id) {
        this.http.post<any>('/api/Vacations/disable', { id }).subscribe(data => {
            this.getUserVacations(this.currentUserSubject.value[0].username);
        },
        error => {
            alert('An error occured while deleting vacation. Please try again later!');
        });
    }

    showAdder() {
        this.showAdd = !this.showAdd;
        if (this.showAdd === true) {
            this.getLocations();
        }
        this.showCalendar = false;
        this.selectedCity = null;
    }
}
