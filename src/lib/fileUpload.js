"use strict";
var AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
class fileUpload {
    async upload(bucketName, fileName, fileData, callback) {
        try {
            let param = {
                Bucket: bucketName, // pass your bucket name
                Key: fileName, // file will be saved as testBucket/contacts.csv
                Body: fileData,
                ACL: 'public-read'
            }
            s3.upload(param, function (error, data) {
                if (error) {
                    console.log("Error in uploading file:", error);
                    
                    return callback(error, null);
                } else {
                    console.log("File Uploaded... path=", data.Location);

                    return callback(null, {
                        'file_path': data.Location
                    });
                }
            });
            return true;
        } catch (error) {
            console.log("Error:", error);
            return {
                'error': error
            }
        }
    }
}

module.exports = new fileUpload();