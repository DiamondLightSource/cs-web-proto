import { VALUE_CHANGED, Action, VALUES_CHANGED } from "./actions";

export class UpdateThrottle {
  private queue: Action[];
  private started: boolean;
  private updateMillis: number;
  public ready: boolean;
  constructor(updateMillis: number) {
    this.queue = [];
    this.started = false;
    this.updateMillis = updateMillis;
    this.ready = true;
    this.queueUpdate = this.queueUpdate.bind(this);
    this.clearQueue = this.clearQueue.bind(this);
    this.setReady = this.setReady.bind(this);
  }

  public queueUpdate(action: Action): void {
    this.queue.push(action);
    if (!this.started) {
      setInterval(this.setReady, this.updateMillis);
      this.started = true;
    }
  }

  public setReady(): void {
    this.ready = true;
  }

  public clearQueue(store: any): void {
    store.dispatch({ type: VALUES_CHANGED, payload: [...this.queue] });
    this.queue.length = 0;
    this.ready = false;
  }
}

export const throttleMiddleware = (updater: UpdateThrottle) => (store: any) => (
  next: any
) => (action: any): any => {
  if (action.type === VALUE_CHANGED) {
    updater.queueUpdate(action);
    if (updater.ready) {
      updater.clearQueue(store);
    }
  } else {
    return next(action);
  }
};
