import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAgentsComponent } from './my-agents.component';

describe('MyAgentsComponent', () => {
  let component: MyAgentsComponent;
  let fixture: ComponentFixture<MyAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
