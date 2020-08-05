import {Injectable} from "@angular/core";
import {ConfigService} from "./config.service";
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class CreditProgrammService {

  constructor(private configService: ConfigService, private http: HttpClient) {
  }

  public getAll(): Observable<any> {
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/open-api/credit-programm`);
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
