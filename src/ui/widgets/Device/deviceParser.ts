import log from "loglevel";
import { WidgetDescription } from "../createComponent";

type Typename = "NamedChild" | "Channel" | "Group" | "Device";

export interface Channel {
  id: string;
  display: {
    description: string;
    widget: string;
  };
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

export function createLabel(value: string): WidgetDescription {
  return {
    type: "label",
    position: "relative",
    text: `${wordSplitter(value)}`,
    width: "45%",
    backgroundColor: "transparent",
    margin: "5px 0 0 0"
  };
}

export function createReadback(pv: string): WidgetDescription {
  return {
    type: "readback",
    position: "relative",
    width: "45%",
    margin: "5px 0 0 0",
    pvName: `${pv}`
  };
}

export function createInput(pv: string): WidgetDescription {
  return {
    type: "input",
    position: "relative",
    width: "45%",
    margin: "5px 0 0 0",
    pvName: `${pv}`
  };
}

export function createButton(
  pv: string,
  description?: string
): WidgetDescription {
  return {
    type: "actionbutton",
    position: "relative",
    width: "45%",
    margin: "5px 0 0 0",
    pvName: pv,
    text: description,
    actions: {
      executeAsOne: false,
      actions: [
        {
          type: "WRITE_PV",
          writePvInfo: {
            pvName: pv,
            value: 0,
            description: description
          }
        }
      ]
    }
  };
}

const WIDGET_FUNCTIONS: {
  [name: string]: (pv: string, description?: string) => WidgetDescription;
} = {
  TEXTUPDATE: createReadback,
  TEXTINPUT: createInput,
  BUTTON: createButton
};
export interface Groups {
  [key: string]: Array<string>;
}

export interface Pvs {
  [key: string]: Channel;
}

/**
 * Takes response json and collects all the PVs in it, collects the groups and collects the names
 * of the PVs that should be in that group
 * @param response
 */
export const parseResponseIntoObject = (
  response: Response
): [string, Pvs, Groups] => {
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
        pvIds[namedChild.name] = namedChild.child as Channel;
      } else {
        log.error("Typename not handled");
      }
    }
  }
  return [deviceName, pvIds, groups];
};

function createWidget(label: string, channel: Channel): any {
  if (WIDGET_FUNCTIONS.hasOwnProperty(channel.display.widget)) {
    return WIDGET_FUNCTIONS[channel.display.widget](channel.id, label);
  } else {
    return createReadback(channel.id);
  }
}

export const parseResponse = (response: Response): any => {
  const deviceChildren: any[] = [];

  let deviceName = "Device";
  if (response.getDevice) {
    const [name, channels, groups]: [string, Pvs, Groups] =
      parseResponseIntoObject(response);
    deviceName = name;

    // Parse groups into json string
    const groupStrings = Object.entries(groups).map(data => {
      const [groupName, pvNames] = data;

      const groupChildren = [];

      for (const pvName of pvNames) {
        const channel = channels[pvName];
        delete channels[pvName];
        groupChildren.push(createLabel(pvName));
        groupChildren.push(createWidget(pvName, channel));
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
    Object.entries(channels).forEach(data => {
      const [label, channel] = data;
      deviceChildren.push(createLabel(label));
      deviceChildren.push(createWidget(label, channel));
    });

    // Then groups are displayed after
    groupStrings.forEach(child => deviceChildren.push(child));
  }

  return {
    type: "groupbox",
    name: `${wordSplitter(deviceName)}`,
    position: "relative",
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
