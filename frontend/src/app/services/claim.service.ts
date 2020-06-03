import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from "rxjs/operators";

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
    return this.http.get<any>(`${this.configService.apiDataManagerUrl}/api/applications/` + id, {});
  }

  public saveClaim(obj): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/applications`, obj)
      .pipe(
        tap()
      );
  }

  public updateClaim(id: number, obj: any): Observable<any> {
    return this.http.put(`${this.configService.apiDataManagerUrl}/api/applications/` + id, obj)
      .pipe(
        tap()
      );
  }

  public saveLightApplication(obj: any): Observable<any> {
    return this.http.post(`${this.configService.apiDataManagerUrl}/api/applications/saveLightApplication`, obj)
      .pipe(
        tap()
      );
  }

  public getApartmentByNumberAndPostcode(apartmentNumber: number, postCode: string): Observable<any> {
    return this.http.get(`${this.configService.apiDataManagerUrl}/api/applications/getApartmentByNumberAndPostcode/` + apartmentNumber + `/` + postCode, {})
      .pipe(
        tap()
      );
  }
}
