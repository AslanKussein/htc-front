import {Injectable} from '@angular/core';
import {language} from "../../environments/language";

@Injectable({
  providedIn: 'root'
})
export class Util {
  _language = language;

  constructor() {
  }

  isNullOrEmpty(e: any) {
    return e == null || e == '' || e == undefined;
  }

  toSelectArray(data, idField = 'id', labelField = this.getDicNameByLanguage()) {
    const list = [];
    if (data) {
      const len = data.length;
      for (let i = 0; i < len; i++) {
        list.push({value: '' + data[i][idField], label: data[i].multiLang[labelField], code: data[i]['code']});
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
}
