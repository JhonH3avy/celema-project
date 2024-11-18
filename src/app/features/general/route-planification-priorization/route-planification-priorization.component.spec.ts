import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanificationPriorizationComponent } from './route-planification-priorization.component';

describe('RoutePlanificationPriorizationComponent', () => {
  let component: RoutePlanificationPriorizationComponent;
  let fixture: ComponentFixture<RoutePlanificationPriorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutePlanificationPriorizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutePlanificationPriorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
