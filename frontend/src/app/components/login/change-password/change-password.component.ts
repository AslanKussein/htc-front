import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {AuthenticationService} from "../../../services/authentication.service";
import {Util} from "../../../services/util";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: any;

  constructor(
    private formBuilder: FormBuilder,
    public modalRef: BsModalRef,
    private authenticationService: AuthenticationService,
    public util: Util
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmationPassword: ['', Validators.required]
    });
  }

  close(): void {
    this.modalRef.hide();
  }

  changePassword(): void {
    const currentUser = this.util.getCurrentUser();
    this.authenticationService.updatePassword(currentUser?.id, this.passwordForm.value).subscribe(res => {
      console.log('res', res);
    })
  }
}
