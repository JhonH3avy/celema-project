import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentRestrictionComponent } from './equipment-restriction.component';

describe('EquipmentRestrictionComponent', () => {
  let component: EquipmentRestrictionComponent;
  let fixture: ComponentFixture<EquipmentRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentRestrictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
