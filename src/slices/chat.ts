import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../lib/axios';
import type { AppThunk } from '../store';
import type {
  Contact,
  Thread,
  Participant
} from '../types/chat';
import objFromArray from '../utils/objFromArray';

interface ChatState {
  activeThreadId?: string;
  contacts: {
    byId: Record<string, Contact>;
    allIds: string[];
  };
  threads: {
    byId: Record<string, Thread>;
    allIds: string[];
  };
  participants: Participant[];
  recipients: any[];
}

const initialState: ChatState = {
  activeThreadId: null,
  contacts: {
    byId: {},
    allIds: []
  },
  threads: {
    byId: {},
    allIds: []
  },
  participants: [],
  recipients: []
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getContacts(
      state: ChatState,
      action: PayloadAction<{ contacts: Contact[] }>
    ): void {
      const { contacts } = action.payload;

      state.contacts.byId = objFromArray(contacts);
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },
    getThreads(
      state: ChatState,
      action: PayloadAction<{ threads: Thread[] }>
    ): void {
      const { threads } = action.payload;

      state.threads.byId = objFromArray(threads);
      state.threads.allIds = Object.keys(state.threads.byId);
    },
    getThread(
      state: ChatState,
      action: PayloadAction<{ thread: Thread | null }>
    ): void {
      const { thread } = action.payload;

      if (thread) {
        state.threads.byId[thread.id] = thread;
        state.activeThreadId = thread.id;

        if (!state.threads.allIds.includes(thread.id)) {
          state.threads.allIds.push(thread.id);
        }
      } else {
        state.activeThreadId = null;
      }
    },
    markThreadAsSeen(
      state: ChatState,
      action: PayloadAction<{ threadId: string }>
    ): void {
      const { threadId } = action.payload;
      const thread = state.threads.byId[threadId];

      if (thread) {
        thread.unreadCount = 0;
      }
    },
    resetActiveThread(state: ChatState): void {
      state.activeThreadId = null;
    },
    getParticipants(
      state: ChatState,
      action: PayloadAction<{ participants: Participant[] }>
    ): void {
      const { participants } = action.payload;

      state.participants = participants;
    },
    addRecipient(
      state: ChatState,
      action: PayloadAction<{ recipient: any }>
    ): void {
      const { recipient } = action.payload;
      const exists = state.recipients.find((_recipient) => _recipient.id === recipient.id);

      if (!exists) {
        state.recipients.push(recipient);
      }
    },
    removeRecipient(
      state: ChatState,
      action: PayloadAction<{ recipientId: string }>
    ): void {
      const { recipientId } = action.payload;

      state.recipients = state.recipients.filter((recipient) => recipient.id !== recipientId);
    }
  }
});

export const { reducer } = slice;

export const getContacts = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ contacts: Contact[] }>('/api/chat/contacts');

  dispatch(slice.actions.getContacts(response.data));
};

export const getThreads = (): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ threads: Thread[] }>('/api/chat/threads');

  dispatch(slice.actions.getThreads(response.data));
};

export const getThread = (threadKey: string): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ thread: Thread }>(
    '/api/chat/thread',
    {
      params: {
        threadKey
      }
    }
  );

  dispatch(slice.actions.getThread(response.data));
};

export const markThreadAsSeen = (threadId: string): AppThunk => async (dispatch): Promise<void> => {
  await axios.get(
    '/api/chat/thread/mark-as-seen',
    {
      params: {
        threadId
      }
    }
  );

  dispatch(slice.actions.markThreadAsSeen({ threadId }));
};

export const resetActiveThread = () => (dispatch): void => {
  dispatch(slice.actions.resetActiveThread());
};

export const getParticipants = (threadKey: string): AppThunk => async (dispatch): Promise<void> => {
  const response = await axios.get<{ participants: any }>(
    '/api/chat/participants',
    {
      params: {
        threadKey
      }
    }
  );

  dispatch(slice.actions.getParticipants(response.data));
};

export const addRecipient = (recipient: any): AppThunk => (dispatch): void => {
  dispatch(slice.actions.addRecipient({ recipient }));
};

export const removeRecipient = (recipientId: string): AppThunk => (dispatch): void => {
  dispatch(slice.actions.removeRecipient({ recipientId }));
};

export default slice;
