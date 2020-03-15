import {Component, OnInit} from '@angular/core';
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

  formData = {
    claimType: '',
    crDateFrom: '',
    crDateTo: '',
    lastModifyDateFrom: '',
    lastModifyDateTo: '',
    lastCommentDateFrom: '',
    lastCommentDateTo: '',
    textSearch: ''
  };
  dClaimType = [];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  ngOnInit(): void {
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      // this.getJournalList(event.page);
    }
  }

}
