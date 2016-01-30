export default function getAncestors ( node ) {
	let ancestors = [];

	while ( node ) {
		ancestors.push( node );
		node = node.parentNode;
	}

	return ancestors; // [ node, ... <body>, <html>, document ]
}
