export function ExtractLevelNLink(arr1) {
  var arrLinks = arr1[0]["rows"]["row"];
  var arrLevel = arr1[2]["rows"]["row"];
  var arrLocation = arr1[1]["rows"]["row"];

  var arrdatalevel = [];

  arrLevel.map((data) => {
    const node = {
      id: data["item"][1]["value"],
      lvlloc: data["item"][0]["value"], //LNKTLV+LNKTLOC
      text: data["item"][2]["value"],
      lvltyp: data["item"][5]["value"],
      lvlrow: data["item"][4]["value"],
      lvlcol: data["item"][3]["value"],
    };

    arrdatalevel.push(node);
  });

  /////////////LINK ARRAY ///////////////
  var arrdatalink = [];
  arrLinks.map((data) => {
    var tonode = arrLevel.find(
      (obj) =>
        obj["item"][1]["value"] === data["item"][3]["value"] && //comparing to node
        obj["item"][0]["value"] === data["item"][2]["value"]
    );

    var fromnode = arrLevel.find(
      (obj) =>
        obj["item"][1]["value"] === data["item"][1]["value"] && //comparing from node
        obj["item"][0]["value"] === data["item"][0]["value"]
    );

    const node = {
      lnkfloc: data["item"][0]["value"],
      lnkfid: data["item"][1]["value"],

      lnktloc: data["item"][2]["value"],
      lnktid: data["item"][3]["value"],
      frow: fromnode["item"][4]["value"],
      fcol: fromnode["item"][3]["value"],
      trow: tonode["item"][4]["value"],
      tcol: tonode["item"][3]["value"],
    };

    arrdatalink.push(node);
  });

  var arrdatalocation = [];
  arrLocation.map((data) => {
    //console.log("ITEM===", item);
    const node = {
      locnr: data["item"][0]["value"],
      locid: data["item"][1]["value"],
      locdsc: data["item"][2]["value"],
      loctyp: data["item"][3]["value"],
    };

    arrdatalocation.push(node);
  });
  // console.log("Location details===", arrdatalocation);
  return {
    datalevel: arrdatalevel,
    datalink: arrdatalink,
    datalocation: arrdatalocation,
  };
}
