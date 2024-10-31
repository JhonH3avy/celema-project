import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandPlanificationComponent } from './demand-planification.component';

describe('DemandPlanificationComponent', () => {
  let component: DemandPlanificationComponent;
  let fixture: ComponentFixture<DemandPlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandPlanificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandPlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
