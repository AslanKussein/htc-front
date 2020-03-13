import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {language} from "../environments/language";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'htc';
  _language = language;

  public loading = false;

  constructor(public translate: TranslateService,
              private router: Router) {
    translate.setDefaultLang(this._language.language);
    translate.use(this._language.language);
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
}
