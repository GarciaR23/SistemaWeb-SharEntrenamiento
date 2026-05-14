import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioTutor } from './formulario-tutor';

describe('FormularioTutor', () => {
  let component: FormularioTutor;
  let fixture: ComponentFixture<FormularioTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
