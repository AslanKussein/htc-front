import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {NotificationService} from "../../services/notification.service";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  submitted = false;
  rememberMe: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notifyService: NotificationService,
    private ngxLoader: NgxUiLoaderService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['claims']);
    }
  }

  ngOnInit(): void {
    this.ngxLoader.start()
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: ['', Validators.nullValidator]
    });
    this.loginForm.rememberMe = localStorage.getItem('username') != null;
    this.ngxLoader.stop()
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.ngxLoader.start()
    this.submitted = true;

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
    this.authenticationService.login(this.loginForm, 1);

    this.ngxLoader.stop()
  }
}
