
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
  //"children":[{"type":"device","deviceName":"Xspress3.Channel1","position":"relative","height":"5vh","width":"50%"},{"type":"progressbar","position":"relative","height":"5vh","width":"50%","pvName":"csim://sine(-10,10,100,0.1)","backgroundColor":"#012265"}]}';

  if (coniqlQuery !== undefined) {

    JSON_str += '"children":[';

    let obj = JSON.parse(JSON.stringify(coniqlQuery));

    for (var entry in obj) {

      if (entry !== '0')
        JSON_str += ',';

      console.log("obj", obj[entry]);
      var {name, label, child, __typename} = obj[entry];
      console.log("obj", name, label, child, __typename);

      JSON_str += '{"type": "flexcontainer",\
      "position": "relative",\
      "children": [\
        {\
          "type": "label",\
          "position": "relative",\
          "width": "50%",\
          "text":"' + label + '",\
          "backgroundColor": "transparent"\
        }]}';
      
      //console.log("obj-", JSON.parse(obj[child]) as childInfo);

    }

    //console.log("obj", JSON.parse(obj));
    
    //console.log("obj", obj);

    //var child_str = '';

    Object.entries(coniqlQuery).forEach(
      ([key, value]) => {
        
        //List of 'NamedChild' - name, label, child, typename

        // if 'child' 'Channel' -> 'display widget'
        // if 'child' 'Device' - 'plonk part back into this ...'
        console.log("?", key, value);
      });

        /*
        if (key.includes("name") && value === 'NamedChild') {
        
          //console.log("? type of child", value);
        }
        if (typeof(value) === 'object' && value !== null) {
        Object.entries(value).forEach(
          ([ckey, cvalue]) => {
            console.log("?", ckey, cvalue);
            console.log("?", ckey, typeof(cvalue));
            if (ckey.includes("typename")) {
              console.log("? type of child", cvalue);
            }
          }
        )
        }
        console.log("?", typeof(value));
        //Object.entries(value).forEach(
        //if (key == "name") {
        //  console.log("??", value);
        //}
    // }
      }
      );
      */
  //}
  //else {
    JSON_str += ']}';
  //}
    }
else {
  JSON_str += '"children":[]}'
}
  console.log("hmm", JSON_str);
  return JSON_str;
  //return '{"type":"display","position":"relative","overflow":"auto","backgroundColor":"#012265","children":[{"type":"device","deviceName":"Xspress3.Channel1","position":"relative","height":"5vh","width":"50%"},{"type":"progressbar","position":"relative","height":"5vh","width":"50%","pvName":"csim://sine(-10,10,100,0.1)","backgroundColor":"#012265"}]}';

}