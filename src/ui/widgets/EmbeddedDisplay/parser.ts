import log from "loglevel";
import { GenericProp } from "../../../types/props";
import { WidgetDescription } from "../createComponent";
import { StringProp, PositionProp } from "../propTypes";
import { ElementCompact } from "xml-js";

export function toArray(element?: ElementCompact): ElementCompact[] {
  let array = [];
  if (Array.isArray(element)) {
    array = element;
  } else if (element) {
    array = [element];
  }
  return array;
}

export type ParserDict = {
  [key: string]: [string, (value: any) => GenericProp | undefined];
};

export type ComplexParserDict = {
  [key: string]: (value: any) => GenericProp;
};

export type PatchFunction = (props: WidgetDescription) => void;

/* Take an object representing a widget and return our widget description. */
export function genericParser(
  widget: any,
  targetWidget: React.FC,
  simpleParsers: ParserDict,
  complexParsers: ComplexParserDict
): WidgetDescription {
  const newProps: any = { type: targetWidget };
  const allProps = {
    type: StringProp,
    position: PositionProp,
    /* We will need another way of using prop-types at runtime here. */
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...targetWidget.propTypes
  };
  /* First, parse our props if we know how to. */
  for (const prop of Object.keys(allProps)) {
    log.debug(`Trying to parse prop ${prop}`);
    if (simpleParsers.hasOwnProperty(prop)) {
      log.debug(`simple parser for ${prop}`);
      const [opiPropName, propParser] = simpleParsers[prop];
      try {
        if (widget.hasOwnProperty(opiPropName)) {
          newProps[prop] = propParser(widget[opiPropName]);
          log.debug(`result ${newProps[prop]}`);
        }
      } catch (e) {
        log.error(`Could not convert prop ${prop}:`);
        log.error(widget[prop]);
        log.error(e);
      }
    }
    /* More complex props need access to the entire widget. */
    if (complexParsers.hasOwnProperty(prop)) {
      log.debug(`complex parser for ${prop}`);
      const propParser = complexParsers[prop];
      try {
        newProps[prop] = propParser(widget);
        log.debug(`result ${newProps[prop]}`);
      } catch (e) {
        log.error(`Could not convert prop ${prop}:`);
        log.error(e);
      }
    }
  }

  return newProps;
}

export function parseWidget(
  props: any,
  getTargetWidget: (props: any) => React.FC,
  childrenName: string,
  simpleParsers: ParserDict,
  complexParsers: ComplexParserDict,
  patchFunctions: PatchFunction[]
): WidgetDescription {
  const targetWidget = getTargetWidget(props);
  const widgetDescription = genericParser(
    props,
    targetWidget,
    simpleParsers,
    complexParsers
  );
  // Execute patch functions.
  for (const patcher of patchFunctions) {
    patcher(widgetDescription);
  }
  /* Child widgets */
  const childWidgets = toArray(props[childrenName]);
  widgetDescription.children = childWidgets.map((child: any) => {
    return parseWidget(
      child,
      getTargetWidget,
      childrenName,
      simpleParsers,
      complexParsers,
      patchFunctions
    );
  });
  return widgetDescription;
}
