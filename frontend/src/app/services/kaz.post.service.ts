import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";
import {ClientDto} from "../models/createClaim/clientDto";

@Injectable({
  providedIn: 'root'
})
export class KazPostService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  /**
   * findUserByLogin
   */
  getDataPost(data: string): Observable<any> {
    return this.http.get<any>(`${this.configService.apiKazPostUrl}/api/byAddress/` + data + `?from=0`, {}).pipe(
    // return this.http.get<any>(`${this.configService.apiKazPostUrl}/api/byAddress/%D0%B0%D1%81%D1%82%D0%B0%D0%BD%D0%B0%20%D0%BA%D1%83%D0%BD%D0%B0%D0%B5%D0%B2%D0%B0%208?from=0`, {}).pipe(
      tap(data => {
      }),
      catchError(this.handleError)
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
