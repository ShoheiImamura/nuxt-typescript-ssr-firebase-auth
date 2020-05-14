import { namespace } from "vuex-class";
import { StoredUser } from "~/types/backend-types";

export interface AuthState {
  user: StoredUser | null,
  forceLogout: boolean,
  rememberMe: boolean
}

export interface NotificationState {
  message: NotificationMessage | null
}

export interface LoadingState {
  loading: boolean
}

export interface RootState {
  auth?: AuthState,
  notification?: NotificationState
  loading?: LoadingState
}

export interface NotificationMessage {
  type: NotificationType
  message: string
  hasIcon?: boolean
}

export enum NotificationType {
  DANGER = 'is-danger',
  WARNING = 'is-warning',
  INFO = 'is-info',
  SUCCESS = 'is-success'
}

export const StateNamespace = {
  auth: namespace('auth'),
  notification: namespace('notification'),
  loading: namespace('loading'),
};

export const StoreConfig = {
  auth: {
    setUser: 'auth/setUser',
    forceLogout: 'auth/forceLogout',
    logout: 'auth/logout',
    saveRememberMe: 'auth/saveRememberMe',
  },
  notification: {
    saveMessage: 'notification/saveMessage',
    clearMessage: 'notification/clearMessage'
  },
  loading: {
    saveLoading: 'loading/saveLoading',
    setLoading: 'loading/setLoading'
  }
}

