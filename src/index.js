import findStackingContext from './utils/findStackingContext.js';
import getAncestors from './utils/getAncestors.js';
import getZIndex from './utils/getZIndex.js';
import last from './utils/last.js';

export function compare ( a, b ) {
	if ( a === b ) throw new Error( 'Cannot compare node with itself' );

	let ancestors = {
		a: getAncestors( a ),
		b: getAncestors( b )
	};

	let commonAncestor;

	// remove shared ancestors
	while ( last( ancestors.a ) === last( ancestors.b ) ) {
		a = ancestors.a.pop();
		b = ancestors.b.pop();

		commonAncestor = a;
	}

	let stackingContexts = {
		a: findStackingContext( ancestors.a ),
		b: findStackingContext( ancestors.b )
	};

	let zIndexes = {
		a: getZIndex( stackingContexts.a ),
		b: getZIndex( stackingContexts.b )
	};

	if ( zIndexes.a === zIndexes.b ) {
		const children = commonAncestor.childNodes;

		const furthestAncestors = {
			a: last( ancestors.a ),
			b: last( ancestors.b )
		};

		let i = children.length;
		while ( i-- ) {
			const child = children[i];
			if ( child === furthestAncestors.a ) return 1;
			if ( child === furthestAncestors.b ) return -1;
		}
	}

	return Math.sign( zIndexes.a - zIndexes.b );
}
