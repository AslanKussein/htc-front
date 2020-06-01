import {Component} from '@angular/core';
import {NewDicService} from "./services/new.dic.service";
import {DicService} from "./services/dic.service";
import {BsLocaleService} from "ngx-bootstrap/datepicker";
import {NgSelectConfig} from "@ng-select/ng-select";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'htc';

  constructor(private newDicService: NewDicService,
              private dicService: DicService,
              private localeService: BsLocaleService,
              private config: NgSelectConfig,) {
    this.localeService.use('ru');
    this.config.notFoundText = 'Данные не найдены';
  }
}
