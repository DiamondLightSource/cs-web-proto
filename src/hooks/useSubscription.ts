import { useEffect } from "react";
import { getStore } from "../redux/store";
import { SUBSCRIBE, UNSUBSCRIBE, WRITE_PV } from "../redux/actions";
import { useDispatch } from "react-redux";
import { VType } from "../vtypes/vtypes";

export function useSubscription(componentId: string, pvNames: string[]): void {
  const dispatch = useDispatch();
  // Get a repeatable value for React to decide whether to re-render.
  // If you put pvNames into the useEffect dependency array it will
  // not compare as equal to the last array, even with the same contents.
  const arrayStr = JSON.stringify(pvNames);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, componentId, arrayStr]);
}

export function writePv(pvName: string, value: VType): void {
  getStore().dispatch({
    type: WRITE_PV,
    payload: { pvName: pvName, value: value }
  });
}
