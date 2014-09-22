/**
 * {@link http://github.com/mikecaines/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

var ok = ok || {};

ok.DOM_NODE_ELEMENT = 1;
ok.DOM_NODE_DOCUMENT = 9;
ok.DOM_NODE_DOCUMENT_FRAGMENT = 11;


/**
 * @class ok.DomContext
 */
ok.DomContext = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.DomContext)) this.construct.apply(this, arguments);
};

ok.DomContext.prototype.makeImplementation = function (aContext) {
	return new ok.DomImplementation(aContext);
};

ok.DomContext.prototype.makeDocument = function (aImplementation) {
	return new ok.DomDocument(aImplementation);
};

ok.DomContext.prototype.makeElement = function (aDocument, aNodeName) {
	return new ok.DomElement(aDocument, aNodeName);
};

ok.DomContext.prototype.makeDocumentFragment = function (aDocument) {
	return new ok.DomDocumentFragment(aDocument);
};

ok.DomContext.prototype.createImplementation = function () {
	return this.makeImplementation(this);
};

ok.DomContext.prototype.construct = function () {

};


/**
 * @class ok.MinimalDomContext
 * @extends ok.DomContext
 */
ok.MinimalDomContext = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.MinimalDomContext)) this.construct.apply(this, arguments);
};
ok.extendObject(ok.MinimalDomContext, ok.DomContext);


/**
 * @class ok.NativeDomContext
 * @extends ok.DomContext
 */
ok.NativeDomContext = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.NativeDomContext)) this.construct.apply(this, arguments);
};
ok.extendObject(ok.NativeDomContext, ok.DomContext);

ok.NativeDomContext.prototype.makeDocument = function (aImplementation) {
	return window.document;
};


/**
 * @class ok.DomImplementation
 */
ok.DomImplementation = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.DomImplementation)) this.construct.apply(this, arguments);
};

ok.DomImplementation.prototype.createDocument = function () {
	return this.context.makeDocument(this);
};

ok.DomImplementation.prototype.construct = function (aContext) {
	this.context = aContext;
};


/**
 * @class ok.DomNode
 */
ok.DomNode = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.DomNode)) this.construct.apply(this, arguments);
};

ok.DomNode.prototype.construct = function (aOwnerDocument, aNodeType, aNodeName) {
	this.ownerDocument = aOwnerDocument;
	this.nodeType = aNodeType;
	this.nodeName = aNodeName;
};


/**
 * @class ok.DomDocumentFragment
 * @extends ok.DomNode
 */
ok.DomDocumentFragment = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.DomDocumentFragment)) this.construct.apply(this, arguments);
};
ok.extendObject(ok.DomDocumentFragment, ok.DomNode);

ok.DomDocumentFragment.prototype.appendChild = function (aElement) {
	this.children.push(aElement);
	aElement.parentNode = this;
};

ok.DomDocumentFragment.prototype.construct = function (aOwnerDocument) {
	ok.DomNode.prototype.construct.call(this, aOwnerDocument, ok.DOM_NODE_DOCUMENT_FRAGMENT, '#document-fragment');

	this.ownerDocument = aOwnerDocument;
	this.children = [];
};


/**
 * @class ok.DomDocument
 */
ok.DomDocument = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.DomDocument)) this.construct.apply(this, arguments);
};
ok.extendObject(ok.DomDocument, ok.DomNode);

ok.DomDocument.prototype.createElement = function (aName) {
	return this.implementation.context.makeElement(this, aName);
};

ok.DomDocument.prototype.createDocumentFragment = function () {
	return this.implementation.context.makeDocumentFragment(this);
};

ok.DomDocument.prototype.construct = function (aDomImplementation) {
	ok.DomNode.prototype.construct.call(this, this, ok.DOM_NODE_DOCUMENT, '#document');

	this.implementation = aDomImplementation;
};


/**
 * @class ok.DomElement
 */
ok.DomElement = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.DomNode)) this.construct.apply(this, arguments);
};
ok.extendObject(ok.DomElement, ok.DomNode);

ok.DomElement.prototype.appendChild = function (aElement) {
	this.children.push(aElement);
	aElement.parentNode = this;
};

ok.DomElement.prototype.setAttribute = function (aName, aValue) {
	this.attributes.push({
		name: ''+ aName,
		value: ''+ aValue
	});
};

ok.DomElement.prototype.appendChild = function (aElement) {
	this.children.push(aElement);
	aElement.parentNode = this;
};

ok.DomElement.prototype.construct = function (aOwnerDocument, aName) {
	ok.DomNode.prototype.construct.call(this, aOwnerDocument, ok.DOM_NODE_ELEMENT, aName.toUpperCase());

	this.children = [];
	this.attributes = [];
	this.textContent = '';
	this.parentNode = null;
};


/**
 * @class ok.HtmlDomSerializer
 */
ok.HtmlDomSerializer = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.HtmlDomSerializer)) this.construct.apply(this, arguments);
};

ok.HtmlDomSerializer.prototype._escape = function (aText) {
	var i, len, html, code;

	html = '';

	len = aText.length;
	for (i = 0; i < len; i++) {
		code = aText.charCodeAt(i);
		html += (code >= 32 && code <= 126) ? aText.charAt(i) : '&#' + code + ';';
	}

	return html;
};

ok.HtmlDomSerializer.prototype._serializeElement = function (aElement) {
	var elementText, i;
	var children, attributes, attribute, len, nodeName;

	nodeName = aElement.nodeName.toLowerCase();

	elementText = '<' + nodeName;

	attributes = aElement.attributes;
	len = attributes.length;
	for (i = 0; i < len; i++) {
		attribute = attributes[i];

		elementText += ' ' + attribute.name + '="' + this._escape(attribute.value) + '"';
	}

	elementText += '>';

	children = aElement.children;
	len = children.length;
	if (len) {
		for (i = 0; i < len; i++) {
			elementText += this._serializeElement(children[i]);
		}
	}
	else {
		elementText += this._escape(aElement.textContent);
	}

	elementText += '</' + nodeName + '>';

	return elementText;
};

ok.HtmlDomSerializer.prototype.serializeToString = function (aNode) {
	return this._serializeElement(aNode);
};

ok.HtmlDomSerializer.prototype.construct = function () {

};


/**
 * @class ok.NodeDomCopier
 */
ok.NodeDomCopier = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.NodeDomCopier)) this.construct.apply(this, arguments);
};

/** @private */
ok.NodeDomCopier.prototype._copyNode = function (aNode, aDocument, aDeep) {
	var el, i, len, attributes, attribute, children;

	if (aNode.nodeType == ok.DOM_NODE_DOCUMENT_FRAGMENT) {
		el = aDocument.createDocumentFragment();
	}

	else {
		el = aDocument.createElement(aNode.nodeName);

		attributes = aNode.attributes;
		len = attributes.length;
		for (i = 0; i < len; i++) {
			attribute = attributes[i];
			el.setAttribute(attribute.name, attribute.value);
		}
	}

	if (aDeep) {
		children = aNode.children;
		len = children.length;
		if (len) {
			for (i = 0; i < len; i++) {
				el.appendChild(this._copyNode(children[i], aDocument, true));
			}
		}
		else {
			el.textContent = '' + aNode.textContent;
		}
	}

	return el;
};

ok.NodeDomCopier.prototype.copyNodeToNode = function (aNode, aDocument, aDeep) {
	return this._copyNode(aNode, aDocument, aDeep != undefined ? aDeep : true);
};

ok.NodeDomCopier.prototype.construct = function () {

};


/**
 * @class ok.JsonDomCopier
 */
ok.JsonDomCopier = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.JsonDomCopier)) this.construct.apply(this, arguments);
};

/**
 * @private
 */
ok.JsonDomCopier.prototype._copyNode = function (aNode, aDeep) {
	var el, i, len, attributes, attribute, children, child;

	el = {
		nodeType: aNode.nodeType,
		nodeName: aNode.nodeName,
		attributes: [],
		textContent: '',
		children: [],
		parentNode: null
	};

	attributes = aNode.attributes;
	len = attributes.length;
	for (i = 0; i < len; i++) {
		attribute = attributes[i];
		el.attributes.push({name:attribute.name, value:attribute.value});
	}

	if (aDeep) {
		children = aNode.children;
		len = children.length;
		if (len) {
			for (i = 0; i < len; i++) {
				child = this._copyNode(children[i], true);
				child.parentNode = el;
				el.children.push(child);
			}
		}
		else {
			el.textContent = '' + aNode.textContent;
		}
	}

	return el;
};

/**
 * @private
 */
ok.JsonDomCopier.prototype._copyJson = function (aJson, aDocument, aDeep) {
	var el, i, len, attributes, attribute, children;

	if (aJson.nodeType == ok.DOM_NODE_DOCUMENT_FRAGMENT) {
		el = aDocument.createDocumentFragment();
	}

	else {
		el = aDocument.createElement(aJson.nodeName);

		attributes = aJson.attributes;
		len = attributes.length;
		for (i = 0; i < len; i++) {
			attribute = attributes[i];
			el.setAttribute(attribute.name, '' + attribute.value);
		}
	}

	if (aDeep) {
		children = aJson.children;
		len = children.length;
		if (len) {
			for (i = 0; i < len; i++) {
				el.appendChild(this._copyJson(children[i], aDocument, true));
			}
		}
		else {
			el.textContent = '' + aJson.textContent;
		}
	}

	return el;
};

ok.JsonDomCopier.prototype.copyNodeToJson = function (aNode, aDeep) {
	return this._copyNode(aNode, aDeep != undefined ? aDeep : true);
};

ok.JsonDomCopier.prototype.copyJsonToNode = function (aJson, aDocument, aDeep) {
	return this._copyJson(aJson, aDocument, aDeep != undefined ? aDeep : true);
};

ok.JsonDomCopier.prototype.construct = function () {

};


/**
 * @class ok.OneWayStaticDomDiffer
 */
ok.OneWayStaticDomDiffer = function () {
	if (!(arguments.length == 1 && arguments[0] === ok.OneWayStaticDomDiffer)) this.construct.apply(this, arguments);
};

ok.OneWayStaticDomDiffer.DIFF_ATTRIBUTE = 1;
ok.OneWayStaticDomDiffer.DIFF_TEXT = 2;

/**
 * @private
 */
ok.OneWayStaticDomDiffer.prototype._getLookup = function (aAttrs) {
	var lookup, i;

	lookup = {};

	for (i = 0; i < aAttrs.length; i++) {
		lookup[aAttrs[i].name] = aAttrs[i].value;
	}

	return lookup;
};

/**
 * @private
 */
ok.OneWayStaticDomDiffer.prototype._getSelector = function (aContextNode, aTopNode) {
	var node, attrs, selector, part;

	selector = '';

	node = aContextNode;
	do {
		attrs = ok.OneWayStaticDomDiffer.prototype._getLookup(node.attributes);

		part = node.nodeName;
		if ('class' in attrs) {
			part += '.' + attrs['class'].replace(/ /, '.');
		}

		if (selector != '') {
			selector = ' > ' + selector;
		}

		selector = part + selector;

	} while ((node = node.parentNode) && node !== aTopNode);

	return selector;
};

/**
 * @private
 */
ok.OneWayStaticDomDiffer.prototype._compare = function (aNode1, aNode2, aContextNode, aTopNode) {
	var diffs, childDiffs, i, len, attrs1, attrs2, attr2, children2, children1;

	diffs = [];

	if (aNode1.nodeType == ok.DOM_NODE_ELEMENT) {
		attrs1 = this._getLookup(aNode1.attributes);

		attrs2 = aNode2.attributes;
		len = attrs2.length;
		for (i = 0; i < len; i++) {
			attr2 = attrs2[i];

			if (!(attr2.name in attrs1 && attr2.value == attrs1[attr2.name])) {
				diffs.push({
					type: ok.OneWayStaticDomDiffer.DIFF_ATTRIBUTE,
					name: attr2.name,
					value: attr2.value,
					context: aContextNode ? this._getSelector(aContextNode, aTopNode) : null
				});
			}
		}
	}

	children1 = aNode1.children;
	children2 = aNode2.children;
	len = children2.length;
	if (len) {
		for (i = 0; i < len; i++) {
			childDiffs = this._compare(children1[i], children2[i], children1[i], aTopNode);
			if (childDiffs.length) {
				diffs = diffs.concat(childDiffs);
			}
		}
	}
	else {
		if (aNode2.textContent != aNode1.textContent) {
			diffs.push({
				type: ok.OneWayStaticDomDiffer.DIFF_TEXT,
				value: aNode2.textContent,
				context: aContextNode ? this._getSelector(aContextNode, aTopNode) : null
			});
		}
	}

	return diffs;
};

ok.OneWayStaticDomDiffer.prototype.compareNodes = function (aNode1, aNode2) {
	return this._compare(aNode1, aNode2, null, aNode1);
};

ok.OneWayStaticDomDiffer.prototype.construct = function () {

};