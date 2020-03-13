import { Component, OnInit } from '@angular/core';
import {language} from "../../environments/language";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  env = language;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(this.env.language);
    translate.use(this.env.language);
  }

  ngOnInit(): void {
  }

}
