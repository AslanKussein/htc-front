import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimEventsComponent } from './claim-events.component';

describe('ClaimEventsComponent', () => {
  let component: ClaimEventsComponent;
  let fixture: ComponentFixture<ClaimEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
