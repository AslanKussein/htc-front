import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {first, map} from "rxjs/operators";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loading = false;
  submitted = false;
  rememberMe: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notifyService: NotificationService,
    private userService: UserService,
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

    this.loading = true;
    if (this.loginForm.value.username.toLocaleUpperCase() == 'ADMIN') {
      this.notifyService.showError('Ошибка', 'Не корректные данные для входа учетка admin не доступен');
      this.loading = false;
      this.ngxLoader.stop()
      return;
    }
    // this.authenticationService.login('admin', 'lCogB5%U*y5v')
    this.authenticationService.login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        datax => {
          this.userService.findUserByLogin().subscribe(data => {
            if (data != null) {
              datax.name = data.name
              datax.surname = data.surname
              datax.login = data.login
              datax.roles = data.roles
              datax.group = data.group
              datax.id = data.id
              console.log(this.authenticationService.currentUser)
              localStorage.setItem('currentUser', JSON.stringify(datax));
            }
          });
          this.router.navigate(['home']);
        },
        error => {
          this.notifyService.showError('Ошибка', 'Не корректные данные для входа')
          this.loading = false;
        });

    this.ngxLoader.stop()
  }
}
