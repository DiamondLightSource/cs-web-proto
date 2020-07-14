import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { deviceSelector, deviceComparator } from "./utils";

import { useEffect } from "react";
import { SUBSCRIBE_DEVICE } from "../../redux/actions";
import { useDispatch } from "react-redux";

export function useDevice(
  deviceName: string
): {} {
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch({
        type: SUBSCRIBE_DEVICE,
        payload: { deviceName: deviceName, description: deviceName }
      });
    });
    const description = useSelector<CsState, {}>(
      (state: CsState): {} => deviceSelector(deviceName, state),
      deviceComparator
          );
    return description;
    };
