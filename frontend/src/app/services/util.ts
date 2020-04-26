import {Injectable} from '@angular/core';
import {language} from "../../environments/language";
import {Router} from "@angular/router";
import {Dic} from "../models/dic";

@Injectable({
  providedIn: 'root'
})
export class Util {
  _language = language;

  constructor(private router: Router) {
  }

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  isNullOrEmpty(e: any) {
    return e == null || e == '' || e == undefined;
  }

  toSelectArray(data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        list.push({value: '' + data[i][idField], label: data[i][labelField], code: data[i]['code']});
      }
    }
    return list;
  }

  toSelectArrayId(data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        list.push({value: data[i][idField], label: data[i][labelField], code: data[i]['code']});
      }
    }
    return list;
  }

  toSelectArrayRoles(data, idField = 'id', labelField = this.getDicName()) {
    const list = [];
    if (data) {
      const len = data.data.length;
      for (let i = 0; i < len; i++) {
        list.push({
          value: '' + data.data[i][idField],
          label: data.data[i][labelField],
          description: data.data[i]['description']
        });
      }
    }
    return list;
  }

  toSelectArrayRoles2(data, idField = 'id', labelField = this.getDicName()) {
    const list = [];
    if (data) {
      const len = data.data.length;
      for (let i = 0; i < len; i++) {
        list.push({value: data.data[i][idField], label: data.data[i][labelField], description: data.data[i]['description']});
      }
    }
    return list;
  }

  getDicName() {
    let fieldName;
   fieldName = 'name';
    return fieldName;
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

  toSelectArrayResidenceComplex(data) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        list.push({
          value: '' + data[i]['id'],
          label: data[i]['houseName'],
          countryId: data[i]['countryId'],
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
          parkingTypeId: data[i]['parkingTypeIds'],
          playground: data[i]['playground'],
          streetId: data[i]['streetId'],
          typeOfElevator: data[i]['typeOfElevator'],
          wheelchair: data[i]['wheelchair'],
          yardType: data[i]['yardType'],
          yearOfConstruction: data[i]['yearOfConstruction'],
        });
      }
    }
    return list;
  }

  getValueByKey(data: any, key: any) {
    return data[key];
  }

  getObjectLength(obj: any) {
    return Object.keys(obj).length;
  }

  roomCountDictionary() {
    let dic_ = [];
    for (let i = 1; i <= 6; i++) {
      let dic = new Dic();
      dic['value'] = i;
      dic['label'] = i == 6 ? "более" : i;
      dic_.push(dic);
    }
    return dic_;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'))
  }

  getDictionaryValueById(data: Dic[], id: any) {
    for (const obj of data) {
      if (obj['value'] == id) {
        return obj;
      }
    }
  }
}
