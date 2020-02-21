import log from "loglevel";

let settings: any;
try {
  // Use require so that we can catch this error
  settings = require("./settings");
} catch (e) {
  settings = {};
}

const PROFILE_ENABLED = settings.profilerEnabled ?? false;
const SIMULATION_TIME = settings.simulationTime ?? 100;

const recordedTimings = {
  startTime: 0,
  actualDur: 0,
  baseDur: 0,
  reconciliation: 0
};

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
