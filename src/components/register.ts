import { REGISTER_WIDGET } from "../redux/actions";
import { getStore } from "../redux/store";

interface Widgets {
  [key: string]: [any, any];
}

let widgets: Widgets = {};

export function registerWidget(
  component: any,
  propTypes: any,
  name: string
): void {
  widgets[name] = [component, propTypes];
  component.propTypes = propTypes;
}

export function registerWidgets(): void {
  console.log("register widgets");
  console.log(widgets);
  for (const [name, val] of Object.entries(widgets)) {
    console.log(`registering ${name}`);
    const [component, propTypes] = val;
    getStore().dispatch({
      type: REGISTER_WIDGET,
      payload: {
        component: component,
        propTypes: propTypes,
        name: name
      }
    });
  }
}
