import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Vacation } from '@app/_models';

@Component({
    templateUrl: 'user.component.html',
    styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    loadingInfo: boolean;
    loadingHistory: boolean;
    userData: User;
    userJoinDate: string;
    vacations: Vacation[] = [];

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    ngOnInit() {
        this.getUserInfo(this.currentUserSubject.value[0].userid);
        this.getUserHistory(this.currentUserSubject.value[0].username);
        this.loadingInfo = true;
        this.loadingHistory = true;
    }

    getUserInfo(id) {
        this.http.get<User>(`/api/Users/${id}`).subscribe(data => {
            this.userData = data;
            // format date
            this.userJoinDate = (new Date(data.joindate)).toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
            });
            this.loadingInfo = false;
        },
        error => {
            this.loadingInfo = false;
            alert(error);
        });
    }

    getUserHistory(username) {
        this.http.get<any>(`/api/Vacations/${username}`).subscribe(data => {
            this.vacations = data;
            // sort by date
            this.vacations.sort(function(a, b)  {
                return ('' + a.startdate).localeCompare(b.startdate);
            });
            // format date
            for (let i = 0; i < this.vacations.length; i++) {
                const startdate = new Date(this.vacations[i].startdate);
                this.vacations[i].startdate = startdate.toLocaleString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                });
            }
            this.loadingHistory = false;
        },
        error => {
            this.loadingHistory = false;
            if (error.status === 404) {
                this.vacations = null;
            } else {
                alert(error);
            }
        });
    }
}
