import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  searchByPhone(number: string): Observable<any> {
    let params = new HttpParams();

    params = params.append('phoneNumber', String(number));

    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/clients/search/by-phone-number`, {params: params})
      .pipe(
        tap(data => {
        }),
        catchError(this.handleError)
      );
  }

  searchByClientId(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/clients/` + clientId, {});
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
