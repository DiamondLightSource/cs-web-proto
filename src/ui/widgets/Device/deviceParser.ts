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

export const createLabel = (value = "-"): any => {
  return {
    type: "label",
    position: "relative",
    text: `${wordSplitter(value)}`,
    width: "45%",
    backgroundColor: "transparent",
    margin: "5px 0 0 0"
  };
};

export const createReadback = (pv = ""): any => {
  return {
    type: "readback",
    position: "relative",
    width: "45%",
    margin: "5px 0 0 0",
    pvName: `${pv}`
  };
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

export const parseResponse = (response: Response): any => {
  const deviceChildren: any[] = [];

  let deviceName = "Device";
  if (response.getDevice) {
    const [name, pvIds, groups]: [string, Pvs, Groups] =
      parseResponseIntoObject(response);
    deviceName = name;

    // Parse groups into json string
    const groupStrings = Object.entries(groups).map(data => {
      const [groupName, pvNames] = data;

      const groupChildren = [];

      for (const pvName of pvNames) {
        const id = pvIds[pvName];
        delete pvIds[pvName];
        groupChildren.push(createLabel(pvName));
        groupChildren.push(createReadback(id));
      }

      return {
        type: "groupbox",
        width: "95%",
        name: `${wordSplitter(groupName)}`,
        position: "relative",
        margin: "10px 0 10px 0",
        children: [
          {
            type: "flexcontainer",
            position: "relative",
            overflow: "auto",
            children: groupChildren
          }
        ]
      };
    });

    // PVs that aren't in a group are displayed first
    Object.entries(pvIds).forEach(data => {
      const [pvName, id] = data;
      deviceChildren.push(createLabel(pvName));
      deviceChildren.push(createReadback(id));
    });

    // Then groups are displayed after
    groupStrings.forEach(child => deviceChildren.push(child));
  }

  return {
    type: "groupbox",
    name: `${wordSplitter(deviceName)}`,
    position: "relative",
    margin: "5px 0 0 0",
    children: [
      {
        type: "flexcontainer",
        position: "relative",
        overflow: "auto",
        children: deviceChildren
      }
    ]
  };
};
