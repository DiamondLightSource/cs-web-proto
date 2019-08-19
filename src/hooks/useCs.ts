import { useEffect } from "react";
import { store } from "../redux/store";
import { SUBSCRIBE, UNSUBSCRIBE, WRITE_PV } from "../redux/actions";
import { useDispatch } from "react-redux";
import { NType } from "../cs";

export function useSubscription(pvName: string): void {
  const dispatch = useDispatch();
  useEffect((): any => {
    dispatch({ type: SUBSCRIBE, payload: { url: "wsurl", pvName: pvName } });
    return (): any => {
      dispatch({ type: UNSUBSCRIBE, payload: { url: "wsurl" } });
    };
  }, [dispatch, pvName]);
}

export function writePv(pvName: string, value: NType): void {
  store.dispatch({
    type: WRITE_PV,
    payload: { pvName: pvName, value: value }
  });
}
