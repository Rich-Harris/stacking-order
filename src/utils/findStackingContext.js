import getParent from './getParent';

const props = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;

function isFlexItem ( node ) {
	const display = getComputedStyle( getParent( node ) ).display;
	return display === 'flex' || display === 'inline-flex';
}

function createsStackingContext ( node ) {
	const style = getComputedStyle( node );

	// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
	if ( style.position === 'fixed' ) return true;
	if ( style.zIndex !== 'auto' && style.position !== 'static' || isFlexItem( node ) ) return true;
	if ( +style.opacity < 1 ) return true;
	if ( 'transform' in style && style.transform !== 'none' ) return true;
	if ( 'webkitTransform' in style && style.webkitTransform !== 'none' ) return true;
	if ( 'mixBlendMode' in style && style.mixBlendMode !== 'normal' ) return true;
	if ( 'filter' in style && style.filter !== 'none' ) return true;
	if ( 'webkitFilter' in style && style.webkitFilter !== 'none' ) return true;
	if ( 'isolation' in style && style.isolation === 'isolate' ) return true;
	if ( props.test( style.willChange ) ) return true;
	if ( style.webkitOverflowScrolling === 'touch' ) return true;

	return false;
}

export default function findStackingContext ( nodes ) {
	let i = nodes.length;

	while ( i-- ) {
		if ( createsStackingContext( nodes[i] ) ) return nodes[i];
	}

	return null;
}
