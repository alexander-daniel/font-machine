'use strict';

var fs = require('fs');
var replaceall = require('replaceall');

var cssFileName = process.argv[3] || 'fonts.css';
var htmlFileName = process.argv[4] || 'fonts.html';
var RENAME = flag();

var cssFile = fs.createWriteStream(cssFileName);
var htmlFile = fs.createWriteStream(htmlFileName);
var fontDir = process.argv[2];

walk(fontDir, function(err, results) {
    if (err) throw err;

    htmlFile.write('<link rel="stylesheet" type="text/css" href="'+cssFileName+'" media="screen" />\n\n');
    cssFile.write('body {margin :0 auto;} h1 {text-align : center;}\n\n');

    results.forEach(writeFontDefinition);

    function writeFontDefinition(fontFilePath) {
        var newPath = replaceall(' ', '_', fontFilePath);
        var name = getName(newPath);
        var format = getFormat(newPath);
        if (RENAME) fs.renameSync(fontFilePath, newPath);
        if (!name) return;
        if (!format) return;

        cssFile.write('@font-face {\n' );
        cssFile.write('\tfont-family: ' + name + ';\n');
        cssFile.write('\tsrc: url('+ newPath + ') format('+ format + ');\n');
        cssFile.write('}\n\n');

        htmlFile.write('<h1 style="font-family: '+name+'">\n');
        htmlFile.write('\t'+name+'\n');
        htmlFile.write('</h1>\n\n');
    }

    if (!RENAME) console.log('beware, files were not renamed, maybe fontpaths are wrong.')

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

function flag () {
    if (process.argv[5] === '-r') return true
    else return false;
}
