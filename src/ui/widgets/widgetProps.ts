import { PvState } from "../../redux/csState";
import {
  StringPropOpt,
  BoolPropOpt,
  InferWidgetProps,
  BorderPropOpt,
  PositionProp,
  ActionsPropType,
  RulesPropOpt,
  PvPropOpt,
  PvTypePropOpt
} from "./propTypes";

import { GenericProp } from "../../types/props";
import { DType } from "../../types/dtypes";

export const WidgetPropType = {
  position: PositionProp,
  rules: RulesPropOpt,
  actions: ActionsPropType,
  tooltip: StringPropOpt,
  border: BorderPropOpt,
  visible: BoolPropOpt
};

type WidgetProps = InferWidgetProps<typeof WidgetPropType>;

// Internal type for creating widgets
export type WidgetComponent = WidgetProps & {
  baseWidget: React.FC<any>;
};

// Internal prop types object for properties which are not in a standard widget
const PVExtras = {
  pvName: PvPropOpt,
  pvType: PvTypePropOpt,
  alarmBorder: BoolPropOpt
};
// PropTypes object for a PV widget which can be expanded
export const PVWidgetPropType = {
  ...PVExtras,
  ...WidgetPropType
};
export type PVWidgetProps = WidgetProps & InferWidgetProps<typeof PVExtras>;
export type PVWidgetComponent = PVWidgetProps & { baseWidget: React.FC<any> };
export type AnyProps = PVWidgetComponent & {
  id: string;
  connected?: boolean;
  readonly?: boolean;
  value?: DType;
} & {
  // All other props with valid types.
  [x: string]: GenericProp;
};

export interface Component {
  style?: Record<string, string>;
}

export type PVComponent = Component & PvState;
export type PVInputComponent = PVComponent & { pvName: string };
