var e = require('espree');
var walker = require('estraverse');
var fs = require( 'fs' );
var verifier = require( './verifier.js' );
var filenames = [];
if ( process.argv.length > 2 ) {
    for ( var i = 2; i < process.argv.length; i++ ) {
        filenames.push( process.argv[i] );
    }
}

for (var i = 0; i < filenames.length; i++ ) {
    var filename = filenames[i];
    console.log( 'Scanning ' + filename );
    var code = fs.readFileSync( filename, { encoding: 'utf8' } );
    
    var errors = verifier.verify( code );
    errors.forEach( function( error ) {
        console.log( error.loc.line + ': ' + error.message );
    });
}
