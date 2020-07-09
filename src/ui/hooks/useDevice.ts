import React from "react";
import { useSelector } from "react-redux";
import { CsState } from "../../redux/csState";
import { deviceSelector, temp } from "./utils";

//import { useSelector } from "react-redux";

/*
export function useDevice(
  id: string,
  deviceName?: string
): string {
  const deviceNameArray = deviceName === undefined ? [] : [deviceName];
  //return useDevice(id, deviceName);
  const test_long = '{"type":"display","position":"relative","overflow":"auto","backgroundColor":"#012265","children":[{"type":"device","deviceName":"test","position":"relative","height":"5vh","width":"50%"},{"type":"progressbar","position":"relative","height":"5vh","width":"50%","pvName":"csim://sine(-10,10,100,0.1)","backgroundColor":"#012265"}]}';
  
  return test_long;
  //return '{"test":"csim://sine(-10,10,100,0.1)"}';
}
*/

import { useEffect } from "react";
import { getStore } from "../../redux/store";
import { SUBSCRIBE, UNSUBSCRIBE, WRITE_PV, SUBSCRIBE_DEVICE } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { DType } from "../../types/dtypes";
import { SubscriptionType } from "../../connection/plugin";

export function useDevice(
  componentId: string,
  deviceName: string
): string {
  console.log("Using device", deviceName);
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
      temp
          );
    console.log("Device to render", description);
    return temp_description;
    };


/*
export function useDevice(componentId: string, deviceName: string, description: string): void {
  console.log("useDevice ...", componentId, deviceName, description);
  getStore().dispatch({
    type: SUBSCRIBE_DEVICE,
    payload: { componentId: componentId, deviceName: deviceName, description: description }
  });
}
*/