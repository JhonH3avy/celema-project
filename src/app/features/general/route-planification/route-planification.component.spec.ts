import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanificationComponent } from './route-planification.component';

describe('RoutePlanificationComponent', () => {
  let component: RoutePlanificationComponent;
  let fixture: ComponentFixture<RoutePlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutePlanificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
