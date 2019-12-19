interface Widgets {
  [key: string]: [any, any];
}

export const widgets: Widgets = {};

export function registerWidget(
  component: any,
  propTypes: any,
  name: string
): void {
  widgets[name] = [component, propTypes];
  component.propTypes = propTypes;
}
