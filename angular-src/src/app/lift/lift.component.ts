import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrajetService, Trajet } from '../services/trajet.service';
import { ReservationService, Reservation } from '../services/reservation.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-lift',
  templateUrl: './lift.component.html',
  styleUrls: ['./lift.component.scss']
})
export class LiftComponent implements OnInit {

  id:any;
  infosTrajet: Trajet;
  infosReservation: Reservation;
  availableSeats: number;
  isLoaded: boolean;
  dateLift: any;
  prix: string[];
  selected = 1;
  liftDisabled = false;

  constructor(private route: ActivatedRoute,
              private router: Router, 
              private trajetserv: TrajetService,
              private bookingserv: ReservationService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.isLoaded = false;
    this.id = this.route.snapshot.params['id'];
    this.trajetserv.getTrajet(this.id).subscribe(res => { // On récupère les informations du trajet / covoiturage
      
      if(res.success === true) {

        this.bookingserv.getReservations(this.id).subscribe(response => {
          if(response.success === true) {
            this.isLoaded = true;
            this.infosReservation = response.bookings;
            this.infosTrajet = res.result;
            this.availableSeats = parseInt(this.infosTrajet.nbPlaces) - parseInt(response.seatsBooked);
            this.prix = parseInt(this.infosTrajet.tarif).toFixed(2).split('.');
            this.dateLift = moment(this.infosTrajet.date).format("DD/MM/YYYY");
            if(moment(this.infosTrajet.date) < moment())
              this.liftDisabled = true;
          }
        });
      }
      else { // Si ce trajet n'existe pas on redirige l'utilisateur à la page d'accueil
        this.router.navigateByUrl('/home');
      }
    });
  }

  booking() {
    let datas = {
      idTrajet: this.id,
      nbPassagers: this.selected.toString()
    };

    this.bookingserv.booking(datas).subscribe(response => {
      console.log(response);
      if(response.success === true) {
        this.router.navigateByUrl('/home');
        this.toastr.success(`Vous avez réservé ${this.selected} place(s) pour ce trajet`, "Trajet réservé !", { timeOut: 3000 });
      }
      else if(response.success === false) {
        this.toastr.error(response.msg, "Erreur !");
      }
    });
  }

  counter(i: number) {
    return new Array(i);
  }
  parseNumber(val: string) {
    return parseInt(val);
  }
}
