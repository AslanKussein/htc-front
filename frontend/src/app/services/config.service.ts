import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  authUrl = 'https://idp-htc.dilau.kz/auth/realms/htc/protocol/openid-connect/token';
  apiDataManagerUrl = 'http://localhost:8080';
  apiFileManagerUrl = 'https://fm-htc.dilau.kz';
  apiViewManagerUrl = 'https://vm-htc.dilau.kz';
  apiUserManagerUrl = 'https://um-htc.dilau.kz';
  apiRoleManagerUrl = 'https://rm-htc.dilau.kz';

  constructor() {
  }
}


