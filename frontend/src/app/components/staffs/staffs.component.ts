import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {Dic} from "../../models/dic";
import {Util} from "../../services/util";
import {StaffService} from "../../services/staff.service";
import {NotificationService} from "../../services/notification.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Subscription} from "rxjs";
import {language} from "../../../environments/language";

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.scss']
})
export class StaffsComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  roles: Dic[];
  groups: Dic[];
  organizations: Dic[];
  isEdit: boolean = false;
  subscriptions: Subscription = new Subscription();

  constructor(private modalService: BsModalService,
              private staffService: StaffService,
              private notifyService: NotificationService,
              private util: Util,
              private ngxLoader: NgxUiLoaderService) {
  }

  filter = {
    search: '',
    roles: null,
    group: null,
    organizationId:null
  }

  formData = {
    residentialComplexes: null,
    roles: null,
    group: null,
    organizationId: null,
    isActive: true,
    login: null,
    pass: '',
    passNew: '',
    passNew2: '',
    name: '',
    surname: '',
    phone: '',
    email: ''
  };

  ngOnInit(): void {
    this.ngxLoader.startBackground();
    this.loadDictionary();
    this.findObjects(0);
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

  getGroup(){
    this.ngxLoader.startBackground();
    let obj={
      roles:7
    };
    this.staffService.getUserInfo(obj).subscribe(res => {
      if (res != null) {
        this.groups = this.util.toSelectArrayGroup(res);
      }
    });
    this.ngxLoader.stopBackground();
  }

  getUserInfo() {
    this.users = [];
    this.ngxLoader.startBackground();
    this.subscriptions.add(this.staffService.getUserInfo(this.filter).subscribe(res => {
      if (res != null) {
        res.data.forEach(u=> {
          let obj = {};
          if (!this.util.isNullOrEmpty(u.photoUuid)) {
            obj['ava'] = this.util.generatorPreviewUrl(u.photoUuid);
          } else {
            obj['info'] = u.name.substr(0, 1) + ' ' + u.surname.substr(0, 1);
          }
          obj['id'] = u.id;
          obj['phone'] = u.phone;
          obj['email'] = u.email;
          obj['roles'] = u.roles;
          obj['group'] = u.group;
          obj['isActive'] = u.isActive;
          obj['login'] = u.login;
          obj['name'] = u.name;
          obj['organizationId'] = u.organizationId;
          obj['surname'] = u.surname;
          this.users.push(obj);
        });
      }
    }));
    this.ngxLoader.stopBackground();
  }

  findObjects(pageNo: number) {
    this.ngxLoader.startBackground();
    let searchFilter = {};

    this.loading = true;
    searchFilter['pageNumber'] = pageNo;
    searchFilter['pageSize'] = this.itemsPerPage;
    searchFilter['direction'] = "ASC";
    searchFilter['sortBy'] = "id";
    searchFilter['locale'] = String(language.language).toUpperCase();
    this.subscriptions.add(this.staffService.getUserList(searchFilter).subscribe(res => {
      if (res != null) {

          // let obj = {};
          // if (!this.util.isNullOrEmpty(u.photoUuid)) {
          //   obj['ava'] = this.util.generatorPreviewUrl(u.photoUuid);
          // } else {
          //   obj['info'] = u.name.substr(0, 1) + ' ' + u.surname.substr(0, 1);
          // }
          // obj['id'] = u.id;
          // obj['phone'] = u.phone;
          // obj['email'] = u.email;
          // obj['roles'] = u.roles;
          // obj['group'] = u.group;
          // obj['isActive'] = u.isActive;
          // obj['login'] = u.login;
          // obj['name'] = u.name;
          // obj['organizationId'] = u.organizationId;
          // obj['surname'] = u.surname;
          // this.users.push(obj);
         this.users=res.content;

        this.totalItems = res.totalElements;
        this.currentPage = res.pageable.pageNumber;
      }
    }));
    this.loading = false;
    this.ngxLoader.stopBackground();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {backdrop: 'static', keyboard: false});
  }

  loadDictionary() {

    this.staffService.getRoleList().subscribe(data => {
      this.roles = this.util.toSelectArrayRoles2(data);
    });
    this.staffService.getOrganizationList().subscribe(data => {
      this.organizations = this.util.toSelectArrayOrganization(data);
    });

    this.getGroup();
  }

  submit() {
    this.ngxLoader.startBackground();
    let valid = true;
    if (!this.isEdit) {
      if (this.util.isNullOrEmpty(this.formData.pass)) {
        valid = false;
      }
    }
    if (this.isEdit) {
      if (!this.util.isNullOrEmpty(this.formData.passNew) && this.util.isNullOrEmpty(this.formData.passNew2)) {
        valid = false;
      }
    }
    if (this.util.isNullOrEmpty(this.formData.login) || this.util.isNullOrEmpty(this.formData.name)
      || this.util.isNullOrEmpty(this.formData.surname) || this.util.isNullOrEmpty(this.formData.phone)
      || this.util.isNullOrEmpty(this.formData.email) || this.util.isNullOrEmpty(this.formData.isActive)
      || this.util.isNullOrEmpty(this.formData.roles) || this.util.isNullOrEmpty(this.formData.group)
      || this.util.isNullOrEmpty(this.formData.organizationId)) {
      valid = false;
    }
    if (!valid) {
      this.ngxLoader.stopBackground();
      this.notifyService.showInfo('???????????????????? ?????????????????? ?????? ???????????????????????? ????????', '????????????????????');
      return;
    }

    if (this.isEdit) {

      this.subscriptions.add(this.staffService.updateUserGroupById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', '?????????????? ??????????????????');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        }));

      this.subscriptions.add(this.staffService.updateUserRolesById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', '?????????????? ??????????????????');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        }));

      this.subscriptions.add(this.staffService.updateUserActiveById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', '?????????????? ??????????????????');
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        }));

      this.subscriptions.add(this.staffService.updateOrganizationById(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', '?????????????? ??????????????????');
          }
        }, err => {
          this.notifyService.showError('warning', err.message);
          this.findObjects(1);
          this.modalRef.hide();
        }));

      if (!this.util.isNullOrEmpty(this.formData.passNew) && !this.util.isNullOrEmpty(this.formData.passNew2)) {
        if (this.formData.passNew == this.formData.passNew2) {
          this.subscriptions.add(this.staffService.updatePasswordById(this.formData)
            .subscribe(data => {
              if (data != null) {
                this.notifyService.showSuccess('success', '?????????????? ??????????????????');
              }
            }, err => {
              this.notifyService.showError('warning', err.message);
              this.findObjects(1);
              this.modalRef.hide();
            }));
        }
      }


    }
    if (!this.isEdit) {
      this.subscriptions.add(this.staffService.createUser(this.formData)
        .subscribe(data => {
          if (data != null) {
            this.notifyService.showSuccess('success', '?????????????? ??????????????????');
            this.findObjects(1);
            this.modalRef.hide();
          }
        }, err => {
          if (err == 'User with Login = test already exists') {
            this.notifyService.showError('?????????? ?????? ??????????????????????????????', "");
          } else if (err == 'User with FIO = test test already exists') {
            this.notifyService.showError('???????????????????????? ?? ?????????? ?????? ?????? ??????????????????????????????', "");
          } else {
            this.notifyService.showError('warning', err);

          }
          this.findObjects(1);
          this.modalRef.hide();
        }));
    }
    this.ngxLoader.stopBackground();
  }

  editData(user: any) {
    this.isEdit = true;
    this.subscriptions.add(this.staffService.getUserById(user)
      .subscribe(data => {
        this.formData = data;
        this.formData.isActive = data.isActive.toString();
      })
    );
  }

  addUser() {
    this.isEdit = false;
    this.formData = {
      residentialComplexes: null,
      roles: null,
      group: null,
      organizationId: null,
      isActive: true,
      login: null,
      pass: '',
      passNew: '',
      passNew2: '',
      name: '',
      surname: '',
      phone: '',
      email: ''
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
