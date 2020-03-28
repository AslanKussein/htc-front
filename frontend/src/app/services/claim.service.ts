import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  getClaims(start: number, length: number, search: any): Observable<any> {
    let params = new HttpParams();

    params = params.append('start', String(start));
    params = params.append('length', String(length));

    if (search.resumeStatus !== undefined) {
      params = params.append('resumeStatus', String(search.resumeStatus));
    }
    if (search.post !== undefined) {
      params = params.append('post', String(search.post));
    }
    if (search.iin !== undefined) {
      params = params.append('iin', String(search.iin));
    }
    if (search.surname !== undefined) {
      params = params.append('surname', String(search.surname));
    }
    if (search.firstName !== undefined) {
      params = params.append('firstName', String(search.firstName));
    }
    if (search.patronymic !== undefined) {
      params = params.append('patronymic', String(search.patronymic));
    }

    return this.http.get<any>(`htc/applications`, {params: params});
    // return this.http.get<any>(`${this.configService.apiUrl}/applications`, {params: params});
  }


  private handleError(error: HttpErrorResponse) {
    if (error instanceof ErrorEvent) {
      console.error('An error occurred:', error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.message}`);
    }
    return throwError(
      error);
  }
}
