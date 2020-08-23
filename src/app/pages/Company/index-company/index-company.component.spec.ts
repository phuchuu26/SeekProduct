import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexCompanyComponent } from './index-company.component';

describe('IndexCompanyComponent', () => {
  let component: IndexCompanyComponent;
  let fixture: ComponentFixture<IndexCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
