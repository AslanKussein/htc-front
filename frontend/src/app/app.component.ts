import {Component} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {DicService} from "./services/dic.service";
import {language} from "../environments/language";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'htc';
  _language = language;

  constructor(private dbService: NgxIndexedDBService,
              private dicService: DicService) {
    this.loadDictionary();
  }

  getDicNameByLanguage() {
    let fieldName;
    switch (this._language.language) {
      case "kz":
        fieldName = 'nameKz';
        break;
      case "en":
        fieldName = 'nameEn';
        break;
      default:
        fieldName = 'nameRu';
        break;
    }
    return fieldName;
  }

  toSelectArray(code: string, data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    if (data) {
      const len = data.length;
      if (code == 'yes_no') {
        idField = 'code';
      }
      for (let i = 0; i < len; i++) {
        this.dbService.add(code, {
          value: data[i][idField], label: data[i][labelField], code: data[i]['code'],
          operationCode: data[i]['operationCode']
        }).then(
          () => {
            // Do something after the value was added
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }

  toSelectArrayResidenceComplex(data) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        this.dbService.add('residentialComplexes',
          {
            value: '' + data[i]['id'],
            id: data[i]['id'],
            label: data[i]['houseName'],
            countryId: data[i]['countryId'],
            cityId: data[i]['cityId'],
            houseName: data[i]['houseName'],
            propertyDeveloperId: data[i]['propertyDeveloperId'],
            numberOfEntrances: data[i]['numberOfEntrances'],
            numberOfApartments: data[i]['numberOfApartments'],
            housingClass: data[i]['housingClass'],
            housingCondition: data[i]['housingCondition'],
            apartmentsOnTheSite: data[i]['apartmentsOnTheSite'],
            ceilingHeight: data[i]['ceilingHeight'],
            concierge: data[i]['concierge'],
            districtId: data[i]['districtId'],
            houseNumber: data[i]['houseNumber'],
            houseNumberFraction: data[i]['houseNumberFraction'],
            materialOfConstructionId: data[i]['materialOfConstructionId'],
            numberOfFloors: data[i]['numberOfFloors'],
            parkingTypeIds: data[i]['parkingTypeIds'],
            playground: data[i]['playground'],
            streetId: data[i]['streetId'],
            typeOfElevator: data[i]['typeOfElevatorIdList'],
            wheelchair: data[i]['wheelchair'],
            yardType: data[i]['yardTypeId'],
            yearOfConstruction: data[i]['yearOfConstruction'],
          }
        ).then(
          () => {
            // Do something after the value was added
          },
          error => {
            console.log(error);
          }
        );
        list.push();
      }
    }
    return list;
  }

  addToDB(dicCode: string) {
    this.dbService.getAll(dicCode).then(
      data => {
        if (data.length == 0) {
          if (dicCode == 'residentialComplexes') {
            this.dicService.getResidentialComplexes().subscribe(obj => {
              this.toSelectArrayResidenceComplex(obj);
            });
          } else {
            this.dicService.getDics(dicCode).subscribe(data => {
              this.toSelectArray(dicCode, data);
            });
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  loadDictionary() {
    this.addToDB('operation_types');
    this.addToDB('object_types');
    this.addToDB('cities');
    this.addToDB('districts');
    this.addToDB('parking_types');
    this.addToDB('streets');
    this.addToDB('possible_reasons_for_bidding');
    this.addToDB('countries');
    this.addToDB('materials_of_construction');
    this.addToDB('yes_no');
    this.addToDB('type_of_elevator');
    this.addToDB('yard_types');
    this.addToDB('property_developers');
    this.addToDB('sewerage_systems');
    this.addToDB('heating_systems');
    this.addToDB('application_statuses');
    this.addToDB('residentialComplexes');
    this.addToDB('event_types');
  }
}
