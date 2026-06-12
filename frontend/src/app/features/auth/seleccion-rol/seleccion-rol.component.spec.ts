import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionRolComponent } from './seleccion-rol';

describe('SeleccionRolComponent', () => {
  let component: SeleccionRolComponent;
  let fixture: ComponentFixture<SeleccionRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionRolComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SeleccionRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
