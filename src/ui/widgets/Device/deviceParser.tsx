export interface Child {
  __typename: string;
  value?: {
    string: string;
    __typename: string;
  };
}

export interface Parent {
  label: string;
  child: Child;
  __typename: string;
}

export interface DeviceResponse {
  children: Parent[];
  __typename: string;
}

export const deviceParser = (response = ""): string => {
  let children = '"children": [';
  if (response.length > 0) {
    const json: DeviceResponse = JSON.parse(response.substring(7)).getDevice;
    for (const parent of json.children) {
      children += parseChild(parent);
    }

    // remove extra comma on children
    children = children.substring(0, children.length - 1);
  }
  children += "]";
  return `{"type": "flexcontainer", "position": "relative", "overflow": "auto", ${children} }`;
};

export const parseChild = (parent: Parent): string => {
  const { label, child } = parent;

  const valueString = createLabel(child.value?.string);
  const labelString = createLabel(label);
  return labelString + valueString;
};

export const createLabel = (value = "-"): string => {
  let label = '{"type": "label", "position": "relative", "text":"';
  label += value;
  label +=
    '", "width":"45%", "backgroundColor": "transparent", "margin": "5px 0 0 0"},';

  return label;
};
