import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';
import { AboutComponent } from './home/pages/about/about.component';
import { VacationComponent } from './home/pages/vacation/vacation.component';
import { UserComponent } from './home/pages/user/user.component';

const routes: Routes = [
    { path: 'home',  component: HomeComponent, canActivate: [AuthGuard],
        children: [
        { path: 'vacations', component: VacationComponent },
        { path: 'user', component: UserComponent },
        { path: 'about', component: AboutComponent },
        { path: '', redirectTo: 'vacations', pathMatch: 'full' }]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
