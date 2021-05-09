import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../lib/axios';
import type { AppThunk } from '../store';
import type { CalendarEvent } from '../types/calendar';

interface CalendarState {
  events: CalendarEvent[];
  isModalOpen: boolean;
  selectedEventId: string | null;
  selectedRange: {
    start: number;
    end: number;
  } | null;
}

const initialState: CalendarState = {
  events: [],
  isModalOpen: false,
  selectedEventId: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    getEvents(
      state: CalendarState,
      action: PayloadAction<{ events: CalendarEvent[] }>
    ): void {
      const { events } = action.payload;

      state.events = events;
    },
    createEvent(
      state: CalendarState,
      action: PayloadAction<{ event: CalendarEvent }>
    ): void {
      const { event } = action.payload;

      state.events.push(event);
    },
    selectEvent(
      state: CalendarState,
      action: PayloadAction<{ eventId?: string }>
    ): void {
      const { eventId = null } = action.payload;

      state.isModalOpen = true;
      state.selectedEventId = eventId;
    },
    updateEvent(
      state: CalendarState,
      action: PayloadAction<{ event: CalendarEvent }>
    ): void {
      const { event } = action.payload;

      state.events = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }

        return _event;
      });
    },
    deleteEvent(
      state: CalendarState,
      action: PayloadAction<{ eventId: string }>
    ): void {
      const { eventId } = action.payload;

      state.events = state.events.filter((event) => event.id !== eventId);
    },
    selectRange(
      state: CalendarState,
      action: PayloadAction<{ start: number; end: number }>
    ): void {
      const { start, end } = action.payload;

      state.isModalOpen = true;
      state.selectedRange = {
        start,
        end
      };
    },
    openModal(state: CalendarState): void {
      state.isModalOpen = true;
    },
    closeModal(state: CalendarState): void {
      state.isModalOpen = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    }
  }
});

export const { reducer } = slice;

export const getEvents = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ events: CalendarEvent[] }>('/api/calendar/events');

  dispatch(slice.actions.getEvents(response.data));
};

export const createEvent = (data: any): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.post<{ event: CalendarEvent }>('/api/calendar/events/new', data);

  dispatch(slice.actions.createEvent(response.data));
};

export const selectEvent = (eventId?: string): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.selectEvent({ eventId }));
};

export const updateEvent = (
  eventId: string,
  update: any
): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.post<{ event: CalendarEvent }>(
    '/api/calendar/events/update',
    {
      eventId,
      update
    }
  );

  dispatch(slice.actions.updateEvent(response.data));
};

export const deleteEvent = (eventId: string): AppThunk => async (dispatch): Promise<void> => {
  await axios.post(
    '/api/calendar/events/remove',
    {
      eventId
    }
  );

  dispatch(slice.actions.deleteEvent({ eventId }));
};

export const selectRange = (
  start: Date,
  end: Date
): AppThunk => (dispatch): void => {
  dispatch(slice.actions.selectRange({
    start: start.getTime(),
    end: end.getTime()
  }));
};

export const openModal = (): AppThunk => (dispatch): void => {
  dispatch(slice.actions.openModal());
};

export const closeModal = (): AppThunk => (dispatch): void => {
  dispatch(slice.actions.closeModal());
};

export default slice;
