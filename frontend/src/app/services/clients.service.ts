import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

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
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/clients/`+id);
  }

  updateClientById(form: any): Observable<any> {
    return this.http.put<any>(`${this.configService.apiDataManagerUrl}/clients/`+form.id,form);
  }

  findClientByPhoneNumber(phoneNumber): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/clients/search/by-phone-number?phoneNumber=`+phoneNumber);
  }

}
