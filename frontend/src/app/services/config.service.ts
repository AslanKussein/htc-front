import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  apiUrl = 'api';

  constructor() {
  }

  currentLang() {
    const lang = sessionStorage.getItem('currentLang');
    if (lang && lang.length > 1) {
      return lang;
    } else {
      return 'kz';
    }
  }
}


