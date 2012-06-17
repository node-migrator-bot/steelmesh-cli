var async = require('async'),
    debug = require('debug')('steelmesh-cli-publish'),
    fs = require('fs'),
    path = require('path'),
    pkginfo = require('pkginfo'),
    attachmate = require('attachmate'),
    url = require('url'),
    _ = require('underscore'),
    reTrailingSlash = /\/$/,
    reLeadingSlash = /^\/$/;
    
exports.desc = 'Publish an application to a steelmesh db';
exports.args = {
    url:    'url',
    path:   path
};

exports.run = function(opts, callback) {
    var appFile = path.resolve(opts.path, 'app.js'),
        sourcePath = path.resolve(opts.path),
        data = pkginfo.read(null, sourcePath)['package'] || {},
        targetUrl = opts.url || 'http://localhost:5984/steelmesh',
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
        
        // update the document
        appid = 'app::' + data.name;

        // upload updated doc
        attachmate.upload(
            targetServer.replace(reTrailingSlash, '') + '/' + targetDB + '/' + appid,
            sourcePath,
            { docData: data },
            callback
        );
    });
};