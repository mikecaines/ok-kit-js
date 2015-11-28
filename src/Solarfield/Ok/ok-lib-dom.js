/**
 * {@link http://github.com/solarfield/ok-kit-js}
 * {@licence https://gnu.org/licenses/lgpl.html}
 */

"use strict";

/**
 * @namespace Solarfield.Ok
 */
if (!self.Solarfield) self.Solarfield = {};
if (!Solarfield.Ok) Solarfield.Ok = {};

Solarfield.Ok.DOM_NODE_ELEMENT = 1;
Solarfield.Ok.DOM_NODE_DOCUMENT = 9;
Solarfield.Ok.DOM_NODE_DOCUMENT_FRAGMENT = 11;


/**
 * @class Solarfield.Ok.DomContext
 */
Solarfield.Ok.DomContext = function () {

};

Solarfield.Ok.DomContext.prototype.makeImplementation = function (aContext) {
	return new Solarfield.Ok.DomImplementation(aContext);
};

Solarfield.Ok.DomContext.prototype.makeDocument = function (aImplementation) {
	return new Solarfield.Ok.DomDocument(aImplementation);
};

Solarfield.Ok.DomContext.prototype.makeElement = function (aDocument, aNodeName) {
	return new Solarfield.Ok.DomElement(aDocument, aNodeName);
};

Solarfield.Ok.DomContext.prototype.makeDocumentFragment = function (aDocument) {
	return new Solarfield.Ok.DomDocumentFragment(aDocument);
};

Solarfield.Ok.DomContext.prototype.createImplementation = function () {
	return this.makeImplementation(this);
};


/**
 * @class Solarfield.Ok.MinimalDomContext
 * @extends Solarfield.Ok.DomContext
 */
Solarfield.Ok.MinimalDomContext = function () {
	Solarfield.Ok.DomContext.call(this);
};
Solarfield.Ok.extendObject(Solarfield.Ok.DomContext, Solarfield.Ok.MinimalDomContext);


/**
 * @class Solarfield.Ok.NativeDomContext
 * @extends Solarfield.Ok.DomContext
 */
Solarfield.Ok.NativeDomContext = function () {
	Solarfield.Ok.DomContext.call(this);
};
Solarfield.Ok.extendObject(Solarfield.Ok.DomContext, Solarfield.Ok.NativeDomContext);

Solarfield.Ok.NativeDomContext.prototype.makeDocument = function (aImplementation) {
	return window.document;
};


/**
 * @class Solarfield.Ok.DomImplementation
 */
Solarfield.Ok.DomImplementation = function (aContext) {
	this.context = aContext;
};

Solarfield.Ok.DomImplementation.prototype.createDocument = function () {
	return this.context.makeDocument(this);
};


/**
 * @class Solarfield.Ok.DomNode
 */
Solarfield.Ok.DomNode = function (aOwnerDocument, aNodeType, aNodeName) {
	this.ownerDocument = aOwnerDocument;
	this.nodeType = aNodeType;
	this.nodeName = aNodeName;
};


/**
 * @class Solarfield.Ok.DomDocumentFragment
 * @extends Solarfield.Ok.DomNode
 */
Solarfield.Ok.DomDocumentFragment = function (aOwnerDocument) {
	Solarfield.Ok.DomNode.call(this, aOwnerDocument, Solarfield.Ok.DOM_NODE_DOCUMENT_FRAGMENT, '#document-fragment');

	this.ownerDocument = aOwnerDocument;
	this.children = [];
};
Solarfield.Ok.extendObject(Solarfield.Ok.DomNode, Solarfield.Ok.DomDocumentFragment);

Solarfield.Ok.DomDocumentFragment.prototype.appendChild = function (aElement) {
	this.children.push(aElement);
	aElement.parentNode = this;
};


/**
 * @class Solarfield.Ok.DomDocument
 */
Solarfield.Ok.DomDocument = function (aDomImplementation) {
	Solarfield.Ok.DomNode.call(this, this, Solarfield.Ok.DOM_NODE_DOCUMENT, '#document');

	this.implementation = aDomImplementation;
};
Solarfield.Ok.extendObject(Solarfield.Ok.DomNode, Solarfield.Ok.DomDocument);

Solarfield.Ok.DomDocument.prototype.createElement = function (aName) {
	return this.implementation.context.makeElement(this, aName);
};

Solarfield.Ok.DomDocument.prototype.createDocumentFragment = function () {
	return this.implementation.context.makeDocumentFragment(this);
};


/**
 * @class Solarfield.Ok.DomElement
 */
Solarfield.Ok.DomElement = function (aOwnerDocument, aName) {
	Solarfield.Ok.DomNode.call(this, aOwnerDocument, Solarfield.Ok.DOM_NODE_ELEMENT, aName.toUpperCase());

	this.children = [];
	this.attributes = [];
	this.textContent = '';
	this.parentNode = null;
};
Solarfield.Ok.extendObject(Solarfield.Ok.DomNode, Solarfield.Ok.DomElement);

Solarfield.Ok.DomElement.prototype.appendChild = function (aElement) {
	this.children.push(aElement);
	aElement.parentNode = this;
};

Solarfield.Ok.DomElement.prototype.setAttribute = function (aName, aValue) {
	this.attributes.push({
		name: ''+ aName,
		value: ''+ aValue
	});
};

Solarfield.Ok.DomElement.prototype.appendChild = function (aElement) {
	this.children.push(aElement);
	aElement.parentNode = this;
};


/**
 * @class Solarfield.Ok.HtmlDomSerializer
 */
Solarfield.Ok.HtmlDomSerializer = function () {

};

Solarfield.Ok.HtmlDomSerializer.prototype._escape = function (aText) {
	var i, len, html, code;

	html = '';

	len = aText.length;
	for (i = 0; i < len; i++) {
		code = aText.charCodeAt(i);
		html += (code >= 32 && code <= 126) ? aText.charAt(i) : '&#' + code + ';';
	}

	return html;
};

Solarfield.Ok.HtmlDomSerializer.prototype._serializeElement = function (aElement) {
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

Solarfield.Ok.HtmlDomSerializer.prototype.serializeToString = function (aNode) {
	return this._serializeElement(aNode);
};


/**
 * @class Solarfield.Ok.NodeDomCopier
 */
Solarfield.Ok.NodeDomCopier = function () {

};

/** @private */
Solarfield.Ok.NodeDomCopier.prototype._copyNode = function (aNode, aDocument, aDeep) {
	var el, i, len, attributes, attribute, children;

	if (aNode.nodeType == Solarfield.Ok.DOM_NODE_DOCUMENT_FRAGMENT) {
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

Solarfield.Ok.NodeDomCopier.prototype.copyNodeToNode = function (aNode, aDocument, aDeep) {
	return this._copyNode(aNode, aDocument, aDeep != undefined ? aDeep : true);
};


/**
 * @class Solarfield.Ok.JsonDomCopier
 */
Solarfield.Ok.JsonDomCopier = function () {

};

/**
 * @private
 */
Solarfield.Ok.JsonDomCopier.prototype._copyNode = function (aNode, aDeep) {
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
Solarfield.Ok.JsonDomCopier.prototype._copyJson = function (aJson, aDocument, aDeep) {
	var el, i, len, attributes, attribute, children;

	if (aJson.nodeType == Solarfield.Ok.DOM_NODE_DOCUMENT_FRAGMENT) {
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

Solarfield.Ok.JsonDomCopier.prototype.copyNodeToJson = function (aNode, aDeep) {
	return this._copyNode(aNode, aDeep != undefined ? aDeep : true);
};

Solarfield.Ok.JsonDomCopier.prototype.copyJsonToNode = function (aJson, aDocument, aDeep) {
	return this._copyJson(aJson, aDocument, aDeep != undefined ? aDeep : true);
};


/**
 * @class Solarfield.Ok.OneWayStaticDomDiffer
 */
Solarfield.Ok.OneWayStaticDomDiffer = function () {

};

Solarfield.Ok.OneWayStaticDomDiffer.DIFF_ATTRIBUTE = 1;
Solarfield.Ok.OneWayStaticDomDiffer.DIFF_TEXT = 2;

/**
 * @private
 */
Solarfield.Ok.OneWayStaticDomDiffer.prototype._getLookup = function (aAttrs) {
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
Solarfield.Ok.OneWayStaticDomDiffer.prototype._getSelector = function (aContextNode, aTopNode) {
	var node, attrs, selector, part;

	selector = '';

	node = aContextNode;
	do {
		attrs = Solarfield.Ok.OneWayStaticDomDiffer.prototype._getLookup(node.attributes);

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
Solarfield.Ok.OneWayStaticDomDiffer.prototype._compare = function (aNode1, aNode2, aContextNode, aTopNode) {
	var diffs, childDiffs, i, len, attrs1, attrs2, attr2, children2, children1;

	diffs = [];

	if (aNode1.nodeType == Solarfield.Ok.DOM_NODE_ELEMENT) {
		attrs1 = this._getLookup(aNode1.attributes);

		attrs2 = aNode2.attributes;
		len = attrs2.length;
		for (i = 0; i < len; i++) {
			attr2 = attrs2[i];

			if (!(attr2.name in attrs1 && attr2.value == attrs1[attr2.name])) {
				diffs.push({
					type: Solarfield.Ok.OneWayStaticDomDiffer.DIFF_ATTRIBUTE,
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
				type: Solarfield.Ok.OneWayStaticDomDiffer.DIFF_TEXT,
				value: aNode2.textContent,
				context: aContextNode ? this._getSelector(aContextNode, aTopNode) : null
			});
		}
	}

	return diffs;
};

Solarfield.Ok.OneWayStaticDomDiffer.prototype.compareNodes = function (aNode1, aNode2) {
	return this._compare(aNode1, aNode2, null, aNode1);
};
