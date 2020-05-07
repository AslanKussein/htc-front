import {Observable, Subject} from "rxjs";
import {ComponentCanDeactivate} from "./componentCanDeactivate";
import {CanDeactivate} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {CreateClaimComponent} from "../../components/claims/create-claim/create-claim.component";
import {Injectable} from "@angular/core";
import {ModalComponent} from "../../components/claims/create-claim/modal.window/modal.component";
@Injectable({
  providedIn: 'root'
})
export class CreateClaimExitDeactivate implements CanDeactivate<CreateClaimComponent> {

  constructor(private modalService: BsModalService) {
  }
  canDeactivate(component: CreateClaimComponent) {

    const subject = new Subject<boolean>();

     this.modalService.show(ConfirmDialogComponent, {
      class: 'modal-md',
    })

    // console.log(this.modalRef)
    // if (this.modalRef) {
    //   this.modalRef.content.subject = subject;
    //   this.modalRef.content.onClose.subscribe(result => {
    //     if (result) {
    //       // component.cancelTimeLoop();
    //     } else {
    //       // when response is NO
    //       console.log('You decided to stay on Page!');
    //     }
    //   })

      return subject.asObservable();
    // }

  }
}
