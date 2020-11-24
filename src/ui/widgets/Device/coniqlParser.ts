function coniqlToWidget(coniql: string): string {
  if (coniql === "TEXTUPDATE") {
    return "readback";
  }
  return "readback";
}

export function coniqlToJSON(coniqlQuery: {}): string {
  let jsonStr = '{"type":"display","position":"relative","overflow":"auto",';

  if (coniqlQuery !== undefined) {
    jsonStr += '"children":[';

    const obj = JSON.parse(JSON.stringify(coniqlQuery));

    for (const entry in obj) {
      // Hack for excess ',' - FIX ME
      if (entry !== "0") jsonStr += ",";

      const { label, child } = obj[entry];

      // Parse Label

      jsonStr +=
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

      //Parse child

      const { __typename, id } = child;

      if (__typename === "Channel") {
        const { widget } = child;

        jsonStr +=
          ', {\
                            "type": "' +
          coniqlToWidget(widget) +
          '",\
                            "position": "relative",\
                            "width":"50%",\
                            "pvName": "' +
          id +
          '"\
                          }';
      }

      if (__typename === "Device") {
        jsonStr +=
          ', {\
            "type": "device",\
            "position": "relative",\
            "width":"50%",\
            "deviceName": "' +
          id +
          '"\
          }';
      }

      jsonStr += "]}";
    }

    jsonStr += "]}";
  } else {
    jsonStr += '"children":[]}';
  }

  return jsonStr;
}
