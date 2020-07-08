import {Injectable} from "@angular/core";
import {ConfigService} from "./config.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {tap} from "rxjs/operators";
import {catchError} from "rxjs/internal/operators";


@Injectable({
  providedIn: 'root'
})
export class ContractService {
  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  generateContract(data: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/contracts/generateContract`, data, {
      responseType: 'text',
    })
      .pipe(
        tap(),
        catchError(ContractService.handleError)
      );
  }

  getCommission(params: any): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/api/contracts/getCommission`, {params})
      .pipe(tap());
  }

  getContractForm(applicationId: number): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/api/contracts/${applicationId}`)
      .pipe(tap());
  }

  missContract(data: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/contracts/missContract`, data)
      .pipe(tap());
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
