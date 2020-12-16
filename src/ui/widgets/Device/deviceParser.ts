import log from "loglevel";

type Typename = "NamedChild" | "Channel" | "Group" | "Device";

export interface Channel {
  id: string;
  __typename: Typename;
}

export interface Device {
  id: string;
  __typename: Typename;
}

export interface GroupChild {
  name: string;
  __typename: Typename;
}

export interface Group {
  layout: string;
  children: GroupChild[];
  __typename: Typename;
}

type Child = Channel | Device | Group;

export interface NamedChild {
  name: string;
  label: string;
  child: Child;
  __typename: Typename;
}

export interface Response {
  getDevice: {
    id: string;
    children: NamedChild[];
    __typename: Typename;
  };
}

// Add spaces between capital letters e.g. WordSplitter -> Word Splitter
export const wordSplitter = (word: string): string =>
  word.replace(/([A-Z])/g, " $1").trim();

export const createLabel = (value = "-"): string => {
  let label = '{"type": "label", "position": "relative", "text":"';
  // Put spaces between each capital letter
  label += wordSplitter(value);
  label += `", "width": "45%", "backgroundColor": "transparent", "margin": "5px 0 0 0"},`;
  return label;
};

export const createReadback = (pv = ""): string => {
  let readback =
    '{"type": "readback", "position": "relative", "width": "45%", "margin": "5px 0 0 0", ';
  readback += `"pvName": "${pv}"},`;
  return readback;
};

export interface Groups {
  [key: string]: Array<string>;
}

export interface Pvs {
  [key: string]: string;
}

/**
 * Takes response json and collects all the PVs in it, collects the groups and collects the names
 * of the PVs that should be in that group
 * @param response
 */
export const parseResponseIntoObject = (response: Response): any => {
  const pvIds: Pvs = {};
  const groups: Groups = {};
  let deviceName = "";
  if (response.getDevice) {
    const { children, id } = response.getDevice;
    deviceName = id;

    for (const namedChild of children) {
      if (namedChild.child.__typename === "Group") {
        groups[namedChild.label] = (namedChild.child as Group).children.map(
          groupChild => groupChild.name
        );
      } else if (namedChild.child.__typename === "Channel") {
        pvIds[namedChild.name] = (namedChild.child as Channel).id;
      } else {
        log.error("Typename not handled");
      }
    }
  }
  return [deviceName, pvIds, groups];
};

export const parseResponse = (response: Response): string => {
  let childrenComponents = '"children": [';

  let deviceName = "Device";
  if (response.getDevice) {
    const [name, pvIds, groups]: [
      string,
      Pvs,
      Groups
    ] = parseResponseIntoObject(response);
    deviceName = name;

    // Parse groups into json string
    const groupStrings = Object.entries(groups).map(data => {
      const [groupName, pvNames] = data;

      let child = `{"type": "groupbox", "width": "95%", "name": "${wordSplitter(
        groupName
      )}", "position": "relative", "margin": "10px 0 10px 0", "children": [{"type": "flexcontainer", "position": "relative", "overflow": "auto", "children": [`;
      // For each pv in group find the PV id and display it with a readback and label
      for (const pvName of pvNames) {
        const id = pvIds[pvName];
        delete pvIds[pvName];
        child += createLabel(pvName);
        child += createReadback(id);
      }

      // Chop off trailing comma
      child = child.substring(0, child.length - 1);
      child += "]}]},";
      return child;
    });

    // PVs that aren't in a group are displayed first
    Object.entries(pvIds).forEach(data => {
      const [pvName, id] = data;
      childrenComponents += createLabel(pvName);
      childrenComponents += createReadback(id);
    });

    // Then groups are displayed after
    groupStrings.forEach(child => (childrenComponents += child));

    // Chop off trailing comma
    childrenComponents = childrenComponents.substring(
      0,
      childrenComponents.length - 1
    );
  }

  childrenComponents += "]";

  return `{"type": "groupbox", "name": "${wordSplitter(
    deviceName
  )}", "position": "relative", "margin": "5px 0 0 0", "children": [{"type": "flexcontainer", "position": "relative", "overflow": "auto", ${childrenComponents} }]}`;
};
