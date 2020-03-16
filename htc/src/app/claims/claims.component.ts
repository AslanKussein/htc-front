import {Component, OnInit} from '@angular/core';
import {language} from "../../environments/language";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ruLocale } from 'ngx-bootstrap/locale';
import {BsLocaleService} from "ngx-bootstrap";

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  env = language;

  constructor(private router: Router,
              private localeService: BsLocaleService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  formData = {
    claimType: '',
    crDateRange: '',
    lastModifyDateRange: '',
    lastCommentDateRange: '',
    textSearch: ''
  };
  dClaimType = [];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  dnHref(href) {
    localStorage.setItem('url', href);
    this.router.navigate([href]);
  }

  clearForm() {
    this.formData = {claimType: '', crDateRange: '', lastModifyDateRange: '', lastCommentDateRange: '', textSearch: ''};
  }

  ngOnInit(): void {
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      // this.getJournalList(event.page);
    }
  }

}
