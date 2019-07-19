!function(window,document) {
"use strict";
window.def	= def;
window._	= dom;
dom.T		= textNode;

var	_target = null;

function def(source, pre, post)
{
	return function() {
		return build(source, [].slice.call(arguments), pre, post);
	}
}

function dom(source)
{
	return build(source, [].slice.call(arguments, 1));
}

function build(source, args, pre, post)
{
	var	elems	= make(source),
		rootEl	= elems[elems.length -1],
		targetTemp,
		error, i;
	if (_target)
		_target.appendChild(rootEl);
	targetTemp = _target;
	_target	= elems[0];
	try {
		buildArg(pre, elems);
		for (i in args)
			buildArg(args[i], elems);
		buildArg(post, elems);
	} catch (error) {
		console.error('dom', error, elems);
	}
	_target = targetTemp;
	return rootEl;
}

function buildArg(arg, elems)
{
	var	type = typeof arg,
		key, index;
	if (type === "function") {
		arg.apply(null, elems);
	} else if (type === "object") {
		for (key in arg) {
			if ((index = key.indexOf('-')) > -1) {
				_target.setAttribute(
					index === 0 ? key.substring(1) : key,
					arg[key]);
			} else if (index === ".") {
				_target.className += " " + arg[key];
			} else {
				_target[key] = arg[key];
			}
		}
	} else if (type !== "undefined" && arg !== null) {
		textNode(arg);
	}
}

function textNode(text)
{
	_target.appendChild(
		document.createTextNode(text));
}

function make(rawSource)
{
	if (rawSource instanceof Node || rawSource === null)
		return [rawSource];
	//
	var	elems = [], childEl, tempEl,
		tag_id,	// tag_id = [tag, id]
		classes,
		source, i = 0,
		sources = rawSource.split(/\s+/);
	//
	while (source = sources[i++]) {
		classes = source.split('.');
		tag_id	= classes.shift().split('#');
		tempEl	= document.createElement(tag_id[0] || 'div');
		if (tag_id[1])
			tempEl.id = tag_id[1];
		if (classes.length)
			tempEl.className = classes.join(' ');
		elems.unshift(tempEl);
		if (childEl)
			childEl.appendChild(tempEl);
		childEl = tempEl;
	}
	return elems;
}

}(window,document);
