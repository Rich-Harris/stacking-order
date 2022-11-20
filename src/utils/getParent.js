export default function getParent ( node ) {
	return node.parentNode && node.parentNode.host || node.parentNode;
}
