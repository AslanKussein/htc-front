import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Dic} from "../../models/dic";
import {Util} from "../../services/util";
import {ruLocale} from "ngx-bootstrap/locale";
import {defineLocale} from "ngx-bootstrap/chronos";
import {BsLocaleService} from "ngx-bootstrap";
import {StaffService} from "../../services/staff.service";
import {NotificationService} from "../../services/notification.service";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.scss']
})
export class StaffsComponent implements OnInit {
  modalRef: BsModalRef;
  roles: Dic[];
  groups: Dic[];
  actions: string;

  constructor(private modalService: BsModalService,
              private localeService: BsLocaleService,
              private staffService: StaffService,
              private notifyService: NotificationService,
              private util: Util,
              private ngxLoader: NgxUiLoaderService) {
    defineLocale('ru', ruLocale);
    this.localeService.use('ru');
  }

  filter = {
    search: '',
    roles: null,
    group: null
  }

  formData = {
    residentialComplexes: null,
    roles: null,
    group: null,
    isActive: true,
    login: null,
    pass: '',
    passNew: '',
    passNew2: '',
    name: '',
    surname: ''
  };


  ngOnInit(): void {
    this.ngxLoader.start();
    this.loadDictionary();
    this.findObjects(1);
  }

  users = [];
  loading;
  totalItems = 0;
  itemsPerPage = 10;
  currentPage = 1;

  pageChanged(event: any): void {
    if (this.currentPage !== event.page) {
      this.findObjects(event.page);
    }
  }

  getUserInfo() {
    this.ngxLoader.start();
    this.staffService.getUserInfo(this.filter).subscribe(res => {
      if (res != null) {
        this.users = res.data;
      }
    });
    this.ngxLoader.stop();
  }

  findObjects(pageNo: number) {
    this.ngxLoader.start();
    let searchFilter = {};

    this.loading = true;
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = this.itemsPerPage;
    this.staffService.getUserList(searchFilter).subscribe(res => {

      if (res != null) {
        this.users = res.data;
      }
    });
    this.loading = false;
    this.ngxLoader.stop();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  loadDictionary() {

    this.staffService.getRoleList('roles').subscribe(data => {
      this.roles = this.util.toSelectArrayRoles2(data);
    });

    this.staffService.getGroupList('groups').subscribe(data => {
      this.groups = this.util.toSelectArrayRoles2(data);
    });
  }

  submit() {
    this.ngxLoader.start();
    if (this.actions == 'EDIT') {

      this.staffService.updateUserRolesById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        });

      this.staffService.updateUserActiveById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        });

      if (!this.util.isNullOrEmpty(this.formData.passNew) && !this.util.isNullOrEmpty(this.formData.passNew2)) {
        if (this.formData.passNew == this.formData.passNew2) {
          this.staffService.updatePasswordById(this.formData)
            .subscribe(data => {
              if (data != null) {
                this.notifyService.showSuccess('success', 'Успешно сохранено');
              }
            }, err => {
              this.notifyService.showError('warning', err.message);
              this.findObjects(1);
              this.modalRef.hide();
            });
        }
      }


    }
    if (this.actions == 'ADD') {
      this.staffService.createUser(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', 'Успешно сохранено');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          if (err == 'User with Login = test already exists') {
            this.notifyService.showError('Логин уже зарегистрирован', "");
          } else if (err == 'User with FIO = test test already exists') {
            this.notifyService.showError('Пользователь с таким ФИО уже зарегистрирован', "");
          } else {
            this.notifyService.showError('warning', err);

          }
          this.findObjects(1);
          this.modalRef.hide();
        });
    }
    this.ngxLoader.stop();
  }

  editData(user: any) {
    this.actions = 'EDIT';
    this.staffService.getUserById(user)
      .subscribe(data => {
        this.formData = data;
        this.formData.isActive = data.isActive.toString();
      });
  }

  addUser() {
    this.actions = 'ADD';
    this.formData = {
      residentialComplexes: null,
      roles: null,
      group: null,
      isActive: true,
      login: null,
      pass: '',
      passNew: '',
      passNew2: '',
      name: '',
      surname: ''
    };
  }
}
