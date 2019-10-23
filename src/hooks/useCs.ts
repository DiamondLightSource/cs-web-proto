import { useEffect } from "react";
import { getStore } from "../redux/store";
import { SUBSCRIBE, UNSUBSCRIBE, WRITE_PV } from "../redux/actions";
import { useDispatch } from "react-redux";
import { VType } from "../vtypes/vtypes";

export function useSubscription(componentId: string, pvNames: string[]): void {
  const dispatch = useDispatch();
  // useEffect takes a function that
  // - takes no arguments and
  // - returns a function that takes no arguments and returns nothing
  useEffect((): (() => void) => {
    pvNames.forEach((pvName): void => {
      dispatch({
        type: SUBSCRIBE,
        payload: { componentId: componentId, pvName: pvName }
      });
    });
    return (): void => {
      pvNames.forEach((pvName): void => {
        dispatch({
          type: UNSUBSCRIBE,
          payload: { componentId: componentId, pvName: pvName }
        });
      });
    };
  }, [dispatch, componentId, pvNames]);
}

export function writePv(pvName: string, value: VType): void {
  getStore().dispatch({
    type: WRITE_PV,
    payload: { pvName: pvName, value: value }
  });
}
