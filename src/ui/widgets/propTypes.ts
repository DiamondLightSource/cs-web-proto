import PropTypes, { InferProps } from "prop-types";
import { Color } from "../../types/color";
import { Font } from "../../types/font";
import { Border } from "../../types/border";
import { RelativePosition, AbsolutePosition } from "../../types/position";
import { PV } from "../../types/pv";
import { FileDescription } from "../../fileContext";

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

export const FuncPropOpt = PropTypes.instanceOf(Function);
export const FuncProp = FuncPropOpt.isRequired;

export const PositionProp = PropTypes.oneOfType([
  PropTypes.instanceOf(AbsolutePosition),
  PropTypes.instanceOf(RelativePosition)
]).isRequired;

export const MacrosProp = PropTypes.objectOf(
  PropTypes.string.isRequired
).isRequired;
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

export const FilePropType = PropTypes.shape({
  path: StringProp,
  macros: MacrosProp,
  defaultProtocol: StringProp
}).isRequired;

export const DynamicContentPropType = PropTypes.shape({
  name: StringProp,
  location: StringProp,
  description: StringPropOpt,
  file: FilePropType
});

export interface DynamicContent {
  name: string; // Name associated with the content
  location: string; // Location of component to target
  description?: string; // Optional description of action
  file: FileDescription;
}
// I would like this line to work but unfortunately it doesn't
// export type DynamicContent = InferWidgetProps<typeof DynamicContentPropType>;

const DynamicActionPropType = PropTypes.shape({
  type: StringProp,
  dynamicInfo: DynamicContentPropType
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
  DynamicActionPropType,
  WritePvPropType,
  OpenWebpagePropType
]);

export const ActionsPropType = PropTypes.shape({
  executeAsOne: BoolPropOpt,
  actions: PropTypes.arrayOf(ActionPropType).isRequired
});
