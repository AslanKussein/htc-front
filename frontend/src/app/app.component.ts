import {Component} from '@angular/core';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {language} from "../environments/language";
import {NewDicService} from "./services/new.dic.service";
import {DicService} from "./services/dic.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'htc';
  _language = language;

  constructor(private dbService: NgxIndexedDBService,
              private newDicService: NewDicService,
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
      if (code == 'YES_NO') {
        idField = 'code';
      }
      for (let i = 0; i < len; i++) {
        let label = code == 'YES_NO' ? data[i][labelField] : data[i].multiLang[labelField];
        this.dbService.add(code, {
          value: data[i][idField],
          label: label,
          code: data[i]['code'],
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
            this.newDicService.getResidentialComplexes().subscribe(obj => {
              this.toSelectArrayResidenceComplex(obj);
            });
          } else if (dicCode == 'YES_NO') {
            this.dicService.getDics(dicCode).subscribe(data => {
              this.toSelectArray(dicCode, data);
            })
          } else {
            this.newDicService.getDictionary(dicCode).subscribe(data => {
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
    this.addToDB('OperationType');
    this.addToDB('ObjectType');
    this.addToDB('City');
    this.addToDB('District');
    this.addToDB('ParkingType');
    this.addToDB('Street');
    this.addToDB('PossibleReasonForBidding');
    this.addToDB('Country');
    this.addToDB('MaterialOfConstruction');
    this.addToDB('YES_NO');
    this.addToDB('TypeOfElevator');
    this.addToDB('YardType');
    this.addToDB('PropertyDeveloper');
    this.addToDB('Sewerage');
    this.addToDB('HeatingSystem');
    this.addToDB('ApplicationStatus');
    this.addToDB('residentialComplexes');
    this.addToDB('EventType');
  }
}
