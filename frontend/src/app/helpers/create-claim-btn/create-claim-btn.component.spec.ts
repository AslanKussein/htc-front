import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClaimBtnComponent } from './create-claim-btn.component';

describe('CreateClaimBtnComponent', () => {
  let component: CreateClaimBtnComponent;
  let fixture: ComponentFixture<CreateClaimBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClaimBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClaimBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
