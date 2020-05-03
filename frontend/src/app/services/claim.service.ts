import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  getClaims(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/register/getApplicationList`, search);
  }

  getShortApplicationList(search: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/register/getShortApplicationList`, search);
  }

  getClaimById(id: number): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/applications/` + id, {});
  }

  public saveClaim(obj): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/applications`, obj)
      // return this.http.post(`/ehr/api/resume/put/resume` , obj)
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

  public updateClaim(id: number, obj: any): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/applications/` + id, obj)
      // return this.http.post(`/ehr/api/resume/put/resume` , obj)
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

  public saveLightApplication(obj: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/applications/saveLightApplication`, obj)
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
    }
    return throwError(
      error);
  }
}
