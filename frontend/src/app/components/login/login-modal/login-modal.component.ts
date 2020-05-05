import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {NotificationService} from "../../../services/notification.service";
import {AuthenticationService} from "../../../services/authentication.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  loginForm: any;

  constructor(public modalRef: BsModalRef,
              private formBuilder: FormBuilder,
              private ngxLoader: NgxUiLoaderService,
              private notifyService: NotificationService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.ngxLoader.stop()
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.ngxLoader.start()

    if (this.loginForm.value.username == null) {
      this.notifyService.showError("Ошибка", "Введите Логин для входа")
      this.ngxLoader.stop()
      return;
    }
    if (this.loginForm.value.password == null) {
      this.notifyService.showError("Ошибка", "Введите Пароль для входа")
      this.ngxLoader.stop()
      return;
    }

    if (this.loginForm.value.username.toLocaleUpperCase() == 'ADMIN') {
      this.notifyService.showError('Ошибка', 'Не корректные данные для входа учетка admin не доступен');
      this.ngxLoader.stop()
      return;
    }
    this.authenticationService.login(this.loginForm, 2);
    this.modalRef.hide();

    this.ngxLoader.stop()
  }
}
