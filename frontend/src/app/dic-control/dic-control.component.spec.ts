import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DicControlComponent } from './dic-control.component';

describe('DicControlComponent', () => {
  let component: DicControlComponent;
  let fixture: ComponentFixture<DicControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DicControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DicControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
