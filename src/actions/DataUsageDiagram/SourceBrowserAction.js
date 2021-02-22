import API_ADDRESS from "../../../server/apiaddress";
export const setSourceBrowser = (param) => async (dispatch, res) => {
  console.log("param in sourcebrowser==", param);
  
  if (param.shortnm==="")
  {
    dispatch({
      type: "FETCH_SOURCEBROWSER",
      payload : [],
      PrcCallsExplosionData:[],
      rBrowser:[],
      pgmID:"",
      program:""
    });
  }
else{

  var shortnm=param.shortnm;
  
  let qurl = "";
  
if (param.value!=="")   ///////program Data Usage
{
qurl = `${API_ADDRESS}/readFile/${param.value}`;

  await fetch(qurl)
    .then((res) => res.json())
    .then(async (json) => {
       
      
       var qurl1 = `${API_ADDRESS}/SourceBrowser/${param.value}/${shortnm}`;

       await fetch(qurl1)
       .then((res) => res.json())
       .then(async (json1) => {
        console.log("show SourceBrowser data===", json1.result);
      //"result": responseForUI

      

      dispatch({
        type: "FETCH_SOURCEBROWSER",
        
        // payload: {PgmCodeData : extractfields(json.response.data),
        //           PrcCallsExplosionData:json1.result.PrcCallsExplosionData,
        //           rBrowser:json1.result.RBrowser,
        //           pgmID:json1.result.pgmID,
        //           program:param
        //           },
        payload : extractfields(json.response.data),
        PrcCallsExplosionData:json1.result.PrcCallsExplosionData,
        rBrowser:json1.result.RBrowser,
        pgmID:json1.result.pgmID,
        program:param,
        shortNm:param.shortnm
      });
    });
  });
}////////ends for file data usage case
else{   //Files data usage
  var qurl1 = `${API_ADDRESS}/SourceBrowser/${shortnm}`;
  await fetch(qurl1)
  .then((res) => res.json())
  .then(async (json1) => {
   console.log("show SourceBrowser data===", json1.result);
 dispatch({
   type: "FETCH_SOURCEBROWSER",
   payload : [],
   PrcCallsExplosionData:[],
   rBrowser:json1.result.RBrowser,
   pgmID:"",
   program:param,
   shortNm:param.shortnm
 });
});
}
}
};
function extractfields(arr1){
  //009000030414     C                   eval      *inlr = *on                                  '
  var resultarr=[];
  var item={};
  console.log(arr1[0]);
  arr1.map((elem)=>{
    
       var xx = elem.substr(6,2)+"/"+elem.substr(8,2)+"/"+elem.substr(10,2);
        item = {
          LineNum : parseInt(elem.substr(0,4))+"."+elem.substr(4,2),
          Stn:elem.substr(17),
          StnDate: xx
        };
        resultarr.push(item);
  })
  console.log("show resultarr==", resultarr);
  return(resultarr);

}


