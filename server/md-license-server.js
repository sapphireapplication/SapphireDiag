const express = require("express");
const webpack = require("webpack");
const axios = require("axios");
const webpackDevMiddleware = require("webpack-dev-middleware");
const port = process.env.PORT || 3000;
const app = express();
const config = require("../webpack.config.js");
const compiler = webpack(config);

const fs = require("fs");
// const xml2json = require('xml2json');
var path = require("path");

app.listen(port, function () {
  console.log(`App listening on port ${port}!\n`);
});

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// function convertXMLToJSON(xmlData) {
//   return new Promise(async (resolve, reject) => {
//     var jsonDataArr = [];

//     await Promise.all(xmlData.map(data => {
//       for (var key in data) {
//         var jsonData = {};
//         jsonData[`${key}`] = JSON.parse(xml2json.toJson(data[key].toString()));
//         jsonDataArr.push(jsonData);
//       }
//     }))

//     resolve(jsonDataArr);
//   })
// }

function readFile(dirName, fileName, xmlRespData) {
  return new Promise((resolve, reject) => {
    fs.readFile(dirName + "/" + fileName, "utf-8", function (err, content) {
      if (err) {
        resolve(0);
      } else {
        var tmpObj = {};
        tmpObj[`${fileName}`] = content.replace(/\r|\n/g, "");
        xmlRespData.push(tmpObj);
        resolve();
      }
    });
  });
}

function getMimeType(filePath) {
  var extname = String(path.extname(filePath)).toLowerCase();
  var mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".wasm": "application/wasm",
    ".pdf": "application/pdf",
    ".jar": "application/java-archive",
    ".zip": "application/zip",
    ".doc": "application/msword",
    ".csv": "text/csv",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".war": "application/x-zip",
  };

  return mimeTypes[extname] || "application/octet-stream";
}

app.get("/auth/:id/:pass", (req, res) => {
  if (req.params.id === "mdadmin" && req.params.pass === "mdadmin")
    res.status(200).send({
      status: 200,
      message: "User Authenticated!",
    });
  else
    res.status(200).send({
      status: 401,
      message: "User not found!",
    });
});

// app.get('/getLogo', (req, res) => {
//   var filename = 'logo.png';
//   var filePath = './src/images/' + filename;

//   var contentType = getMimeType(filePath);

//   fs.readFile(filePath, function(error, content) {
//       if (error) {
//           res.status(404).send({
//               'status' : 404,
//               'message' : 'File not found or error reading file'
//           })
//       }
//       else {
//           res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//           res.setHeader('Content-type', contentType);
//           res.write(content, 'utf-8');
//           res.status(200).end();
//       }
//   });
// })

// app.get('/getAvatar', (req, res) => {
//   var filename = 'avatar.png';
//   var filePath = './src/images/' + filename;

//   var contentType = getMimeType(filePath);

//   fs.readFile(filePath, function(error, content) {
//       if (error) {
//           res.status(404).send({
//               'status' : 404,
//               'message' : 'File not found or error reading file'
//           })
//       }
//       else {
//           res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//           res.setHeader('Content-type', contentType);
//           res.write(content, 'utf-8');
//           res.status(200).end();
//       }
//   });
// })

app.get("/getdfd", (req, res) => {
  // var filename = "organization.png";
  var filename = "dfd.png";
  var filePath = "./src/images/" + filename;

  var contentType = getMimeType(filePath);

  fs.readFile(filePath, function (error, content) {
    if (error) {
      res.status(404).send({
        status: 404,
        message: "File not found or error reading file",
      });
    } else {
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", contentType);
      res.write(content, "utf-8");
      res.status(200).end();
    }
  });
});

app.get("/getSessionData", (req, res) => {
  const url = "https://mdworkflow.mdcms.ch/mdlicenseBridge/webapi/login";

  axios.get(url).then((response) => {
    res.send({
      status: "Ok",
      content: response.data,
    });
  });
});

app.get("/logoff/:jobNum", (req, res) => {
  const url =
    "https://mdworkflow.mdcms.ch/mdlicenseBridge/webapi/logoff/" +
    req.params.jobNum;

  axios.get(url).then((response) => {
    res.send({
      status: "Ok",
      content: response.data,
    });
  });

  // var filename = 'sessionInfo.json';
  // var filePath = './sessionData/' + filename;

  // var contentType = getMimeType(filePath);

  // fs.readFile(filePath, function(error, content) {
  //   if (error) {
  //       res.status(404).send({
  //           'status' : 404,
  //           'message' : 'File not found or error reading file'
  //       })
  //   }
  //   else {
  //       res.setHeader('Content-type', contentType);
  //       res.write(content, 'utf-8');
  //       res.status(200).end();
  //   }
  // });
});

// app.get('/getFilenames/:dirName', (req, res) => {
//   fs.readdir(req.params.dirName, function (err, filenames) {
//     if (err) {
//       res.send({
//         status: 'Error',
//         content: 'Error reading directory!'
//       });
//     } else
//       res.send({
//         status: 'Ok',
//         content: filenames
//       });
//   });
// });

app.get("/getResp", (req, res) => {
  var xmlRespData = [];
  fs.readdir("./MDCONNECT/res/", async function (err, filenames) {
    if (err) {
      res.send({
        status: "Error",
        content: "Error getting XML response!",
      });
    } else {
      await Promise.all(
        filenames.map(async (file) => {
          await readFile("./MDCONNECT/res/", file, xmlRespData);
        })
      );

      // var jsonDataObj = await convertXMLToJSON(xmlRespData)
      res.send({
        status: "Ok",
        content: xmlRespData,
      });
    }
  });
});

// app.get('/getBaseTemplate/:screen', (req, res) => {
//   fs.readFile('./src/baseTemplates/page-schema-' + req.params.screen + '.json', 'utf-8', function (err, fileContent) {
//     if (err) {
//       res.send({
//         status: 'Error',
//         content: 'Error reading template!'
//       });
//     } else {
//       res.send({
//         status: 'Ok',
//         content: fileContent
//       });
//     }
//   });
// });
