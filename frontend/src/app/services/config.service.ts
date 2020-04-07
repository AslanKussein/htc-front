import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  authUrl = ' https://idp-htc.dilau.kz/auth/realms/htc/protocol/openid-connect/token';
  apiDataManagerUrl = ' https://dm-htc.dilau.kz';

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


