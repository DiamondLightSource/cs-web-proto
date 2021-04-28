interface Widgets {
  [key: string]: [any, any];
}

export const REGISTERED_WIDGETS: Widgets = {};

// Tricky to get the right types here.
export function registerWidget(
  component: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  propTypes: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
  name: string
): void {
  REGISTERED_WIDGETS[name] = [component, propTypes];
  // Allow adding another property to the component.
  component.propTypes = propTypes;
}
