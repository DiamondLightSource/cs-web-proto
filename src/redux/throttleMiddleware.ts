import { VALUE_CHANGED, Action, VALUES_CHANGED } from "./actions";
import { MiddlewareAPI, Dispatch } from "redux";

export class UpdateThrottle {
  private queue: Action[];
  private started: boolean;
  private updateMillis: number;

  constructor(updateMillis: number) {
    this.queue = [];
    this.started = false;
    this.updateMillis = updateMillis;
  }

  public queueUpdate(action: Action, store: MiddlewareAPI): void {
    if (!this.started) {
      setInterval(() => this.sendQueue(store), this.updateMillis);
      this.started = true;
    }
    this.queue.push(action);
  }

  public sendQueue(store: MiddlewareAPI): void {
    if (this.queue.length > 0) {
      store.dispatch({ type: VALUES_CHANGED, payload: [...this.queue] });
      this.queue = [];
    }
  }
}

export const throttleMiddleware =
  (updater: UpdateThrottle) =>
  (
    store: MiddlewareAPI
    // next(action) returns the action, but in the case of a value being cached,
    // we don't call next(action) so return undefined.
  ) =>
  (next: Dispatch<Action>) =>
  (action: Action): Action | undefined => {
    if (action.type === VALUE_CHANGED) {
      updater.queueUpdate(action, store);
    } else {
      return next(action);
    }
  };
