import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ClaimService} from "../../../../services/claim.service";
import {Subscription} from "rxjs";
import {Util} from "../../../../services/util";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ClaimViewDto} from "../../../../models/createClaim/view/ClaimViewDto";
import {OwnerService} from "../../../../services/owner.service";
import {UploaderService} from "../../../../services/uploader.service";
import {CreateClaimComponent} from "../create-claim.component";

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
  photoList: any[] = [];
  photoPlanList: any[] = [];
  photo3DList: any[] = [];

  constructor(private actRoute: ActivatedRoute,
              private util: Util,
              private ngxLoader: NgxUiLoaderService,
              private ownerService: OwnerService,
              private uploader: UploaderService,
              private createClaimComponent: CreateClaimComponent,
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
          if (!this.util.isNullOrEmpty(this.claimViewDto?.photoIdList)) {
            for (const ph of this.claimViewDto.photoIdList) {
              this.fillPicture(ph, 1);
            }
          }
          if (!this.util.isNullOrEmpty(this.claimViewDto?.housingPlanImageIdList)) {
            for (const ph of this.claimViewDto.housingPlanImageIdList) {
              this.fillPicture(ph, 2);
            }
          }
          if (!this.util.isNullOrEmpty(this.claimViewDto?.virtualTourImageIdList)) {
            for (const ph of this.claimViewDto?.virtualTourImageIdList) {
              this.fillPicture(ph, 3);
            }
          }
        }, () => this.ngxLoader.stopBackground())
      );
    }
    this.ngxLoader.stopBackground();
  }

  editApplication() {
    let result = confirm("Вы хотите редактировать заявку?");
    if (result) {
      this.createClaimComponent.view = true;
      this.util.dnHref('create-claim/' + this.applicationId)
    }
  }

  fillPicture(guid: any, id: number) {
    let uuid = guid.uuid != null ? guid.uuid : guid;
    this.subscriptions.add(this.uploader.getFileInfoUsingGET(uuid).subscribe(res => {
      if (res.size > 0) {
        let obj = {};
        obj['guid'] = uuid;
        obj['image'] = this.util.generatorPreviewUrl(uuid);
        obj['fullImage'] = this.util.generatorFullUrl(uuid);
        if (id == 1) {
          this.photoList.push(obj);
        } else if (id == 2) {
          this.photoPlanList.push(obj);
        } else if (id == 3) {
          this.photo3DList.push(obj);
        }
      }
    }))
  }

  searchByPhone(login: string) {
    if (this.util.isNullOrEmpty(login)) return;
    this.subscriptions.add(this.ownerService.searchByPhone(login)
      .subscribe(res => {
          this.clientFullName = res.id + ' (' + res.surname + ' ' + res.firstName + ' ' + (res.patronymic ? res.patronymic : ' ') + ')';
        }
      ));
  }

  getDicNameByLanguage(data: any, column: string) {
    if (!this.util.isNullOrEmpty(data)) {
      let x = this.util.getDicNameByLanguage();
      return !this.util.isNullOrEmpty(data[column]) ? data[column]?.[x] : '';
    }
  }

  setLoop(data: any, column: string) {
    let txt = '';
    if (!this.util.isNullOrEmpty(data[column])) {
      let x = this.util.getDicNameByLanguage();
      for (const ownerServiceElement of data[column]) {
        txt += ownerServiceElement?.[x] + ', '
      }
      return txt;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
