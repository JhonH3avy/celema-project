import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WashRestrictionComponent } from './wash-restriction.component';

describe('WashRestrictionComponent', () => {
  let component: WashRestrictionComponent;
  let fixture: ComponentFixture<WashRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WashRestrictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WashRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
