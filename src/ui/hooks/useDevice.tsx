import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { deviceSelector, deviceComparator } from "./utils";
import { useDeviceSubscription } from "./useDeviceSubscription";

export function useDevice(
  componentId: string,
  device: string
): string | undefined {
  useDeviceSubscription(componentId, device);
  const description: any = useSelector<CsState, {}>(
    (state: CsState): {} => deviceSelector(device, state),
    deviceComparator
  );

  if (description) {
    return description.value.stringValue;
  }
}
