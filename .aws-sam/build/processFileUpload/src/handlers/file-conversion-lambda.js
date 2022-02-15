exports.processFileUpload = async (event) => {
  console.log(`Incoming Request ${JSON.stringify(event)}`);

  const message = "Hello from Lambda!";

  // All log statements are written to CloudWatch
  console.info(`${message}`);

  return message;
};
