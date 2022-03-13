const aws = require("aws-sdk");
const s3 = new aws.S3();
const fs = require("fs");
const path = require("path");
const os = require("os");
const gm = require("gm").subClass({ imageMagick: true });

exports.processFileUpload = async (event, context) => {
  console.log(`Incoming Request ${JSON.stringify(event)}`);

  s3MetaData = event.Records[0].s3;
  bucketName = s3MetaData.bucket.name;
  fileKey = s3MetaData.object.key;

  console.log(
    `S3 Metadata bucketname : ${bucketName} and uploaded file key : ${fileKey}`
  );

  id = context.awsRequestId;

  extension = fileKey.split(".")[1];

  inputPath = path.join(os.tmpdir(), id + "." + extension);
  outputPath = path.join(os.tmpdir(), "converted-" + id + "." + extension);

  console.log(
    `Temporary file path created ${inputPath} with file extension ${extension}`
  );

  return s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise()
    .then((data) => {
      console.log(`File reading done using given key and bucket name`);

      fs.writeFileSync(inputPath, data.body);
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync(inputPath, "utf8"));

      // return fs.writeFile(tempPath, data.Body, (err) => {
      //   if (err) console.log(`Error in writing file ${err}`);
      //   console.log("File written successfully");

      //   return gm(tempPath).identify(function (err, value) {
      //     console.log("Image reading values" + value);

      //     if (err) {
      //       console.log("Error in reading image idenficaiton" + err);
      //     }
      //   });
      // });
    })
    .catch((err) => {
      console.log(`Error in reading S3 file ${err}`);
    });
};
