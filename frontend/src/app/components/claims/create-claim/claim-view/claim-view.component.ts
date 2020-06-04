import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ClaimService} from "../../../../services/claim.service";
import {Subscription} from "rxjs";
import {Util} from "../../../../services/util";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ClaimViewDto} from "../../../../models/createClaim/view/ClaimViewDto";
import {OwnerService} from "../../../../services/owner.service";

@Component({
  selector: 'app-claim-view',
  templateUrl: './claim-view.component.html',
  styleUrls: ['./claim-view.component.scss']
})
export class ClaimViewComponent implements OnInit, OnDestroy {
  applicationId: number;
  claimViewDto: ClaimViewDto;
  subscriptions: Subscription = new Subscription();
  clientFullName: string;

  constructor(private actRoute: ActivatedRoute,
              private util: Util,
              private ngxLoader: NgxUiLoaderService,
              private ownerService: OwnerService,
              private claimService: ClaimService) {
    this.applicationId = Number(this.actRoute.snapshot.params.id);
  }

  ngOnInit(): void {
    this.getApplicationById();
  }

  getApplicationById() {
    this.claimViewDto = new ClaimViewDto();
    this.ngxLoader.startBackground();
    if (!this.util.isNullOrEmpty(this.applicationId)) {
      this.subscriptions.add(
        this.claimService.getApplicationViewById(this.applicationId).subscribe(res => {
          this.claimViewDto = res;
          this.searchByPhone(res.clientLogin);
          console.log(this.claimViewDto)
        }, () => this.ngxLoader.stopBackground())
      );
    }
    this.ngxLoader.stopBackground();
  }

  searchByPhone(login: string) {
    if (this.util.isNullOrEmpty(login)) return;
    this.subscriptions.add(this.ownerService.searchByPhone(login)
      .subscribe(res => {
          this.clientFullName = login + ' (' + res.surname + ' ' + res.firstName + ' ' + (res.patronymic ? res.patronymic : ' ') + ')';
        }
      ));
  }

  getDicNameByLanguage(data: any, column: string) {
    if (!this.util.isNullOrEmpty(data)) {
      let x = this.util.getDicNameByLanguage();
      return data[column]?.[x];
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
