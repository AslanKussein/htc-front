import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {first} from "rxjs/operators";
import {NotificationService} from "../services/notification.service";

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
    private notifyService : NotificationService) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['claims']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: ['', Validators.nullValidator]
    });
    this.loginForm.username = localStorage.getItem('username');
    this.loginForm.password = localStorage.getItem('password');
    this.loginForm.rememberMe = localStorage.getItem('username') != null;
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;

    if (this.loginForm.value.username == null) {
      this.notifyService.showError("Ошибка", "Введите Логин для входа")
      return;
    }
    if (this.loginForm.value.password == null) {
      this.notifyService.showError("Ошибка", "Введите Пароль для входа")
      return;
    }

    this.loading = true;
    // this.authenticationService.login('admin', 'lCogB5%U*y5v')
    this.authenticationService.login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['claims']);
        },
        error => {
          this.notifyService.showError('Ошибка', 'Не корректные данные для входа')
          this.loading = false;
        });
  }
}
