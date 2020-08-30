import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationCompanyComponent } from './verification-company.component';

describe('VerificationCompanyComponent', () => {
  let component: VerificationCompanyComponent;
  let fixture: ComponentFixture<VerificationCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
