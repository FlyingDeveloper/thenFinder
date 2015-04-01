var e = require('esprima');
var fs = require( 'fs' );
var filenames = [];
if ( process.argv.length > 2 ) {
    for ( var i = 2; i < process.argv.length; i++ ) {
        filenames.push( process.argv[i] );
    }
}

var nodeParser = function nodeParser( node ) {
    if ( node instanceof Array ) {
        node.forEach( nodeParser );
    } else if ( node.type == 'Program' ) {
        nodeParser( node.body );
    } else if ( node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' ) {
        var blockStatement = node.body;
        nodeParser( blockStatement.body );
    } else if ( node.type === 'BlockStatement' ) {
        nodeParser( node.body );
    } else if ( node.type === 'ExpressionStatement' ) {
        nodeParser( node.expression );
    } else if ( node.type === 'IfStatement' ) {
        nodeParser( node.consequent );
        if ( node.alternate ) {
            nodeParser( node.alternate );
        }
    } else if ( node.type === 'ForStatement' ) {
        nodeParser( node.body );
    } else if ( node.body !== undefined ) {
        nodeParser( node.body );
    } else if ( node.type === 'VariableDeclaration' ) {
        node.declarations.forEach( function( declaration ) {
            if ( declaration.init ) {
                nodeParser( declaration.init );
            }
        });
    } else if ( node.type === 'ArrayExpression' ) {
        node.elements.forEach( function( element ) {
            nodeParser( element );
        });
    } else if ( node.type === 'CallExpression' ) {
        if ( node.callee.property && node.callee.property.name === 'then' ) {
            if ( node.arguments.length !== 2 ) {
                var loc = node.callee.property.loc;
                console.log(
                    'Found a then() call without two arguments at line ' +
                    loc.start.line + ':' +
                    loc.start.column
                );
            }
            
            node.arguments.forEach( function( arg ) {
                if ( arg.type !== 'FunctionExpression' ) {
                    var message = 'Found an argument passed to then() that isn\'t a function';
                    console.log( message );
                }
            });
        }
    }

};

for (var i = 0; i < filenames.length; i++ ) {
    var filename = filenames[i];
    console.log( 'Scanning ' + filename );
    var code = fs.readFileSync( filename, { encoding: 'utf8' } );
    
    var parsed = e.parse(code, { loc: true });

    nodeParser(parsed.body);
}
