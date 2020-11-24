import {
  VALUE_CHANGED,
  Action,
  VALUES_CHANGED,
  DEVICE_CHANGED,
  DEVICES_CHANGED
} from "./actions";
import { MiddlewareAPI, Dispatch } from "redux";

/**
 * Throttling helper class, lets a queue build up and then sends it
 * at set intervals
 * @param updateMillis: the interval to flush the queue at (in milliseconds)
 */
export class UpdateThrottle {
  private pvQueue: Action[];
  private deviceQueue: Action[];
  public ready: boolean;
  constructor(updateMillis: number) {
    this.pvQueue = [];
    this.deviceQueue = [];
    this.ready = true;
    setInterval(() => (this.ready = true), updateMillis);
  }

  public queueUpdate(action: Action, store: MiddlewareAPI): void {
    if (action.type === VALUE_CHANGED) {
      this.pvQueue.push(action);
    } else if (action.type === DEVICE_CHANGED) {
      this.deviceQueue.push(action);
    }
    if (this.ready) {
      this.sendQueue(store);
    }
  }

  public sendQueue(store: MiddlewareAPI): void {
    store.dispatch({ type: VALUES_CHANGED, payload: [...this.pvQueue] });
    store.dispatch({ type: DEVICES_CHANGED, payload: [...this.deviceQueue] });
    this.pvQueue = [];
    this.deviceQueue = [];
    this.ready = false;
  }
}

export const throttleMiddleware = (updater: UpdateThrottle) => (
  store: MiddlewareAPI
  // next(action) returns the action, but in the case of a value being cached,
  // we don't call next(action) so return undefined.
  // this makes the return value 'Action | undefined'
) => (next: Dispatch<Action>) => (action: Action): Action | undefined => {
  if (action.type === VALUE_CHANGED || action.type === DEVICE_CHANGED) {
    updater.queueUpdate(action, store);
  } else {
    return next(action);
  }
};
