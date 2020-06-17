import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractOuComponent } from './contract-ou.component';

describe('ContractOuComponent', () => {
  let component: ContractOuComponent;
  let fixture: ComponentFixture<ContractOuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractOuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractOuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
