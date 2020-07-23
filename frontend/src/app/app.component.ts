import {Component, OnDestroy, OnInit} from '@angular/core';
import {NewDicService} from "./services/new.dic.service";
import {DicService} from "./services/dic.service";
import {BsLocaleService} from "ngx-bootstrap/datepicker";
import {NgSelectConfig} from "@ng-select/ng-select";
import {TranslateService} from "@ngx-translate/core";
import {language} from "../environments/language";
import {AuthenticationService} from "./services/authentication.service";
import {Util} from "./services/util";
import {User} from "./models/users";
import {Router} from "@angular/router";
import {UploaderService} from "./services/uploader.service";
import {ProfileService} from "./services/profile.service";
import {Subscription} from "rxjs";

declare var jquery: any;   // not required
declare var $: any;   // not required

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'htc';
  _language = language;
  currentUser: User;
  photo: string = 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png';
  logo: string = '../../../assets/images/home/Лого.png';
  subscriptions: Subscription = new Subscription();

  constructor(private newDicService: NewDicService,
              private dicService: DicService,
              private localeService: BsLocaleService,
              public translate: TranslateService,
              public util: Util,
              private router: Router,
              private profileService: ProfileService,
              private uploader: UploaderService,
              private authenticationService: AuthenticationService,
              private config: NgSelectConfig,) {
    translate.setDefaultLang(this._language.language)
    translate.use(this._language.language);
    this.localeService.use('ru');
    this.config.notFoundText = 'Данные не найдены';
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
    this.loadAva();
  }

  loadAva() {
    this.photo = this.util.generatorPreviewUrl(this.util.getCurrentUser().photoUuid);
  }

  isActive() {
    return '/' + localStorage.getItem('url') == this.router.url;
  }

  logout() {
    this.authenticationService.logout();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
