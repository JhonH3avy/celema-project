import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentAdminComponent } from './equipment-admin.component';

describe('EquipmentAdminComponent', () => {
  let component: EquipmentAdminComponent;
  let fixture: ComponentFixture<EquipmentAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
