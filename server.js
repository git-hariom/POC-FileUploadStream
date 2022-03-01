
const express = require("express");
const cors = require("cors");
const fs = require('fs');
const app = express();
const XLSX = require("XLSX");
const bodyParser = require('body-parser');
var multer  = require('multer')();
app.use(cors());
app.use(bodyParser.json());
var buffer = [];

// PORT
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Server API works!!");
});

app.post('/upload', multer.single('slicedFile'), (req , res) => {
    buffer.push(req.file.buffer);
    if(req.body.isLastBlob){
        let buf = Buffer.concat(buffer);
        var base64 = (buf.toString('base64'));
        var pre="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        base64 = pre+base64;
        // var doc_data = base64.split(',').pop();
        // var bufData = Buffer.from(doc_data,'base64');
        // let wb = XLSX.read(bufData,{type:'buffer'});
        // const wsname = wb.SheetNames[0];
        // const ws = wb.Sheets[wsname];
        // const excelData = XLSX.utils.sheet_to_json(ws);
        // var jsonData = JSON.stringify(excelData);
        // console.log(excelData);
        buffer = [];  
    }
    res.json(base64);
});

app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});
