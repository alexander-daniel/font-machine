'use strict';

var fs = require('fs');
var replaceall = require('replaceall');

walk('fonts', function(err, results) {
    if (err) throw err;
    var cssFile = fs.createWriteStream('fonts.css');
    var htmlFile = fs.createWriteStream('fonts.html');

    htmlFile.write('<link rel="stylesheet" type="text/css" href="fonts.css" media="screen" />\n\n');
    cssFile.write('body {margin :0 auto;} h1 {text-align : center;}\n\n');

    results.forEach(writeFontDefinition);

    function writeFontDefinition(fontFilePath) {
        var newPath = replaceall(' ', '_', fontFilePath);
        fs.renameSync(fontFilePath, newPath);
        var name = getName(fontFilePath);
        var format = getFormat(fontFilePath);
        if (!name) return;
        if (!format) return;

        cssFile.write('@font-face { \n' );
        cssFile.write('\tfont-family: ' + name + ';\n');
        cssFile.write('\tsrc: url('+ newPath + ') format('+ format + ');\n');
        cssFile.write('} \n\n');

        htmlFile.write('<h1 style="font-family: '+ name + ' ">\n');
        htmlFile.write('\t' + name + '\n');
        htmlFile.write('</h1>\n\n');
    }

});

function getFormat (fontFilePath) {
    var splitPath = fontFilePath.split('.');
    var ext = splitPath[splitPath.length - 1];
    if (ext === 'ttf' || ext === 'TTF') return 'truetype';
    if (ext === 'otf') return 'opentype';
    else return false;
}


function getName (fontFilePath) {
    var splitPath = fontFilePath.split('.');
    var fileName = splitPath[splitPath.length - 2];
    var splitName = fileName.split('/');
    var name = splitName[splitName.length - 1];
    return name;
}

function walk (dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
}
