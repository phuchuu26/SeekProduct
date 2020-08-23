import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductGroupComponent } from './manage-product-group.component';

describe('ManageProductGroupComponent', () => {
  let component: ManageProductGroupComponent;
  let fixture: ComponentFixture<ManageProductGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProductGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
