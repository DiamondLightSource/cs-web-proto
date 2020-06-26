import { MacroMap, resolveMacros } from "../../types/macros";
import { DType } from "../../types/dtypes";

function tooltipValue(connected?: boolean, value?: DType): string {
  if (value) {
    const time = value.getTime();
    const alarm = value.getAlarm();
    let displayValue = "";
    if (!connected) {
      displayValue = "WARNING: Not Connected";
    } else {
      if (!value) {
        displayValue = "Warning: Waiting for value";
      } else {
        displayValue = DType.coerceString(value);
      }
    }
    const dateAndAlarm = [
      value ? (time ? time.datetime : "") : "",
      value ? (alarm ? alarm.message : "") : ""
    ]
      .filter((word): boolean => word !== "")
      .join(", ");
    return `${displayValue}\n ${dateAndAlarm}`;
  } else {
    return "no value";
  }
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
