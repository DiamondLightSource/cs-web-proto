import { useSelector, useDispatch } from "react-redux";
import { CsState } from "../../redux/csState";
import { deviceSelector, deviceComparator } from "./utils";
import { DType } from "../../types/dtypes";
import { QUERY_DEVICE } from "../../redux/actions";
import { useEffect } from "react";

export function useDevice(device: string): DType | undefined {
  const dispatch = useDispatch();

  useEffect((): void => {
    dispatch({
      type: QUERY_DEVICE,
      payload: { device: device }
    });
  }, [dispatch, device]);

  const description: DType | undefined = useSelector<CsState, DType>(
    (state: CsState): DType => deviceSelector(device, state),
    deviceComparator
  );
  return description;
}
