import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDatepickerModule, MatNativeDateModule, MatInputModule, MatCardModule, MatButtonModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AmazingTimePickerModule } from 'amazing-time-picker';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PublishComponent } from './publish/publish.component';

/* Services */
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';
import { TrajetService } from './services/trajet.service';
import { CityService } from './services/city.service';
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    PublishComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    LoadingBarHttpModule,
    LoadingBarRouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    AmazingTimePickerModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [
    UserService,
    AuthenticationService,
    TrajetService,
    CityService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
