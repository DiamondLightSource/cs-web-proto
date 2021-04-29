import log from "loglevel";

/**
 * Functions concerned with profiling the code
 * Everything but the header is wrapped in the profiler, which triggers
 * the onRenderCallback function
 * Inbuilt profiler is used as opposed to browser profiler for simplicity of use,
 * and for more reliable measurements
 */

const PROFILE_ENABLED = process.env.REACT_APP_PROFILER_ENABLED === "true";
const ITEMS_TO_STORE = 100;

class Timings {
  private startTime: Array<number> = [];
  private actualDur: Array<number> = [];
  private baseDur: Array<number> = [];
  private reconciliation: Array<number> = [];
  count = 0;

  private average(array: Array<number>): number {
    return Math.round(array.reduce((a, b) => a + b, 0) / array.length);
  }

  public avgStart(): number {
    return this.average(this.startTime);
  }
  public avgActual(): number {
    return this.average(this.actualDur);
  }
  public avgBase(): number {
    return this.average(this.baseDur);
  }
  public avgReconciliation(): number {
    return this.average(this.reconciliation);
  }

  public update(
    start: number,
    actual: number,
    base: number,
    reconciliation: number
  ): void {
    this.startTime.push(start);
    this.actualDur.push(actual);
    this.baseDur.push(base);
    this.reconciliation.push(reconciliation);
    this.count += 1;
    if (this.count >= ITEMS_TO_STORE) {
      this.startTime.shift();
      this.actualDur.shift();
      this.baseDur.shift();
      this.reconciliation.shift();
    }
  }
}

const timings = new Timings();

/**
 * Called whenever a new render occurs
 */
export function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
  interactions: unknown
): void {
  if (PROFILE_ENABLED) {
    const reconciliationTime = commitTime - startTime;
    timings.update(startTime, actualDuration, baseDuration, reconciliationTime);

    if (timings.count % 10 === 0) {
      log.info(`actualDuration,baseDuration,reconciliation
    ${timings.avgActual()},${timings.avgBase()},${timings.avgReconciliation()}`);
    }
  }
}
