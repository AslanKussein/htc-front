import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Util} from "./util";

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private configService: ConfigService,
              private util: Util,
              private http: HttpClient) {
  }

  /**
   * Просмотр реестра клиентов
   * @param search
   */
  getClientList(obj: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/register/getClientList`, obj);
  }

  getClientById(id: string): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/profile-client/` + id);
  }

  updateClientById(form: any): Observable<any> {
    return this.http.put<any>(`${this.configService.apiUserManagerUrl}/api/profile-client/crm`, form);
  }

  findClientByPhoneNumber(phoneNumber): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/clients/search/by-phone-number?phoneNumber=` + phoneNumber);
  }

}
