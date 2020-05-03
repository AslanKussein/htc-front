import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FortebankApiComponent } from './fortebank-api.component';

describe('FortebankApiComponent', () => {
  let component: FortebankApiComponent;
  let fixture: ComponentFixture<FortebankApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FortebankApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FortebankApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
