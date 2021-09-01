import API_ADDRESS from "../../../server/apiaddress";
export const setSourceBrowser = (param) => async (dispatch, res) => {
  console.log("param in sourcebrowser==", param);
  
 /* if (param.shortnm==="")
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
else{*/

 // var shortnm=param.shortnm;
  
  let qurl = "";
  
//if (param.value!=="")   ///////program Data Usage
//{
//qurl = `${SERVERADDR}/readFile/${param.value}`; SA_FIX//


qurl = `${SERVERADDR}/SourceMember/${DBNAME}/${encodeURIComponent(param.value)}`;
console.log('check query',qurl)

  await fetch(qurl)
    .then((res) => res.json())
    .then(async (json) => {
       
      console.log('source member result', json)
      
      /*in case of SPHMDNA lib, hardocde srcfile and srcdir to PGMSOURCE and MDNA resp. */
      console.log('what is dbname',DBNAME)
      var qurl1;
      if(DBNAME.includes("mdna")){
        
        qurl1 = `${SERVERADDR}/member/${encodeURIComponent(param.value)}/PGMSOURCE/MDNA`
      }
      else if(DBNAME.includes("spha")){
      //  qurl1 = `${SERVERADDR}/member/${param.value}/${json.response.results[0].SRCFILE}/${json.response.results[0].SRCDIR}`
      qurl1 = `${SERVERADDR}/member/${param.value}/${json.response.results[0].SRCFILE}/SPHAPP`
      }
      else{
        qurl1 = `${SERVERADDR}/readFile/${param.value}`; //for custd and mvxd
      }
      
       console.log('kya bana query',qurl1)

       await fetch(qurl1)
       .then((res) => res.json())
       .then(async (json1) => {
         console.log('show json only',json1)
         //var qurl2 = `${SERVERADDR}/SourceBrowser/${DBNAME}/${encodeURIComponent(param.value)}/${encodeURIComponent(shortnm)}`;
         var qurl2 = `${SERVERADDR}/SourceBrowser/${DBNAME}/${encodeURIComponent(param.value)}`;
         await fetch(qurl2)
       .then((res) => res.json())
       .then(async (json2) => {
        
        console.log('show json2 only',json2)

        if(DBNAME.includes("spha") || DBNAME.includes('mdna')){

      dispatch({
        type: "FETCH_SOURCEBROWSER",
        payload : extractfields1(json1.response.data),
        PrcCallsExplosionData:json2.response.PrcCallsExplosionData,
        //rBrowser:json2.response.RBrowser,
        pgmID:json2.response.pgmID,
        program:param,
        //shortNm:param.shortnm
      });
    }
    else{
      dispatch({
        type: "FETCH_SOURCEBROWSER",
        payload : extractfields(json1.response.data),
        PrcCallsExplosionData:json2.response.PrcCallsExplosionData,
        //rBrowser:json2.response.RBrowser,
        pgmID:json2.response.pgmID,
        program:param,
        //shortNm:param.shortnm
      });
    }
      });
    });
  });
//}////////ends for file data usage case

/*else{   //Files data usage
  var qurl1 = `${SERVERADDR}/SourceBrowser/${DBNAME}/${shortnm}`;
  await fetch(qurl1)
  .then((res) => res.json())
  .then(async (json1) => {
   console.log("show SourceBrowser data===", json1);
 dispatch({
   type: "FETCH_SOURCEBROWSER",
   payload : [],
   PrcCallsExplosionData:[],
   //rBrowser:json1.result.RBrowser,
   rBrowser:json1.response,
   pgmID:"",
   program:param,
   shortNm:param.shortnm
 });
});
}*/
//}
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
function extractfields1(arr1){
  //009000030414     C                   eval      *inlr = *on                                  '
  var resultarr=[];
  var item={};
  console.log(arr1[0]);
  arr1.map((elem,i)=>{
       if(i == 0)
       console.log('elem',elem)
      // var xx = elem.substr(6,2)+"/"+elem.substr(8,2)+"/"+elem.substr(10,2);
        item = {
          LineNum : elem.SRCSEQ,
        Stn:      elem.SRCDTA.substr(5),
        StnDate:  (elem.SRCDAT==="0")?" ":elem.SRCDAT.substr(4,2)+"/"+elem.SRCDAT.substr(2,2)+"/"+elem.SRCDAT.substr(0,2)
        };
        resultarr.push(item);
  })
  console.log("show resultarr==", resultarr);
  return(resultarr);

}


