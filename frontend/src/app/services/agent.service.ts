import {Injectable} from "@angular/core";
import {ConfigService} from "./config.service";
import {Util} from "./util";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  constructor(private configService: ConfigService,
              private util: Util,
              private http: HttpClient) {
  }

  getMyAgentList(obj: any): Observable<any> {
    return this.http.post<any>(`${this.configService.apiViewManagerUrl}/api/register/getMyAgentList`, obj);
  }
}
