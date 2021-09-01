const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const mysql = require("mysql");
const { response } = require("express");
const path = require("path");

//app.use(bodyParser.json());
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  //password: "root@123", //for local seema's machine
  //password: "Mysql@123", //for pipeline server machine
  password: "mysql123", //for local shilpi machine
  //database: "cdemd014",
  
  //database: "custd008",
  database:"mvxd008",
 //database: "custd008",
//insecureAuth : 'true',
});

app.use(cors());
conn.connect((err) => {
  if (err) throw err;
  console.log("MySql Connected");
});

//app.use(express.static(path.join(__dirname, "/codefile")));
app.use(express.static("codefile"));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/readFile/:filename", (req, res)=>
{
  var filenm=req.params.filename;
  console.log("whats in filename===", filenm)
  var fs = require('fs');

var readMe = fs.readFileSync(`../QRPGLESRC/${filenm}.rpgle`, 'utf8').split('\n');
//console.log("readme==", readMe)
res.send(JSON.stringify({ status: 200, error: null, 
  response: {
   data:readMe
   }, 
  }));
})

app.get("/Entities", (req, res) => {
  console.log("inside entities");
  var entities = [];
  var entrels = [];
  //var dbname = [req.params.dbname];

  let sql = `SELECT  * FROM  ENTITIES `;
  let query =  conn.query(sql, async(err, results) => {
    if (err) throw err;
    entities = results;
    /* query to fetch entrels */
    let sql1 = `SELECT * FROM ENTRELS`;
    let query1 = await conn.query(sql1, async (err1, results1) => {
      if (err1) throw err1;
      console.log("shilpi RESULTS in ENTRELS==", results1);
      entrels = results1;
      res.send(JSON.stringify({ status: 200, error: null, 
        response: {
          entities: entities,
          entrels: entrels
         }, 
        }));
      });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/entsch/:entids', (req, res ) => {
  const entids = req.params.entids;
  const sql = `SELECT * FROM ENTSCHEMA WHERE ENTID IN (${entids})`;
  conn.query(sql, async(err, entities) => {
    if (err) throw err;
    console.log(entities);
    const resp = JSON.stringify({
      status: 200,
      error: null,
      response: {
        entities
      }
    });
    res.send(resp);
  });
  
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/PgmDefs/', async (req, res) => {
  console.log('inside pgmdefs');
  var programs = [];
  var chartArray = [];
  var chartArrayWithoutD = [];
  //var dbname = [req.params.dbname];

  let sql = `SELECT  * FROM  PGMDEFS `;
  let query = conn.query(sql, async (err, results) => {
    if (err) throw err;
    programs = results;
    /* query to fetch pgmcalls */
    let sql1 = `SELECT * FROM PGMCALLS WHERE PGMID <> CLDPGM AND CALLCLS = 'D' AND EXCPGM = ''`;
    let query1 = await conn.query(sql1, async (err1, results1) => {
      if (err1) throw err1;
      chartArray = results1;
      console.log('shilpi RESULTS in PGMCALLS==', results1);
      /*query to fetch pgmcalls with callcls=''*/
      let sql2 = `SELECT * FROM PGMCALLS WHERE PGMID <> CLDPGM AND CALLCLS = '' AND EXCPGM = ''`;
      let query2 = await conn.query(sql2, async (err2, results2) => {
        chartArrayWithoutD = results2;
        res.send(
          JSON.stringify({
            status: 200,
            error: null,
            response: {
              programs: programs,
              chartArray: chartArray,
              chartArrayWithoutD: chartArrayWithoutD,
            },
          })
        );
      });
    });
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmDefsDU", async(req, res) => {
  console.log("inside pgmdefsdatausage");
 
  let sql = `SELECT  * FROM  PGMDEFS `;
  let query = conn.query(sql, async(err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
    
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.get("/EntListDU", async(req, res) => {
  console.log("inside EntListdatausage");
 
  let sql = `SELECT  * FROM  ENTITIES `;
  let query = conn.query(sql, async(err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
    
  });
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmFiles/:entid", (req, res) => {
  console.log("inside pgmfiles");
  var entid = [req.params.entid];

  //entid == "0"
  //? "SELECT A.*, B.PGMTX, C.ENTTX FROM PGMFILES AS A LEFT JOIN PGMDEFS AS B ON  trim(A.PGMID)=trim(B.PGMID) LEFT JOIN ENTITIES AS C ON  trim(A.ENTID)=trim(C.ENTID) ORDER BY A.PGMID LIMIT 1000"
  let sql = `SELECT  A.*, B.PGMTX, C.ENTTX FROM  PGMFILES AS A LEFT JOIN PGMDEFS AS B ON  trim(A.PGMID)=trim(B.PGMID) LEFT JOIN ENTITIES AS C ON  trim(A.ENTID)=trim(C.ENTID) WHERE trim(A.ENTID)='${entid}'`;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    console.log("query===", sql);
    console.log("result==", results);
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmFiles/Entities/:pgmid", (req, res) => {
  var pgmid = req.params.pgmid;

  console.log("inside pgmfiles====", req.params.pgmid.slice(-1));
  if (req.params.pgmid.slice(-1) !== "$") {
    let sql = `SELECT  A.*, B.PGMTX, C.ENTTX FROM  PGMFILES AS A LEFT JOIN PGMDEFS AS B ON trim(A.PGMID)=trim(B.PGMID) LEFT JOIN ENTITIES AS C ON trim(A.ENTID)=trim(C.ENTID)   WHERE TRIM(A.PGMID)='${pgmid}'`;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  } else {
    ///not being used now....can b discarded later
    var pgmid1 = req.params.pgmid.substr(0, req.params.pgmid.length - 1);
    console.log("kya yahan aaya", pgmid1);
    let sql1 = `SELECT  A.ENTID as ID, B.ENTTX as TEXT FROM  PGMFILES AS A  INNER JOIN ENTITIES AS B ON trim(A.ENTID)=trim(B.ENTID)  WHERE TRIM(A.PGMID)='${pgmid1}' AND TRIM(A.FWRITE)="" AND TRIM(A.FDELETE)="" AND TRIM(A.FUPDATE)=""`;
    let sql2 = `SELECT  A.ENTID as ID, B.ENTTX as TEXT FROM  PGMFILES AS A  INNER JOIN ENTITIES AS B ON trim(A.ENTID)=trim(B.ENTID)  WHERE TRIM(A.PGMID)='${pgmid1}' AND (TRIM(A.FWRITE)!="" OR TRIM(A.FDELETE)!="" OR TRIM(A.FUPDATE)!="")`;
    let IFS = conn.query(sql1, (err, result) => {
      if (err) throw err;
      console.log("results1===", result);

      let OFS = conn.query(sql2, (err, results) => {
        if (err) throw err;
        // return results;
        res.send(
          JSON.stringify({
            status: 200,
            error: null,
            response: { InputFiles: result, OutputFiles: results },
          })
        );
        console.log("results2===", response);
      });
    });
    //console.log("OFS===", OFS);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/EntSchema/:entid", (req, res) => {
  console.log("inside entschema", [req.params.entid]);
  var entid = [req.params.entid];

  if (req.params.entid.slice(-1) !== "$") {
    let sql = `SELECT * FROM  ENTSCHEMA WHERE trim(ENTID)='${entid}'`;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  } else {
    var entid1 = req.params.entid.substr(0, req.params.entid.length - 1);
    let sql = `SELECT SHORTNM AS ID, FTXT AS TEXT FROM  ENTSCHEMA WHERE trim(ENTID)='${entid1}'`;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      console.log("entschema SQL==", sql, results);
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/DataUsageDiagram/Program/:pgmid", async (req, res) => {
  console.log("inside entschema", [req.params.pgmid]);
  var pgmid = [req.params.pgmid];
  var entities = [];
  var entschema = [];
  var pgmcode = [];

  let sql = `SELECT  A.*, B.PGMTX, C.ENTTX FROM  PGMFILES AS A LEFT JOIN PGMDEFS AS B ON trim(A.PGMID)=trim(B.PGMID) LEFT JOIN ENTITIES AS C ON trim(A.ENTID)=trim(C.ENTID)   WHERE TRIM(A.PGMID)='${pgmid}'  order by WHFUSG DESC`;
  let query = await conn.query(sql, async (err, results) => {
    if (err) throw err;
    //console.log("RESULTS in DFD==", results);
    var arrent = [];
    entities = results;
    results.map((ent) => {
      if (ent.ENTID !== null) arrent.push(`'${ent.ENTID}'`);
    });
    console.log("arrent==", arrent);

    let sql1 = `SELECT trim(ENTID) AS ENTID, trim(SHORTNM) AS ID, trim(FTXT) as TEXT  FROM PGMSCMDB AS A WHERE trim(A.ENTID) in (${arrent}) AND TRIM(A.PGMID)='${pgmid}'`;
    console.log("sql1===", sql1);
    let query1 = await conn.query(sql1, async (err1, results1) => {
      if (err1) throw err1;
      console.log("RESULTS in DFD==", results1);
      entschema = results1;

      let sql2 = `SELECT LINENUM as ID, STN as TEXT, FILENM as FILENM, MVAR as MVARDB, SVAR1 as SVAR1, SVAR2 as SVAR2, SVAR3 as SVAR3, SVAR4 as SVAR4 FROM PGMCODE AS A WHERE trim(A.FILENM) in (${arrent}) AND trim(A.PGMID)='${pgmid}'`;
      console.log("sql2===", sql2);
      let query2 = await conn.query(sql2, (err2, results2) => {
        if (err2) throw err2;
        //console.log("RESULTS in DFD==", results1);
        pgmcode = results2;

        res.send(
          JSON.stringify({
            status: 200,
            error: null,
            response: {
              entities: entities,
              entschema: entschema,
              pgmcode: pgmcode,
            },
          })
        );
      });
    });
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/DataUsageDiagram/File/:dbname/:entid", async (req, res) => {
  console.log("inside pgmschemaschema", [req.params.entid]);
  var entid = [req.params.entid];
  var dbname = [req.params.dbname];
  var programs = [];
  var pgmschema = [];
  var pgmcode = [];
  var entschema = [];
  

  let sql = `SELECT  A.*, B.PGMTX FROM  ${dbname}.PGMFILES AS A LEFT JOIN PGMDEFS AS B ON trim(A.PGMID)=trim(B.PGMID) WHERE TRIM(A.ENTID)='${entid}' order by WHFUSG DESC `;
  let query = await conn.query(sql, async (err, results) => {
    if (err) throw err;
    //console.log("RESULTS in DFD==", results);
    var arrpgm = [];
    programs = results;
    results.map((pgm) => {
      if (pgm.PGMID !== null) {
          let pgm1 = pgm.PGMID.trim()
        
        //arrpgm.push(`'${pgm.PGMID}'`);
        arrpgm.push(`'${pgm1}'`);
      }
    });
    console.log("arrpgm==", arrpgm);

    let sql1 = `SELECT trim(PGMID) AS PGMID, trim(SHORTNM) AS ID, trim(FTXT) as TEXT  FROM ${dbname}.PGMSCMDB AS A WHERE trim(A.PGMID) in (${arrpgm}) AND TRIM(A.ENTID)='${entid}'`;
    console.log("sql1===", sql1);
    let query1 = await conn.query(sql1, async (err1, results1) => {
      if (err1) throw err1;
      console.log("RESULTS in DFD==", results1);
      pgmschema = results1;

      let sql2 = `SELECT trim(PGMID) as PGMID, format(LINENUM,2) as ID, STN as TEXT, FILENM as FILENM, MVAR as MVARDB, SVAR1 as SVAR1, SVAR2 as SVAR2, SVAR3 as SVAR3, SVAR4 as SVAR4 FROM ${dbname}.PGMCODE AS A WHERE A.PGMID in (${arrpgm}) AND A.FILENM='${entid}'`;
      console.log("sql2===", sql2);
      let query2 = await conn.query(sql2, async(err2, results2) => {
        if (err2) throw err2;
        //console.log("RESULTS in DFD==", results1);
        pgmcode = results2;
        let sql3 = `SELECT trim(ENTID) AS PGMID, trim(SHORTNM) AS ID, trim(FTXT) as TEXT  FROM ${dbname}.ENTSCHEMA AS A WHERE TRIM(A.ENTID)='${entid}'`;
        console.log("sql3===", sql3);
        let query3 = await conn.query(sql3, async(err3, results3) => {
          if (err3) throw err3;
          entschema = results3;
          res.send(
          JSON.stringify({
            status: 200,
            error: null,
            response: {
              programs: programs,
              pgmschema: pgmschema,
              pgmcode: pgmcode,
              entschema: entschema,
            },
          })
        );
      });
    });
  });
 });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmSchema/:pgmid", (req, res) => {
  console.log("inside PgmSchema", req.params.pgmid);
  var pgmid = [req.params.pgmid];

  if (req.params.pgmid.slice(-1) !== "$") {
    let sql = `SELECT  A.* , B.PGMTX, C.ENTTX FROM PGMSCMDB  AS A LEFT JOIN PGMDEFS AS B ON  TRIM(A.PGMID)=TRIM(B.PGMID)
    LEFT JOIN ENTITIES AS C ON TRIM(A.ENTID) = TRIM(C.ENTID) WHERE trim(A.PGMID)=trim('${pgmid}')`;
    console.log("SQL===", sql);
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  } else {
    var pgmid1 = req.params.pgmid.substr(0, req.params.pgmid.length - 1);
    let sql = `SELECT  A.SHORTNM AS ID, A.FTXT AS TEXT FROM PGMSCMDB A
     WHERE trim(A.PGMID)=trim('${pgmid1}')`;
    console.log("SQL===", sql);
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmSchema/2/:pgmid/:entid", (req, res) => {
  console.log("inside PgmSchema");
  var pgmid = [req.params.pgmid];
  var entid = [req.params.entid];

  let sql = `SELECT  A.* , B.PGMTX, C.ENTTX FROM PGMSCMDB  AS A LEFT JOIN PGMDEFS AS B ON  TRIM(A.PGMID)=TRIM(B.PGMID)
  LEFT JOIN ENTITIES AS C ON TRIM(A.ENTID) = TRIM(C.ENTID) WHERE trim(A.PGMID)=trim('${pgmid}') AND trim(A.ENTID)=trim('${entid}')`;
  console.log("SQL===", sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmSchema/3/:entid", (req, res) => {
  console.log("inside PgmSchema");

  var entid = [req.params.entid];

  let sql = `SELECT  A.* , B.PGMTX, C.ENTTX FROM PGMSCMDB  AS A LEFT JOIN PGMDEFS AS B ON  TRIM(A.PGMID)=TRIM(B.PGMID)
  LEFT JOIN ENTITIES AS C ON TRIM(A.ENTID) = TRIM(C.ENTID) WHERE trim(A.ENTID)=trim('${entid}') ORDER BY A.PGMID`;
  console.log("SQL===", sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/Entview/:entid", (req, res) => {
  console.log("inside Entviews");
  var entid = [req.params.entid];

  let sql = `SELECT  * FROM  ENTVIEWS WHERE trim(ENTID)=trim('${entid}')`;
  console.log("SQL===", sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/EntRels/:entid", (req, res) => {
  console.log("inside EntRels");
  var entid = [req.params.entid];

  let sql = `SELECT A.*, B.ENTTX as PARTX,  C.ENTTX as CHLDTX  FROM ENTRELS AS A LEFT JOIN ENTITIES AS B ON  trim(A.PAR)=trim(B.ENTID)
 LEFT JOIN ENTITIES AS C ON trim(A.CHLD) = trim(C.ENTID) WHERE trim(A.PAR)='${entid}' or trim(A.CHLD)='${entid}' ;`;
  console.log("SQL===", sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmCalled/:pgmid", async (req, res) => {
  console.log("inside Pgmcalled==", req.params.pgmid);
  var pgmid = req.params.pgmid;
  if (req.params.pgmid.slice(-1) !== "$") {
    let sql = `SELECT A.*, B.PGMTX as PGMTX, C.PGMTX as CLDPGMTX  FROM PGMCALLS AS A LEFT JOIN PGMDEFS AS B ON  trim(A.PGMID)=trim(B.PGMID)
  LEFT JOIN PGMDEFS AS C ON  trim(A.CLDPGM)=trim(C.PGMID)
  WHERE trim(A.PGMID)=trim('${pgmid}') ;`;
    console.log("SQL===", sql);
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  } else {
    var pgmid1 = req.params.pgmid.substr(0, req.params.pgmid.length - 1);
    let sql = `SELECT A.CLDPGM as ID, B.PGMTX as TEXT  FROM PGMCALLS AS A LEFT JOIN PGMDEFS AS B ON  trim(A.CLDPGM)=trim(B.PGMID)
  WHERE trim(A.PGMID)=trim('${pgmid1}') ;`;
    console.log("SQL===", sql);
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmCalling/:pgmid", async (req, res) => {
  console.log("inside Pgmcalling==", req.params.pgmid);
  var pgmid = [req.params.pgmid];
  if (req.params.pgmid.slice(-1) !== "$") {
    let sql = `SELECT A.*, B.PGMTX as PGMTX, C.PGMTX as CALLPGMTX  FROM PGMCALLS AS A INNER JOIN PGMDEFS AS B ON  trim(A.PGMID)=trim(B.PGMID) INNER JOIN PGMDEFS AS C ON  trim(A.CLDPGM)=trim(C.PGMID)
  WHERE trim(A.CLDPGM)=trim('${pgmid}') ;`;
    console.log("SQL===", sql);
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  } else {
    var pgmid1 = req.params.pgmid.substr(0, req.params.pgmid.length - 1);
    let sql = `SELECT A.PGMID as ID, B.PGMTX as TEXT FROM PGMCALLS AS A INNER JOIN PGMDEFS AS B ON  trim(A.PGMID)=trim(B.PGMID)
  WHERE trim(A.CLDPGM)=trim('${pgmid1}') ;`;
    console.log("SQL===", sql);
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmCode/:entid/:pgmid/:shortnm", async (req, res) => {
  var entid = [req.params.entid];
  var pgmid = [req.params.pgmid];
  var shortnm = [req.params.shortnm];

  if (req.params.shortnm.slice(-1) !== "$") {
    let sql = `SELECT *  FROM PGMCODE
  WHERE trim(pgmid)=trim('${pgmid}') AND trim(FILENM)=trim('${entid}') AND (trim(MVARDB)=trim('${shortnm}') || trim(SVAR1)=trim('${shortnm}') || trim(SVAR2)=trim('${shortnm}') ||trim(SVAR3)=trim('${shortnm}') || trim(SVAR4)=trim('${shortnm}'));`;
    console.log("SQL===", sql);
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  } else {
    var shortnm1 = req.params.shortnm.substr(0, req.params.shortnm.length - 1);
    let sql = `SELECT STNNUM as ID, STN as TEXT  FROM PGMCODE
  WHERE trim(pgmid)=trim('${pgmid}') AND trim(FILENM)=trim('${entid}') AND trim(MVAR)=trim('${shortnm1}');`;
    let query = conn.query(sql, (err, results) => {
      if (err) throw err;
      console.log("PGMCODE SQL==", sql, results);
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
    });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/PgmCode/2/:entid", async (req, res) => {
  var entid = [req.params.entid];

  let sql = `SELECT * FROM PGMCODE
  WHERE trim(FILENM)=trim('${entid}') ORDER BY PGMID;`;
  console.log("SQL===", sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmParam/:pgmid", async (req, res) => {
  var pgmid = [req.params.pgmid];

  let sql = `SELECT *  FROM PGMPARMS
  WHERE trim(pgmid)=trim('${pgmid}') ;`;
  console.log("SQL===", sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/PgmCallingParams/:program/:cldprogram", async (req, res) => {
  var pgmid = [req.params.program];
  var cldpgmid = [req.params.cldprogram];

  let sql = `SELECT *  FROM PGMCPRMS
  WHERE trim(pgmid)=trim('${pgmid}') AND trim(cldpgm)=trim('${cldpgmid}');`;
  console.log("SQL===", sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: results }));
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/PgmDiagSchemas/:pgms', (req, res) => {
  var entities = {};
  var entPrograms = [];
  const pgms = JSON.parse(req.params.pgms);
  console.log('shilpi PGMS', pgms);
  //console.log("shilpi inside PgmSchema", req.params.pgmid);
  let pgmIdValues = '(';
  pgms.map((id, index) => {
    if (index === 0) pgmIdValues += "'" + id + "'";
    else pgmIdValues += ',' + "'" + id + "'";
  });
  pgmIdValues += ')';
  console.log('shilpi pgmIdValues ', pgmIdValues);
  let sql = `SELECT * FROM PGMSCMDB WHERE PGMID IN ${pgmIdValues};`;
  console.log('SQL===', sql);
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    let sql1 = `SELECT  A.*, B.PGMTX, C.ENTTX FROM  PGMFILES AS A LEFT JOIN PGMDEFS AS B ON trim(A.PGMID)=trim(B.PGMID) LEFT JOIN ENTITIES AS C ON trim(A.ENTID)=trim(C.ENTID)  WHERE TRIM(A.PGMID) IN ${pgmIdValues}`;
    let query1 = conn.query(sql1, (err, results2) => {
      results2.map((ent) => {
        var entpgmid = ent.PGMID.trim();
        if (!(entpgmid in entities)) {
          entities[entpgmid] = [];
        }
        if (ent.ENTID !== null) entities[entpgmid].push(`${ent.ENTID}`);
      });
      // console.log('query ', entities);
      let sql2 = `SELECT * FROM ENTITIES`;
      let query2 = conn.query(sql2, (err, results3) => {
        entPrograms = results3;
        res.send(
          JSON.stringify({
            status: 200,
            error: null,
            response: results,
            filesUsedByPgm: entities,
            entPrograms: entPrograms,
          })
        );
      });
    });
  });
});

app.get('/', async (req, res) => {
  res.send(
    JSON.stringify({
      status: 200,
      error: null,
      response: 'Hello from the server!!',
    })
  );
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*app.get("/SourceBrowser/:pgmId", async function(req, res) {
  var pgmId = req.params.pgmId;
  let responseForUI = {};

  console.log('Source browser query executions!');
  let sql1 = `SELECT PgmId, StnTyp, LineNum, Stn, LEFT(StnDate, 10) as StnDate, OpCode, OpType, CmpTor, LvlNum, MVarDB, SVar1, SVar2, SVar3, SVar4, FileNm, InvPrNm, CurPrNm, StateID, RuleID, RLSeq, RuleTyp FROM PgmCode WHERE PgmID = '${pgmId}'`;
  let query1 = await conn.query(sql1, async (err1, results1)=>
  {
    if(err1) throw err1;
    responseForUI.PgmCodeData = results1;
   //  Fetch PgmCode data;
  
  let sql2 = `SELECT PgmId, ShortNm, Len, DecP, DtaTyp FROM PgmSchemaW WHERE PgmID = '${pgmId}'`;
  let query2 = await conn.query(sql2, async (err2, results2)=>{
    if(err2) throw err2;
    responseForUI.PgmSchemaWData = results2;
     // Fetch PgmSchemaW data
  

  let sql3 = `SELECT MVar FROM PgmCode WHERE OpCode = 'BEGSR' AND PgmID = '${pgmId}'`;
  let query3 = await conn.query(sql3, async (err3, results3)=>{
    if(err3) throw err3;
  responseForUI.SubRoutineData =results3;
   //  // Fetch SubRoutine data
  

  let sql4= `SELECT EntID, ShortNm FROM EntSchema WHERE EntID IN (SELECT FileID from PgmFiles WHERE PgmID = '${pgmId}')`;
  let query4 = await conn.query(sql4, async (err4, results4)=>{
    if(err4) throw err4;
    responseForUI.DbFldFileData = results4;
     //  Fetch Db Fld & File data;
  
  let sql5 = `SELECT PgmID, PrcId, PrcTp FROM PrcDefs WHERE PgmID = '${pgmId}'`;
  let query5 = await conn.query(sql5, async (err5, results5)=>{
    if(err5) throw err5;
    responseForUI.PrcDefsData = results5;
     //  Fetch PrcDefs data
  
  let sql6 = `SELECT PgmID, StnNum, Stn, LvlNum, CurPrNm FROM PgmCode WHERE PgmID = 'API.JS'`;
  let query6 = await conn.query(sql6,async  (err6, results6)=>{
    if(err6) throw err6;
    responseForUI.RestApiData = results6;
     //  Fetch Rest API file
  
  let sql7= `SELECT * FROM PrcCallExp WHERE PgmID = '${pgmId}'`;
  let query7 = await conn.query(sql7, async (err7, results7)=>{
    if(err7) throw err7;
    responseForUI.PrcCallsExplosionData = results7;
     //  Fetch PrcCallsExplosion data
  
  let sql8 = `SELECT * FROM PgmStates WHERE PgmID = '${pgmId}'`;
  let query8 = await conn.query(sql8, async (err8, results8)=>{
    if(err8) throw err8;
    responseForUI.PgmStatesData = results8;
     //  Fetch PgmStates data
  
  // let sql9 = `SELECT * FROM PgmStScma WHERE PgmID = '${pgmId}'`;
  // let query9 = await conn.query(sql9, async (err, results)=>{
  //   if(err) throw err;
  //   responseForUI.PgmStScmaData = results;
  // })   //  Fetch PgmStSchema data
  

  let sql10 = `SELECT * FROM PgmStRules WHERE PgmID = '${pgmId}'`;
  let query10 = await conn.query(sql10 , async (err10, results10)=>{
    if(err10) throw err10;
    responseForUI.PgmStRulesData = results10;
     //  Fetch PgmStRules data
  
console.log("show whats in response==",responseForUI);
  res.send(JSON.stringify({
      "Error": false,
      "result": responseForUI
  }));
});
});
});
});
});
});
});
});

});*/
app.get("/SourceBrowser/:pgmId/:shortnm", async function(req, res) {
  var pgmId = req.params.pgmId;
  var shortnm = req.params.shortnm;
  let responseForUI = {};

  console.log('Source browser query executions!');
  responseForUI.pgmID=pgmId;
  
  let sql7= `SELECT * FROM PrcCallExp WHERE PgmID = '${pgmId}'`;
  let query7 = await conn.query(sql7, async (err7, results7)=>{
    if(err7) throw err7;
    responseForUI.PrcCallsExplosionData = results7;
     //  Fetch PrcCallsExplosion data
     let sql1= `SELECT * , FORMAT(LINENUM,2) as LINENUM FROM Pgmcode WHERE trim(mvardb) = '${shortnm}' or trim(mvar) = '${shortnm}' order by pgmid`;
     console.log(`SELECT *, FORMAT(LINENUM,2) as LINENUM FROM Pgmcode WHERE trim(mvardb) = '${shortnm}'`)
     let query1 = await conn.query(sql1, async (err1, results1)=>{
       if(err1) throw err1;
       responseForUI.RBrowser = results1;  
  
//console.log("show whats in response==",responseForUI);
  res.send(JSON.stringify({
      "Error": false,
      "result": responseForUI
  }));
  });

});
});

app.get("/SourceBrowser/:shortnm", async function(req, res) {
  var shortnm = req.params.shortnm;
  let responseForUI = {};
  console.log('Source browser query executions!');
  let sql1= `SELECT * , FORMAT(LINENUM,2) as LINENUM FROM Pgmcode WHERE trim(mvardb) = '${shortnm}' or trim(mvar) = '${shortnm}' order by pgmid`;
     console.log(`SELECT *, FORMAT(LINENUM,2) as LINENUM FROM Pgmcode WHERE trim(mvardb) = '${shortnm}'`)
     let query1 = await conn.query(sql1, async (err1, results1)=>{
       if(err1) throw err1;
       responseForUI.RBrowser = results1;  
  res.send(JSON.stringify({
      "Error": false,
      "result": responseForUI
  }));
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// app.get("/", async (req, res) => {
//   res.send(
//     JSON.stringify({
//       status: 200,
//       error: null,
//       response: "Hello from the server!!",
//     })
//   );
// });

app.get("/codefile", function (request, response) {
  //response.send("About Us");
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(3030, () => {
  console.log("server started on port 3030.....");
});
