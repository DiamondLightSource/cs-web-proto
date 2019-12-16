import PropTypes, { InferProps } from "prop-types";

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

export const PvProp = PropTypes.string.isRequired;
export const PvPropOpt = PropTypes.string;

export const ChildrenProp = PropTypes.node.isRequired;
export const ChildrenPropOpt = PropTypes.node;

export const ObjectProp = PropTypes.object.isRequired;
export const ObjectPropOpt = PropTypes.object;

export const MacrosPropOpt = PropTypes.objectOf(PropTypes.string.isRequired);
export const MacrosProp = PropTypes.objectOf(PropTypes.string.isRequired)
  .isRequired;

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
  border: StringPropOpt,
  minWidth: StringPropOpt,
  maxWidth: StringPropOpt
};

const OpenWebpagePropType = PropTypes.shape({
  type: StringProp,
  url: StringProp,
  description: StringPropOpt
});

const OpenPagePropType = PropTypes.shape({
  type: StringProp,
  page: StringProp,
  location: StringProp,
  macros: StringProp,
  description: StringPropOpt
});

const ClosePagePropType = PropTypes.shape({
  type: StringProp,
  location: StringProp,
  description: StringPropOpt
});

const WritePvPropType = PropTypes.shape({
  type: StringProp,
  pvName: StringProp,
  value: PropTypes.oneOfType([StringPropOpt, FloatPropOpt]),
  description: StringPropOpt
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
