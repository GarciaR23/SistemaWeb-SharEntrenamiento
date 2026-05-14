import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formulario inválido si está vacío', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('email inválido', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('mal-email');
    expect(email.valid).toBeFalse();
  });

  it('formulario válido con datos correctos', () => {
    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456'
    });

    expect(component.loginForm.valid).toBeTrue();
  });

  it('debe llamar onSubmit al enviar', () => {
    spyOn(component, 'onSubmit');

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456'
    });

    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

});
