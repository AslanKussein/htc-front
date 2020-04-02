import {Component, OnInit} from '@angular/core';
import {language} from "../../environments/language";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from "ngx-bootstrap";
import {ClaimService} from "../services/claim.service";
import {ApplicationDto} from "../models/applicationDto";

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  env = language;

  constructor(private router: Router,
              private localeService: BsLocaleService,
              private claimService: ClaimService) {
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

  claimData = [];
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
    this.findClaims(1);
  }

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findClaims(event.page);
    }
  }

  findClaims(pageNo: number) {
    this.loading = true;

    this.claimService.getClaims(pageNo, this.itemsPerPage, this.formData).subscribe(res => {
      console.log(res)
      if (res != null) {

        this.claimData = res;
        this.totalItems = res.totalElements;
        this.itemsPerPage = res.size;
        this.currentPage = res.number + 1;
      }
    });
    this.loading = false;
  }
}
