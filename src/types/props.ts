import { Color } from "./color";
import { Font } from "./font";
import { MacroMap } from "../redux/csState";
import { WidgetActions } from "../ui/widgets/widgetActions";
import { Border } from "./border";
import { Position } from "./position";

export type GenericProp =
  | string
  | boolean
  | number
  | Color
  | Font
  | Border
  | Position
  | Rule[]
  | MacroMap
  | WidgetActions;

export interface Expression {
  boolExp: string;
  value: string;
  convertedValue?: GenericProp;
}

interface RulePV {
  pvName: string;
  trigger: boolean;
}

export interface Rule {
  name: string;
  prop: string;
  outExp: boolean;
  pvs: RulePV[];
  expressions: Expression[];
}
