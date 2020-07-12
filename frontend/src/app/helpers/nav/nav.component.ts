import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {language} from "../../../environments/language";
import {User} from "../../models/users";


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  _language = language;
  currentUser: User;

  constructor(public translate: TranslateService,
              private router: Router,
              private authenticationService: AuthenticationService) {
    translate.setDefaultLang(this._language.language)
    translate.use(this._language.language);
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

  }

  ngOnInit(): void {

  }

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  isActive() {
    return '/'+localStorage.getItem('url') == this.router.url;
  }

  changeLang(language: string) {
    this._language.language = language;
    this.translate.setDefaultLang(language);
    this.translate.use(language);
  }

  logout() {
    this.authenticationService.logout();
  }
}
