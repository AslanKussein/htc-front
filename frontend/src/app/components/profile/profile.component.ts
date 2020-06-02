import {Component, OnDestroy, OnInit} from '@angular/core';
import {Util} from "../../services/util";
import {User} from "../../models/users";
import {AuthenticationService} from "../../services/authentication.service";
import {ProfileService} from "../../services/profile.service";
import {ProfileDto} from "../../models/profile/profileDto";
import {UploaderService} from "../../services/uploader.service";
import {NotificationService} from "../../services/notification.service";
import {ComponentCanDeactivate} from "../../helpers/canDeactivate/componentCanDeactivate";
import {Observable} from "rxjs/index";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, ComponentCanDeactivate, OnDestroy {
  subscriptions: Subscription = new Subscription();
  selectedFile: File;
  currentUser: User;
  profile: ProfileDto;
  save: boolean;
  loading: boolean;
  agentRoles: boolean;
  rgRoles: boolean;

  constructor(private util: Util,
              private uploader: UploaderService,
              private notifyService: NotificationService,
              private profileService: ProfileService,
              private authenticationService: AuthenticationService,
              private ngxLoader: NgxUiLoaderService) {
    this.subscriptions.add(this.authenticationService.currentUser.subscribe(x => this.currentUser = x));
    if (this.currentUser.roles != null) {
      this.agentRoles = false;
      this.rgRoles = false;
      for (const role of this.currentUser.roles) {
        if (role == 'AGENT_GROUP_CHOOSE') {
          this.agentRoles = true;
        }
        if (role == 'РГ') {
          this.rgRoles = true;
        }
      }

    }
    this.agentRoles = true;
  }

  ngOnInit(): void {
    // this.ngxLoader.start();
    this.profile = new ProfileDto();
    this.getProfile();
    this.save = false;
    this.ngxLoader.stop();
  }

  getProfile() {
    this.subscriptions.add(this.profileService.getProfile().subscribe(res => {
      this.profile = res;
    }));
  }

  editProfile() {
    this.save = true;
  }

  saveProfile() {
    this.save = false;
    this.subscriptions.add(this.profileService.updateProfile(this.profile).subscribe(res => {
        this.profile = res;
        this.notifyService.showSuccess('Данные сохранены', "");
      }, err => {
        this.notifyService.showError('warning', err);

      }
    ));
  }


  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.loading = true;
    this.subscriptions.add(this.uploader.uploadData(this.selectedFile)
      .subscribe(data => {
        if (data != null) {
          this.profile.photoUuid = data.uuid;
        }
      }));
  }

  getSrcImg(photoUuid) {
    if (!this.util.isNullOrEmpty(photoUuid)) {
      return this.util.generatorPreviewUrl(this.profile.photoUuid)
    }
    return 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png';
  }

  removeByGuid(photoUuid) {
    this.subscriptions.add(this.uploader.removePhotoById(photoUuid).subscribe(data => {
      this.profile.photoUuid=null;
      this.saveProfile();
    }));
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.save) {
      let result = confirm("Внесенные данные не сохранены, данные будут потеряны. Покинуть страницу?");
      return result;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
