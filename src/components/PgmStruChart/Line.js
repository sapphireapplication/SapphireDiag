let xM = 5;
let arr = [];
let gDir = 0;
let glbHorizCoords = []; //for box cut case
let globalYLev=[];


function updateCordinates(outLineObjArr, oldIndex, newIndex,parLevel)
{
    let j;
    var gap;
    var temp = outLineObjArr[newIndex];
    var temp1 = outLineObjArr[oldIndex];
    /* only x1 and y2 will be changed */
   
    temp.count = temp1.count;
    for (j = 0; j < temp1.count; j++) {

        temp.y1[j] = temp1.y1[j];
        temp.x3[j] = temp1.x3[j];
        //console.log('shilpi temp1.x3[j] ',temp1.x3[j]);
        temp.x4[j] = temp1.x4[j];
        temp.y4[j] = temp1.y4[j];
        if (newIndex > oldIndex) {
            gap = newIndex - oldIndex;
            /* TBD- might have to check count val in future...currently using index 0 */
            temp.x1[j] = temp1.x1[j] + 10 * gap;
            temp.x2[j] = temp.x1[j];
            temp.y2[j] = temp1.y2[j] - 10 * gap;
            temp.y3[j] = temp.y2[j];
        }
        else {
            gap = oldIndex - newIndex;
            temp.x1[j] = temp1.x1[j] - 10* gap;
            temp.x2[j] = temp.x1[j];
            temp.y2[j] = temp1.y2[j] - 10 * gap;
            temp.y3[j] = temp.y2[j];
        }
        //remove temp1 y2 from overlap y2 array
        globalYLev[parLevel].splice(globalYLev[parLevel].findIndex(v=> v.y2 ==temp1.y2[j]  &&
                v.x2 == temp1.x2[j] && v.x3==temp1.x3[j]), 1);


        //check overlap in y2
        var check = checkOverlapY2(temp.y2[j],temp.x2[j],temp.x3[j],parLevel);
       // console.log('SHILPI CHECK y2 OVERLAP',check);
       if(check == 1){
        //console.log('SHILPI overlap detected');
        //again check overlap
        check = checkOverlapY2(temp.y2[j]-10,temp.x2[j],temp.x3[j],parLevel); 
        if(check == 1){
          //  console.log('SHILPI again overlap detected');
            temp.y2[j] = temp.y2[j] + 5;
        }
        else{
            temp.y2[j] = temp.y2[j] - 10; 
        }
       }
       temp.y3[j] = temp.y2[j];

    addEntryInglobalYLev(parLevel,temp.y2[j],temp.x2[j],temp.x3[j]);

        if(temp1.flag){
            //console.log('shilpi flag set temp1 j',temp1,j,temp1.x5[0],temp.x5[0]);
            temp.flag = temp1.flag;
            temp.x5[j] = temp1.x5[j];
            temp.y5[j] = temp1.y5[j];
            temp.x6[j] = temp1.x6[j];
            temp.y6[j] = temp1.y6[j];
        }
        temp.chldobj[j] = new Object();
        temp.chldobj[j] = temp1.chldobj[j];
    }    
}

function populateCords(outLineObj,parXLFTP,parYLFTP,chldObj,elementWidth,elementHeight,elementVGap,minBox)
{
    let  x1=[],x2=[], x3=[], x4=[],y1=[],y2=[],y3=[],y4=[], chldobjArr =[];
    let x5=[],x6=[],y5=[],y6=[];
    let tempObj;
    x1[0] = parXLFTP + elementWidth/2;
    y1[0] = parYLFTP + elementHeight;
    x2[0] = x1[0];
    /* always check if y cord is free from global spatial co-ords */
    //hack for minBox case-  resource---->job
    //console.log('shilpi populateCords globalYarray',globalYLev[])
    y2[0] = y1[0]+elementVGap/2;  
    x3[0] = 0; //TODO
    y3[0] = y2[0];
    x4[0] = x3[0];
    y4[0] = chldObj.chldYLFTP;
    if(minBox.ID != undefined)
    {
        console.log('SHILPI NOT COME');
       //console.log('SHILPI MIN BOX ID DEFINED');
       /*if(DiagramType == 'D'){
        y2[0] = 426; //allocate from global spatial array
        y3[0] = 426;
    }*/

        x3[0]= minBox.xlftp + 600+10;
        tempObj = glbHorizCoords.find(tempObj => tempObj.xlftp == x3[0]);
   //To Do- check if we can still use this x 
   
   while (tempObj!= undefined){
     x3[0] = x3[0]+10;
     tempObj = glbHorizCoords.find(tempObj => tempObj.xlftp == x3[0]);
       //select next 
   }
         /* insert x val in glbHorizCoords */
   glbHorizCoords.push({
       "xlftp":x3[0],
       "ymin": y3[0],
       "ymax":y4[0]      
})
        //To Do- check in golbal spatial co-ord if x3 is free
        if(chldObj.chldXLFTP<x3){
            gDir = 2
            }
         if(chldObj.chldXLFTP>x3){
             gDir = 1;
         }   
        x4[0] = x3[0];
        y4[0] = chldObj.chldYLFTP - elementVGap/2;
        x5[0] = 0;
        y5[0] = y4[0];
        x6[0] = x5[0];
        y6[0] = chldObj.chldYLFTP;
    }
    chldobjArr[0] = chldObj;
    outLineObj["x1"] = x1;
    outLineObj["y1"] = y1;
    outLineObj["x2"] = x2;
    outLineObj["y2"] = y2;
    outLineObj["x3"] = x3;
    outLineObj["y3"] = y3;
    outLineObj["x4"] = x3;
    outLineObj["y4"] = y4;
    outLineObj["flag"] = 0;
    
    if(minBox.ID != undefined)
    {
        outLineObj["x5"] = x5;
        outLineObj["y5"] = y5;
        outLineObj["x6"] = x6;
        outLineObj["y6"] = y6;
        outLineObj["flag"] = 1;
    }
    outLineObj["count"] = 1;
    outLineObj["chldobj"] = chldobjArr;
}

function calTerminatingCord(chldObj, chldDgeIdArr, DiagrammedEntities,index,tempOutLineObjArr,tempIndex)
{
    console.log('SHILPI in calTerminatingCord')
    let chldCordObj = null;
    let tempInfo, tempInfoArr = [];
    let parinfoArr, parinfo;
    let xC = 5; // mid point
    let xCal = chldObj.chldXLFTP + 600/2;
    //console.log('shilpi xCal',xCal);
    let arr = []; //to hold xC
    let len, flag = 0, gap = 0, resultObj,tempParObj;
    let tempOutLineObj = null;
    let i = 0,j = 0,m,val;
    let dgeID;
    let count;
    resultObj = new Object();
    /* search chldDgeId in chldDgeIdArr */
    chldCordObj = chldDgeIdArr.find(chldCordObj => chldCordObj.chldDgeid == chldObj.chldId);
    if(chldCordObj == null)
    {
        console.log('chldcordobj not found');

        /* create new object */
        chldCordObj = new Object();
        /* check if child is left or right child or just below parent */
        if(chldObj.chldXLFTP > DiagrammedEntities[index].XLFTP) //Right child
        {
            console.log('Shilpi term case RC, gdir',gDir);
            if(gDir ==2){
             //   console.log('Shilpi gdir LC');
                xC = xC + 1;
                xCal = xCal + 10;
            }
            else{
            xC = xC -1;
            xCal = xCal - 10;
            }                        
        }
        else if(chldObj.chldXLFTP < DiagrammedEntities[index].XLFTP) //Left child
        {
            if(gDir ==1){
               // console.log('Shilpi gdir RC');
                xC = xC - 1;
                xCal = xCal - 10;
            }
            else{
            xC = xC + 1;
            xCal = xCal + 10;
            }
        }
        else
        {
           // console.log('Shilpi just below parent case gDir',gDir);
            // xC will remain 5
            //for box cut case check flag gDir--- 1 means RChld and 2 LChld
            if(gDir == 1){
                xC = xC -1;
                xCal = xCal - 10;
            }
            if(gDir ==2){
                xC = xC + 1;
                xCal = xCal + 10;
            }
            
        }
        tempInfo = new Object();
        tempInfo["parxlftp"] =  DiagrammedEntities[index].XLFTP;
        tempInfo["parlev"] = DiagrammedEntities[index].Level;
        tempInfo["xchld"] = xC;
        tempInfo["pardgeid"] = DiagrammedEntities[index].PgmName;
        tempInfo["parindex"] = tempIndex;
        tempInfo["gDir"] = gDir;

        tempInfoArr[0] = tempInfo;
        arr[xC] = 1;
        chldCordObj["cordarr"] = arr;
        chldCordObj["chldDgeid"] = chldObj.chldId;

        chldCordObj["count"] = 1;
        chldCordObj["parinfo"] = tempInfoArr; //holds associated parents info
        len = chldDgeIdArr.length;
        chldDgeIdArr[len] = chldCordObj;
        resultObj["xC"] = xCal;
        resultObj["flag"] = flag;
        resultObj["gap"] = gap;
        flag = 0;
        //gDir = 0;
        return resultObj;
    }
    else
    {
        if(chldObj.chldXLFTP > DiagrammedEntities[index].XLFTP) //Right child
        {

            //console.log('shilpi right chld');
            if(gDir ==2){
              //  console.log('Shilpi gdir LC');
                xC = xC + 1;
                xCal = xCal + 10;
                //gDir = 0;
            }
            else{
            xC = xC -1;
            xCal = xCal - 10;
            }

        }
        else if(chldObj.chldXLFTP < DiagrammedEntities[index].XLFTP) //Left child
        {
            if(gDir ==1){
                //console.log('Shilpi gdir RC');
                xC = xC - 1;
                xCal = xCal - 10;

            }
            else{
                //console.log('Shilpi gdir LC ****');
            xC = xC + 1;
            xCal = xCal + 10;
            }
        }
        else if(chldObj.chldXLFTP == DiagrammedEntities[index].XLFTP && chldObj.chldLev-DiagrammedEntities[index].Level>1 )
        {
            //console.log('shilpi TERM CASE chld');
            xC = xC -1;
            xCal = xCal - 10;
        }
        else
        {
            // xC will remain 5 -- mid point of entity
        }
        if(chldCordObj.cordarr[xC] == undefined)
        {
            //console.log('should come here',xC);
            chldCordObj.cordarr[xC] = 1;
            tempInfo = new Object();
            tempInfo["parxlftp"] =  DiagrammedEntities[index].XLFTP;
            tempInfo["parlev"] = DiagrammedEntities[index].Level;
            tempInfo["xchld"] = xC;
            tempInfo["pardgeid"] = DiagrammedEntities[index].PgmName;
            tempInfo["parindex"] = tempIndex;
            tempInfo["gDir"] = gDir;
            count = chldCordObj.count;
            parinfoArr = chldCordObj.parinfo;
            parinfoArr[count] = tempInfo;
            chldCordObj.count++;
            resultObj["xC"] = xCal;
            resultObj["flag"] = flag;
            resultObj["gap"] = gap;
            flag = 0;
            return resultObj;
        }
        else
        {
            //console.log('mail logic xC occupied');
            /* main logic */
            /* fetch parent info already present at xC */
            let x,y,xL=-1;
            parinfoArr = chldCordObj.parinfo;
            //console.log('SA_DEBUG b4 parinfoarr' + parinfoArr[0].parindex);
            parinfo = parinfoArr.find(parinfo => parinfo.xchld == xC);
            //console.log('shilpi parinfo',parinfo);
            //console.log('Shilpi gDir',gDir);
            if(gDir == 2 && parinfo.gDir == 2){
                /* Check if both parents at same level */
                if (parinfo.parlev == DiagrammedEntities[index].Level) {
                    /* check x distance */
                    if (DiagrammedEntities[index].XLFTP > parinfo.parxlftp) {
                        //console.log('shilpi should come here ***');
                        xC = xC + 1; /* TODO assuming xC+1 is free */
                        xCal = xCal + 10;
                        gap++;
                        flag = 1;
                    }
                }
                else {
                    /* parents at different level - place new onc at xC+1*/
                    j = 0;
                    while (chldCordObj.cordarr[xC] != undefined && xC <= 10) {
                        xC = xC + 1;
                        j++;
                    }
                    if (xC == 12) {
                       // console.log('SA_DEBUG REACHED EXTREME END');
                        xC = xC - 1;
                        j--;
                    }
                    xCal = xCal + 10 * j;
                    //console.log('shilpi j',j);
                    gap = j;
                    flag = 1;
                }

            }

            /* right child */
            else if(DiagrammedEntities[index].XLFTP < chldObj.chldXLFTP && parinfo.parxlftp < chldObj.chldXLFTP)
            {
                /* Check if both parents at same level */
               // if(DiagrammedEntities[index].XLFTP > parinfo.parxlftp)
               if(parinfo.parlev == DiagrammedEntities[index].Level)
                { 
                    /* xlftp of new parent is greater than parent already present on xC*/
                   if(DiagrammedEntities[index].XLFTP > parinfo.parxlftp)
                   {
                        /* place new parent at xC and shift others to left */
                        for(x=xC;x>=0;x--)
                        {
                            if(chldCordObj.cordarr[x]!=undefined)
                            {
                                xL = x;
                            }
                            else
                            {
                                break;
                            }
                        }
                        if(x!=-1)
                        {
                            //console.log('SA_DEBUG NEW CODE HIT');
                            
                            //console.log('SA_DEBUG xL = '+xL);
                            for(x=xL; x<=xC;x++)
                            {
                              //  console.log('SA_DEBUG in loop x=' + x);
                                /* fetch parent with xC = x */
                                //parinfo = parinfoArr.find(parinfo => parinfo.xchld == xC);
                                tempParObj = parinfoArr.find(tempParObj => tempParObj.xchld == x);
                                //console.log('SA_DEBUG tempParOBJ' + tempParObj);
                                //console.log('SA_DEBUG***** tempParObj ' + tempParObj.parindex);
                                m = tempParObj.parindex;
                                tempOutLineObj = tempOutLineObjArr[m];
                                /* get exact value corresponding to xC*/
                                val = xCal - (xC-x)*10;

                                for(i = 0; i<tempOutLineObj.count; i++ )
                                {
                                    
                                    if(tempOutLineObj.x3[i] == val)
                                    {
                                        console.log('SA_DEBUG match found');
                                        /* decrease x and increase y*/
                                        tempOutLineObj.x3[i] = tempOutLineObj.x3[i] -10;
                                        tempOutLineObj.x4[i] = tempOutLineObj.x3[i];
                                        tempOutLineObj.y2[i] = tempOutLineObj.y2[i] +10;
                                        tempOutLineObj.y3[i] = tempOutLineObj.y2[i];
                                    }
                                }
                            }
                            chldCordObj.cordarr[xL-1] = 1;
                            tempInfo = new Object();
                            tempInfo["parxlftp"] = DiagrammedEntities[index].XLFTP;
                            tempInfo["parlev"] = DiagrammedEntities[index].Level;
                            tempInfo["xchld"] = xC;
                            tempInfo["pardgeid"] = DiagrammedEntities[index].PgmName;
                            tempInfo["index"] = tempIndex;
                            tempInfo["gDir"] = gDir;
                            count = chldCordObj.count;
                            parinfoArr[count] = tempInfo;
                            chldCordObj.count++;
                            resultObj["xC"] = xCal;
                            resultObj["flag"] = 0;
                            resultObj["gap"] = 0;
                            return resultObj;             
                        }
                        else
                        {
                           // console.log('SA_DEBUG ERROR REACHED EXTREME LEFT');
                        }
                   }
                   else
                   {
                       //console.log('SA_DEBUG *** is this case possible');
                   }
                }
                else
                {
                     /* parents at different level - place new one at xC-1*/
                        j=0;
                        while(chldCordObj.cordarr[xC]!=undefined && xC>=0)
                        {
                            xC = xC - 1;
                            j++;
                        }
                       // console.log('Shilpi xC and j',xC,j);
                        if(xC < 0)
                        {
                         //   console.log('SA_DEBUG REACHED EXTREME END');
                            xC = xC+1;
                            j--;
                        }
                        xCal = xCal - (10*j);
                }
            }
            /* left child */
            else if(DiagrammedEntities[index].XLFTP > chldObj.chldXLFTP && parinfo.parxlftp > chldObj.chldXLFTP)
            {
                 /* Check if both parents at same level */
                 if(parinfo.parlev == DiagrammedEntities[index].Level)
                 {
                    /* check x distance */
                    if(DiagrammedEntities[index].XLFTP > parinfo.parxlftp)
                    {
                     //   console.log('shilpi should come here ***');
                        xC = xC + 1; /* TODO assuming xC+1 is free */
                        xCal = xCal + 10;
                        gap++;
                        flag = 1;
                    }
                 }
                 else
                 {
                     /* parents at different level - place new onc at xC+1*/
                        j=0;
                        while(chldCordObj.cordarr[xC]!=undefined && xC<=10)
                        {
                            xC = xC +1;
                            j++;
                        }
                        if(xC == 12)
                        {
                           // console.log('SA_DEBUG REACHED EXTREME END');
                            xC = xC-1;
                            j--;
                        }
                        xCal = xCal + 10*j;
                        //gap++;
                        //flag = 1;
                 }
            }
            /* save new info in chldCordObj*/       
            chldCordObj.cordarr[xC] = 1;
            tempInfo = new Object();
            tempInfo["parxlftp"] =  DiagrammedEntities[index].XLFTP;
            tempInfo["parlev"] = DiagrammedEntities[index].Level;
            tempInfo["xchld"] = xC;
            tempInfo["pardgeid"] = DiagrammedEntities[index].PgmName;
            tempInfo["parindex"] = tempIndex;
            tempInfo["gDir"] = gDir; 
            count = chldCordObj.count;
            parinfoArr = chldCordObj.parinfo;
            parinfoArr[count] = tempInfo;
            chldCordObj.count++;
            resultObj["xC"] = xCal;
            resultObj["flag"] = flag;
            resultObj["gap"] = gap;
            flag = 0;
            return resultObj;
        }
    }
}
function getDgeID(DiagrammedEntities,parEntID)
{
    let i;
    for(i = 0; i < DiagrammedEntities.length; i++)
    {
        if(DiagrammedEntities[i].EntID == parEntID)
        {
            return DiagrammedEntities[i].DgeID;
        }
    }
}

function connectParChld(xP,parXLFTP,parYLFTP,chldObj,outLineObjArr,elementWidth, elementHeight, elementVGap,DiagrammedEntities,i,chldDgeIdArr,tempOutLineObjArr,m,parLevel)
{
    
    console.log('In connectParChld m',m,chldObj);
    let outLineObj,xC,result;
    outLineObj = new Object();
    let minBox={};
     /* check if line box cut case  */
     console.log('SHILPI B4 IF',chldObj.chldLev,parLevel,chldObj);
    if((chldObj.chldLev-parLevel)>1)
    { 
        console.log('SHILPI BOX cut');
        minBox = findBox(DiagrammedEntities,chldObj,parYLFTP) ; 
        console.log('SHILPI minBox',minBox)  
    }

    
    populateCords(outLineObj, parXLFTP, parYLFTP, chldObj,elementWidth,elementHeight,elementVGap,minBox);
    //console.log('shilpi after  populateCords globalYarray',globalYLev[parLevel]);
    //console.log('SHILPI in populate' +outLineObj.x1[0] );
    //console.log('shilpi xP and xM',xP,xM);

    if(xP > xM)
    {
        outLineObj.x1[0] = outLineObj.x1[0] + (xP-xM)*10;
        outLineObj.x2[0] = outLineObj.x1[0];
        outLineObj.y2[0] = outLineObj.y2[0] - (xP-xM)*10;         
        outLineObj.y3[0] = outLineObj.y2[0];
    }
    else if(xP < xM)
    {
        outLineObj.x1[0] = outLineObj.x1[0] - (xM-xP)*10;
        outLineObj.x2[0] = outLineObj.x1[0];
        outLineObj.y2[0] = outLineObj.y2[0] - (xM-xP)*10; 
        outLineObj.y3[0] = outLineObj.y2[0];
        
    }
    result = calTerminatingCord(chldObj, chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
    xC = result.xC;
    //gDir = 0;
    //console.log('shilpi xC returnrd ' + result.xC );
    console.log('shilpi result of terminating chld cord',result);
    if (result.flag == 1)  // inc y2 by factor of gap
    {
     //   console.log('Shilpi inc y2 gDir',gDir);
        if(gDir){
            outLineObj.y4[0] = outLineObj.y4[0] + 10 * result.gap;
            outLineObj.y5[0] = outLineObj.y4[0]; 
        }
        else{
       // outLineObj.y2[0] = outLineObj.y2[0] + 10 * result.gap;
       // outLineObj.y3[0] = outLineObj.y2[0];
        }
    }
    else if (result.flag == 2) // dec y2 by factor of gap
    {
       // outLineObj.y2[0] = outLineObj.y2[0] - 10 * result.gap;
       // outLineObj.y3[0] = outLineObj.y2[0];
    }
    if(minBox.ID!=undefined)
    {
        outLineObj.x5[0] = xC;
        outLineObj.x6[0] = xC;
       // console.log('FINAL CORD',outLineObj.x1[0],outLineObj.y1[0],outLineObj.x2[0],outLineObj.y2[0],outLineObj.x3[0],outLineObj.y3[0],outLineObj.x4[0],outLineObj.y4[0],
       // outLineObj.x5[0],outLineObj.y5[0],outLineObj.x6[0],outLineObj.y6[0]);
        //console.log('shilpi arr',arr);
    }
    else{
    outLineObj.y3[0] = outLineObj.y2[0];
    outLineObj.x3[0] = xC;
    outLineObj.x4[0] = xC;
    }
    //console.log('shilpi y2 x2 x3',outLineObj.y2[0],outLineObj.x2[0],outLineObj.x3[0]);
    //console.log('Printing y2 level',globalYLev[parLevel]);
    var check = checkOverlapY2(outLineObj.y2[0],outLineObj.x2[0],outLineObj.x3[0],parLevel);
    //console.log('SHILPI CHECK y2 OVERLAP',check);
    var y2 = outLineObj.y2[0];
    while(check!=0){
        if(xP == xM){
            y2 = y2+10;
        }
        else{
        y2 = y2-10;
        }
        check = checkOverlapY2(y2,outLineObj.x2[0],outLineObj.x3[0],parLevel);
    }
    console.log('shilpi final y2',y2);
    outLineObj.y2[0] = y2;

    /*if(check == 1){
        console.log('SHILPI overlap detected');
        //again check overlap
        check = checkOverlapY2(outLineObj.y2[0]-10,outLineObj.x2[0],outLineObj.x3[0],parLevel); 
        if(check == 1){
            console.log('SHILPI again overlap detected');
            outLineObj.y2[0] = outLineObj.y2[0] - 30;
        }
        else{
            outLineObj.y2[0] = outLineObj.y2[0] - 10; 
        }
       }*/
       outLineObj.y3[0] = outLineObj.y2[0];
   
    //addEntryInglobalYLev(parLevel,outLineObj.y2[0],outLineObj.x2[0],outLineObj.x3[0]);
    if(minBox.ID!=undefined){
        //TO Do
        check = checkOverlapY2(outLineObj.y2[0],outLineObj.x2[0],outLineObj.x3[0],parLevel);
    }

    
    outLineObjArr[xP] = outLineObj;
   
//    console.log('Shilpi printing calc cord',outLineObj.x1[0],outLineObj.y1[0],outLineObj.x2[0],outLineObj.y2[0],outLineObj.x3[0],outLineObj.y3[0],outLineObj.x4[0],outLineObj.y4[0]);

  //  console.log('SHILPI in connectParChld' +outLineObjArr[xP].x1[0] );
}
function findBox(DiagrammedEntities,chldObj,parYLFTP)
{
    let box = [];
    let tempObj;
    let minBox={};
    /* find boxes that have xlftp same as child's x and y > par's y and < chld's y */
   DiagrammedEntities.forEach(function(el) {
       if(el.XLFTP == chldObj.chldXLFTP && (el.YLFTP> parYLFTP &&el.YLFTP < chldObj.chldYLFTP ))
       {
           tempObj = box.find(tempObj => tempObj.ID == el.PgmName);
           if(tempObj == undefined){
           box.push({
            "xlftp":el.XLFTP,
            "ylftp":el.YLFTP,
            "lev":el.Level,
            "ID":el.PgmName
           });}
       }
       el.chldInfoArray.forEach(function(s) {
         if (s.chldXLFTP == chldObj.chldXLFTP && (s.chldYLFTP>parYLFTP && s.chldYLFTP < chldObj.chldYLFTP )){
           tempObj = box.find(tempObj => tempObj.ID == s.chldId); 
           if(tempObj == undefined){
           box.push({
               "xlftp":s.chldXLFTP,
               "ylftp":s.chldYLFTP,
               "lev":s.chldLev,
               "ID":s.chldId
              });}
         }
       });
     })
     //console.log('SHILPI BOX',box);
     if(box.length > 0){
    minBox = box.reduce(function(res, obj) {
       return (obj.ylftp < res.ylftp) ? obj : res;
   });}
   let x = minBox.xlftp + 600+10;
   tempObj = glbHorizCoords.find(tempObj => tempObj.xlftp == x);
   //To Do- check if we can still use this x 
   //console.log('Shilpi tempObj',tempObj);
   while (tempObj!= undefined){
     x = x+10;
     tempObj = glbHorizCoords.find(tempObj => tempObj.xlftp == x);
       //select next 
   }
  
   /* again check if any box overlaps with selected box */
   let check=0;
   for(var i=0;i < DiagrammedEntities.length;i++){
       let ent = DiagrammedEntities[i];
       if(ent.XLFTP <= x && ent.XLFTP+600 >x){
        minBox.xlftp = ent.XLFTP;
        minBox.ylftp=ent.YLFTP;
        minBox.lev=ent.Level;
        minBox.ID=ent.PgmName;
        return minBox;
       }
       for(var j=0; j< ent.chldInfoArray.length;j++){
           if(ent.chldInfoArray[j].chldXLFTP <= x && ent.chldInfoArray[j].chldXLFTP +600 >x){
            minBox.xlftp = ent.chldInfoArray[j].chldXLFTP;
            minBox.ylftp=ent.chldInfoArray[j].chldYLFTP;
            minBox.lev=ent.chldInfoArray[j].chldLev;
            minBox.ID=ent.chldInfoArray[j].chldId;
            return minBox;
           }
   }
}
   /*DiagrammedEntities.some(function(el) {
    if(el.XLFTP <= x && el.XLFTP+150 >x)
    {
        
         minBox.xlftp = el.XLFTP;
         minBox.ylftp=el.YLFTP;
         minBox.lev=el.Level;
         minBox.ID=el.PgmName;
         return true;
        
    }
    el.chldInfoArray.some(function(s) {
      if (s.chldXLFTP <=x && s.chldXLFTP+150>x){
        minBox.xlftp = s.XLFTP;
        minBox.ylftp=s.YLFTP;
        minBox.lev=s.Level;
        minBox.ID=s.PgmName;
        check = 1;
        return true;
        
      }
      else{
          return false;
      }
    });
    if(check == 1){
        return true;}
        else{
            return false;
        }
  })*/



   return minBox;
}
export function positionLines  (DiagrammedEntities, elementWidth, elementHeight, elementVGap)                    
{
    console.log('SHILPI function input',DiagrammedEntities)
    let connectingLines;
    let xPar, yPar, xChld, yChld;
    let  xL, xR, xP;
    let parEntId, parDgeId, parXLFTP, parYLFTP,parLevel;
    let parRelDgeId;
    let chldId, chldDgeId, chldLev, k, chldXLFTP;
    let chldObj, chldInfoArray = [];
    let outLineObjArr = [], tempOutLineObjArr = [];
    let connectingLinesArray = [];
    let cnt, m = 0,x=0, tempObj, numChild, result;
    //let x1 = [], x2 = [], x3 = [], x4 = [], y1 = [], y2 = [], y3 = [], y4 = [],x5=[],y5=[],x6=[],y6=[], chldobjArr = [];
    // Structures for x3 cordinate calc. 
    let chldDgeIdArr = [];
    let xC;
    let i,j;
    let minBox = {};
    gDir = 0;
    glbHorizCoords=[];
    globalYLev=[];

    //return new Promise(async (resolve) => {
        /* HARDCODING should be removed after testing ---start */
     //sort DiagrammedEntities Level Wise
     DiagrammedEntities.sort(function (a, b) {
        return a.XLFTP - b.XLFTP;
     }) 
     DiagrammedEntities.sort(function (a, b) {
        return a.Level - b.Level;
     })
//     console.log('Shilpi After sort DiagrammedEntities ',DiagrammedEntities);
     /*DiagrammedEntities.sort(function (a, b) {
        return a.XLFTP - b.XLFTP;
     })*/
        
        /* loop for each entity in DgmObj */
        for ( i = 0; i <DiagrammedEntities.length ; i++) {
            arr = []; /* array to hold outgoing x co-ordinates from box - arr[0] -->xlftp arr[1]-->xlftp + gap where gap = 10 arr[10] --->xlftp +width*/
            /* fetch child nodes of this entity and keep in chldObj */
            outLineObjArr = [];
                parEntId = DiagrammedEntities[i].PgmName;
  //              console.log('SHILPI ****** parENTID, i ' + parEntId + i);
                parXLFTP = DiagrammedEntities[i].XLFTP;
                parYLFTP = DiagrammedEntities[i].YLFTP;
                parLevel = DiagrammedEntities[i].Level;
                chldInfoArray = DiagrammedEntities[i].chldInfoArray;
                /*sort child level wise */
                 chldInfoArray.sort(function (a, b) {
                    return a.chldXLFTP - b.chldXLFTP;
                })
                chldInfoArray.sort(function (a, b) {
                    return a.chldLev - b.chldLev;
                })
                console.log('SHILPI after sort chldifo',chldInfoArray)
              

            //if(i == 5)
              // chldInfoArray.length = 5;
              //var temp;
                for (j = 0; j < chldInfoArray.length; j++) {
                   var temp = chldInfoArray[j];
                    console.log('child id and lev ', temp.chldId + ' ' + temp.chldLev);
                }
                /* Now loop of each child in chldInfoArray and calculate xP */
                //xP = 5; //mid point of arr
                xL = -1;
                xR = -1;
                //arr[xP] = 0;
              
                for (j = 0; j < chldInfoArray.length; j++) {
                    //console.log('loop for j =',j);
                    xP = xM;
                    gDir = 0;
                    if (arr[xP] == undefined) /* not occupied */ {
                        console.log('SHILPI in if case',chldInfoArray[j])
                        connectParChld(xP, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,parLevel);
                        if (parXLFTP < chldInfoArray[j].chldXLFTP) // Right Child 
                        {
                            xR = xP;
                        }
                        if (parXLFTP > chldInfoArray[j].chldXLFTP) //Left Child 
                        {
                            xL = xP;
                        }
                        arr[xP] = 1;  // fill 1 in arr for occupied positions 
                    }
                    else {
                        /* xP already occupied so calculate new co-ordinate*/ 
                        /* main logic starts here */
                        /* check if new chld node is left chld or right chld */
                        chldXLFTP = chldInfoArray[j].chldXLFTP;
                        if (parXLFTP < chldXLFTP)  /* child at RHS */ {
                            console.log('child is RIGHT');
                            let done = 0;
                            let index = 0;
                            let l;
                            console.log('SA_DEBUG checking xR'+xR);
                            if (xR != -1) {
                                
                                for(k = xM; k <= xR; k++) {

                                    tempObj = outLineObjArr[k];
                                    console.log('SA_DEBUG b4 loop tempObj count' + tempObj.count);
                                    for (x = 0; x < tempObj.count; x++) {
                                        if(tempObj.chldobj[x].chldXLFTP > parXLFTP){
                                            if(chldXLFTP > tempObj.chldobj[x].chldXLFTP){
                                                index =k;
                                                l = x;
                                            }
                                            else if(chldXLFTP < tempObj.chldobj[x].chldXLFTP){
                                                console.log('shilpi break from last');
                                                index =k;
                                                l=x;
                                                done = 1;
                                                break;
                                            }
                                            //TODO gp relation xlftp same but different level
                                            else{
                                                /* box cut case */
                                                index =k;
                                                l=x;
                                                done=1;
                                            }
                                        }
                                    }
                                    if(done ==1){
                                        break;
                                    }
                                }
                              //  console.log('index  and l', index,l);
                                /*if(l == undefined){
                                    console.log('shilpi new case');
                                    //place at next free pos.
                                    xP = xR +1;
                                    while(arr[xP]!= undefined)
                                    {
                                    xP = xP+1;

                                    }
                                    xR = xP;
                                    console.log('shilpi new xR',xR);
                                    connectParChld(xR, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,
                                        parLevel);
                                    arr[xR] = 1;    
                                    }*/
                                  //FIX
                                  tempObj = outLineObjArr[index];
                                 if(chldXLFTP > tempObj.chldobj[l].chldXLFTP){
                                    /* Same level check */
                                    if (chldInfoArray[j].chldLev == tempObj.chldobj[l].chldLev) {
                                       // console.log('SHILPI should come here Right chld and same level');
                                        cnt = tempObj.count;
                                        /*update xR*/
                                        // xR = xP;
                                        tempObj.x1[cnt] = tempObj.x1[cnt - 1];
                                        tempObj.y1[cnt] = tempObj.y1[cnt - 1];
                                        tempObj.x2[cnt] = tempObj.x2[cnt - 1];
                                        tempObj.y2[cnt] = tempObj.y2[cnt - 1];
                                        result = calTerminatingCord(chldInfoArray[j], chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
                                        console.log('shilpi result',result);
                                        tempObj.x3[cnt] = result.xC;
                                        /*if (result.flag == 1)  // inc y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] + 10 * result.gap;
                                        }
                                        else if (result.flag == 2) // dec y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] - 10 * result.gap;
                                        }*/
                                        tempObj.y3[cnt] = tempObj.y2[cnt];
                                        tempObj.x4[cnt] = tempObj.x3[cnt];
                                        tempObj.y4[cnt] = chldInfoArray[j].chldYLFTP;
                                        tempObj.chldobj[cnt] = chldInfoArray[j];
                                        tempObj.count++;
                                     }

                                    
                                    else{
                                        //console.log('SA_DEBUG This child is right most');
                                        //check if any left child is at same level as of this one */
                                        found =0;
                                        for (k = xL; k <= xM; k++){
                                            tempObj = outLineObjArr[k];
                                            for (x = 0; x < tempObj.count; x++) {

                                                if (tempObj.chldobj[x].chldXLFTP < parXLFTP) {
                                                    if(tempObj.chldobj[x].chldLev == chldInfoArray[j].chldLev){
                                                        index = k;
                                                        found = 1;
                                                        break;
                                                    }
                                                }
                                            }
                                            if(found ==1){
                                                break;
                                            }
                                        }
                                        if(found == 1){
                                            cnt = tempObj.count;
                                            tempObj = outLineObjArr[index];
                                            tempObj.x1[cnt] = tempObj.x1[cnt - 1];
                                            tempObj.y1[cnt] = tempObj.y1[cnt - 1];
                                            tempObj.x2[cnt] = tempObj.x2[cnt - 1];
                                            tempObj.y2[cnt] = tempObj.y2[cnt - 1];
                                            result = calTerminatingCord(chldInfoArray[j], chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
                                       // console.log('shilpi result',result);
                                            tempObj.x3[cnt] = result.xC;
                                            tempObj.y3[cnt] = tempObj.y2[cnt];
                                            tempObj.x4[cnt] = tempObj.x3[cnt];
                                            tempObj.y4[cnt] = chldInfoArray[j].chldYLFTP;
                                            tempObj.chldobj[cnt] = chldInfoArray[j];
                                            tempObj.count++;
                                        }
                                        else{ 
                                        /* Place new at index+1*/
                                        /* TODO Will there be  any case of index+1 already occupied */
                                        if (arr[index+1] == undefined) {
                                            connectParChld(index+1, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,
                                                parLevel);
                                            /* update xR */
                                            xR = xR+1;
                                            arr[xR] = 1;  // fill 1 in arr for occupied positions 

                                        }
                                    }

                                    }
                                  }
                                  else if(chldXLFTP < tempObj.chldobj[l].chldXLFTP){
                                      /* Place new child at index and shift others to right */
                                     // console.log('SA_DEBUG shifting case there is right chld at current right chld');
                                    /* b4 deciding that index should be given to new child,check if any child is at left at same index*/
                                    if(tempObj.count > 1)
                                    {
                                        var found = 0;
                                        for (k = 0; k < tempObj.count; k++) {
                                            if (tempObj.chldobj[k].chldXLFTP < chldXLFTP) {
                                                found = 1;
                                                break;
                                            }

                                        }
                                        if (found == 1) {
                                            /* place new chld at index+1 */
                                            if (arr[index + 1] == undefined) {
                                                connectParChld(index + 1, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr, tempOutLineObjArr, m,
                                                    parLevel);
                                                /* update xR */
                                                xR = xR + 1;
                                                arr[xR] = 1;  // fill 1 in arr for occupied positions
                                            }
                                            else {
                                                /*shift others to right*/
                                                shiftRight(xR, outLineObjArr, index + 1,chldInfoArray[j],chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP);
                                                xR = xR+1;
                                            }
                                        }
                                   }
                                   else{  
                                    shiftRight(xR, outLineObjArr, index,chldInfoArray[j],chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP);
                                    xR = xR+1;




                                      /*let tempNewObj;
                                    x1 = [], x2 = [], x3 = [], x4 = [], y1 = [], y2 = [], y3 = [], y4 = [], chldobjArr = [];
                                    // Initialise new object created at rightmost free position
                                    outLineObjArr[xR + 1] = new Object();
                                    tempNewObj = outLineObjArr[xR + 1];
                                    tempNewObj["x1"] = x1;
                                    tempNewObj["y1"] = y1;
                                    tempNewObj["x2"] = x2;
                                    tempNewObj["y2"] = y2;
                                    tempNewObj["x3"] = x3;
                                    tempNewObj["y3"] = y3;
                                    tempNewObj["x4"] = x4;
                                    tempNewObj["y4"] = y4;
                                    tempNewObj["count"] = 0;
                                    tempNewObj["chldobj"] = chldobjArr;
                                    tempNewObj["flag"] = 0;

                                    arr[xR + 1] = 1;
                                    // TODO may be require to check xM 
                                    console.log('SHILPI xR' + xR + 'xP' + xP);
                                    for (k = xR; k >= index; k--) {
                                        updateCordinates(outLineObjArr, k, k + 1);
                                    }
                                    //update xR 
                                    xR = xR + 1;
                                    // fill coordinates of new chld just added at index .we will fill only changed values at xP now ...rest will be as it is 
                                    tempLineObj = outLineObjArr[index];
                                    //console.log('check' + tempOutLineObjArr[0].x3[0]);
                                    result = calTerminatingCord(chldInfoArray[j], chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
                                    if (result.flag == 1) {
                                        tempLineObj.y2[0] = tempLineObj.y2[0] + 11 * result.gap;
                                    }
                                    else if (result.flag == 2) {
                                        tempLineObj.y2[0] = tempLineObj.y2[0] - 11 * result.gap;
                                    }
                                    tempLineObj.y3[0] = tempLineObj.y2[0];
                                    tempLineObj.x3[0] = result.xC;
                                    tempLineObj.x4[0] = tempLineObj.x3[0];
                                    tempLineObj.y4[0] = chldInfoArray[j].chldYLFTP;
                                    tempLineObj.chldobj[0] = chldInfoArray[j];*/
                                }
                                  }
                                  else{
                                      //Place new at index+1
                                      /* TODO Will there be  any case of index+1 already occupied */
                                    //  console.log('Shilpi box cut case xR ,xP,index',xR,xP,index);
                                      if(arr[index+1] == undefined) {
                                         gDir = 2;
                                         arr[index+1] = 1
                                  //       let index1 = calIndex(arr,index+1); 
                                    //     let index2 = m+index1-1;
                                      //   console.log('Shilpi index2,index1,m',index2,index1,m,arr);
                                        connectParChld(index+1, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,
                                            parLevel);
                                        /* update xR */
                                        xR = xR+1;
                                        //arr[xR] = 1;  // fill 1 in arr for occupied positions 
                                    }
                                  }
                                }
                                else
                                {
//                                    console.log('SA_DEBUG adding first right child when left childs are present');
                                    tempObj = outLineObjArr[xP];
                                    numChild = tempObj.count;
                                    /* if child present at xP is at different level....add new child at xP+1*/

                                    if (chldInfoArray[j].chldLev == tempObj.chldobj[numChild - 1].chldLev) {
                                        console.log('SA_DEBUG same level case');
                                        cnt = tempObj.count;
                                        /*update xR*/
                                        xR = xP;
                                        tempObj.x1[cnt] = tempObj.x1[cnt - 1];
                                        tempObj.y1[cnt] = tempObj.y1[cnt - 1];
                                        tempObj.x2[cnt] = tempObj.x2[cnt - 1];
                                        tempObj.y2[cnt] = tempObj.y2[cnt - 1];
                                        result = calTerminatingCord(chldInfoArray[j], chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
  //                                      console.log('shilpi result',result);
                                        tempObj.x3[cnt] = result.xC;
                     /*                   if (result.flag == 1)  // inc y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] + 10 * result.gap;
                                        }
                                        else if (result.flag == 2) // dec y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] - 10 * result.gap;
                                        }*/
                                        tempObj.y3[cnt] = tempObj.y2[cnt];
                                        tempObj.x4[cnt] = tempObj.x3[cnt];
                                        tempObj.y4[cnt] = chldInfoArray[j].chldYLFTP;
                                        tempObj.chldobj[cnt] = chldInfoArray[j];
                                        tempObj.count++;
                                }
                                else
                                {
                                    /* place new child at xP+1 */
                                        xP = xP + 1;
                                        if (arr[xP] == undefined) {
                                            arr[xP] = 1;  // fill 1 in arr for occupied positions
                                            connectParChld(xP, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,
                                                parLevel);
                                            /* update xR */
                                            xR = xP;
                                             

                                        }

                                }
                            }
                        }
                        else if (parXLFTP > chldXLFTP) {
                            /* child at LHS */
                            /* fetch number of left child */
                            let done = 0;
                            let l;
                            var index;

                         //   console.log('SA_DEBUG checking xL'+xL);
                            if (xL != -1) {
                                for (k = xL; k <= xM; k++) {

                                    tempObj = outLineObjArr[k];
                                    /* it is possible at left index, some child may not be left(same level case)*/
                           //         console.log('SA_DEBUG b4 loop tempObj count' + tempObj.count);
                                    for (x = 0; x < tempObj.count; x++) {

                                        if (tempObj.chldobj[x].chldXLFTP < parXLFTP) {
                             //               console.log('SA_DEBUG chld at count' + x +'is left chld');
                               //             console.log('SA_DEBUG k = ' +k);
                                                                                        
                                            if (chldXLFTP > tempObj.chldobj[x].chldXLFTP) {
                                     //           console.log('SA_DEBUG in left check '+tempObj.chldobj[x].chldXLFTP );
                                                index = k;
                                                l = x;
                                            }
                                            else if (chldXLFTP < tempObj.chldobj[x].chldXLFTP) {
                                                index = k;
                                                l = x;
                                                done = 1;
                                              //  console.log('***break from first right');
                                                break;
                                            }
                                            else{
                                                //console.log('shilpi GP REL');
                                                index =k;
                                                l=x;
                                                done=1;
                                            }
                                           
                                        }  /* if for lhs check ends*/
                                    }   /* for cnt ends */
                                    if (done == 1) {
                                        break;
                                    }
                                }

                             //   console.log('SA_DEBUG L= index' , l, index);
                              //  console.log('tempobj chldXLFTP' + tempObj.chldobj[l].chldXLFTP);
                                //FIX 
                                tempObj = outLineObjArr[index];
                                if (chldXLFTP > tempObj.chldobj[l].chldXLFTP) {
                                  //  console.log('Shilpi greater tempObj count',tempObj.count);
                                    /* check if  same level */
                                    if (chldInfoArray[j].chldLev == tempObj.chldobj[l].chldLev) {
                                    //    console.log('SHILPI should come here Left chld and same level');
                                        cnt = tempObj.count;
                                        tempObj.x1[cnt] = tempObj.x1[cnt - 1];
                                        tempObj.y1[cnt] = tempObj.y1[cnt - 1];
                                        tempObj.x2[cnt] = tempObj.x2[cnt - 1];
                                        tempObj.y2[cnt] = tempObj.y2[cnt - 1];
                                        result = calTerminatingCord(chldInfoArray[j], chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
                                      //  console.log('shilpi result',result);
                                        tempObj.x3[cnt] = result.xC;
                                        /*if (result.flag == 1)  // inc y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] + 10 * result.gap;
                                        }
                                        else if (result.flag == 2) // dec y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] - 10 * result.gap;
                                        }*/
                                         //insert in globalYCord
                                         addEntryInglobalYLev(parLevel,tempObj.y2[cnt],tempObj.x2[cnt],tempObj.x3[cnt]);
                                        tempObj.y3[cnt] = tempObj.y2[cnt];
                                        tempObj.x4[cnt] = tempObj.x3[cnt];
                                        tempObj.y4[cnt] = chldInfoArray[j].chldYLFTP;
                                        tempObj.chldobj[cnt] = chldInfoArray[j];
                                        tempObj.count++;
                                    }
                                    else if(tempObj.count > 1)
                                    {
                                        //tempObj = outLineObjArr[index];
                                        var found = 0;
                                        /* check if there are any right child at same index */
                                        for (k = 0; k < tempObj.count; k++) {

                                            if (tempObj.chldobj[k].chldXLFTP > chldXLFTP) {
                                                found = 1;
                                                break;
                                            }
                                        }
                                        if(found == 1){
                                           // console.log('Shilpi final ');
                                                /* place new chld at index-1 */
                                                //TODO- make func for this and case below- //chld x < old lchld chld x
                                                //if undefined shift others to left..also add min box case
                                                index = index - 1;
                                              if (arr[index] == undefined) {
                                                   connectParChld(index, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,
                                                    parLevel);
                                                    xL = index;
                                                      arr[index] = 1;  // fill 1 in arr for occupied positions 
                                        //tempOutLineObjArr[m++] = outLineObjArr[xP+1];
                                         }

                                            }
                                    }
                                
                                    else {
                                           //case 5
                                       // console.log('***SHILPI case 5 hit for i = ' + i + '' + 'j=' + j);
                                        /* different level case - new chld will be add xP and old chld will be shifted to left */
                                        shiftLeft(xL, outLineObjArr, index,chldInfoArray[j],chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP,elementVGap);
                                        xL = xL - 1;                                        
                                    }
                                }
                                else if(chldXLFTP < tempObj.chldobj[l].chldXLFTP) //chld x < old lchld chld x
                                {
                                    /* Place new child at index -1 */
                                    //console.log('Shoul come here else part ');
                                    //xP = xP - 1;
                                    index = index - 1;
                                    if (arr[index] == undefined) {
                                        connectParChld(index, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,
                                            parLevel);
                                        xL = index;
                                        arr[index] = 1;  // fill 1 in arr for occupied positions 
                                        //tempOutLineObjArr[m++] = outLineObjArr[xP+1];
                                    }
                                    else{
                                        /* check if  same level */
                                        tempObj = outLineObjArr[index];
                                        cnt = tempObj.count;
                                    if (chldInfoArray[j].chldLev == tempObj.chldobj[cnt-1].chldLev) {
                                        
                                      //  console.log('SHILPI should come here Left chld and same level');
                                        
                                        tempObj.x1[cnt] = tempObj.x1[cnt - 1];
                                        tempObj.y1[cnt] = tempObj.y1[cnt - 1];
                                        tempObj.x2[cnt] = tempObj.x2[cnt - 1];
                                        tempObj.y2[cnt] = tempObj.y2[cnt - 1];
                                        result = calTerminatingCord(chldInfoArray[j], chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
                                        tempObj.x3[cnt] = result.xC;
                                        addEntryInglobalYLev(parLevel,tempObj.y2[cnt],tempObj.x2[cnt],tempObj.x3[cnt]);
                                       /* if (result.flag == 1)  // inc y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] + 10 * result.gap;
                                        }
                                        else if (result.flag == 2) // dec y2 by factor of gap
                                        {
                                            tempObj.y2[cnt] = tempObj.y2[cnt] - 10 * result.gap;
                                        }*/
                                        tempObj.y3[cnt] = tempObj.y2[cnt];
                                        tempObj.x4[cnt] = tempObj.x3[cnt];
                                        tempObj.y4[cnt] = chldInfoArray[j].chldYLFTP;
                                        tempObj.chldobj[cnt] = chldInfoArray[j];
                                        tempObj.count++;
                                    }
                                    else{
                                        /* shift others to left */
                                        shiftLeft(xL, outLineObjArr, index,chldInfoArray[j],chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP,elementVGap);
                                        xL = xL - 1;
                                    }
                                    }

                                }
                                else{
                                   // console.log('Shilpi box cut case xL ,xP,index',xL,xP,index);
                                    /* put child at index and shift others to left */
                                    if(tempObj.count > 1)
                                    {
                                        var found = 0;
                                        for (k = 0; k < tempObj.count; k++) {
                                            if (tempObj.chldobj[k].chldXLFTP > chldXLFTP) {
                                                found = 1;
                                                break;
                                            }

                                        }
                                        if (found == 1) {
                                            /* place new chld at index-1 */
                                            if (arr[index - 1] == undefined) {
                                                connectParChld(index - 1, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr, tempOutLineObjArr, m,
                                                    parLevel);
                                                /* update xR */
                                                xL = xL - 1;
                                                arr[xL] = 1;  // fill 1 in arr for occupied positions
                                            }
                                            else {
                                                /*shift others to left*/
                                                shiftLeft(xL, outLineObjArr, index - 1,chldInfoArray[j],chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP,elementVGap);
                                                xL = xL-1;
                                            }
                                        }
                                   }
                                   else{
                                       /* place new at index and shift others to left */
                                       /* before shifting check if there are any more child with same x and diff. level*/
                                       for(k=index+1;k<=xM;k++){
                                           //if(outLineObjArr[k])
                                           tempObj = outLineObjArr[k];
                                            // for (x = 0; x < tempObj.count; x++) {
                                                if (tempObj.chldobj[0].chldXLFTP == chldXLFTP) {
                                                    index = k;
                                                }
                                            //}
                                       }
                                      // console.log('shilpi correct place shift left');
                                       shiftLeft(xL, outLineObjArr, index ,chldInfoArray[j],chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP,elementVGap);
                                       xL = xL-1;
                                   }
                                    
                                }

                            }
                            else {
                                /* no chld present at lhs*/
                                /* Place new child at xP -1 */
                                xP = xP - 1;
                                if (arr[xP] == undefined) {
                                    arr[xP] = 1;
                                    connectParChld(xP, parXLFTP, parYLFTP, chldInfoArray[j], outLineObjArr, elementWidth, elementHeight, elementVGap, DiagrammedEntities, i, chldDgeIdArr,tempOutLineObjArr,m,
                                        parLevel);
                                    xL = xP;
                                    //arr[xP] = 1;  // fill 1 in arr for occupied positions 
                                }
                            }

                        }
                        else {
                            /* child just below parent */
                            /* box cut case */
                            if((chldInfoArray[j].chldLev-parLevel)>1){
                                let tempObj;
                                let k1,k2;
                                let x1 = [], x2 = [], x3 = [], x4 = [], y1 = [], y2 = [], y3 = [], y4 = [],x5=[],y5=[],x6=[],y6=[] ,chldobjArr = [];
                               // console.log('Shilp xL and xR xP',xL,xR,xP);                   
                               /* First check if no left child,start from left*/
                               /* if decision done for left */
                               /* assign next available xL */
                               let xF;
                               if(xL == -1){                  
                                  // console.log('shilpi in if');
                                   xF = xP -1;                   
                               }
                               else if(xR == -1){
                               // console.log('shilpi in else if');
                                xF = xP +1;
                               }
                            else{
                               // console.log('shilpi in else');
                                /* check alternate left and right to get free pos. */
                               /* k1 = xP-1;
                                k2 = xP+1;
                                while(arr[k1]!=undefined && arr[k2]!=undefined){
                                k1 = k1-1;
                                k2 = k2+1;
                                }
                                if(arr[k1] == undefined){
                                    console.log('shilpi go left');
                                    xF = k1;       
                                }           
                                else{
                                    xF = k2;
                                }*/
                                xF = xP+1;
                                while(arr[xF]!=undefined){
                                    xF = xF +1;
                                }
                                                     
                            }
                           // console.log('shilpi xF',xF);
                            outLineObjArr[xF] = new Object();
                            arr[xF] = 1;
                            tempObj = outLineObjArr[xF];
                            if(xF > xM){
                                x1[0] = (parXLFTP + elementWidth/2)+(xF-xM)*10;
                                y1[0] = parYLFTP + elementHeight;
                                y2[0] = y1[0]+elementVGap/2-(xF-xM)*10;
                                x3[0] = parXLFTP+10;
                                xR = xF;
                                gDir = 2;                     
                            }
                            else{
                                x1[0] = (parXLFTP + elementWidth/2)-(xM-xF)*10;
                                y1[0] = parYLFTP + elementHeight;
                                y2[0] = y1[0]+elementVGap/2-(xM-xF)*10;
                                x3[0] = parXLFTP-10;
                                xL = xF;
                                gDir = 1;
                            } 
                            
                            x2[0] = x1[0];
                            y3[0]= y2[0];
                            x4[0] = x3[0];
                            y4[0] = chldInfoArray[j].chldYLFTP - elementVGap/2;
                            x5[0] = 0;
                            y5[0] = y4[0];
                            y6[0] = chldInfoArray[j].chldYLFTP;
                            let index1 = calIndex(arr,xF); 
                            let index2 = m+index1-1;
                            result = calTerminatingCord(chldInfoArray[j], chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,index2);
                               x5[0] = result.xC;
                               x6[0] = x5[0];
                               tempObj["x1"] = x1;
                               tempObj["y1"] = y1;
                               tempObj["x2"] = x2;
                               tempObj["y2"] = y2;
                               tempObj["x3"] = x3;
                               tempObj["y3"] = y3;
                               tempObj["x4"] = x3;
                               tempObj["y4"] = y4;
                               tempObj["x5"] = x5;
                               tempObj["y5"] = y5;
                               tempObj["x6"] = x6;
                               tempObj["y6"] = y6;
                               tempObj["count"] = 1;
                               chldobjArr[0] = chldInfoArray[j];
                               tempObj["chldobj"] = chldobjArr;
                               tempObj["flag"] = 1;
                             //  console.log('FINAL CORD CUST_JOB',tempObj.x1[0],tempObj.y1[0],tempObj.x2[0],tempObj.y2[0],tempObj.x3[0],tempObj.y3[0],tempObj.x4[0],tempObj.y4[0],
                              // tempObj.x5[0],tempObj.y5[0],tempObj.x6[0],tempObj.y6[0]);                                                                         
                            }
                            else{
                            /* so place it at xP */
                            /* TODO do below if prev child was at same level */
                            // console.log('SHILPI PArent child same level j = ' + j);
                            tempObj = outLineObjArr[xP];
                            cnt = tempObj.count;
                            temp = chldInfoArray[j];
                            tempObj.x1[cnt] = tempObj.x1[cnt - 1];
                            tempObj.y1[cnt] = tempObj.y1[cnt - 1];
                            tempObj.x2[cnt] = tempObj.x2[cnt - 1];
                            tempObj.y2[cnt] = tempObj.y2[cnt - 1];
                            tempObj.x3[cnt] = tempObj.x2[cnt];
                            tempObj.y3[cnt] = tempObj.y2[cnt];
                            tempObj.x4[cnt] = tempObj.x3[cnt];
                            tempObj.y4[cnt] = chldInfoArray[j].chldYLFTP;
                            tempObj.chldobj[cnt] = temp;
                            tempObj.count++;
                            }
                        }
                    }
                }
            
            for (j = 0; j < arr.length; j++) {
                if (arr[j] == 1) {
                    tempOutLineObjArr[m++] = outLineObjArr[j];
                    
                }
            }
             
    } // end of for loop DgmObj
    /* TODO put it into a func */
    k = 0;
    var t=0;
   // console.log('shilpi array len ' + tempOutLineObjArr.length);
    for(i = 0; i < tempOutLineObjArr.length; i++)
    {
        if(tempOutLineObjArr[i].count)
        {
           // console.log('shilpi count i ' , tempOutLineObjArr[i].count,i );
            for(j = 0; j < tempOutLineObjArr[i].count; j++)
            {
                connectingLines = new Object();
                connectingLines["x1"] = tempOutLineObjArr[i].x1[j];
                connectingLines["y1"] = tempOutLineObjArr[i].y1[j];
                connectingLines["x2"] = tempOutLineObjArr[i].x2[j];
                connectingLines["y2"] = tempOutLineObjArr[i].y2[j];
                connectingLines["x3"] = tempOutLineObjArr[i].x3[j];
                connectingLines["y3"] = tempOutLineObjArr[i].y3[j];
                connectingLines["x4"] = tempOutLineObjArr[i].x4[j];
                connectingLines["y4"] = tempOutLineObjArr[i].y4[j];
                connectingLines["x5"] = undefined;
                connectingLines["y5"] = undefined;
                connectingLines["x6"] = undefined;
                connectingLines["y6"] = undefined;
                if(tempOutLineObjArr[i].flag)
                {
                    connectingLines["x5"] = tempOutLineObjArr[i].x5[j];
                    connectingLines["y5"] = tempOutLineObjArr[i].y5[j];
                    connectingLines["x6"] = tempOutLineObjArr[i].x6[j];
                    connectingLines["y6"] = tempOutLineObjArr[i].y6[j];
                    t++;
                }
                connectingLines["rlnID"] = tempOutLineObjArr[i].chldobj[j].rlnID;
              //  console.log('SHILPI RLNID' + connectingLines.rlnID);
                
                connectingLinesArray[k++] = connectingLines;
              
                /*
                if(i == 3)
                {
                    console.log('PCONTRACT-JOB',connectingLines); 
                }*/
            }
        }
    }
    //processedParameters = new Object();
    //processedParameters["Lines"] = connectingLinesArray;
    //processedParameters["Ents"] = DiagrammedEntities;

   // resolve(processedParameters);
//});
return connectingLinesArray;
}

function calIndex(arr,currIndex){
    var count=0;
    for (var j = 0; j < arr.length; j++) {
        if (arr[j] == 1 && j!=currIndex) {
            count++;
        }
        if (j == currIndex) {
            count++;
            break;
        }

    }
    return count;
}
function shiftRight(xR,outLineObjArr,index,chldObj,chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP){
   // console.log('shilpi print input shiftr8 xR and index',xR,index);
    let tempNewObj,tempLineObj,result;
    let x1 = [], x2 = [], x3 = [], x4 = [], y1 = [], y2 = [], y3 = [], y4 = [], chldobjArr = [];
    let x5 = [],y5=[],x6=[],y6=[];
    let x51 = [],y51=[],x61=[],y61=[];
    let k;
    /* Initialise new object created at rightmost free position*/
    outLineObjArr[xR + 1] = new Object();
    tempNewObj = outLineObjArr[xR + 1];
    tempNewObj["x1"] = x1;
    tempNewObj["y1"] = y1;
    tempNewObj["x2"] = x2;
    tempNewObj["y2"] = y2;
    tempNewObj["x3"] = x3;
    tempNewObj["y3"] = y3;
    tempNewObj["x4"] = x4;
    tempNewObj["y4"] = y4;
    tempNewObj["x5"] = x5;
    tempNewObj["y5"] = y5;
    tempNewObj["x6"] = x6;
    tempNewObj["y6"] = y6;
    tempNewObj["count"] = 0;
    tempNewObj["chldobj"] = chldobjArr;
    tempNewObj["flag"] = 0;

    arr[xR + 1] = 1;
    /* TODO may be require to check xM */
    //console.log('SHILPI xR' + xR + 'xP' + xP);
    for (k = xR; k >= index; k--) {
        updateCordinates(outLineObjArr, k, k + 1,parLevel);
    }
    /*update xR */
    //xR = xR + 1;
    /* fill coordinates of new chld just added at index .we will fill only changed values at xP now ...rest will be as it is */
    tempLineObj = outLineObjArr[index];
    tempLineObj["flag"] = 0;
    tempLineObj["x5"] = x51;
    tempLineObj["y5"] = y51;
    tempLineObj["x6"] = x61;
    tempLineObj["y6"] = y61;
    let minBox={};
                                        var x31;
                                        if((chldObj.chldLev-parLevel)>1){
                                            console.log('Shilpi parYLFTP',parYLFTP);
                                            minBox = findBox(DiagrammedEntities,chldObj,parYLFTP) ;
                                            console.log('shilpi minBox',minBox);
                                        }
     /*if(minBox == undefined){
        for(var i=0;i < DiagrammedEntities.length;i++){
            let ent = DiagrammedEntities[i];
            if(ent.XLFTP <= x && ent.XLFTP+150 >x){
             minBox.xlftp = ent.XLFTP;
             minBox.ylftp=ent.YLFTP;
             minBox.lev=ent.Level;
             minBox.ID=ent.PgmName;
             return minBox;
            }
            for(var j=0; j< ent.chldInfoArray.length;j++){
                if(ent.chldInfoArray[j].chldXLFTP <= x && ent.chldInfoArray[j].chldXLFTP +150 >x){
                 minBox.xlftp = ent.chldInfoArray[j].chldXLFTP;
                 minBox.ylftp=ent.chldInfoArray[j].chldYLFTP;
                 minBox.lev=ent.chldInfoArray[j].chldLev;
                 minBox.ID=ent.chldInfoArray[j].chldId;
                 return minBox;
                }
        }
     }
     } */                                  

    //console.log('check' + tempOutLineObjArr[0].x3[0]);
    result = calTerminatingCord(chldObj, chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
    /*if (result.flag == 1) {
        tempLineObj.y2[0] = tempLineObj.y2[0] + 10 * result.gap;
    }
    else if (result.flag == 2) {
        tempLineObj.y2[0] = tempLineObj.y2[0] - 10 * result.gap;
    }*/
    tempLineObj.y3[0] = tempLineObj.y2[0];
    tempLineObj.x3[0] = result.xC;
    tempLineObj.x4[0] = tempLineObj.x3[0];
    tempLineObj.y4[0] = chldObj.chldYLFTP;
    tempLineObj.chldobj[0] = chldObj;
}

function shiftLeft(xL, outLineObjArr, index,chldObj,chldDgeIdArr,DiagrammedEntities, i,tempOutLineObjArr,m,parLevel,parYLFTP,elementVGap){
    let tempNewObj,tempObj;
    let tempLineObj;
    let x1 = [], x2 = [], x3 = [], x4 = [], y1 = [], y2 = [], y3 = [], y4 = [], chldobjArr = [];
    let x5 = [],y5=[],x6=[],y6=[];
    let k,result;
    
    /* Initialise new object created at leftmost free position*/
    outLineObjArr[xL - 1] = new Object();
    tempNewObj = outLineObjArr[xL - 1];
    tempNewObj["x1"] = x1;
    tempNewObj["y1"] = y1;
    tempNewObj["x2"] = x2;
    tempNewObj["y2"] = y2;
    tempNewObj["x3"] = x3;
    tempNewObj["y3"] = y3;
    tempNewObj["x4"] = x4;
    tempNewObj["y4"] = y4;
    tempNewObj["x5"] = x5;
    tempNewObj["y5"] = y5;
    tempNewObj["x6"] = x6;
    tempNewObj["y6"] = y6;
    tempNewObj["count"] = 0;
    tempNewObj["chldobj"] = chldobjArr;
    tempNewObj["flag"] = 0;
    //console.log('check x5',tempNewObj.x5[0]);

    arr[xL - 1] = 1;
    /* TODO may be require to check xM */
    
    //console.log('Shilpi index and xL',index,xL);
    for (k = xL; k <= index; k++) {
        
        updateCordinates(outLineObjArr, k, k - 1,parLevel);
    }
    //console.log('Shilpi after update',outLineObjArr[xL]);
    /*update xL */
    xL = xL - 1;
    let x51 = [],y51=[],x61=[],y61=[];
    /* fill coordinates of new chld just added at index .we will fill only changed values at xP now ...rest will be as it is */
    tempLineObj = outLineObjArr[index];
    tempLineObj["flag"] = 0;
    tempLineObj["x5"] = x51;
    tempLineObj["y5"] = y51;
    tempLineObj["x6"] = x61;
    tempLineObj["y6"] = y61;

    let minBox={};
    var x31;
    if((chldObj.chldLev-parLevel)>1){
        minBox = findBox(DiagrammedEntities,chldObj,parYLFTP) ;
       // console.log('shilpi minBox',minBox);
        if(minBox.ID!=undefined){
            x31 = minBox.xlftp + 600 + 10;
            tempObj = glbHorizCoords.find(tempObj => tempObj.xlftp == x31);
            //To Do- check if we can still use this x 
         //   console.log('Shilpi tempObj', tempObj);
            while (tempObj != undefined) {
                x31 = x31 + 10;
                tempObj = glbHorizCoords.find(tempObj => tempObj.xlftp == x31);
                //select next 
            }
            tempLineObj.flag = 1;
            tempLineObj.x3[0] = x31;
            tempLineObj.y4[0] = chldObj.chldYLFTP - elementVGap / 2;
            /* insert x val in glbHorizCoords */
            glbHorizCoords.push({
                "xlftp": tempLineObj.x3[0],
                "ymin": tempLineObj.y3[0],
                "ymax": tempLineObj.y4[0]
            })
            //To Do- check in golbal spatial co-ord if x3 is free
            if (chldObj.chldXLFTP < tempLineObj.x3[0]) {
                gDir = 2
            }
            if (chldObj.chldXLFTP > tempLineObj.x3[0]) {
                gDir = 1;
            }
            tempLineObj.x4[0] = tempLineObj.x3[0];
            //x5[0] = 0;
            tempLineObj.y5[0] = tempLineObj.y4[0];
            //x6[0] = x5[0];
            tempLineObj.y6[0] = chldObj.chldYLFTP;
        }
    }


    
    //console.log('check' + tempOutLineObjArr[0].x3[0]);
    result = calTerminatingCord(chldObj, chldDgeIdArr, DiagrammedEntities, i,tempOutLineObjArr,m);
    if (result.flag == 1) {
        if(gDir){
            tempLineObj.y4[0] = tempLineObj.y4[0] + 10 * result.gap;
            tempLineObj.y5[0] = tempLineObj.y4[0]; 
        }
        else{
       // tempLineObj.y2[0] = tempLineObj.y2[0] + 10 * result.gap;
        //tempLineObj.y3[0] = tempLineObj.y2[0];
        }
    }
    else if (result.flag == 2) {
        if(gDir){
            tempLineObj.y4[0] = tempLineObj.y4[0] - 10 * result.gap;
            tempLineObj.y5[0] = tempLineObj.y4[0]; 
        }
        else{
        //tempLineObj.y2[0] = tempLineObj.y2[0] - 10 * result.gap;
        //tempLineObj.y3[0] = tempLineObj.y2[0];
        }
    }
    if(minBox.ID!=undefined){
        tempLineObj.x5[0] = result.xC;
        tempLineObj.x6[0] = result.xC;
       // console.log('shilpi x5 x6 set and flag',result.xC,tempLineObj.flag);
    }
    else{
    tempLineObj.y3[0] = tempLineObj.y2[0];
    tempLineObj.x3[0] = result.xC;
    tempLineObj.x4[0] = tempLineObj.x3[0];
    tempLineObj.y4[0] = chldObj.chldYLFTP;
    }
    tempLineObj.chldobj[0] = chldObj;
    tempLineObj.count = 1;
    //console.log('SA_DEBUG ****bye j = ' + j);
}

function checkOverlapY2(y2,x2,x3,parLevel)
{
    var cordObj;
    if(globalYLev.length > parLevel){
        cordObj = globalYLev[parLevel].find(cordObj => cordObj.y2 == y2);
        if(cordObj !=undefined){
            //check if we can still use occupied y2
            if((cordObj.x2 >=x3 && x2 >=cordObj.x2) ||(cordObj.x2<=x3 && x2 <=cordObj.x2) ||
                       (cordObj.x2 >= x2 && cordObj.x3 <= x3) ||(cordObj.x3 >= x2 && cordObj.x2<=x2)){
                return 1; //overlap
            }
            else{
                return 0;
            }
        }
        else{
            return 0;
        }
    }
    else{
        return 0;
    }
}
function addEntryInglobalYLev(parLevel,y2,x2,x3)
{
    if(globalYLev.length > parLevel)
    {
        globalYLev[parLevel].push({
            "y2":y2,
            "x2":x2,
            "x3":x3
        })
    }
    else{
        globalYLev.push(new Array());
        globalYLev[parLevel].push({
            "y2":y2,
            "x2":x2,
            "x3":x3
        })
    }
}
/*module.exports = 
{
    positionLines
}*/