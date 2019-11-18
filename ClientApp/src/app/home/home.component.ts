import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
    currentUser: User;
    loading = false;
    users: User[];
    events: string[] = [];
    opened: boolean;
    disableClose: boolean;
    closeEvent: boolean;
    w = window.innerWidth;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private router: Router
        ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        if (this.w > 450) {
            this.disableClose = true;
            this.closeEvent = true;
        } else {
            this.disableClose = false;
            this.closeEvent = false;
        }
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    sidenavToggle() {
        const sidenav = document.getElementById('sidenav1');
    }
}
