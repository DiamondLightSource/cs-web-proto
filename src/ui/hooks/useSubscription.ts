import { useEffect } from "react";
import { SUBSCRIBE, UNSUBSCRIBE, WRITE_PV } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { DType } from "../../types/dtypes";
import { SubscriptionType } from "../../connection/plugin";
import { store } from "../../redux/store";

export function useSubscription(
  componentId: string,
  pvNames: string[],
  types: SubscriptionType[]
): void {
  // zip pvNames and types together
  const pvsAndTypes: [string, SubscriptionType][] = pvNames.map(
    (pvName: string, i: number) => {
      return [pvName, types[i]];
    }
  );
  const dispatch = useDispatch();
  // Get a repeatable value for React to decide whether to re-render.
  // If you put pvNames into the useEffect dependency array it will
  // not compare as equal to the last array, even with the same contents.
  const arrayStr = JSON.stringify(pvNames);
  // useEffect takes a function that
  // - takes no arguments and
  // - returns a function that takes no arguments and returns nothing
  useEffect((): (() => void) => {
    pvsAndTypes.forEach(([pvName, type]): void => {
      dispatch({
        type: SUBSCRIBE,
        payload: { componentId: componentId, pvName: pvName, type: type }
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

export function writePv(pvName: string, value: DType): void {
  store.dispatch({
    type: WRITE_PV,
    payload: { pvName: pvName, value: value }
  });
}
