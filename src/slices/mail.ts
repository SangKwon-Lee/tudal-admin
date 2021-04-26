import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../lib/axios';
import type { AppThunk } from '../store';
import type { Email, Label } from '../types/mail';
import objFromArray from '../utils/objFromArray';

interface MailState {
  emails: {
    byId: Record<string, Email>;
    allIds: string[];
  };
  labels: Label[];
  isSidebarOpen: boolean;
  isComposeOpen: boolean;
}

const initialState: MailState = {
  emails: {
    byId: {},
    allIds: []
  },
  labels: [],
  isSidebarOpen: false,
  isComposeOpen: false
};

const slice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    getLabels(
      state: MailState,
      action: PayloadAction<{ labels: Label[] }>
    ): void {
      const { labels } = action.payload;

      state.labels = labels;
    },
    getEmails(
      state: MailState,
      action: PayloadAction<{ emails: Email[] }>
    ): void {
      const { emails } = action.payload;

      state.emails.byId = objFromArray(emails);
      state.emails.allIds = Object.keys(state.emails.byId);
    },
    getEmail(state: MailState, action: PayloadAction<{ email: Email }>): void {
      const { email } = action.payload;

      state.emails.byId[email.id] = email;

      if (!state.emails.allIds.includes(email.id)) {
        state.emails.allIds.push(email.id);
      }
    },
    openSidebar(state: MailState): void {
      state.isSidebarOpen = true;
    },
    closeSidebar(state: MailState): void {
      state.isSidebarOpen = false;
    },
    openCompose(state: MailState): void {
      state.isComposeOpen = true;
    },
    closeCompose(state: MailState): void {
      state.isComposeOpen = false;
    }
  }
});

export const { reducer } = slice;

export const getLabels = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ labels: Label[] }>('/api/mail/labels');

  dispatch(slice.actions.getLabels(response.data));
};

export const getEmails = ({
  customLabel,
  systemLabel
}: { customLabel: string, systemLabel: string }): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ emails: Email[] }>(
    '/api/mail/emails',
    {
      params: {
        customLabel,
        systemLabel
      }
    }
  );

  dispatch(slice.actions.getEmails(response.data));
};

export const getEmail = (emailId: string): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ email: Email }>(
    '/api/mail/email',
    {
      params: {
        emailId
      }
    }
  );

  dispatch(slice.actions.getEmail(response.data));
};

export const openSidebar = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.openSidebar());
};

export const closeSidebar = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.closeSidebar());
};

export const openCompose = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.openCompose());
};

export const closeCompose = (): AppThunk => async (dispatch): Promise<void> => {
  dispatch(slice.actions.closeCompose());
};

export default slice;
