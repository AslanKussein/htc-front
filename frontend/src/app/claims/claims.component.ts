import {Component, OnInit} from '@angular/core';
import {language} from "../../environments/language";
import {Router} from "@angular/router";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ruLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from "ngx-bootstrap";
import {ClaimService} from "../services/claim.service";
import {Dic} from "../models/dic";
import {DicService} from "../services/dic.service";
import {Util} from "../services/util";

@Component({
    selector: 'app-claims',
    templateUrl: './claims.component.html',
    styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
    env = language;

    constructor(private router: Router,
                private localeService: BsLocaleService,
                private claimService: ClaimService,
                private dicService: DicService,
                private util: Util) {
        defineLocale('ru', ruLocale);
        this.localeService.use('ru');
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

    operationType: Dic[];
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
        this.formData = {
            claimType: '',
            crDateFrom: '',
            crDateTo: '',
            lastModifyDateFrom: '',
            lastModifyDateTo: '',
            lastCommentDateFrom: '',
            lastCommentDateTo: '',
            textSearch: ''
        };
    }

    ngOnInit(): void {
        this.findClaims(1);
        this.dicService.getDics('operationType').subscribe(data => {
            this.operationType = this.util.toSelectArray(data);
        });
    }

    pageChanged(event: any): void {
        if (this.currentPage !== event.page) {
            this.findClaims(event.page);
        }
    }

    findClaims(pageNo: number) {
        this.loading = true;
        console.log('formData.lastModifyDateRange', this.formData)
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
