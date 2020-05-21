import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Subscription} from "rxjs";
import {ClaimService} from "../../../../services/claim.service";
import {Util} from "../../../../services/util";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.choose.claim.component.html',
  styleUrls: ['./modal.choose.claim.component.scss'],
})
export class ModalChooseClaimComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  title;
  apartmentNumber;
  kazPostId;

  constructor(public modalRef: BsModalRef,
              private util: Util,
              private claimService: ClaimService) {
  }

  getApartmentByNumberAndPostcode() {

    this.subscriptions.add(
      this.claimService.getApartmentByNumberAndPostcode(this.apartmentNumber, this.kazPostId).subscribe(res => {
        console.log(res)
      })
    );
  }

  ngOnInit() {
    if (!this.util.isNullOrEmpty(this.kazPostId) && !this.util.isNullOrEmpty(this.kazPostId)) {
        this.getApartmentByNumberAndPostcode();
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
