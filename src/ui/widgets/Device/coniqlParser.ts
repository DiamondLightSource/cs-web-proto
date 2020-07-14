
interface childInfo {
  name: string,
  label: string
}

function coniqlToJSON_childParse(child: {}) : string {
  return ''
}

function coniqlToJSON_objectParse(obj : object) : string {
  return ''; 
}

//function create_container()
/*
      "type": "flexcontainer",
      "position": "relative",
      "children": [
        {
          "type": "label",
          "position": "relative",
          "width": "50%",
          "text": "Position",
          "backgroundColor": "transparent"
        },

*/

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

          JSON_str += ', {\
                            "type": "progressbar",\
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