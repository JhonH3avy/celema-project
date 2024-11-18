import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlanificationDetailComponent } from './route-planification-detail.component';

describe('RoutePlanificationDetailComponent', () => {
  let component: RoutePlanificationDetailComponent;
  let fixture: ComponentFixture<RoutePlanificationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutePlanificationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutePlanificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
