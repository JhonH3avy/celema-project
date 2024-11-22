import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlanificationComponent } from './production-planification.component';

describe('ProductionPlanificationComponent', () => {
  let component: ProductionPlanificationComponent;
  let fixture: ComponentFixture<ProductionPlanificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionPlanificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionPlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
