import { AlarmQuality } from "../../types/dtypes";

export type CssProps = {
  [key: string]: string;
};

/**
 * Function to add CSS properties depending on alarm severity and connection state
 * @param classes the css properties file for the widget
 * @param connected whether the widget is connected to the PV
 * @param alarmSeverity whether an alarm should register as minor or major
 * @param defaultClass? the default css properties for the widget that the alarm will add
 * onto/modify, if not passed will access the Default CSS properties in the classes object
 */
export function getClass(
  classes: CssProps,
  connected: boolean,
  alarmSeverity: AlarmQuality,
  defaultClass?: string
): string {
  let cls = defaultClass ? defaultClass : classes.Default;
  if (!connected) {
    cls += ` ${classes.Disconnected}`;
  } else {
    switch (alarmSeverity) {
      case AlarmQuality.WARNING: {
        cls += ` ${classes.Minor}`;
        break;
      }
      case AlarmQuality.ALARM: {
        cls += ` ${classes.Major}`;
        break;
      }
    }
  }
  return cls;
}
