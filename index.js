/**
 * Determine which of two nodes appears in front of the other —
 * if `a` is in front, returns 1, otherwise returns -1
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 */
export function compare(a, b) {
	if (a === b) throw new Error('Cannot compare node with itself');

	const ancestors = {
		a: get_ancestors(a),
		b: get_ancestors(b),
	};

	let common_ancestor;

	// remove shared ancestors
	while (ancestors.a.at(-1) === ancestors.b.at(-1)) {
		a = ancestors.a.pop();
		b = ancestors.b.pop();

		common_ancestor = a;
	}

	const z_indexes = {
		a: get_z_index(find_stacking_context(ancestors.a)),
		b: get_z_index(find_stacking_context(ancestors.b)),
	};

	if (z_indexes.a === z_indexes.b) {
		const children = common_ancestor.childNodes;

		const furthest_ancestors = {
			a: ancestors.a.at(-1),
			b: ancestors.b.at(-1),
		};

		let i = children.length;
		while (i--) {
			const child = children[i];
			if (child === furthest_ancestors.a) return 1;
			if (child === furthest_ancestors.b) return -1;
		}
	}

	return Math.sign(z_indexes.a - z_indexes.b);
}

const props = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;

/** @param {HTMLElement} node */
function is_flex_item(node) {
	const display = getComputedStyle(get_parent(node)).display;
	return display === 'flex' || display === 'inline-flex';
}

/** @param {HTMLElement} node */
function creates_stacking_context(node) {
	const style = getComputedStyle(node);

	// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
	if (style.position === 'fixed') return true;
	if ((style.zIndex !== 'auto' && style.position !== 'static') || is_flex_item(node)) return true;
	if (+style.opacity < 1) return true;
	if ('transform' in style && style.transform !== 'none') return true;
	if ('webkitTransform' in style && style.webkitTransform !== 'none') return true;
	if ('mixBlendMode' in style && style.mixBlendMode !== 'normal') return true;
	if ('filter' in style && style.filter !== 'none') return true;
	if ('webkitFilter' in style && style.webkitFilter !== 'none') return true;
	if ('isolation' in style && style.isolation === 'isolate') return true;
	if (props.test(style.willChange)) return true;
	// @ts-expect-error
	if (style.webkitOverflowScrolling === 'touch') return true;

	return false;
}

/** @param {HTMLElement[]} nodes */
function find_stacking_context(nodes) {
	let i = nodes.length;

	while (i--) {
		if (creates_stacking_context(nodes[i])) return nodes[i];
	}

	return null;
}

/** @param {HTMLElement} node */
function get_z_index(node) {
	return (node && Number(getComputedStyle(node).zIndex)) || 0;
}

/** @param {HTMLElement} node */
function get_ancestors(node) {
	const ancestors = [];

	while (node) {
		ancestors.push(node);
		node = get_parent(node);
	}

	return ancestors; // [ node, ... <body>, <html>, document ]
}

/** @param {HTMLElement} node */
function get_parent(node) {
	// @ts-ignore
	return node.parentNode?.host || node.parentNode;
}
