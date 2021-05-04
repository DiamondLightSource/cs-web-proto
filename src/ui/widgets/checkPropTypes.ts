/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * We will need our own implementation, but for now we use this code.
 *
 * This code was adapted from the check-prop-types npm library. Its licence is here:
 * https://github.com/ratehub/check-prop-types/blob/bbf86b8122bcc58cb5dc68f2fa584f6fce4dbe5f/LICENSE
 * The original source code:
 * https://github.com/ratehub/check-prop-types/blob/bbf86b8122bcc58cb5dc68f2fa584f6fce4dbe5f/index.js
 *
 * The original documentation comment follows:
 *
 * Copyright Facebook, ratehub.
 * All rights reserved.
 *
 * This code is intended to closely match the behaviour of checkPropTypes() from
 * facebook/prop-types. The license for that code can be found here:
 * https://github.com/facebook/prop-types/blob/be165febc8133dfbe2c45133db6d25664dd68ad8/LICENSE
 *
 * That function's source:
 * https://github.com/facebook/prop-types/blob/be165febc8133dfbe2c45133db6d25664dd68ad8/checkPropTypes.js
 */

// Allows calling type checkers without an error being thrown. Not API!
const ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";

/**
 * Check if the values match with the type specs
 * Return a type error message or null
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 */
export function checkPropTypes(
  typeSpecs: any,
  values: any,
  location: any,
  componentName: any,
  getStack: any
): any {
  const name = componentName || "React class";
  for (const typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      let error;
      if (typeof typeSpecs[typeSpecName] !== "function") {
        return (
          name +
          ": " +
          location +
          " type `" +
          typeSpecName +
          "` is " +
          "invalid; it must be a function, usually from React.PropTypes."
        );
      } else {
        // Prop type validation may throw. In case they do, catch and save the
        // exception as the error.
        try {
          error = typeSpecs[typeSpecName](
            values,
            typeSpecName,
            componentName,
            location,
            null,
            ReactPropTypesSecret
          );
        } catch (ex) {
          error = ex;
        }
      }
      if (error && !(error instanceof Error)) {
        return (
          name +
          ": type specification of " +
          location +
          " `" +
          typeSpecName +
          "` is invalid; the type checker function must " +
          "return `null` or an `Error` but returned a " +
          typeof error +
          ". " +
          "You may have forgotten to pass an argument to the type checker " +
          "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " +
          "shape all require an argument)."
        );
      }
      if (error instanceof Error) {
        const stack = (getStack && getStack()) || "";
        return "Failed " + location + " type: " + error.message + stack;
      }
    }
  }
}
