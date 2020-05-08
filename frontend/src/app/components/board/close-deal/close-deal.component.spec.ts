import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseDealComponent } from './close-deal.component';

describe('CloseDealComponent', () => {
  let component: CloseDealComponent;
  let fixture: ComponentFixture<CloseDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
