import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFamilyAdminComponent } from './product-family-admin.component';

describe('ProductFamilyAdminComponent', () => {
  let component: ProductFamilyAdminComponent;
  let fixture: ComponentFixture<ProductFamilyAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFamilyAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFamilyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
