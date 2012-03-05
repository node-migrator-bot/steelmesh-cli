var async = require('async'),
    debug = require('debug')('steelmesh-cli-publish'),
    fs = require('fs'),
    path = require('path'),
    nano = require('nano'),
    attachmate = require('attachmate'),
    url = require('url'),
    _ = require('underscore'),
    reTrailingSlash = /\/$/,
    reLeadingSlash = /^\/$/,
    db, doc;
    
function updateDoc(db, id, data, callback) {
    // get the data for the existing document
    db.get(id, function(err, doc) {
        if (! err) {
            data = _.extend({}, doc, data);
        }
        
        data._id = id;
        db.insert(data, callback);
    });
} // updateDoc

module.exports = function(args, callback) {
    var data = this.pkgInfo,
        appFile = path.resolve('app.js'),
        sourcePath = this.workingDir,
        targetUrl = args || 'http://localhost:5984/steelmesh',
        parts = url.parse(targetUrl),
        targetServer = url.format({ protocol: parts.protocol, host: parts.host, auth: parts.auth }),
        targetDB = (parts.path || '').replace(reLeadingSlash, '') || 'steelmesh',
        appid;
        
    // check if we have an app file to use in addition to the package data
    path.exists(appFile, function(exists) {
        if (exists) {
            data = _.extend({}, data, require(appFile));
        }
        
        // initialise the db connection
        debug('connecting to ' + targetServer + ', db: ' + targetDB);
        db = nano(targetServer).use(targetDB);
        
        // update the document
        appid = 'app::' + data.name;
        updateDoc(db, appid, data, function(err) {
            if (! err) {
                // upload the attachments
                attachmate.upload(
                    targetServer.replace(reTrailingSlash, '') + '/' + targetDB + '/' + appid,
                    sourcePath,
                    callback
                );
            }
            else {
                callback(err);
            }
        });
    });
};