import { resolveMacros } from "../../macros";
import { MacroMap } from "../../redux/csState";
import { timeOf } from "../../vtypes/time";
import { alarmOf } from "../../vtypes/alarm";
import { vtypeToString } from "../../vtypes/utils";
import { VType } from "../../vtypes/vtypes";

function tooltipValue(connected: boolean, value: VType): any {
  const time = timeOf(value);
  const alarm = alarmOf(value);
  let displayValue = "";
  if (!connected) {
    displayValue = "WARNING: Not Connected";
  } else {
    if (!value) {
      displayValue = "Warning: Waiting for value";
    } else {
      displayValue = vtypeToString(value, 3);
    }
  }
  const dateAndAlarm = [
    value ? (time ? time.asDate() : "") : "",
    value ? (alarm ? alarm.getName() : "") : ""
  ]
    .filter((word): boolean => word !== "")
    .join(", ");
  return `${displayValue}\n ${dateAndAlarm}`;
}

export function resolveTooltip(props: any): string | undefined {
  const { connected, value, tooltip } = props;
  const ttval = tooltipValue(connected, value);
  const valueProps = { ...props, pvValue: ttval };

  const rawTooltip = tooltip;
  const stringified: MacroMap = {};
  for (const [key, value] of Object.entries(valueProps)) {
    stringified[key] = String(value);
  }
  if (rawTooltip) {
    return resolveMacros(rawTooltip, stringified);
  } else {
    return rawTooltip;
  }
}
