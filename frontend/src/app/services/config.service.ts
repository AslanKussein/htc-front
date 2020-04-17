import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  authUrl = ' https://idp-htc.dilau.kz/auth/realms/htc/protocol/openid-connect/token';
  apiDataManagerUrl = ' https://dm-htc.dilau.kz';
  apiFileManagerUrl = ' https://fm-htc.dilau.kz';
  apiViewManagerUrl = ' https://vm-htc.dilau.kz';
  apiUserManagerUrl = ' https://um-htc.dilau.kz';
  apiRoleManagerUrl = ' https://rm-htc.dilau.kz';

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


