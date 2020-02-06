import { Color } from "./color";
import { Font } from "./font";
import { MacroMap } from "../redux/csState";
import { Rule } from "./rules";
import { WidgetActions } from "../ui/widgets/widgetActions";

export type GenericProp =
  | string
  | boolean
  | number
  | Color
  | Font
  | Rule[]
  | MacroMap
  | WidgetActions;
