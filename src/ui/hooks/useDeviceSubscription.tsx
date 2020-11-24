import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { SUBSCRIBE_DEVICE, UNSUBSCRIBE_DEVICE } from "../../redux/actions";

export function useDeviceSubscription(
  componentId: string,
  device: string
): void {
  const dispatch = useDispatch();

  useEffect((): (() => void) => {
    dispatch({
      type: SUBSCRIBE_DEVICE,
      payload: { device: device, componentId }
    });
    return (): void => {
      dispatch({
        type: UNSUBSCRIBE_DEVICE,
        payload: { device: device, componentId }
      });
    };
  }, [dispatch, componentId, device]);
}
