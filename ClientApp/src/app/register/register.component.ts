import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    text: any;
    type: any;
    hide: any;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private http: HttpClient
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            passwordagain: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
        });

        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    }

    // form field values
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.error = null;
        // stop if invalid
        if (this.loginForm.invalid) {
            return;
        }
        if (this.f.password.value !== this.f.passwordagain.value) {
            this.error = 'Password doesn\'t match';
            return;
        }
        this.loading = true;

        this.registerUser(this.f.username.value, this.f.password.value, this.f.firstname.value, this.f.lastname.value);
    }

    registerUser(username, password, firstname, lastname) {
        this.http.post<User>('/api/Users/register', { username, password, firstname, lastname }).subscribe(data => {
            this.loading = false;
            alert('Registered, now you can login');
        },
        error => {
            if (error.status === 409) {
                this.error = "Username already in use"
                this.loading = false;
            }
            else {
                alert('An error occured please try again later');
                this.loading = false;
            }
        });

    }
}
