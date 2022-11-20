import getParent from './getParent';

export default function getAncestors ( node ) {
	let ancestors = [];

	while ( node ) {
		ancestors.push( node );
		node = getParent( node );
	}

	return ancestors; // [ node, ... <body>, <html>, document ]
}
