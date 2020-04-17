import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {language} from "../../environments/language";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private configService: ConfigService,
              private http: HttpClient) {
  }

  getUserList(search: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('locale', String(language.language));
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/users`, {params});
  }

  getUserById(obj): Observable<any> {
    return this.http.get<any>(`${this.configService.apiUserManagerUrl}/users/`+obj.id);
  }

  getRoleList(search: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('locale', String(language.language));
    return this.http.get<any>(`${this.configService.apiRoleManagerUrl}/roles`, {params});
  }

  public createUser(obj): Observable<any> {
    return this.http.post(`${this.configService.apiUserManagerUrl}/users`, obj)
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

  public updateUserActiveById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/users/`+obj.id+`/active`,{isActive:obj.isActive} )
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }
  public updateUserRolesById(obj): Observable<any> {
    return this.http.put(`${this.configService.apiUserManagerUrl}/users/`+obj.id+`/roles`,{roles:obj.roles} )
      .pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }

}
