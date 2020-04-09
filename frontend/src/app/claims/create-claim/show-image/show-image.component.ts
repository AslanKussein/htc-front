import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild} from '@angular/core';
import {BsLocaleService, defineLocale, ModalDirective, ruLocale} from 'ngx-bootstrap';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.scss']
})
export class ShowImageComponent implements OnInit, OnChanges {
  @ViewChild('modalAddAward')
  public modalActAgree: ModalDirective;

  @Output()
  public onHide = new EventEmitter<boolean>();

  isShow = false;
  submitted;
  changed = false;
  image: any;

  constructor() {
  }

  ngOnInit() {
  }

  @Input()
  set show(show: boolean) {
    this.isShow = show;
  }

  @Input()
  set act(act: any) {
    console.log(this.image)
    console.log(act)
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.isShow) {
      this.modalActAgree.show();
    }
  }

  hide() {
    this.isShow = false;
    this.isShow = false;
    this.modalActAgree.hide();
    this.onHide.emit(this.changed);
  }

}
