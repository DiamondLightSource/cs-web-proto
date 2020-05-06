import { PvState } from "../../redux/csState";
import {
  StringPropOpt,
  BoolPropOpt,
  InferWidgetProps,
  MacrosPropOpt,
  BorderPropOpt,
  PositionProp,
  ActionsPropType,
  PvPropOpt,
  RulesPropOpt
} from "./propTypes";

import { VType } from "../../types/vtypes/vtypes";

export const WidgetPropType = {
  position: PositionProp,
  macroMap: MacrosPropOpt,
  rules: RulesPropOpt,
  actions: ActionsPropType,
  tooltip: StringPropOpt,
  resolvedTooltip: StringPropOpt,
  menuWrapper: BoolPropOpt,
  border: BorderPropOpt,
  highlight: StringPropOpt,
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
  value?: VType;
  // This should be removed when typing is improved.
  [x: string]: any;
};

export interface Component {
  style?: object;
}

export type PVComponent = Component & PvState;
export type PVInputComponent = PVComponent & { pvName: string };
