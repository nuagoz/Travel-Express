import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  fumeur = false;
  animaux = false;
  musique = false;

  reservations:any;
  publications:any;

  isLoaded = false;
  displayedColumns: string[] = ['depart', 'destination', 'heuredep', 'heurearr', 'date', 'places', 'prix', 'action'];
  dataSource:any;

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.userService.getBoard().subscribe(response => {
      if(response.success === true) {
        console.log(response);
        this.isLoaded = true;
        this.fumeur = response.user.prefFumeur;
        this.animaux = response.user.prefAnimaux;
        this.musique = response.user.prefMusique;
        this.reservations = response.trajetsReserves;
        this.publications = response.trajetsProposes;
        
        this.dataSource = response.trajetsReserves;
      }
    });
  }

  prefChanged(preference:string) {
    let toSet = {};
    toSet['musique'] = this.musique;
    toSet['cigarette'] = this.fumeur;
    toSet['animaux'] = this.animaux;
    
    this.userService.changePref(toSet).subscribe(response => {
      this.toastr.success("Vos préférences ont été modifiées");
    });
  }

  formatDate(date:string) {
    return moment(date).format("DD/MM/YYYY");
  }

  calcPrice(tarif:string, nbplaces:string) {
    return parseInt(tarif) * parseInt(nbplaces);
  }

  /**
   * Retourne true si la date est passée
   * @param date 
   */
  isPreviousDate(date:string): boolean {
    return moment(date) < moment();
  }
}
