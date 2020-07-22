import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {language} from "../../environments/language";

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  searchByPhone(login: string): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/profile-client/` + login)
      .pipe(
        tap(data => {
        }),
        catchError(OwnerService.handleError)
      );
  }

  findByLoginAndAppId(login: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('login', login);
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/api/profile-client/findByLoginAndAppId`, {params})
      .pipe(
        tap(data => {
        }),
        catchError(OwnerService.handleError)
      );
  }

  searchByClientId(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/clients/` + clientId, {});
  }


  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
