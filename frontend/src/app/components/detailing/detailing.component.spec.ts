import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailingComponent } from './detailing.component';

describe('DetailingComponent', () => {
  let component: DetailingComponent;
  let fixture: ComponentFixture<DetailingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


