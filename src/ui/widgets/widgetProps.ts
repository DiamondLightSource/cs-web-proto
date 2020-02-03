import PropTypes from "prop-types";
import { PvState } from "../../redux/csState";
import {
  ContainerFeaturesPropType,
  ActionsPropType,
  StringOrNumProp,
  StringPropOpt,
  BoolPropOpt,
  InferWidgetProps,
  StringProp,
  StringOrNumPropOpt,
  ChoicePropOpt,
  MacrosProp,
  MacrosPropOpt
} from "./propTypes";

import { VType } from "../../types/vtypes/vtypes";

const RulesPropType = PropTypes.shape({
  condition: StringProp,
  trueState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  falseState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    .isRequired,
  substitutionMap: MacrosProp,
  prop: StringProp
});

const AbsoluteContainerProps = {
  position: PropTypes.oneOf(["absolute"]).isRequired,
  x: StringOrNumProp,
  y: StringOrNumProp,
  height: StringOrNumProp,
  width: StringOrNumProp,
  ...ContainerFeaturesPropType
};

const FlexibleContainerProps = {
  position: PropTypes.oneOf(["relative"]).isRequired,
  height: StringOrNumPropOpt,
  width: StringOrNumPropOpt,
  ...ContainerFeaturesPropType
};

const WidgetStylingPropType = {
  font: StringPropOpt,
  fontSize: StringOrNumPropOpt,
  fontWeight: StringOrNumPropOpt,
  textAlign: ChoicePropOpt(["center", "left", "right", "justify"]),
  backgroundColor: StringPropOpt,
  color: StringPropOpt
};
export type WidgetStyling = InferWidgetProps<typeof WidgetStylingPropType>;

const CommonWidgetProps = {
  widgetStyling: PropTypes.shape(WidgetStylingPropType),
  macroMap: MacrosPropOpt,
  rules: PropTypes.arrayOf(RulesPropType.isRequired),
  actions: ActionsPropType,
  tooltip: StringPropOpt,
  resolvedTooltip: StringPropOpt,
  menuWrapper: BoolPropOpt
};

const AbsoluteComponentPropType = {
  containerStyling: PropTypes.shape(AbsoluteContainerProps).isRequired,
  ...CommonWidgetProps
};
type AbsoluteType = InferWidgetProps<typeof AbsoluteComponentPropType>;

const FlexibleComponentPropType = {
  containerStyling: PropTypes.shape(FlexibleContainerProps).isRequired,
  ...CommonWidgetProps
};
type FlexibleType = InferWidgetProps<typeof FlexibleComponentPropType>;

// PropTypes object for a widget which can be expanded
export const WidgetPropType = {
  containerStyling: PropTypes.oneOfType([
    PropTypes.exact(AbsoluteContainerProps),
    PropTypes.exact(FlexibleContainerProps)
  ]).isRequired,
  ...CommonWidgetProps
};
// Allows for either absolute or flexible positioning
export type WidgetProps = AbsoluteType | FlexibleType;
// Internal type for creating widgets
export type WidgetComponent = WidgetProps & { baseWidget: React.FC<any> };

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
