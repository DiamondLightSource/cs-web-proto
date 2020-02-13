import { Color } from "./color";
import { Font } from "./font";
import { MacroMap } from "../redux/csState";
import { WidgetActions } from "../ui/widgets/widgetActions";
import { Border } from "./border";

export type GenericProp =
  | string
  | boolean
  | number
  | Color
  | Font
  | Border
  | Rule[]
  | MacroMap
  | WidgetActions;

interface Expression {
  boolExp: string;
  value: string;
  convertedValue?: GenericProp;
}

interface PV {
  pvName: string;
  trigger: boolean;
}

export interface Rule {
  name: string;
  prop: string;
  outExp: boolean;
  pvs: PV[];
  expressions: Expression[];
}