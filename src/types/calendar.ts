export interface CalendarEvent {
  id?: string;
  allDay: boolean;
  color?: string;
  description: string;
  end: Date;
  start: Date;
  title: string;
  submit?: boolean;
}

export type CalendarView =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek';
