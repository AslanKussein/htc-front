import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  /**
   * Просмотр реестра клиентов
   * @param search
   */
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/profile`);
  }
  updateProfile(obj:any): Observable<any> {
    return this.http.put<any>(`${this.configService.apiUserManagerUrl}/profile`,obj);
  }

}
