import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TrajetService, Trajet } from '../services/trajet.service';
import { CityService, City } from '../services/city.service';
import { Router } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {

  myControl = new FormControl();
  myControl2 = new FormControl();
  options: City[];

  filteredOptions: Observable<City[]>;
  filteredOptions2: Observable<City[]>;

  formDatas: Trajet = {
    villeDepart:'',
    villeArrivee:''
  };

  formError: Boolean;
  msgError: String;

  constructor(private trajetserv: TrajetService, 
              private cityserv: CityService, 
              private atp: AmazingTimePickerService, 
              private toastr: ToastrService,
              private router: Router) { }

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
    });
  }

  displayFn(city?: City): string | undefined {
    return city ? city.nom : undefined;
  }

  private _filter(nom: string): City[] {
    const filterValue = nom.toLowerCase();
    return this.options.filter(option => option.nom.toLowerCase().indexOf(filterValue) === 0);
  }

  openDepart() {
    const amazingTimePicker = this.atp.open({
        theme: 'material-blue',
    });
    amazingTimePicker.afterClose().subscribe(time => {
        this.formDatas.heureDepart = time;
    });
  }
  openArrivee() {
    const amazingTimePicker = this.atp.open({
        theme: 'material-blue',
    });
    amazingTimePicker.afterClose().subscribe(time => {
        this.formDatas.heureArrivee = time;
    });
  }

  addTrajet() {
    let datas = _.clone(this.formDatas);
    if(datas.villeDepart.nom)
      datas.villeDepart = datas.villeDepart.nom;

    if(datas.villeArrivee.nom)
      datas.villeArrivee = datas.villeArrivee.nom;

    this.trajetserv.addTrajet(datas).subscribe(response => {
      if(response.success === false) {
        this.formError = true;
        this.msgError = response.msg;
      }
      else if(response.success === true) {
        this.router.navigateByUrl('/home');
        this.toastr.success("Le trajet que vous avez proposé a été ajouté à la liste", "Trajet ajouté !", { timeOut: 3000 });
      }
    });
  }
}
