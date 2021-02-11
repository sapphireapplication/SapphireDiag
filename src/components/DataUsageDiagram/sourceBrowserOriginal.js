/* Rashi Code Starts */
//pgmCode, pgmSchemaW, prNmArr, fldFileData
var gPgmCodeData = undefined;
var gPgmSchemaWData = undefined;
var gSubRoutineData = undefined;
var gDbFldFileData = undefined;
var gPrcDefsData = undefined;
var gRestApiData = undefined;
var gPrcCallsExplosionData = undefined;
var gPgmStatesData = undefined;
var gPgmStScmaData = undefined;
var gPgmStRulesData = undefined;
// var gCmpStatesData = undefined;
// var gApiDefsData = undefined;
// var gApiRulesData = undefined;
// var gApiRLogicData = undefined;
// var gApiSchemaData = undefined;

var highlightedElem = undefined;
var highlightedElemLineNum = undefined;
var browserMode = 0;
var level = 1;
var subRtFocus = undefined;
var subRoutineCallArr = [];

function handleLevelChange () {
    document.getElementById('ceReEnggSel').value = 'Re-engineer';
    level = document.getElementById("ceLvlSel").value.split(' ')[1];
    level = eval(level);

    $("#ceTBody").empty();  //  Delete all rows from source browser
    $("#editdata").hide();
    ceDiv.scrollBy(0,0);

    gPgmCodeData.forEach((row) => {
        if (row['LvlNum'] >= level && (row['StnTyp'] === 'F' || row['StnTyp'] === 'D' || row['StnTyp'] === 'C')) {
            ceTRow = ceTBody.insertRow(-1);
    
            for (key in row) {
                if (key === 'LineNum' || key === 'StnDate') {
                    ceTCell = ceTRow.insertCell(-1);
                    ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                }
                else if (key === 'Stn') {
                    ceTCell = ceTRow.insertCell(-1);
                    ceTCell.colSpan = 2;
                    ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                }
            }
        }
    })

    if ($('#ceTBody tr').length === 0) {
        ceTRow = ceTBody.insertRow(-1);
        ceTCell = ceTRow.insertCell(-1);
        ceTCell.colSpan = 4;
        ceTCell.setAttribute('align', 'center');
        ceTCell.innerHTML = `<pre class = 'preBody'>No records found !</pre>`;
    } else {
                //wrap words in spans
        $('.preBodyWU').each(function() {
            var $this = $(this);
            var comparator = '';
            var attributes = ['MVar', 'SVar1', 'SVar2', 'SVar3', 'SVar4', 'FileNm', 'InvPrNm', 'CurPrNm'];

            attributes.forEach(attrName => {
                if ($this.attr(attrName) != 'null' && (gPgmSchemaWData.find(row => {return(row['ShortNm'] === $this.attr(attrName))}) || gSubRoutineData.find(row => {return(row['MVar'] === $this.attr(attrName))}))) {
                    var word = $this.attr(attrName).replace(/[$#@%&_*]/g, '\\$&');
                    comparator = comparator === '' ? word : comparator.concat('|', word);
                } else if ($this.attr(attrName) != 'null' && $this.attr(attrName).indexOf("'") >= 0){
                    // console.log($this.attr(attrName));
                    var word = $this.attr(attrName).replace(/[$#@%&_*]/g, '\\$&');
                    var re = RegExp(word, "ig");
                    $this.html($this.html().replace(re,  `<span style = 'color: #f19947; display:inline;'>$&</span>`));
                }
            })

            if (comparator != '') {
                var re = RegExp(comparator, "ig");
                $this.html($this.html().replace(re,  `<span style = 'cursor: pointer; display:inline;' onClick = "invokeCodeBrowserWhereUsed('$&')">$&</span>`));
            }

            if ($this.attr('OpCode') === 'COMM') {
                $(this).css('color','#66b366').text();
            } else if ($this.attr('StnTyp') === 'C') {
                var re = RegExp($this.attr('OpCode'), "ig");
                $this.html($this.html().replace(re, `<span style = 'color:#d68ff5; display:inline;'>$&</span>`));
            }
    
            if ($this.attr('OpCode') === 'EXSR') {
                var re = RegExp($this.attr('OpCode'), "ig");
                $this.html($this.html().replace(re, `<span style = 'cursor: pointer; display:inline;' onClick = "invokeCodeBrowserWhereUsed('$&', '${$this.attr('id')}')">$&</span>`));
            } else if ($this.attr('OpCode') === 'BEGSR') {
                var re = RegExp($this.attr('OpCode'), "ig");
                $this.html($this.html().replace(re, `<span style = 'cursor: pointer; display:inline;' onClick = "goBackToExSR('$&', '${$this.attr('id')}')">$&</span>`));
            }
        });
    }
}


function browseSourceMember(id) {
    if (highlightedElem) {
        highlightedElem.style.backgroundColor = '';
        highlightedElem.style.color = '';
    }

    highlightedElem = document.getElementById(`${id}Stn`);

    if (highlightedElem) {
        highlightedElem.style.backgroundColor = 'cyan';
        highlightedElem.style.color = 'black';
        ceDiv.scrollBy(0, highlightedElem.getBoundingClientRect()['top']-150);
    }
}

flagstates=0;
function drawStatesTable (pgmId) {

 ///editing by seema
 var ceDiv4 = document.getElementById('ceDiv4');

 if (ceDiv4)
     ceDiv4.parentNode.removeChild(ceDiv4);

 // Draw Code Editor DIV
 var divContainer = document.createElement('div');
 divContainer.setAttribute('id', 'ceDiv4');
 divContainer.setAttribute('class', 'relative1 draggable resizable');
 document.body.appendChild(divContainer);
 $( function() { $('.draggable').draggable().resizable();});
 var ceSpan = document.createElement('span');
     ceSpan.setAttribute('id', 'ceClose');
     ceSpan.setAttribute('class', 'ceClose');
     //ceSpan.setAttribute('onclick', `$(this).parent().hide();`);
     ceSpan.setAttribute('onclick', 'closetempdiv(event)');
     ceSpan.innerHTML = 'X';
     document.getElementById("ceDiv4").appendChild(ceSpan);
console.log("flagsates == ", flagstates);
PositionDiv("ceDiv4", 'M');
     if (flagstates == 0)
     {
      
       checkotherdivs("ceDiv", "ceDiv1", "ceDiv2", "ceDiv3", "editdata");
       flagstates=1;
     }
 ///end by seema



    var divContainer = document.getElementById("ceDiv4");

    // while (divContainer.childNodes[2])
    //     divContainer.removeChild(divContainer.childNodes[2]);

    document.getElementById("ceDiv4").style.position = 'absolute';
    document.getElementById("ceDiv4").style.display = 'inline';
    document.getElementById("ceDiv4").style.background = 'white';

    /* Extract states information from PgmStates Table */
    var states = gPgmStatesData.filter(row => {return(row['PgmID'] === pgmId.toUpperCase())})

    /* Create Main Table that will accomodate all the states tables */
    var mainTable = document.createElement('table');
    mainTable.setAttribute('id', 'mainTable');
    mainTable.setAttribute('width', '50%');
    mainTable.setAttribute('height', 'auto');
    mainTable.align = 'center';
    divContainer.appendChild(mainTable);
        
    var raTRow = undefined;
    var raTCell = undefined;

    states.forEach((state, idx) => {
        /* Insert row in Main Table to append individual States Div and 3 Tables */
        raTRow = mainTable.insertRow(-1);

        var tBodyDiv = document.createElement('div');
        tBodyDiv.style.width = '100%';
        tBodyDiv.style.height = 'auto';
        tBodyDiv.style.border = '3px solid #264d7e';
        raTRow.appendChild(tBodyDiv);

        // Draw State Main Table
        var raTable = document.createElement('table');
        raTable.width = '100%';
        tBodyDiv.appendChild(raTable);

        // Draw State Main Table Head
        var raTHead = document.createElement('thead');
        raTable.appendChild(raTHead);

        // Draw State Main Table Body
        var raTBody = document.createElement('tbody');
        raTable.appendChild(raTBody);

        // Creating State Table Head Rows for heading
        raTRow = raTHead.insertRow(-1);
        raTCell = raTRow.insertCell(-1);
        raTCell.colSpan = 4;
        raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivHeadMainCap' value = '${state['StateTxt'].toUpperCase()}'/>`;

        if (gPgmStScmaData.find (sData => { return (sData['StateID'] === state['StateID']) }) != undefined) {
            raTRow = raTBody.insertRow(-1);
            raTCell = raTRow.insertCell(-1);
            raTCell.colSpan = 4;
            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivHeadCap' value = 'SCHEMA'/>`;

            // Draw API Schema DIV TABLE
            var tBodyDiv = document.createElement('div');
            tBodyDiv.style.width = '100%';
            tBodyDiv.style.height = '200px';
            tBodyDiv.style.overflow = 'auto';
            tBodyDiv.style.background = '#dbd9da';

            raTRow = raTBody.insertRow(-1);
            raTRow.appendChild(tBodyDiv);

            // Draw API Schema TABLE
            var raTable = document.createElement('table');
            raTable.setAttribute('width', '100%');
            raTable.setAttribute('height', 'auto');
            raTable.align = 'center';
            raTable.style.background = 'yellow';

            tBodyDiv.appendChild(raTable);

            var schemaFiles = $.unique(gPgmStScmaData.map(function (row) {return row.FileID;}));

            // Draw Schema data
            schemaFiles.forEach((file) => {
                var cnt = 0;
                gPgmStScmaData.forEach(fieldRow => {
                    if (fieldRow['FileID'] === file && fieldRow['StateID'] === state['StateID']) {

                        if (cnt === 0) {
                            raTRow = raTable.insertRow(-1);
                            raTCell = raTRow.insertCell(-1);
                            raTCell.colSpan = 4;
                            raTCell.style.paddingLeft = '10px';
                            raTCell.style.background = '#dbd9da';
                            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivHeadCol' value = '${file}'/>`;
                        }

                        raTRow = raTable.insertRow(-1);
                        raTCell = raTRow.insertCell(-1);
                        raTCell.style.paddingLeft = '20px';
                        raTCell.style.background = '#dbd9da';
                        raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = '${fieldRow['ShortNm']}'/>`;
            
                        raTCell = raTRow.insertCell(-1);
                        raTCell.style.background = '#dbd9da';
                        raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = '${fieldRow['FTxt']}'/>`;
            
                        raTCell = raTRow.insertCell(-1);
                        raTCell.style.background = '#dbd9da';
                        raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = '${fieldRow['Len']}${fieldRow['DtaTyp']}'/>`;
            
                        raTCell = raTRow.insertCell(-1);
                        raTCell.style.background = '#dbd9da';
                        raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = '${fieldRow['EdtTyp']}'/>`;
                        cnt ++;
                    }
                })

                raTRow = raTable.insertRow(-1);
                raTCell = raTRow.insertCell(-1);
                raTCell.style.background = '#dbd9da';
                raTCell.colSpan = 4;
                raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = ''/>`;
            })
        }


        if (gPgmStRulesData.find (sData => { return (sData['StateID'] === state['StateID'] && sData['RuleTyp'] === 'R') }) != undefined) {
            raTRow = raTBody.insertRow(-1);
            raTCell = raTRow.insertCell(-1);
            raTCell.colSpan = 4;
            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivHeadCap' value = 'READ RULES'/>`;

            // Draw Read Rules Div
            var tBodyDiv = document.createElement('div');
            tBodyDiv.style.width = '100%';
            tBodyDiv.style.height = '80px';
            tBodyDiv.style.overflow = 'auto';
            tBodyDiv.style.background = '#dbd9da';

            raTRow = raTBody.insertRow(-1);
            raTRow.appendChild(tBodyDiv);

            // Draw Read Rules TABLE
            var raTable = document.createElement('table');
            raTable.setAttribute('width', '100%');
            raTable.setAttribute('height', 'auto');
            raTable.align = 'center';
            tBodyDiv.appendChild(raTable);

            gPgmStRulesData.forEach(rules => {
                if (rules['RuleTyp'] === 'R' && rules['StateID'] === state['StateID']) {
                    raTRow = raTable.insertRow(-1);
                    raTCell = raTRow.insertCell(-1);
                    raTCell.colSpan = 4;
                    raTCell.style.paddingLeft = '10px';
                    raTCell.style.background = '#dbd9da';
                    raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = "&#9679 ${rules['RuleTxt']}"/>`;

                    var joinInfo = gPgmCodeData.filter(row => {
                        return (row['StateID'] === state['StateID'] && row['RuleID'] === rules['RuleID'] && row['RuleTyp'] === rules['RuleTyp']) 
                    })

                    joinInfo.forEach(jInfo => {
                        if (jInfo['OpCode'] === 'PP') {
                            raTRow = raTable.insertRow(-1);
                            raTCell = raTRow.insertCell(-1);
                            raTCell.colSpan = 4;
                            raTCell.style.paddingLeft = '30px';
                            raTCell.style.background = '#dbd9da';
                            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' id = "${jInfo['LineNum']}" style = "cursor: pointer" onClick = "browseSourceMember(id)" value = "&#10146 ${jInfo['MVar']}"/>`;
                        } else if (jInfo['OpCode'] === 'WHERE') {
                            raTRow = raTable.insertRow(-1);
                            raTCell = raTRow.insertCell(-1);
                            raTCell.colSpan = 4;
                            raTCell.style.paddingLeft = '30px';
                            raTCell.style.background = '#dbd9da';
                            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' id = "${jInfo['LineNum']}" style = "cursor: pointer" onClick = "browseSourceMember(id)" value = "&#10146 ${jInfo['MVar']} = ${jInfo['SVar1']}"/>`;
                        }
                    })                
                }
            })
        }

        if (gPgmStRulesData.find (sData => { return (sData['StateID'] === state['StateID'] && sData['RuleTyp'] === 'V') }) != undefined) {
            raTRow = raTBody.insertRow(-1);
            raTCell = raTRow.insertCell(-1);
            raTCell.colSpan = 4;
            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivHeadCap' value = 'EDIT RULES'/>`;
    
            // Draw Edit Rules Div
            var tBodyDiv = document.createElement('div');
            tBodyDiv.style.width = '100%';
            tBodyDiv.style.height = '80px';
            tBodyDiv.style.overflow = 'auto';
            tBodyDiv.style.background = '#dbd9da';
    
            raTRow = raTBody.insertRow(-1);
            raTRow.appendChild(tBodyDiv);
    
            // Draw Edit Rules TABLE
            var raTable = document.createElement('table');
            raTable.setAttribute('width', '100%');
            raTable.setAttribute('height', 'auto');
            raTable.align = 'center';
            tBodyDiv.appendChild(raTable);
    
            gPgmStRulesData.forEach(rules => {
                if (rules['RuleTyp'] === 'V' && rules['StateID'] === state['StateID']) {
                    raTRow = raTable.insertRow(-1);
                    raTCell = raTRow.insertCell(-1);
                    raTCell.colSpan = 4;
                    raTCell.style.paddingLeft = '10px';
                    raTCell.style.background = '#dbd9da';
                    raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = "&#9679 ${rules['RuleTxt']}"/>`;
    
                    var vInfo = gPgmCodeData.filter(row => {
                        return (row['StateID'] === state['StateID'] && row['RuleID'] === rules['RuleID'] && row['RuleTyp'] === rules['RuleTyp']) 
                    })
    
                    var str = '';
    
                    var id = vInfo[0]['LineNum'];

                    vInfo.forEach(vInfo => {
                        if (vInfo['OpCode'] === 'WHERE') {
                            if (str === '')
                                str = str.concat(vInfo['SVar1']);
                            else
                                str = str.concat(' and ', vInfo['SVar1']);
                        } else if (vInfo['OpCode'] === 'IF') {
                            str = `If ${vInfo['OpType']} ${vInfo['MVar']} for ${str}`;
                        } else if (vInfo['OpCode'] === 'WHEN') {
                            raTRow = raTable.insertRow(-1);
                            raTCell = raTRow.insertCell(-1);
                            raTCell.colSpan = 4;
                            raTCell.style.paddingLeft = '30px';
                            raTCell.style.background = '#dbd9da';
                            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' id = "${id}" style = "cursor: pointer" onClick = "browseSourceMember(id)" value = "&#10146 If ${vInfo['MVar']} ${vInfo['CmpTor']} ${vInfo['SVar1']}"/>`;
                        } else if (vInfo['OpCode'] === 'AND') {
                            raTRow = raTable.insertRow(-1);
                            raTCell = raTRow.insertCell(-1);
                            raTCell.colSpan = 4;
                            raTCell.style.paddingLeft = '30px';
                            raTCell.style.background = '#dbd9da';
                            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' id = "${id}" style = "cursor: pointer" onClick = "browseSourceMember(id)" value = "&#10146 And ${vInfo['MVar']} ${vInfo['CmpTor']} ${vInfo['SVar1']}"/>`;
                        }
                    })
    
                    if (str) {
                        raTRow = raTable.insertRow(-1);
                        raTCell = raTRow.insertCell(-1);
                        raTCell.colSpan = 4;
                        raTCell.style.paddingLeft = '30px';
                        raTCell.style.background = '#dbd9da';
                        raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' id = "${id}" style = "cursor: pointer" onClick = "browseSourceMember(id)" value = "&#10146 ${str}"/>`;
                    }
                }
            })
        }

        if (gPgmStRulesData.find (sData => { return (sData['StateID'] === state['StateID'] && sData['RuleTyp'] === 'U') }) != undefined) {
            raTRow = raTBody.insertRow(-1);
            raTCell = raTRow.insertCell(-1);
            raTCell.colSpan = 4;
            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivHeadCap' value = 'UPDATE RULES'/>`;
    
            // Draw Update Rules Div
            var tBodyDiv = document.createElement('div');
            tBodyDiv.style.width = '100%';
            tBodyDiv.style.height = '200px';
            tBodyDiv.style.overflow = 'auto';
            tBodyDiv.style.background = '#dbd9da';
    
            raTRow = raTBody.insertRow(-1);
            raTRow.appendChild(tBodyDiv);
    
            // Draw Update Rules TABLE
            var raTable = document.createElement('table');
            raTable.setAttribute('width', '100%');
            raTable.setAttribute('height', 'auto');
            raTable.align = 'center';
            tBodyDiv.appendChild(raTable);
    
            gPgmStRulesData.forEach(rules => {
                if (rules['RuleTyp'] === 'U' && rules['StateID'] === state['StateID']) {
                    raTRow = raTable.insertRow(-1);
                    raTCell = raTRow.insertCell(-1);
                    raTCell.colSpan = 4;
                    raTCell.style.paddingLeft = '10px';
                    raTCell.style.background = '#dbd9da';
                    raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' value = "&#9679 ${rules['RuleTxt']}"/>`;
    
                    var uInfo = gPgmCodeData.filter(row => {
                        return (row['StateID'] === state['StateID'] && row['RuleID'] === rules['RuleID'] && row['RuleTyp'] === rules['RuleTyp']) 
                    })
    
                    uInfo.forEach(uInfo => {
                        if (uInfo['StnTyp'] === 'C') {
                            raTRow = raTable.insertRow(-1);
                            raTCell = raTRow.insertCell(-1);
                            raTCell.colSpan = 4;
                            raTCell.style.paddingLeft = '30px';
                            raTCell.style.background = '#dbd9da';
                            raTCell.innerHTML = `<input type = 'text' class = 'ceApiDivCol' id = "${uInfo['LineNum']}" style = "cursor: pointer" onClick = "browseSourceMember(id)" value = "&#10146 ${uInfo['Stn'].trim()}"/>`;
                        }
                    })
                }
            })
        }

        if (idx < states.length-1) {
            raTRow = mainTable.insertRow(-1);
            raTCell = raTRow.insertCell(-1);
            raTCell.colSpan = 4;
            raTCell.innerHTML = `<input type = 'text' class = 'vertical_line' value = ''/>`;
        }

    })
}

function handleReEnggSelChange (pgmId) {
    document.getElementById("ceLvlSel").value = 'Select Level';
    type = document.getElementById('ceReEnggSel').value;

    $("#ceTBody").empty();  //  Delete all rows from source browser
    ceDiv.scrollBy(0,0);
    if (type === 'NONE') {

        $("#editdata").hide();
        gPgmCodeData.forEach((row) => {
            if (row['StnTyp'] === 'F' || row['StnTyp'] === 'D' || row['StnTyp'] === 'C') {
                ceTRow = ceTBody.insertRow(-1);
    
                for (key in row) {
                    if (key === 'LineNum' || key === 'StnDate') {
                        ceTCell = ceTRow.insertCell(-1);
                        ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" LvlNum = "${row['LvlNum']}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                    }
                    else if (key === 'Stn') {
                        ceTCell = ceTRow.insertCell(-1);
                        ceTCell.colSpan = 2;
    
                        ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                    }
                }
            }
        })
    } else {
        gPgmCodeData.forEach((row) => {
            if (row['StnTyp'] === 'F' || row['StnTyp'] === 'D' || row['StnTyp'] === 'C') {
                if ((type === 'ALL' || type === 'API') && gPrcDefsData.find(prc => { return (prc['PrcId'] === row['CurPrNm'] && prc['PrcTp'] === 'APIR' && prc['PgmID'].toUpperCase() === pgmId.toUpperCase() && row['StnTyp'] === 'C')})) {
                    ceTRow = ceTBody.insertRow(-1);
                    for (key in row) {
                        if (key === 'LineNum') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' style = "background: peru; color: black" id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                        else if (key === 'Stn') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" LvlNum = "${row['LvlNum']}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
    
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.style.backgroundColor = 'peru';
                        } else if (key === 'StnDate') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                    }
                } else if ((type === 'ALL' || type === 'API') && gPrcDefsData.find(prc => { return (prc['PrcId'] === row['CurPrNm'] && prc['PrcTp'] === 'APIVP' && prc['PgmID'].toUpperCase() === pgmId.toUpperCase() && row['StnTyp'] === 'C')})) {
                    ceTRow = ceTBody.insertRow(-1);
                    for (key in row) {
                        if (key === 'LineNum') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' style = "background: burlywood; color: black" id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                        else if (key === 'Stn') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" LvlNum = "${row['LvlNum']}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
    
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.style.backgroundColor = 'burlywood';
                        } else if (key === 'StnDate') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                    }
                } else if ((type === 'ALL' || type === 'API') && gPrcDefsData.find(prc => { return (prc['PrcId'] === row['CurPrNm'] && prc['PrcTp'] === 'APIVM' && prc['PgmID'].toUpperCase() === pgmId.toUpperCase() && row['StnTyp'] === 'C')})) {
                    ceTRow = ceTBody.insertRow(-1);
                    for (key in row) {
                        if (key === 'LineNum') {
                            ceTCell = ceTRow.insertCell(-1);
    
                            if (row['LvlNum'] === '3')
                                ceTCell.innerHTML = `<pre class = 'preBody' style = "background: lightblue; color: black" id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                            else
                                ceTCell.innerHTML = `<pre class = 'preBody' style = "background: wheat; color: black" id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                        else if (key === 'Stn') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" LvlNum = "${row['LvlNum']}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
    
                            ceTCell = ceTRow.insertCell(-1);
                            if (row['LvlNum'] === '3')
                                ceTCell.style.backgroundColor = 'lightblue';
                            else
                                ceTCell.style.backgroundColor = 'wheat';
                        } else if (key === 'StnDate') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                    }
                } else if ((type === 'ALL' || type === 'API') && gPrcDefsData.find(prc => { return (prc['PrcId'] === row['CurPrNm'] && prc['PrcTp'] === 'APIU' && prc['PgmID'].toUpperCase() === pgmId.toUpperCase() && row['StnTyp'] === 'C')})) {
                    ceTRow = ceTBody.insertRow(-1);
                    for (key in row) {
                        if (key === 'LineNum') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' style = "background: brown; color: black" id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                        else if (key === 'Stn') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" LvlNum = "${row['LvlNum']}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
    
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.style.backgroundColor = 'brown';
                        } else if (key === 'StnDate') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                    }
                } else if ((type === 'ALL' || type === 'SKL') && gPrcDefsData.find(prc => { return (prc['PrcId'] === row['CurPrNm'] && prc['PrcTp'] === 'SKL' && prc['PgmID'].toUpperCase() === pgmId.toUpperCase() && row['StnTyp'] === 'C')})) {
                    ceTRow = ceTBody.insertRow(-1);
                    for (key in row) {
                        if (key === 'LineNum') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' style = "background: lightblue; color: black" id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                        else if (key === 'Stn') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" LvlNum = "${row['LvlNum']}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
    
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.style.backgroundColor = 'lightblue';
                        } else if (key === 'StnDate') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                    }
                } else if (type === 'ALL' && row['StnTyp'] === 'C') {
                    ceTRow = ceTBody.insertRow(-1);
                    // ceTRow.style.background = 'lightpink';
                    for (key in row) {
                        if (key === 'LineNum') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' style = "background: lightblue; color: black" id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                        else if (key === 'Stn') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBodyWU'  id = "${row['LineNum']}Stn" LvlNum = "${row['LvlNum']}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
    
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.style.backgroundColor = 'lightblue';
                        } else if (key === 'StnDate') {
                            ceTCell = ceTRow.insertCell(-1);
                            ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        }
                    }
                }
            }
        })
        drawStatesTable(pgmId);
    }
    
    if ($('#ceTBody tr').length === 0) {
        ceTRow = ceTBody.insertRow(-1);
        ceTCell = ceTRow.insertCell(-1);
        ceTCell.colSpan = 4;
        ceTCell.setAttribute('align', 'center');
        ceTCell.innerHTML = `<pre class = 'preBody'>No records found !</pre>`;
    } else {
                //wrap words in spans
        $('.preBodyWU').each(function() {
            var $this = $(this);
            var comparator = '';
            var attributes = ['MVar', 'SVar1', 'SVar2', 'SVar3', 'SVar4', 'FileNm', 'InvPrNm', 'CurPrNm'];

            attributes.forEach(attrName => {
                if ($this.attr(attrName) != 'null' && (gPgmSchemaWData.find(row => {return(row['ShortNm'] === $this.attr(attrName))}) || gSubRoutineData.find(row => {return(row['MVar'] === $this.attr(attrName))}))) {
                    var word = $this.attr(attrName).replace(/[$#@%&_*]/g, '\\$&');
                    comparator = comparator === '' ? word : comparator.concat('|', word);
                } else if ($this.attr(attrName) != 'null' && $this.attr(attrName).indexOf("'") >= 0){
                    // console.log($this.attr(attrName));
                    var word = $this.attr(attrName).replace(/[$#@%&_*]/g, '\\$&');
                    var re = RegExp(word, "ig");
                    $this.html($this.html().replace(re,  `<span style = 'color: #f19947; display:inline;'>$&</span>`));
                }
            })

            if (comparator != '') {
                var re = RegExp(comparator, "ig");
                $this.html($this.html().replace(re,  `<span style = 'cursor: pointer; display:inline;' onClick = "invokeCodeBrowserWhereUsed('$&')">$&</span>`));
            }

            if ($this.attr('OpCode') === 'COMM') {
                $(this).css('color','#66b366').text();
            } else if ($this.attr('StnTyp') === 'C') {
                var re = RegExp($this.attr('OpCode'), "ig");
                $this.html($this.html().replace(re, `<span style = 'color:#d68ff5; display:inline;'>$&</span>`));
            }
    
            if ($this.attr('OpCode') === 'EXSR') {
                var re = RegExp($this.attr('OpCode'), "ig");
                $this.html($this.html().replace(re, `<span style = 'cursor: pointer; display:inline;' onClick = "invokeCodeBrowserWhereUsed('$&', '${$this.attr('id')}')">$&</span>`));
            } else if ($this.attr('OpCode') === 'BEGSR') {
                var re = RegExp($this.attr('OpCode'), "ig");
                $this.html($this.html().replace(re, `<span style = 'cursor: pointer; display:inline;' onClick = "goBackToExSR('$&', '${$this.attr('id')}')">$&</span>`));
            }
            
            if ($this.attr('LvlNum') === '9') {
                $(this).css('background','cyan').text();
                $(this).css('color','black').text();
            }
        });

    }
}

function drawSubRoutineExplosion () {
    document.getElementById("ceLvlSel").value = 'Select Level';
    document.getElementById('ceReEnggSel').value = 'Re-engineer';

    ///editing by seema
    var ceDiv1 = document.getElementById('ceDiv1');

    if (ceDiv1)
        ceDiv1.parentNode.removeChild(ceDiv1);

    // Draw Code Editor DIV
    var divContainer = document.createElement('div');
    divContainer.setAttribute('id', 'ceDiv1');
    divContainer.setAttribute('class', 'relative1 draggable resizable');
    document.body.appendChild(divContainer);
    $( function() { $('.draggable').draggable().resizable();});
    var ceSpan = document.createElement('span');
        ceSpan.setAttribute('id', 'ceClose');
        ceSpan.setAttribute('class', 'ceClose');
        //ceSpan.setAttribute('onclick', `$(this).parent().hide();`);
        ceSpan.setAttribute('onclick', 'closetempdiv(event)');
        ceSpan.innerHTML = 'X';
        divContainer.appendChild(ceSpan);
    PositionDiv("ceDiv1", 'M');
    checkotherdivs("ceDiv", "ceDiv4", "ceDiv2", "ceDiv3", "editdata");
    // if (document.getElementById("ceDiv").style.display == 'block')
    // PositionDiv("ceDiv", 'P');
    // if (document.getElementById("editdata").style.display == 'block')
    // PositionDiv("editdata", 'P');

    ///end by seema
    // var divContainer = document.getElementById("editdata");

    // while (divContainer.childNodes[2])
    //     divContainer.removeChild(divContainer.childNodes[2]);

    var srTable = document.createElement('table');
    srTable.setAttribute('id', 'srTable');
    srTable.setAttribute('height', 'auto');
    srTable.setAttribute('width', '100%');
    divContainer.appendChild(srTable);

    document.getElementById("ceDiv1").style.position = 'fixed'; //absolute
    document.getElementById("ceDiv1").style.display = 'block';  //inline
    document.getElementById("ceDiv1").style.background = '#262626';

    // Draw Rest API TABLE HEAD
    var srTHead = document.createElement('thead');
    srTHead.setAttribute('id', 'srTHead');
    srTable.appendChild(srTHead);

    // Dsrw Rest API TABLE BODY
    var srTBody = document.createElement('tbody');
    srTBody.setAttribute('id', 'srTBody');
    srTable.appendChild(srTBody);

    var srTRow = undefined;
    var srTCell = undefined;

    srTRow = srTHead.insertRow(-1);
    srTCell = srTRow.insertCell(-1);
    srTCell.innerHTML = `<input type = 'text' class = 'ceDivBlankHead' value = ''/>`;

    // Creating Table Head Rows for heading
    srTRow = srTHead.insertRow(-1);

    srTCell = srTRow.insertCell(-1);
    srTCell.innerHTML = `<input type = 'text' class = 'ceDivHeadCap' value = 'Sub-Routine Explosion Chart'/>`;

    gPrcCallsExplosionData.forEach((row, idx) => {
        srTRow = srTBody.insertRow(-1);
        srTCell = srTRow.insertCell(-1);

        var pxMul = 15;
        srTCell.innerHTML = `<input type = 'text' class = 'preBodySRE' value = '${row['Stn'].trim()}' style = 'width: 100%; margin-left: ${eval(pxMul*row['LvlNum'])}px'/>`;
    })
}

function drawCodeEditor(pgmId, pgmStn, lineNum, data) {

    if (data) {
        gPgmCodeData = data.PgmCodeData;
        gPgmSchemaWData = data.PgmSchemaWData;
        gSubRoutineData = data.SubRoutineData;
        gDbFldFileData = data.DbFldFileData;
        gPrcDefsData = data.PrcDefsData;
        gRestApiData = data.RestApiData;
        gPrcCallsExplosionData = data.PrcCallsExplosionData;
        // gCmpStatesData = data.CmpStatesData;
        // gApiDefsData = data.ApiDefsData;
        // gApiRulesData = data.ApiRulesData;
        // gApiRLogicData = data.ApiRLogicData;
        // gApiSchemaData = data.ApiSchemaData;
        gPgmStatesData = data.PgmStatesData;
        gPgmStScmaData = data.PgmStScmaData;
        gPgmStRulesData = data.PgmStRulesData;
    }

    var ceDiv = document.getElementById('ceDiv');

    if (ceDiv)
        ceDiv.parentNode.removeChild(ceDiv);

    // Draw Code Editor DIV
    var ceDiv = document.createElement('div');
    ceDiv.setAttribute('id', 'ceDiv');
    

    if (browserMode === 1)
        ceDiv.setAttribute('class', 'ceDivIndv');
    else
        ceDiv.setAttribute('class', 'ceDiv');

    document.body.appendChild(ceDiv);
    // added by seema

     
      if  (FlagCodeEditor == 0)  
     { 
      PositionDiv("ceDiv", 'M');
      checkotherdivs("ceDiv4", "ceDiv1", "ceDiv2", "ceDiv3", "editdata");
      FlagCodeEditor = 1;
     }
     else /// again source browser call from whereused
     {
        ceDiv.style.right=='';
        PositionDiv("ceDiv", 'M');
        deleteallsubmenus();
        checkotherdivs("ceDiv4", "ceDiv1", "ceDiv2", "ceDiv3", "editdata");
     }
      // if (document.getElementById("editdata").style.display == 'block')
        // if (document.getElementById("editdata").style.display == 'block')
        // PositionDiv("editdata", 'P');
    // ended by seema

    if (browserMode != 1){
        var srExplosionDiv = document.createElement('div');
       // srExplosionDiv.style.position = 'fixed';
        srExplosionDiv.style.position = 'absolute';
        srExplosionDiv.style.left = '36%';
        ceDiv.appendChild(srExplosionDiv);

        var srExplosionBtn = document.createElement('button');
        srExplosionBtn.setAttribute('id', 'srExplosionBtn');
        srExplosionBtn.setAttribute('class', 'srExplosionBtn');
        srExplosionBtn.setAttribute('onClick', `drawSubRoutineExplosion()`);
        srExplosionBtn.innerHTML = 'Draw SubRoutine Explosion'
        srExplosionDiv.appendChild(srExplosionBtn);

        var ceReEnggSelDiv = document.createElement('div');
        //ceReEnggSelDiv.style.position = 'fixed';
        ceReEnggSelDiv.style.position = 'absolute';
        ceReEnggSelDiv.style.left = '42%';
        ceDiv.appendChild(ceReEnggSelDiv);

        var ceReEnggSel = document.createElement('select');
        ceReEnggSel.setAttribute('id', 'ceReEnggSel');
        ceReEnggSel.setAttribute('class', 'ceReEnggSel');
        ceReEnggSel.setAttribute('onChange', `handleReEnggSelChange('${pgmId}')`);
        ceReEnggSelDiv.appendChild(ceReEnggSel);

        ceReEnggSel.innerHTML = '<option value="Re-engineer" selected disabled hidden>Re-engineer</option>';

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'API');
        ceReEnggSelOpt.innerHTML = `<pre>API</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'SKL');
        ceReEnggSelOpt.innerHTML = `<pre>SKL</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'ALL');
        ceReEnggSelOpt.innerHTML = `<pre>ALL</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'NONE');
        ceReEnggSelOpt.innerHTML = `<pre>NONE</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceLvlSelDiv = document.createElement('div');
        //ceLvlSelDiv.style.position = 'fixed';
        ceLvlSelDiv.style.position = 'absolute';
        ceLvlSelDiv.style.left = '47%';
        ceDiv.appendChild(ceLvlSelDiv);

        var ceLvlSel = document.createElement('select');
        ceLvlSel.setAttribute('id', 'ceLvlSel');
        ceLvlSel.setAttribute('class', 'ceLvlSel');
        ceLvlSel.setAttribute('onChange', 'handleLevelChange()');
        ceLvlSelDiv.appendChild(ceLvlSel);

        ceLvlSel.innerHTML = '<option value="Select Level" selected disabled hidden>Select Level</option>';

        cnt = 1;
        while (cnt <= 5) {
            var ceLvlSelOpt = document.createElement('option');
            ceLvlSelOpt.setAttribute('value', `Level ${cnt}`);
            ceLvlSelOpt.innerHTML = `<pre>Level ${cnt}</pre>`
            ceLvlSel.appendChild(ceLvlSelOpt);
            cnt++;
        }

        var ceSpan = document.createElement('span');
        ceSpan.setAttribute('id', 'ceClose');
        ceSpan.setAttribute('class', 'ceClose');
     //   ceSpan.setAttribute('onclick', `$(this).parent().hide();`);
        ceSpan.setAttribute('onclick', 'closetempdiv(event)');
        ceSpan.innerHTML = 'X';
        ceDiv.appendChild(ceSpan);
    } else {
        var srExplosionDiv = document.createElement('div');
        srExplosionDiv.style.position = 'absolute';
        srExplosionDiv.style.right = '21%';
        ceDiv.appendChild(srExplosionDiv);

        var srExplosionBtn = document.createElement('button');
        srExplosionBtn.setAttribute('id', 'srExplosionBtn');
        srExplosionBtn.setAttribute('class', 'srExplosionBtn');
        srExplosionBtn.setAttribute('onClick', `drawSubRoutineExplosion()`);
        srExplosionBtn.innerHTML = 'Draw SubRoutine Explosion'
        srExplosionDiv.appendChild(srExplosionBtn);

        var ceReEnggSelDiv = document.createElement('div');
        //ceReEnggSelDiv.style.position = 'fixed';
        ceReEnggSelDiv.style.position = 'absolute';
        ceReEnggSelDiv.style.right = '51%';
        ceDiv.appendChild(ceReEnggSelDiv);

        var ceReEnggSel = document.createElement('select');
        ceReEnggSel.setAttribute('id', 'ceReEnggSel');
        ceReEnggSel.setAttribute('class', 'ceReEnggSel');
        ceReEnggSel.setAttribute('onChange', `handleReEnggSelChange('${pgmId}')`);
        ceReEnggSelDiv.appendChild(ceReEnggSel);

        ceReEnggSel.innerHTML = '<option value="Re-engineer" selected disabled hidden>Re-engineer</option>';

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'API');
        ceReEnggSelOpt.innerHTML = `<pre>API</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'SKL');
        ceReEnggSelOpt.innerHTML = `<pre>SKL</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'ALL');
        ceReEnggSelOpt.innerHTML = `<pre>ALL</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceReEnggSelOpt = document.createElement('option');
        ceReEnggSelOpt.setAttribute('value', 'NONE');
        ceReEnggSelOpt.innerHTML = `<pre>NONE</pre>`
        ceReEnggSel.appendChild(ceReEnggSelOpt);

        var ceLvlSelDiv = document.createElement('div');
        //ceLvlSelDiv.style.position = 'fixed';
        ceLvlSelDiv.style.position = 'absolute';
        ceLvlSelDiv.style.right = '56%';
        ceDiv.appendChild(ceLvlSelDiv);

        var ceLvlSel = document.createElement('select');
        ceLvlSel.setAttribute('id', 'ceLvlSel');
        ceLvlSel.setAttribute('class', 'ceLvlSel');
        ceLvlSel.setAttribute('onChange', 'handleLevelChange()');
        ceLvlSelDiv.appendChild(ceLvlSel);

        ceLvlSel.innerHTML = '<option value="Select Level" selected disabled hidden>Select Level</option>';

        cnt = 1;
        while (cnt <= 5) {
            var ceLvlSelOpt = document.createElement('option');
            ceLvlSelOpt.setAttribute('value', `Level ${cnt}`);
            ceLvlSelOpt.innerHTML = `<pre>Level ${cnt}</pre>`
            ceLvlSel.appendChild(ceLvlSelOpt);
            cnt++;
        }
    }

    ceDiv.style.display = 'block';
    ceDiv.style.position = 'absolute';

    // Draw Code Editor TABLE
    var ceTable = document.createElement('table');
    ceTable.setAttribute('id', 'ceTable');
    ceTable.setAttribute('height', 'auto');
    ceTable.setAttribute('width', '80%');
    // ceTable.setAttribute('align', 'left');
    ceDiv.appendChild(ceTable);

    // Draw Code Editor TABLE HEAD
    var ceTHead = document.createElement('thead');
    ceTHead.setAttribute('id', 'ceTHead');
    ceTable.appendChild(ceTHead);

    // Draw Code Editor TABLE BODY
    var ceTBody = document.createElement('tbody');
    ceTBody.setAttribute('id', 'ceTBody');
    ceTable.appendChild(ceTBody);

    var ceTRow = undefined;
    var ceTCell = undefined;

    // Inserting BLANK Rows on top to ignore overlap with DATA Models etc heading
    // if (browserMode != 1) {
        var bRow = 3;

        while (bRow > 0) {
            ceTRow = ceTHead.insertRow(-1);
            ceTCell = ceTRow.insertCell(-1);
            ceTCell.colSpan = 3;
            ceTCell.innerHTML = `<input type = 'text' class = 'ceDivBlankHead' value = ''/>`;
            bRow --;
        }
    // }

    // Creating Table Head Rows for heading
    ceTRow = ceTHead.insertRow(-1);

    ceTCell = ceTRow.insertCell(-1);
    ceTCell.colSpan = 4;
    ceTCell.innerHTML = `<input type = 'text' class = 'ceDivHeadCap' value = '${pgmId}'/>`;

    ceTRow = ceTHead.insertRow(-1);

    ceTCell = ceTRow.insertCell(-1);
    ceTCell.width = '10%';
    ceTCell.innerHTML = `<input type = 'text' class = 'ceDivHeadCol' value='LineNo'></input>`;

    ceTCell = ceTRow.insertCell(-1);
    ceTCell.width = '80%';
    ceTCell.innerHTML = `<input type = 'text' class = 'ceDivHeadCol' value='Stn'></input>`;

    ceTCell = ceTRow.insertCell(-1);
    ceTCell.width = '1%';
    ceTCell.innerHTML = `<input type = 'text' class = 'ceDivHeadCol' value=''></input>`;

    ceTCell = ceTRow.insertCell(-1);
    ceTCell.width = '9%';
    ceTCell.innerHTML = `<input type = 'text' class = 'ceDivHeadCol' value='Date'></input>`;

    console.log('DrawCodeEditorLevelNum:', level);

    gPgmCodeData.forEach((row) => {
        if (row['LvlNum'] >= level && (row['StnTyp'] === 'F' || row['StnTyp'] === 'D' || row['StnTyp'] === 'C')) {
            ceTRow = ceTBody.insertRow(-1);
    
            for (key in row) {
                if (key === 'LineNum' || key === 'StnDate') {

                    ceTCell = ceTRow.insertCell(-1);
                    ceTCell.innerHTML = `<pre class = 'preBody' id = "${row[key]}" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                }
                else if (key === 'Stn') {
                    ceTCell = ceTRow.insertCell(-1);
                    ceTCell.colSpan = 2;

                    if (lineNum != null && lineNum === row['LineNum']) {
                        ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" style = "background-color: cyan; color: black" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                        highlightedElem = document.getElementById(`${row['LineNum']}Stn`);
                        // highlightedElemLineNum = document.getElementById(`${row['LineNum']}`);
                    }
                    else
                        ceTCell.innerHTML = `<pre class = 'preBodyWU' id = "${row['LineNum']}Stn" StnTyp = "${row['StnTyp']}" OpCode = "${row['OpCode']}" MVar = "${row['MVar']}" SVar1 = "${row['SVar1']}" SVar2 = "${row['SVar2']}" SVar3 = "${row['SVar3']}" SVar4 = "${row['SVar4']}" FileNm = "${row['FileNm']}" InvPrNm= "${row['InvPrNm']}" CurPrNm = "${row['CurPrNm']}">${row[key]}</pre>`;
                }
            }
        }
    })


    if (pgmStn != null){
        ceDiv.scrollBy(0, highlightedElem.getBoundingClientRect()['top']-150);
    }
    //wrap words in spans
    $('.preBodyWU').each(function(stn) {
        var $this = $(this);
        var comparator = '';
        var attributes = ['MVar', 'SVar1', 'SVar2', 'SVar3', 'SVar4', 'FileNm', 'InvPrNm', 'CurPrNm'];

        attributes.forEach(attrName => {
            if ($this.attr(attrName) != 'null' && (gPgmSchemaWData.find(row => {return(row['ShortNm'] === $this.attr(attrName))}) || gSubRoutineData.find(row => {return(row['MVar'] === $this.attr(attrName))}))) {
                var word = $this.attr(attrName).replace(/[$#@%&_*]/g, '\\$&');
                comparator = comparator === '' ? word : comparator.concat('|', word);
            } else if ($this.attr(attrName) != 'null' && $this.attr(attrName).indexOf("'") >= 0){
                // console.log($this.attr(attrName));
                var word = $this.attr(attrName).replace(/[$#@%&_*]/g, '\\$&');
                var re = RegExp(word, "ig");
                $this.html($this.html().replace(re,  `<span style = 'color: #f19947; display:inline;'>$&</span>`));
            }
        })

        if (comparator != '') {
            var re = RegExp(comparator, "ig");
            $this.html($this.html().replace(re, `<span style = 'cursor: pointer; display:inline;' onClick = "invokeCodeBrowserWhereUsed('$&')">$&</span>`));
        }

        if ($this.attr('OpCode') === 'COMM') {
            $(this).css('color','#66b366').text();
        } else if ($this.attr('StnTyp') === 'C') {
            var re = RegExp($this.attr('OpCode'), "ig");
            $this.html($this.html().replace(re, `<span style = 'color:#d68ff5; display:inline;'>$&</span>`));
        }

        if ($this.attr('OpCode') === 'EXSR') {
            var re = RegExp($this.attr('OpCode'), "ig");
            $this.html($this.html().replace(re, `<span style = 'cursor: pointer; display:inline;' onClick = "invokeCodeBrowserWhereUsed('$&', '${$this.attr('id')}')">$&</span>`));
        } else if ($this.attr('OpCode') === 'BEGSR') {
            var re = RegExp($this.attr('OpCode'), "ig");
            $this.html($this.html().replace(re, `<span style = 'cursor: pointer; display:inline;' onClick = "goBackToExSR('$&', '${$this.attr('id')}')">$&</span>`));
        }
    });

    // bind to each span
    // $('span').hover(
    //     // function() {console.log($(this).text())}
    //     function() { $(this).css('background-color','#ffff66').text() }
    //     function() { $('#word').text(''); $(this).css('background-color','');}
    // );
}

function goBackToExSR (input, id) {
    // console.log(subRoutineCallArr);

    var match = subRoutineCallArr.find(sr => {
        return ($(document.getElementById(sr)).attr('InvPrNm') === $(document.getElementById(id)).attr('MVar'));
    })

    if (subRtFocus) {
        subRtFocus.style.background = '';
        subRtFocus.style.color = '';
    }

    // console.log(match);

    if (match) {
        subRtFocus = document.getElementById(match);
        subRtFocus.style.background = 'cyan';
        subRtFocus.style.color = 'black';
        ceDiv.scrollBy(0, subRtFocus.getBoundingClientRect()['top']-150);
    }

    subRoutineCallArr = subRoutineCallArr.filter(sr => {console.log(sr, match); return (sr != match)});
    // console.log(subRoutineCallArr);
}


var FlagDrWoFiWhUs = 0;
function drawWorkFieldWhereUsed(schemaData, codeData) {

    // var divContainer = document.getElementById("editdata");

    // while (divContainer.childNodes[2])
    //     divContainer.removeChild(divContainer.childNodes[2]);

    

    var ceDiv2 = document.getElementById('ceDiv2');

    if (ceDiv2)
        ceDiv2.parentNode.removeChild(ceDiv2);

    // Draw Code Editor DIV
    var divContainer = document.createElement('div');
    divContainer.setAttribute('id', 'ceDiv2');
    divContainer.setAttribute('class', 'relative1 draggable resizable');
    document.body.appendChild(divContainer);
    $( function() { $('.draggable').draggable().resizable();});
    var ceSpan = document.createElement('span');
        ceSpan.setAttribute('id', 'ceClose');
        ceSpan.setAttribute('class', 'ceClose');
        ceSpan.setAttribute('onclick', `$(this).parent().hide();`);
        ceSpan.setAttribute('onclick', 'closetempdiv(event)');
        ceSpan.innerHTML = 'X';
        divContainer.appendChild(ceSpan);

        PositionDiv("ceDiv2", 'M');
        if (FlagDrWoFiWhUs == 0)
        {
           
        checkotherdivs("ceDiv", "ceDiv1", "ceDiv4", "ceDiv3", "editdata");
        // if (document.getElementById("ceDiv").style.display == 'block')
        //    PositionDiv("ceDiv", 'P');
        // if (document.getElementById("editdata").style.display == 'block')
        //    PositionDiv("editdata", 'P');
        }

        if (FlagDrWoFiWhUs == 0)
        FlagDrWoFiWhUs = 1;



    //Top Heading 
    var table = document.createElement("table");
    table.setAttribute("class", "tableq");

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.outerHTML = `<th colspan=4 class = 'ceDivHeadCapMain'>${schemaData['PgmId']} :: ${schemaData['ShortNm']}</th>`
    // tabCell.setAttribute("align", "center");
    // tabCell.setAttribute("width", "200px");

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = `<input type = 'text' class = 'ceDivBlankHead' value = ''/>`;
    divContainer.appendChild(table);

    // ADD JSON DATA TO THE TABLE AS ROWS.
    var table = document.createElement("table")
    table.setAttribute("class", "tableq");

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.outerHTML = `<th colspan=4 class = 'ceDivHeadCol'>Schema Details</th>`

    tr = table.insertRow(-1);

    var tabCell = tr.insertCell(-1);
    tabCell.setAttribute("width", "100px");
    tabCell.innerHTML = `<pre class = 'preBody'>${schemaData.ShortNm}</pre>`;

    var tabCell = tr.insertCell(-1);
    tabCell.setAttribute("align", "right");
    tabCell.setAttribute("width", "30px");
    tabCell.innerHTML = `<pre class = 'preBody'>${schemaData.Len}</pre>`;

    if (schemaData.DecP) {
        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute("align", "right");
        tabCell.setAttribute("width", "30px");
        tabCell.innerHTML = `<pre class = 'preBody'>${schemaData.DecP}</pre>`;
    }
    
    var tabCell = tr.insertCell(-1);
    tabCell.setAttribute("align", "right");
    tabCell.setAttribute("width", "10px");
    tabCell.innerHTML = `<pre class = 'preBody'>${schemaData.DtaTyp}</pre>`;

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = `<input type = 'text' class = 'ceDivBlankHead' value = ''/>`;
    divContainer.appendChild(table);

    var table = document.createElement("table")
    table.setAttribute("class", "tableq");

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.outerHTML = `<th colspan=2 class = 'ceDivHeadCol'>Code Details</th>`

    codeData.forEach((row) => {
        tr = table.insertRow(-1);
        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute("width", "50px");
        tabCell.innerHTML = `<pre class = 'preBody'>${row.LineNum}</pre>`;

        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute("width", "140px");

        var stn = row['Stn'];
        row['Stn'] = row['Stn'].replace(/'/g, "\\'");

        tabCell.innerHTML = `<a onClick = "locateWorkFieldWhereUsedStn('${row.LineNum}')"><pre class = 'preLink'>${stn}</pre></a>`;
    });

    divContainer.appendChild(table);

    document.getElementById("ceDiv2").style.position = 'fixed'; //'absolute';
    document.getElementById("ceDiv2").style.display = 'block';  //'inline';
    document.getElementById("ceDiv2").style.background = '#262626';
}


function drawSubRoutineWhereUsed(sr, codeData) {

    // var divContainer = document.getElementById("editdata");

    // while (divContainer.childNodes[2])
    //     divContainer.removeChild(divContainer.childNodes[2]);

    var ceDiv3 = document.getElementById('ceDiv3');

    if (ceDiv3)
        ceDiv3.parentNode.removeChild(ceDiv3);

    // Draw Code Editor DIV
    var divContainer = document.createElement('div');
    divContainer.setAttribute('id', 'ceDiv3');
    divContainer.setAttribute('class', 'relative1 draggable resizable');
    document.body.appendChild(divContainer);
    $( function() { $('.draggable').draggable().resizable();});
    var ceSpan = document.createElement('span');
        ceSpan.setAttribute('id', 'ceClose');
        ceSpan.setAttribute('class', 'ceClose');
      //  ceSpan.setAttribute('onclick', `$(this).parent().hide();`);
        ceSpan.setAttribute('onclick', 'closetempdiv(event)');
        ceSpan.innerHTML = 'X';
        divContainer.appendChild(ceSpan);
        PositionDiv("ceDiv3", 'M');
    //     if (document.getElementById("ceDiv").style.display == 'block')
    // PositionDiv("ceDiv", 'P');
    // if (document.getElementById("editdata").style.display == 'block')
    // PositionDiv("editdata", 'P');
   // PositionDiv("ceDiv3", 'M');
    checkotherdivs("ceDiv", "ceDiv1", "ceDiv2", "ceDiv4"," editdata");


    //Top Heading 
    var table = document.createElement("table");
    table.setAttribute("class", "tableq");

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.outerHTML = `<th colspan=4 class = 'ceDivHeadCapMain'>${codeData[0]['PgmId']} :: ${sr}</th>`
    // tabCell.setAttribute("align", "center");
    // tabCell.setAttribute("width", "200px");

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = `<input type = 'text' class = 'ceDivBlankHead' value = ''/>`;
    divContainer.appendChild(table);

    var table = document.createElement("table")
    table.setAttribute("class", "tableq");

    tr = table.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.outerHTML = `<th colspan=2 class = 'ceDivHeadCol'>Code Details</th>`

    codeData.forEach((row) => {
        tr = table.insertRow(-1);
        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute("width", "50px");
        tabCell.innerHTML = `<pre class = 'preBody'>${row.LineNum}</pre>`;

        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute("width", "140px");

        var stn = row['Stn'];
        row['Stn'] = row['Stn'].replace(/'/g, "\\'");

        tabCell.innerHTML = `<a onClick = "locateWorkFieldWhereUsedStn('${row.LineNum}')"><pre class = 'preLink'>${stn}</pre></a>`;
    });

    divContainer.appendChild(table);

    document.getElementById("ceDiv3").style.position = 'fixed'; //'absolute';
    document.getElementById("ceDiv3").style.display = 'block';  //'inline';
    document.getElementById("ceDiv3").style.background = '#262626';

}

function locateWorkFieldWhereUsedStn (lineNum) {

    if (highlightedElem) {
        highlightedElem.style.backgroundColor = '';
        highlightedElem.style.color = '';
    }

    highlightedElem = document.getElementById(`${lineNum}Stn`);
    highlightedElem.style.backgroundColor = 'cyan';
    highlightedElem.style.color = 'black';
    ceDiv.scrollBy(0, highlightedElem.getBoundingClientRect()['top']-150);
}

var CBWUcount = 0;
function invokeCodeBrowserWhereUsed(input, id) {
    if (highlightedElem) {
        highlightedElem.style.backgroundColor = '';
        highlightedElem.style.color = '';
    }

    if (subRtFocus) {
        subRtFocus.style.background = '';
        subRtFocus.style.color = '';
    }

    //  If we have clicked on DB field to get the WHERE USED DATA
    var match = gDbFldFileData.find(row => {
        return (row['ShortNm'] === input.toUpperCase())
    })

    if (match) {
        Parameter1 = match['ShortNm'].concat('+', match['EntID']);
        Parameter2 = 'name';

        CBWUcount++;
        showids(null);
        PositionDiv("editdata", 'M');
        console.log("CBWUcount=====", CBWUcount);
        if (CBWUcount == 1)
        {
            if (document.getElementById("ceDiv").style.display == 'block')
             PositionDiv("ceDiv", 'P');
             
             checkotherdivs("ceDiv4", "ceDiv1", "ceDiv2", "ceDiv3", "editdata");
        }     
           
    } else {
        //  If we have clicked on Work field to get WHERE USED DATA
        schemaData = gPgmSchemaWData.find(row => {
            return(row['ShortNm'] === input.toUpperCase())
        })

        if (schemaData) {
            codeData = gPgmCodeData.filter(row => {
                return(row['MVar'] === input.toUpperCase() || row['SVar1'] === input.toUpperCase() || row['SVar2'] === input.toUpperCase() || row['SVar3'] === input.toUpperCase() || row['SVar4'] === input.toUpperCase() && (row['StnTyp'] === 'F' || row['StnTyp'] === 'D' || row['StnTyp'] === 'C'))
            })

            drawWorkFieldWhereUsed(schemaData, codeData);
        } else {

            // If we have clicked on Sub Routine name to get whereUsed of that sub-routine

            match = gSubRoutineData.find(row => {
                return (row['MVar'] === input.toUpperCase())
            })

            if (match) {
                codeData = gPgmCodeData.filter(row => {
                    return(row['MVar'] === match['MVar'] || row['CurPrNm'] === match['MVar'] || row['InvPrNm'] === match['MVar'] && (row['StnTyp'] === 'F' || row['StnTyp'] === 'D' || row['StnTyp'] === 'C'));
                })

                drawSubRoutineWhereUsed(input, codeData);
            } else if (input.toUpperCase() === 'EXSR') { 
                // If we have clicked on Sub Routine EXSR to zoom in to the Sub-Routine Data

                srName = gPgmCodeData.find(row => {
                    return(row['LineNum'] === id.split('Stn')[0]);
                })

                subRoutineCallArr.push(id);

                var row = gPgmCodeData.find(row => {
                    return (row['OpCode'] === 'BEGSR' && row['MVar'] === srName['InvPrNm'])
                })

                subRtFocus = document.getElementById(`${row['LineNum']}Stn`);
                ceDiv.scrollBy(0, subRtFocus.getBoundingClientRect()['top']-150);
                subRtFocus.style.background = 'cyan';
                subRtFocus.style.color = 'black';
            } else {
                    console.log('Clicked field not identified !');
            }
        }
    }
}

var FlagCodeEditor = 0;
function invokeCodeEditorModule(pgmId, pgmStn, lineNum) {
    fetch(`http://localhost:3030/SourceBrowser/${pgmId}/`)
    .then(res => res.json())
    .then(data => {
        if (pgmStn === null)
            browserMode = 1;
           
        drawCodeEditor(pgmId, pgmStn, lineNum, data.result);
    })
}
/* Rashi Code Ends */