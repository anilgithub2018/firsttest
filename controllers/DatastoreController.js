const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

exports.addImage = function(req, res, next) {
    var busboy = new Busboy({headers: req.headers});
    var uploads = {};

    // Imports the Google Cloud client library
    const googleStorage = require('@google-cloud/storage');

    // Your Google Cloud Platform project ID
    const projectId = 'propertymanagement-207415';

    // console.log(file[0]);
    // file = file[0];
    // Creates a client
    const storage = googleStorage({
        projectId: "propertymanagement-207415",
        keyFilename: "./PropertyManagement-storage.json"
    });

    const bucket = storage.bucket("gs://property-mgmt-storage");

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);

        let fileUpload = bucket.file(filename);
        // console.log(bucket.name);
        // const blobStream = fileUpload.createWriteStream({
        //     metadata: {
        //         contentType: mimetype
        //     }
        // });
        // // console.log(blobStream);
        //
        // blobStream.on('error', (error) => {
        //     res.status(405).send('Something is wrong! Unable to upload at the moment.');
        // });
        //
        // blobStream.on('finish', () => {
        //     // The public URL can be used to directly access the file via HTTP.
        //     const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        //     res.status(200).send(url);
        // });

        // console.log(file.pipe);
        // blobStream.end(busboy);
        file.pipe(fileUpload.createWriteStream({
            metadata: {
                contentType: mimetype
            }
        }));
    });
    busboy.on('finish', function() {

        res.status(200).send("Busboy Done");
        res.end();

    });
    req.pipe(busboy);
};