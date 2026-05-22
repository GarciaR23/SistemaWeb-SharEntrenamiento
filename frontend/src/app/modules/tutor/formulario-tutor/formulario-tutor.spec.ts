import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormularioTutor } from './formulario-tutor';
import { Location } from '../../../services/location';

describe('FormularioTutor', () => {
  let component: FormularioTutor;
  let fixture: ComponentFixture<FormularioTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioTutor, HttpClientTestingModule],
      providers: [Location]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioTutor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start at paso 1', () => {
    expect(component.paso).toBe(1);
  });

  it('should validate step 1 correctly', () => {
    expect(component.isStep1Valid()).toBeFalsy();

    component.nombreTutor = 'Alex Rivera';
    component.nombrePaciente = 'Roxana Pérez';
    component.condicion = 'TEA';
    component.gradoAutismo = 'Leve';
    component.genero = 'Femenino';
    component.edad = 24;
    component.distrito = '1401';
    component.direccion = 'Av. Principal 123';

    expect(component.isStep1Valid()).toBeTruthy();
  });

  it('should validate step 2 correctly', () => {
    expect(component.isStep2Valid()).toBeFalsy();

    component.sensibilidadesSeleccionadas = ['Ruidos fuertes'];
    expect(component.isStep2Valid()).toBeFalsy();

    component.protocoloEmergencia = 'Instrucciones especiales';
    expect(component.isStep2Valid()).toBeTruthy();
  });

  it('should toggle sensibilidad correctly', () => {
    const sensibilidad = 'Ruidos fuertes';
    expect(component.estaSeleccionada(sensibilidad)).toBeFalsy();

    component.toggleSensibilidad(sensibilidad);
    expect(component.estaSeleccionada(sensibilidad)).toBeTruthy();

    component.toggleSensibilidad(sensibilidad);
    expect(component.estaSeleccionada(sensibilidad)).toBeFalsy();
  });

  it('should move to next step', () => {
    component.paso = 1;
    component.nombreTutor = 'Alex Rivera';
    component.nombrePaciente = 'Roxana Pérez';
    component.condicion = 'TEA';
    component.gradoAutismo = 'Leve';
    component.genero = 'Femenino';
    component.edad = 24;
    component.distrito = '1401';
    component.direccion = 'Av. Principal 123';

    component.siguiente();
    expect(component.paso).toBe(2);
  });

  it('should move to previous step', () => {
    component.paso = 2;
    component.atras();
    expect(component.paso).toBe(1);
  });

  it('should not go below paso 1', () => {
    component.paso = 1;
    component.atras();
    expect(component.paso).toBe(1);
  });
});
