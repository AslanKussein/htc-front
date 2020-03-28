import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  //serverUrl = 'http://localhost:9001';
  serverUrl = 'http://localhost:8080';
  apiUrl = 'https://dm-htc.dilau.kz';

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


