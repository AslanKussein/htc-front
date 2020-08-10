import {Injectable} from "@angular/core";
import {ConfigService} from "./config.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private authenticationService: AuthenticationService) {}

  saveComment(obj: any): Observable<any> {
    const currentUser = this.authenticationService.currentUserValue;
    return this.http.post(`${this.configService.apiDataManagerUrl}/open-api/notes`, obj , {
      headers: {
        Authorization: `Bearer ${currentUser.access_token}`
      }
    })
      .pipe(tap(data => {}));
  } 
}
