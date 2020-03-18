/* The intention of this file is to provide a generic parsing mechanism
   that can be used for different filetypes by calling parseWidget with
   appropriate arguments.

   Limitations:
    - rules can only apply to props that have 'simple' parsers

   Possible enhancements:
    - be able to register new parsing functions for particular widgets
    - allow 'complex' parsers to be able to return multiple props
    - more precise TypeScript types
*/

import log from "loglevel";
import { GenericProp } from "../../../types/props";
import { WidgetDescription } from "../createComponent";
import { StringProp, PositionProp } from "../propTypes";
import { ElementCompact } from "xml-js";

function isEmpty(obj: any): boolean {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}
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
  complexParsers: ComplexParserDict,
  // Whether props with no registered function should be passed through
  // with no parsing.
  passThrough: boolean
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
        if (
          widget.hasOwnProperty(opiPropName) &&
          !isEmpty(widget[opiPropName])
        ) {
          newProps[prop] = propParser(widget[opiPropName]);
          log.debug(`result ${newProps[prop]}`);
        }
      } catch (e) {
        log.error(`Could not convert simple prop ${prop}:`);
        log.error(widget[opiPropName]);
        log.error(e);
      }
    } else if (complexParsers.hasOwnProperty(prop)) {
      /* More complex props need access to the entire widget. */
      log.debug(`complex parser for ${prop}`);
      const propParser = complexParsers[prop];
      try {
        newProps[prop] = propParser(widget);
        log.debug(`result ${newProps[prop]}`);
      } catch (e) {
        log.error(`Could not convert complex prop ${prop}:`);
        log.error(e);
      }
    } else if (passThrough) {
      newProps[prop] = widget[prop];
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
  passThrough: boolean,
  patchFunctions: PatchFunction[]
): WidgetDescription {
  const targetWidget = getTargetWidget(props);
  const widgetDescription = genericParser(
    props,
    targetWidget,
    simpleParsers,
    complexParsers,
    passThrough
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
      passThrough,
      patchFunctions
    );
  });
  return widgetDescription;
}
