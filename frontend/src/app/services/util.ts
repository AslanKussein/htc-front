import {Injectable} from '@angular/core';
import {language} from "../../environments/language";
import {Router} from "@angular/router";
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {ConfigService} from "./config.service";
import {isArray} from "rxjs/internal-compatibility";
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Util {
  _language = language;

  constructor(private router: Router,
              private configService: ConfigService,
              private dbService: NgxIndexedDBService) {
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

  toSelectArrayNewDic(data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        console.log(data[i])
        list.push({value: data[i][idField], label: data[i].multiLang[labelField], code: data[i]['code']});
      }
    }
    return list;
  }

  toSelectArrayRoles(data, idField = 'id') {
    const list = [];
    if (data) {
      const len = data.data.length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          list.push({
            value: '' + data.data[i][idField],
            label: data.data[i]['surname']?.toUpperCase() + ' ' + data.data[i]['name']?.toUpperCase() + ' (' + this.isNullOrEmpty(data.data[i]['applicationCount']) ? 0 : data.data[i]['applicationCount'] + ')',
            applicationCount: data.data[i]['applicationCount']
          });
        }
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
          houseName: data[i]['houseName'],
          propertyDeveloperId: data[i]['propertyDeveloperId'],
          numberOfEntrances: data[i]['numberOfEntrances'],
          numberOfApartments: data[i]['numberOfApartments'],
          housingClass: data[i]['housingClass'],
          housingCondition: data[i]['housingCondition'],
          apartmentsOnTheSite: data[i]['apartmentsOnTheSite'],
          ceilingHeight: data[i]['ceilingHeight'],
          concierge: data[i]['concierge'],
          materialOfConstructionId: data[i]['materialOfConstructionId'],
          numberOfFloors: data[i]['numberOfFloors'],
          parkingTypeIds: data[i]['parkingTypeIds'],
          playground: data[i]['playground'],
          typeOfElevator: data[i]['typeOfElevatorIdList'],
          wheelchair: data[i]['wheelchair'],
          yardType: data[i]['yardTypeId'],
          yearOfConstruction: data[i]['yearOfConstruction'],
        });
        let buildingDto = data[i]['buildingDto']
        list.push({
          cityId: buildingDto.cityId,
          districtId: buildingDto.districtId,
          houseNumber: buildingDto.houseNumber,
          houseNumberFraction: buildingDto.houseNumberFraction,
          streetId: buildingDto.streetId,
        });
      }
    }
    console.log(list)
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

  getDictionaryValueById(data, id: any) {
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
    return `${this.configService.apiFileManagerUrl}` + '/api/download/' + uuid + '/preview?access_token=' + this.getCurrentUser().access_token;
  }

  generatorFullUrl(uuid: string) {
    return `${this.configService.apiFileManagerUrl}` + '/api/download/' + uuid + '?access_token=' + this.getCurrentUser().access_token;
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
    if (this.isNullOrEmpty(JSON.parse(localStorage.getItem('currentUser')).roles)) {
      return false;
    }
    for (const routerElement of JSON.parse(localStorage.getItem('currentUser')).roles) {
      if (routerElement == 'РГ') {
        return true;
      }
    }
    return false;
  }

  nvl(val: any, val2: any) {
    return this.isNullOrEmpty(val2) ? val : val2;
  }

  length(data: any) {
    return data?.length;
  }

  getAllDic(code: string) {
    return this.dbService.getAll(code);
  }

  toSelectArrayPost(data) {
    const list = [];
    if (data) {
      const len = data.length;

      let fieldName;
      switch (this._language.language) {
        case "kz":
          fieldName = 'addressKaz';
          break;
        default:
          fieldName = 'addressRus';
          break;
      }

      for (let i = 0; i < len; i++) {
        list.push({
          value: data[i]['id'],
          label: data[i][fieldName],
          fullAddress: data[i]['fullAddress']
        });
      }
    }
    return list;
  }

  hasShowClientGroup(operation: string, roles: any) {
    if (!this.isNullOrEmpty(roles)) {
      for (const data of roles) {
        if (data.code === 'CLIENT_GROUP') {
          return !data.operations.includes(operation);
        }
      }
    }
  }

  hasShowApplicationGroup(operation: string, roles: any) {
    if (!this.isNullOrEmpty(roles)) {
      for (const data of roles) {
        if (data.code === 'APPLICATION_GROUP') {
          return !data.operations.includes(operation);
        }
      }
    }
  }

  toSelectArrayGroup(data, idField = 'id', surname = 'surname',name='name') {
    const list = [];
    if (data) {
      const len = data.data.length;
      for (let i = 0; i < len; i++) {
        list.push({
          value: data.data[i][idField],
          label: data.data[i][surname]+' '+data.data[i][name],
          description: data.data[i]['description']
        });
      }
    }
    return list;
  }

  hasShowRealPropertyGroup(operation: string, roles: any) {
    if (!this.isNullOrEmpty(roles)) {
      for (const data of roles) {
        if (data.code === 'REAL_PROPERTY_GROUP') {
          return !data.operations.includes(operation);
        }
      }
    }
  }

  keyPress(event: KeyboardEvent) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }
}
