import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  /**
   * Просмотр реестра клиентов
   * @param search
   */
  getClientList(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/register/getClientList`, search);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/clients/` + id);
  }

  updateClientById(form: any): Observable<any> {
    return this.http.put<any>(`${this.configService.apiDataManagerUrl}/api/clients/` + form.id, form);
  }

  findClientByPhoneNumber(phoneNumber): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/clients/search/by-phone-number?phoneNumber=` + phoneNumber);
  }

}
