import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {language} from "../environments/language";
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from "./services/authentication.service";
import {User} from "./models/users";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'htc';
  _language = language;

  public loading = false;
  currentUser: User;

  constructor(public translate: TranslateService,
              private router: Router,
              private authenticationService: AuthenticationService) {
    translate.setDefaultLang(this._language.language);
    translate.use(this._language.language);
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  changeLang(language: string) {
    this._language.language = language;
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
