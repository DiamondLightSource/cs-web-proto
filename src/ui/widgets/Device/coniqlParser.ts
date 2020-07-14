
function coniqlToWidget(coniql: string) : string {

  if (coniql === "TEXTUPDATE") {
    return "readback";
  }

  return "readback";

}

export function coniqlToJSON(coniqlQuery: {}) : string {

  var JSON_str = '{"type":"display","position":"relative","overflow":"auto",';

  if (coniqlQuery !== undefined) {

    JSON_str += '"children":[';

    let obj = JSON.parse(JSON.stringify(coniqlQuery));

    for (var entry in obj) {

      // Hack for excess ',' - FIX ME
      if (entry !== '0')
        JSON_str += ',';

      var {label, child, __typename} = obj[entry];

      // Parse Label

      JSON_str += '{"type": "flexcontainer",\
      "position": "relative",\
      "children": [\
        {\
          "type": "label",\
          "position": "relative",\
          "text":"' + label + '",\
          "width":"50%",\
          "backgroundColor": "transparent"\
        }';
        
        //Parse child
        
        var {__typename, id} = child;
        
        if (__typename === "Channel") {

          var {widget} = child;

          JSON_str += ', {\
                            "type": "' + coniqlToWidget(widget) + '",\
                            "position": "relative",\
                            "width":"50%",\
                            "pvName": "' + id + '"\
                          }';

        }
        
        if (__typename === "Device") {

          JSON_str += ', {\
            "type": "device",\
            "position": "relative",\
            "width":"50%",\
            "deviceName": "' + id + '"\
          }';

        }

        JSON_str += ']}';
    
    }
  
    JSON_str += ']}';
  
  }

  else {
    JSON_str += '"children":[]}'
  }

  return JSON_str;

}