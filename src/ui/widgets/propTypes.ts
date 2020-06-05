import PropTypes, { InferProps } from "prop-types";
import { Color } from "../../types/color";
import { Font } from "../../types/font";
import { Border } from "../../types/border";
import { RelativePosition, AbsolutePosition } from "../../types/position";
import { PV } from "../../types/pv";

export type ExcludeNulls<T> = {
  [P in keyof T]: Exclude<T[P], null>;
};
export type InferWidgetProps<T> = ExcludeNulls<InferProps<T>>;

export const StringProp = PropTypes.string.isRequired;
export const StringPropOpt = PropTypes.string;

export const IntProp = PropTypes.number.isRequired;
export const IntPropOpt = PropTypes.number;

export const FloatProp = PropTypes.number.isRequired;
export const FloatPropOpt = PropTypes.number;

export const BoolProp = PropTypes.bool.isRequired;
export const BoolPropOpt = PropTypes.bool;

export const PvProp = PropTypes.instanceOf(PV).isRequired;
export const PvPropOpt = PropTypes.instanceOf(PV);

export const ChildrenProp = PropTypes.node.isRequired;
export const ChildrenPropOpt = PropTypes.node;

export const ObjectProp = PropTypes.object.isRequired;
export const ObjectPropOpt = PropTypes.object;

export const ColorProp = PropTypes.instanceOf(Color).isRequired;
export const ColorPropOpt = PropTypes.instanceOf(Color);

export const FontProp = PropTypes.instanceOf(Font).isRequired;
export const FontPropOpt = PropTypes.instanceOf(Font);

export const BorderProp = PropTypes.instanceOf(Border).isRequired;
export const BorderPropOpt = PropTypes.instanceOf(Border);

export const PositionProp = PropTypes.oneOfType([
  PropTypes.instanceOf(AbsolutePosition),
  PropTypes.instanceOf(RelativePosition)
]).isRequired;

export const MacrosProp = PropTypes.objectOf(PropTypes.string.isRequired)
  .isRequired;
export const MacrosPropOpt = PropTypes.objectOf(PropTypes.string.isRequired);

export const PvTypePropOpt = PropTypes.shape({
  double: BoolPropOpt,
  string: BoolPropOpt,
  base64Array: BoolPropOpt,
  stringArray: BoolPropOpt,
  display: BoolPropOpt,
  timestamp: BoolPropOpt
});

export const PvTypeProp = PvTypePropOpt.isRequired;

const RulePvs = PropTypes.shape({
  pvName: PvProp,
  trigger: BoolProp
}).isRequired;

const RuleExpressions = PropTypes.shape({
  boolExp: StringProp,
  value: PropTypes.any,
  convertedValue: PropTypes.any
}).isRequired;

export const RulePropType = PropTypes.shape({
  name: StringProp,
  prop: StringProp,
  outExp: BoolProp,
  pvs: PropTypes.arrayOf(RulePvs).isRequired,
  expressions: PropTypes.arrayOf(RuleExpressions).isRequired
});

export const RulesProp = PropTypes.arrayOf(RulePropType.isRequired).isRequired;
export const RulesPropOpt = PropTypes.arrayOf(RulePropType.isRequired);

export const StringOrNumPropOpt = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
]);
export const StringOrNumProp = StringOrNumPropOpt.isRequired;

export function ChoicePropOpt(
  options: string[]
): PropTypes.Requireable<string> {
  return PropTypes.oneOf(options);
}
export function ChoiceProp(options: string[]): PropTypes.Validator<string> {
  return PropTypes.oneOf(options).isRequired;
}

// Number of prop types organised into useable sections to form more
// complex units
export const ContainerFeaturesPropType = {
  margin: StringPropOpt,
  padding: StringPropOpt,
  minWidth: StringPropOpt,
  maxWidth: StringPropOpt,
  minHeight: StringPropOpt
};

const OpenWebpagePropType = PropTypes.shape({
  type: StringProp,
  openWebpageInfo: PropTypes.shape({
    url: StringProp,
    description: StringPropOpt
  }).isRequired
});

const OpenPagePropType = PropTypes.shape({
  type: StringProp,
  openPageInfo: PropTypes.shape({
    page: StringProp,
    pageDescription: PropTypes.shape({
      filename: PropTypes.string,
      filetype: PropTypes.oneOf(["bob", "opi", "json"]),
      macros: MacrosProp
    }),
    description: StringPropOpt
  }).isRequired
});

const ClosePagePropType = PropTypes.shape({
  type: StringProp,
  closePageInfo: PropTypes.shape({
    page: StringProp,
    description: StringPropOpt
  }).isRequired
});

const WritePvPropType = PropTypes.shape({
  type: StringProp,
  writePvInfo: PropTypes.shape({
    pvName: StringProp,
    value: PropTypes.oneOfType([StringPropOpt, FloatPropOpt]),
    description: StringPropOpt
  }).isRequired
});

const ActionPropType = PropTypes.oneOfType([
  OpenPagePropType,
  ClosePagePropType,
  WritePvPropType,
  OpenWebpagePropType
]);

export const ActionsPropType = PropTypes.shape({
  executeAsOne: BoolPropOpt,
  actions: PropTypes.arrayOf(ActionPropType).isRequired
});
