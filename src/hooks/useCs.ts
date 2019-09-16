import { useEffect } from "react";
import { getStore } from "../redux/store";
import { SUBSCRIBE, UNSUBSCRIBE, WRITE_PV } from "../redux/actions";
import { useDispatch } from "react-redux";
import { NType } from "../ntypes";

export function useSubscription(componentId: string, pvName: string): void {
  const dispatch = useDispatch();
  useEffect((): any => {
    dispatch({
      type: SUBSCRIBE,
      payload: { componentId: componentId, pvName: pvName }
    });
    return (): any => {
      dispatch({
        type: UNSUBSCRIBE,
        payload: { componentId: componentId, pvName: pvName }
      });
    };
  }, [dispatch, componentId, pvName]);
}

export function writePv(pvName: string, value: NType): void {
  getStore().dispatch({
    type: WRITE_PV,
    payload: { pvName: pvName, value: value }
  });
}
