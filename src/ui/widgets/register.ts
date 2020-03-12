interface Widgets {
  [key: string]: [any, any];
}

export const REGISTERED_WIDGETS: Widgets = {};

export function registerWidget(
  component: any,
  propTypes: any,
  name: string
): void {
  REGISTERED_WIDGETS[name] = [component, propTypes];
  component.propTypes = propTypes;
}
