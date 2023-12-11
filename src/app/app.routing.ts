import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from './auth.guard';

import{ UserComponent } from './user/user.component';
import { LoginComponent } from './login';
import { RegistrationComponent } from './registration';
import { FeedComponent } from './feed/feed.component';
import { HomeComponent } from './home';
// import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'user/:userName', component: UserComponent },
  { path: 'user/:id', component: UserComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: 'feed', component: FeedComponent},
    { path: 'home', component: HomeComponent},

    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
