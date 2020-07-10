import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { deviceSelector, deviceComparator } from "./utils";

import { useEffect } from "react";
import { SUBSCRIBE_DEVICE } from "../../redux/actions";
import { useDispatch } from "react-redux";

export function useDevice(
  deviceName: string
): string {
  const dispatch = useDispatch();
  let temp_description = '{"type":"display","position":"relative","overflow":"auto","backgroundColor":"#012265","children":[{"type":"device","deviceName":"Xspress3.Channel1","position":"relative","height":"5vh","width":"50%"},{"type":"progressbar","position":"relative","height":"5vh","width":"50%","pvName":"csim://sine(-10,10,100,0.1)","backgroundColor":"#012265"}]}';  
  useEffect(() => {
      dispatch({
        type: SUBSCRIBE_DEVICE,
        payload: { deviceName: deviceName, description: temp_description }
      });
    });
    const description = useSelector(
      (state: CsState): string => deviceSelector(deviceName, state),
      deviceComparator
          );
    return temp_description;
    };
