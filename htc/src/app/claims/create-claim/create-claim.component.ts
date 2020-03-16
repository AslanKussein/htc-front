import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {language} from "../../../environments/language";

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent implements OnInit {

  env = language;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang(this.env.language);
    translate.use(this.env.language);
  }

  ngOnInit(): void {
  }

}
