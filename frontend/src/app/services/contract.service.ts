import {Injectable} from "@angular/core";
import {ConfigService} from "./config.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {map, tap} from "rxjs/operators";
import {catchError} from "rxjs/internal/operators";
import {ContractFormAgreementDto} from "../models/createClaim/ContractFormAgreementDto";


@Injectable({
  providedIn: 'root'
})
export class ContractService {
  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  generateContract(data: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/contracts/generateContract`, data, {
      responseType: 'json'
    }).pipe(tap());
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

  public generateDepositContract(data): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/contracts/generateDepositContract`, data)
      .pipe(
        tap(),
      );
  }

  private static handleError(error: HttpErrorResponse) {
    return throwError(
      error);
  }
}
