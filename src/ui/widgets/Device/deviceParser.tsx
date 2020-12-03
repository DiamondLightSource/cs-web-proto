export interface Child {
  name: string;
  label: string;
  subChild: Child;
  __typename: string;
}

export const deviceParser = (response = ""): string => {
  if (response.length >= 0) {
    let children = '"children": [';

    const json = JSON.parse(response.substring(7)).getDevice;
    for (const child of json.children) {
      children += parseChild(child);
    }

    return `{"type": "display", "position": "relative", "overflow": "auto", ${children} }`;
  }
  return "";
};

export const parseChild = (child: Child): string => {
  const { name, label, subChild, __typename } = child;

  const children =
    '{"type": "flexcontainer",\
  "position": "relative",\
  "children": [\
    {\
      "type": "label",\
      "position": "relative",\
      "text":"' +
    label +
    '",\
      "width":"50%",\
      "backgroundColor": "transparent"\
    }';
  return children;
};
