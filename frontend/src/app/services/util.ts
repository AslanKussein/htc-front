import {Injectable} from '@angular/core';
import {language} from "../../environments/language";
import {Router} from "@angular/router";
import {Dic} from "../models/dic";
import {ConfigService} from "./config.service";
import {isArray} from "rxjs/internal-compatibility";
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Util {
  _language = language;

  constructor(private router: Router,
              private configService: ConfigService) {
  }

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  navigateByUrl(href) {
    this.router.navigateByUrl(href);
  }

  isNullOrEmpty(e: any) {
    return e == null || e == '' || e == undefined;
  }

  toSelectArray(data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        list.push({value: data[i][idField], label: data[i][labelField], code: data[i]['code']});
      }
    }
    return list;
  }

  toSelectArrayId(data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        list.push({
          value: data[i][idField],
          label: data[i][labelField],
          code: data[i]['code'],
          operationCode: data[i]['operationCode']
        });
      }
    }
    return list;
  }

  toSelectArrayRoles(data, idField = 'id') {
    const list = [];
    if (data) {
      const len = data.data.length;
      for (let i = 0; i < len; i++) {
        list.push({
          value: '' + data.data[i][idField],
          label: data.data[i]['surname']?.toUpperCase() + ' ' + data.data[i]['name']?.toUpperCase() + ' (' + this.isNullOrEmpty(data.data[i]['applicationCount']) ? 0 : data.data[i]['applicationCount'] + ')',
          applicationCount: data.data[i]['applicationCount']
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
        list.push({
          value: data.data[i][idField],
          label: data.data[i][labelField],
          description: data.data[i]['description']
        });
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

  getError() {
    let fieldName;
    switch (this._language.language) {
      case "kz":
        fieldName = 'kk';
        break;
      case "en":
        fieldName = 'en';
        break;
      default:
        fieldName = 'ru';
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

  toString(data: any) {
    return data?.toString();
  }

  generatorPreviewUrl(uuid: string) {
    const fm = `${this.configService.apiFileManagerUrl}`;
    return fm + '/download/' + uuid + '/preview?access_token=' + this.getCurrentUser().access_token;
  }

  generatorFullUrl(uuid: string) {
    const fm = `${this.configService.apiFileManagerUrl}`;
    return fm + '/download/' + uuid + '?access_token=' + this.getCurrentUser().access_token;
  }

  isNumeric(val: any): val is number | string {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat (#15100)
    return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
  }

  formatDate(date: any) {
    return formatDate(date, 'dd.MM.yyyy HH:mm', 'en-US');
  }

  hasRGRole() {
    for (const routerElement of JSON.parse(localStorage.getItem('currentUser')).roles) {
      if (routerElement == 'РГ') {
        return true;
      }
    }
    return false;
  }
}
