import {Component, OnInit} from '@angular/core';
import {DicService} from "../services/dic.service";
import {Dic} from "../models/dic";
import {Util} from "../services/util";

@Component({
  selector: 'app-dic-control',
  templateUrl: './dic-control.component.html',
  styleUrls: ['./dic-control.component.scss']
})
export class DicControlComponent implements OnInit {
  dictionary: Dic[];
  cities: Dic[];
  districts: Dic[];
  streets: Dic[];
  propertyDevelopers: Dic[];
  materialsOfConstruction: Dic[];
  residentialComplexes: Dic[];
  typeOfElevator:Dic[];
  parkingTypes:Dic[];
  yardTypes:Dic[];
  resident:boolean;

  constructor(private util: Util,
              private dicService: DicService) {
  }

  ngOnInit(): void {
      this.loadDictionary();
      this.loadDictionaryForEdit('residential-complexes');
      this.resident=true;
  }

  loadDictionary(){
    this.dicService.getDics('CITIES').subscribe(data => {
      this.cities = this.util.toSelectArray(data);
    });
    this.dicService.getDics('DISTRICTS').subscribe(data => {
      this.districts = this.util.toSelectArray(data);
    });
    this.dicService.getDics('STREETS').subscribe(data => {
      this.streets = this.util.toSelectArray(data);
    });
    this.dicService.getDics('PROPERTY_DEVELOPERS').subscribe(data => {
      this.propertyDevelopers = this.util.toSelectArray(data);
    });
    this.dicService.getDics('MATERIALS_OF_CONSTRUCTION').subscribe(data => {
      this.materialsOfConstruction = this.util.toSelectArray(data);
    });
    this.dicService.getDics('TYPE_OF_ELEVATOR').subscribe(data => {
      this.typeOfElevator = this.util.toSelectArray(data);
    });
    this.dicService.getDics('PARKING_TYPES').subscribe(data => {
      this.parkingTypes = this.util.toSelectArray(data);
    });
    this.dicService.getDics('YARD_TYPES').subscribe(data => {
      this.yardTypes = this.util.toSelectArray(data);
    });

  }

  loadDictionaryForEdit(dic) {
    if (dic == 'residential-complexes') {
      this.dicService.getResidentialComplexes().subscribe(data => {
        this.residentialComplexes = this.util.toSelectArrayResidenceComplex(data);
        console.log(this.residentialComplexes)
      });
    } else {
      this.dicService.getDics(dic).subscribe(data => {
        this.dictionary = data;
      });
    }


  }
}
