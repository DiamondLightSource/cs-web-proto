import PropTypes from "prop-types";
import { PvState } from "../../redux/csState";
import {
  StringPropOpt,
  BoolProp,
  BoolPropOpt,
  InferWidgetProps,
  StringProp,
  MacrosPropOpt,
  BorderPropOpt,
  PositionProp,
  ActionsPropType
} from "./propTypes";

import { VType } from "../../types/vtypes/vtypes";

const RulePvs = PropTypes.shape({
  pvName: StringProp,
  trigger: BoolProp
}).isRequired;

const RuleExpressions = PropTypes.shape({
  boolExp: StringProp,
  value: PropTypes.any,
  convertedValue: PropTypes.any
}).isRequired;

const RulesPropType = PropTypes.shape({
  name: StringProp,
  prop: StringProp,
  outExp: BoolProp,
  pvs: PropTypes.arrayOf(RulePvs).isRequired,
  expressions: PropTypes.arrayOf(RuleExpressions).isRequired
});

export const WidgetPropType = {
  position: PositionProp,
  macroMap: MacrosPropOpt,
  rules: PropTypes.arrayOf(RulesPropType.isRequired),
  actions: ActionsPropType,
  tooltip: StringPropOpt,
  resolvedTooltip: StringPropOpt,
  menuWrapper: BoolPropOpt,
  border: BorderPropOpt
};

type WidgetProps = InferWidgetProps<typeof WidgetPropType>;

// Internal type for creating widgets
export type WidgetComponent = WidgetProps & {
  baseWidget: React.FC<any>;
};

// Internal prop types object for properties which are not in a standard widget
const PVExtras = {
  pvName: StringPropOpt,
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
