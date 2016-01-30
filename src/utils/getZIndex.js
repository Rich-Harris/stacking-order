export default function getZIndex ( node ) {
	return node && Number( getComputedStyle( node ).zIndex ) || 0;
}
