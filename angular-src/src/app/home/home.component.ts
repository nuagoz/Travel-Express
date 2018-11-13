import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TrajetService, Trajet } from '../services/trajet.service';
import { ReservationService, Reservation } from '../services/reservation.service';
import { CityService, City } from '../services/city.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myControl = new FormControl();
  myControl2 = new FormControl();
  options: City[];

  filteredOptions: Observable<City[]>;
  filteredOptions2: Observable<City[]>;

  searchDatas: Trajet = {
    villeDepart: '',
    villeArrivee: '',
    date: ''
  };

  isLoaded = false;
  searchResults: Trajet[];

  constructor(private trajetserv: TrajetService, 
              private cityserv: CityService, 
              private router: Router,
              private bookingserv: ReservationService) {}

  ngOnInit() {
    this.cityserv.getCities().subscribe(res => {
      this.options = res.cities;

      this.filteredOptions2 = this.myControl2.valueChanges
      .pipe(
          startWith<string | City>(''),
          map(value => typeof value === 'string' ? value : value.nom),
          map(nom => nom ? this._filter(nom) : this.options.slice())
        );
      
        this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith<string | City>(''),
          map(value => typeof value === 'string' ? value : value.nom),
          map(nom => nom ? this._filter(nom) : this.options.slice())
        );

        this.search();

    });
  }

  displayFn(city?: City): string | undefined {
    return city ? city.nom : undefined;
  }

  private _filter(nom: string): City[] {
    const filterValue = nom.toLowerCase();
    return this.options.filter(option => option.nom.toLowerCase().indexOf(filterValue) === 0);
  }

  /**
   * Fonction de recherche
   */
  search() {
    this.isLoaded = false;
    let datas = _.clone(this.searchDatas);
    if(datas.villeDepart.nom)
      datas.villeDepart = datas.villeDepart.nom;
    if(datas.villeArrivee.nom)
      datas.villeArrivee = datas.villeArrivee.nom;

    this.trajetserv.search(datas).subscribe(response => {
      if(response.success === true) {
        // On récupère les réservations pour chaque trajet
        let cpt = 0;
        for(let trajet of response.resultTrajets) {
          
          this.bookingserv.getReservations(trajet._id).subscribe(res => {
            cpt++;
            if(res.success === true) {
              trajet.availableSeats = parseInt(trajet.nbPlaces) - parseInt(res.seatsBooked);
              if(cpt === response.resultTrajets.length) {
                this.searchResults = response.resultTrajets.filter(x => x.availableSeats > 0); // on enlève les covoiturages pleins
                this.isLoaded = true;
                console.log("is loaded!", this.searchResults);
              }
            }
          });
          
        }
      }
    });

  }

  /**
   * Accede à la page du trajet sélectionné
   * @param id du trajet
   */
  getLift(id: string): void {
    this.router.navigateByUrl('/lift/' + id);
  }

}
