import { GenericProp } from "./props";

export interface Expression {
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
