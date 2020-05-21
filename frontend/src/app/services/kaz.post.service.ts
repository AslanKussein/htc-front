import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

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
  getDataPost(data: string, page: number): Observable<any> {
    return this.http.get<any>(`${this.configService.apiKazPostUrl}/api/byAddress/` + data + `?from=` + page, {}).pipe(
      tap(),
      catchError(KazPostService.handleError)
    );
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
