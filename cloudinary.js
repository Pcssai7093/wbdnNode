const cloudinary = require('cloudinary').v2
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const path=require("path");

function bufferParser(req){
  return parser.format(path.extname(req.file.originalname).toString(), req.file.buffer).content
}

cloudinary.config({
  cloud_name: "dgeg6il49",
  api_key: "812339449319741",
  api_secret: "NKMt8CdJWg05mcnUEOoF0e1TG74"
});

exports.cloudinary=cloudinary;
exports.bufferParser=bufferParser;