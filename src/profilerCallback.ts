import log from "loglevel";

/**
 * Functions concerned with profiling the code
 * Everything but the header is wrapped in the profiler, which triggers
 * the onRenderCallback function
 * Inbuilt profiler is used as opposed to browser profiler for simplicity of use,
 * and for more reliable measurements
 */

const PROFILE_ENABLED = process.env.REACT_APP_PROFILER_ENABLED === "true";
const SIMULATION_TIME = parseFloat(
  process.env.REACT_APP_SIMULATION_TIME ?? "100"
);

// Object for storing profiling information
const recordedTimings = {
  startTime: 0,
  actualDur: 0,
  baseDur: 0,
  reconciliation: 0,
};

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
  interactions: any
): void {
  if (PROFILE_ENABLED) {
    const reconciliationTime = commitTime - startTime;

    if (
      recordedTimings.startTime === 0 ||
      startTime > recordedTimings.startTime + SIMULATION_TIME / 2
    ) {
      // Add final timings
      recordedTimings.actualDur += actualDuration;
      recordedTimings.baseDur += baseDuration;
      recordedTimings.reconciliation += reconciliationTime;
      // Produce a csv friendly output
      log.info(`actualDuration,baseDuration,reconciliation
    ${recordedTimings.actualDur},${recordedTimings.baseDur},${recordedTimings.reconciliation}`);
      // Reset timings
      recordedTimings.startTime = startTime;
      recordedTimings.actualDur = 0;
      recordedTimings.baseDur = 0;
      recordedTimings.reconciliation = 0;
    } else {
      // Add timings
      recordedTimings.actualDur += actualDuration;
      recordedTimings.baseDur += baseDuration;
      recordedTimings.reconciliation += reconciliationTime;
    }
  }
}
