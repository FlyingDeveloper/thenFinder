var e = require( 'espree');
var walker = require( 'estraverse' );
exports.verify = function( code ) {
    var parsed = e.parse(code, { loc: true });
    var errors = [];

    walker.traverse(parsed, {
        enter: function( node, parent ) {
            if ( node.type === 'CallExpression' ) {
                if (node.callee.property.name === 'then') {
                    if (node.arguments.length !== 2) {
                        errors.push({
                            loc: node.loc.start,
                            message: 'Should pass two arguments to then call'
                        });
                    }
                }
            }
        }
    });

    return errors;
};
