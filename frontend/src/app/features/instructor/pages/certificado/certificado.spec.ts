import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Certificado } from './certificado.component';

describe('Certificado', () => {
  let component: Certificado;
  let fixture: ComponentFixture<Certificado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Certificado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Certificado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
