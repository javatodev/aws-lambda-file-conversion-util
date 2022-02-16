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

  tempPath = path.join(os.tmpdir(), id + "." + extension);
  outputPath = path.join(os.tmpdir(), "converted-" + id + "." + extension);

  console.log(
    `Temporary file path created ${tempPath} with file extension ${extension}`
  );

  return s3
    .getObject({ Bucket: bucketName, Key: fileKey })
    .promise()
    .then((data) => {
      console.log(`File reading done using given key and bucket name`);

      fs.writeFileSync(tempPath, data.Body);

      return gm(tempPath).identify(function (err, value) {
        console.log("Image reading values" + value);

        if (err) {
          console.log("Error in reading image idenficaiton" + err);
        }
      });

      // im.resize(
      //   {
      //     srcPath: tempPath,
      //     dstPath: outputPath,
      //     width: 256,
      //   },
      //   function (err, stdout, stderr) {
      //     if (err) throw err;
      //     console.log("resized kittens.jpg to fit within 256x256px");
      //   }
      // );
    })
    .catch((err) => {
      console.log(`Error in reading S3 file ${err}`);
    });
};
