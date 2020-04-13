import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  getClaims(start: number, length: number, search: any): Observable<any> {
    let params = new HttpParams();

    params = params.append('pageNumber', String(start));
    params = params.append('pageSize', String(length));
    params = params.append('sortBy', String('id'));
    params = params.append('direction', String('ASC'));

    if (search.resumeStatus !== undefined) {
      params = params.append('applicationTypeId', String(search.claimType));
    }
    if (search.authorId !== undefined) {
      params = params.append('authorId', String(search.claimType));
    }
    if (search.crDateFrom !== undefined) {
      params = params.append('creationDateFrom', String(search.crDateFrom));
    }
    if (search.crDateTo !== undefined) {
      params = params.append('creationDateTo', String(search.crDateTo));
    }
    if (search.lastModifyDateFrom !== undefined) {
      params = params.append('changeDateFrom', String(search.lastModifyDateFrom));
    }
    if (search.lastModifyDateTo !== undefined) {
      params = params.append('changeDateTo', String(search.lastModifyDateTo));
    }
    if (search.textSearch !== undefined) {
      params = params.append('text', search.textSearch);
    }

    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/register/getApplicationList`, params);
  }

  public saveClaim(obj): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/applications`, obj)
      // return this.http.post(`/ehr/api/resume/put/resume` , obj)
      .pipe(
        tap(data => {
          console.log(data)
        }),
        // catchError(this.handleError)
      );
  }

}
