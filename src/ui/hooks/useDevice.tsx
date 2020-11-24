import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { deviceSelector, deviceComparator } from "./utils";
import { useDeviceSubscription } from "./useDeviceSubscription";

export function useDevice(componentId: string, device: string): {} {
  useDeviceSubscription(componentId, device);
  const description = useSelector<CsState, {}>(
    (state: CsState): {} => deviceSelector(device, state),
    deviceComparator
  );
  return description;
}
