import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface CalendarDay {
  day: number;
  outside: boolean;
  date: Date;
}

interface CalendarSession {
  id: number;
  day: number;
  month: number;
  year: number;
  time: string;
  endTime: string;
  patient: string;
  color: 'green' | 'blue';
  durationMin: number;
  location: string;
  status: 'confirmado' | 'pendiente';
}

interface AvailableHour {
  id: number;
  range: string;
  status: 'libre' | 'ocupado';
}

@Component({
  selector: 'app-calendario',
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss',
})
export class calendarioComponent implements OnInit {
  vistaActiva: 'mes' | 'semana' | 'dia' = 'mes';

  currentDate = new Date();
  selectedDate = new Date();
  monthLabel = '';
  selectedDateFormatted = '';

  weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  calendarDays: CalendarDay[] = [];
  sessions: CalendarSession[] = [];

  availableHours: AvailableHour[] = [];

  todaySessions: any[] = [];

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.currentDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);

    this.generateCalendar();
    this.obtenerCalendario();
  }

  obtenerCalendario(): void {
    // Aquí llamarás a tu servicio
    // this.calendarioService.obtenerCalendario(...).subscribe(res => {
    //   this.sessions = res.sesiones;
    //   this.availableHours = res.horariosDisponibles;
    //   this.updateSelectedDateInfo();
    // });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    this.monthLabel = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    this.calendarDays = [];

    // Días del mes anterior
    for (let i = startDay; i > 0; i--) {
      this.calendarDays.push({
        day: daysInPrevMonth - i + 1,
        outside: true,
        date: new Date(year, month - 1, daysInPrevMonth - i + 1),
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({
        day: i,
        outside: false,
        date: new Date(year, month, i),
      });
    }

    // Días del siguiente mes para completar la cuadrícula de 42 celdas
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      this.calendarDays.push({
        day: i,
        outside: true,
        date: new Date(year, month + 1, i),
      });
    }
  }

  prevMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
    this.obtenerCalendario();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
    this.obtenerCalendario();
  }

  selectDay(item: CalendarDay): void {
    this.selectedDate = item.date;

    if (item.outside) {
      this.currentDate = new Date(item.date.getFullYear(), item.date.getMonth(), 1);

      this.generateCalendar();
      this.obtenerCalendario();
    }

    this.updateSelectedDateInfo();
  }

  isSelected(item: CalendarDay): boolean {
    return (
      item.date.getDate() === this.selectedDate.getDate() &&
      item.date.getMonth() === this.selectedDate.getMonth() &&
      item.date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  updateSelectedDateInfo() {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    this.selectedDateFormatted = `${dayNames[this.selectedDate.getDay()]}, ${this.selectedDate.getDate()} de ${monthNames[this.selectedDate.getMonth()]}`;

    // Filtramos las sesiones del día para mostrarlas en el panel lateral
    const currentSessions = this.getSessionsForDate(this.selectedDate);

    this.todaySessions = currentSessions.map((s) => ({
      id: s.id,
      patient: s.patient,
      specialty: 'Entrenamiento Funcional Adaptado',
      time: `${s.time} — ${s.endTime}`,
      duration: `${s.durationMin} min`,
      location: s.location,
      status: s.status.toUpperCase(),
    }));
  }

  getSessionsForDate(date: Date): CalendarSession[] {
    return this.sessions.filter(
      (s) =>
        s.day === date.getDate() && s.month === date.getMonth() && s.year === date.getFullYear(),
    );
  }

  get totalSessions(): number {
    return this.getSessionsForDate(this.selectedDate).length;
  }

  get totalMinutes(): number {
    return this.getSessionsForDate(this.selectedDate).reduce(
      (total, item) => total + item.durationMin,
      0,
    );
  }

  get totalAvailableHours(): number {
    return this.availableHours.length + 2;
  }

  get currentWeekDays(): CalendarDay[] {
    const index = this.calendarDays.findIndex(
      (d) =>
        d.date.getDate() === this.selectedDate.getDate() &&
        d.date.getMonth() === this.selectedDate.getMonth() &&
        d.date.getFullYear() === this.selectedDate.getFullYear(),
    );
    if (index === -1) return this.calendarDays.slice(0, 7);
    const startOfWeek = Math.floor(index / 7) * 7;
    return this.calendarDays.slice(startOfWeek, startOfWeek + 7);
  }

  cambiarVista(vista: 'mes' | 'semana' | 'dia'): void {
    this.vistaActiva = vista;
  }

  trackDay(index: number): number {
    return index;
  }

  trackSession(_: number, session: CalendarSession): number {
    return session.id;
  }
}
