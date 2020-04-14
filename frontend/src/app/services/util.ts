import {Injectable} from '@angular/core';
import {language} from "../../environments/language";
import {Router} from "@angular/router";

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
}
