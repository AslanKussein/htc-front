import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {AuthenticationService} from "../../../services/authentication.service";
import {Util} from "../../../services/util";
import {NotificationService} from "../../../services/notification.service";

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
    public util: Util,
    private notifyService: NotificationService
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
    if (localStorage.getItem('password') !== this.passwordForm.value.currentPassword) {
      return this.notifyService.showError('Ошибка', 'Не правильно указано текущий пароль');
    }
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmationPassword) {
      return this.notifyService.showError('Ошибка', 'Пароль не совпадает');
    }
    const obj = {
      pass: this.passwordForm.value.newPassword
    };
    this.authenticationService.updatePassword(obj).subscribe(res => {
      if (res && res.success === true) {
        this.modalRef.hide();
        this.notifyService.showSuccess('', 'Пароль успешно поменялся');
        this.authenticationService.logout();
      }
    });
  }
}
