Array.lambda = function (s) {
	if (typeof s !== "string") {
		return s;
	}

	s = s.replace("=>", "`return ") + ";";
	s = s.split("`");
	s = Function.apply(null, s);

	return s;
};
Array.prototype.any = function (d) {
	var result;

	d = Array.lambda(d);

	if (d) {
		this.forEach(function (it) {
			if (d(it)) {
				result = it;
				return { stop: true };
			}
		});
	} else {
		result = this[0];
	}

	return result ? true : false;
}
Array.prototype.select = function (d) {
	var result = [];

	d = Array.lambda(d);

	this.forEach(function (it, i) {
		result.push(d(it, i));
	});

	return result;
};
Array.prototype.where = function (d) {
	var result = [];

	d = Array.lambda(d);

	this.forEach(function (it, i) {
		if (d(it, i)) {
			result.push(it);
		}
	});

	return result;
};

var css2less = function (css, options) {
	var me = this;

	var ctor = function () {
		me.css = css || "";
		me.options = {
			cssColors: ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
			vendorPrefixesList: ["-moz", "-o", "-ms", "-webkit"],
			//vendorPrefixesReg: /^(-moz|-o|-ms|-webkit)-/gi,
			indentSymbol: "\t",
			indentSize: 1,
			selectorSeparator: ",\n",
			blockFromNewLine: false,
			blockSeparator: "\n",
			updateColors: false,
			vendorMixins: true,
			nameValueSeparator: ": "
		};
		var vendorPrefixesListStr = me.options.vendorPrefixesList.join('|');

		me.options.vendorPrefixesReg = new RegExp('^(' + vendorPrefixesListStr + ')-', 'gi');

		for (var i in me.options) {
			if (typeof options[i] === 'undefined') continue;
			me.options[i] = options[i];
		}

		me.tree = {};
		me.less = [];
		me.colors = {};
		me.colors_index = 0;
		me.vendorMixins = {};
	},
	isBase64 = function(str) {
		return str.indexOf('base64') !== -1;
	};

	me.processLess = function () {
		me.cleanup();

		if (!me.css) {
			return false;
		}

		me.generateTree();
		me.renderLess();
		me.less = me.less.join("");

		return true;
	};

	me.cleanup = function () {
		me.tree = {};
		me.less = [];
	}

	me.convertRules = function (data) {
		var arr = data.split(/[;]/gi).select("val=>val.trim()").where("val=>val"),
			base64Index = false;

		arr.forEach(function(item, i) {
			if ( isBase64(item) ) base64Index = i;
		});

		if (base64Index) {
			arr[base64Index - 1] = arr[base64Index - 1] + ';' + arr[base64Index];
			arr.splice(base64Index, 1);
		}

		return arr;
	};

	me.color = function (value) {
		value = value.trim();

		if (me.options.cssColors.indexOf(value) >= 0 || /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/gi.test(value) || /(rgba?)\(.*\)/gi.test(value)) {
			return true;
		}

		return false;
	};

	me.convertIfColor = function (color) {
		color = color.trim();

		if (me.color(color)) {
			if (!me.colors[color]) {
				me.colors[color] = "@color" + me.colors_index;
				me.colors_index++;
			}

			return me.colors[color];
		}

		return color;
	};

	me.matchColor = function (style) {
		var rules = me.convertRules(style);
		var result = [];

		rules.forEach(function (r, i) {
			var parts = r.split(/[:]/gi);
            if (!parts || !parts.length) return;
			var key = parts[0].trim();
			var value = parts[1] ? parts[1].trim() : null;

			result.push(i > 0 ? "\n" : "", key);

			if (!value) {
				return;
			}

			var oldValues = value.split(/\s+/gi);
			var newValues = oldValues.select(function (v) {
				return me.convertIfColor(v);
			});

			result.push(me.options.nameValueSeparator, newValues.join(" "), ";");
		});

		return result.join("");
	};

	me.matchVendorPrefixMixin = function (style) {
		var normal_rules = {};
		var prefixed_rules = {};
		var rules = me.convertRules(style);

		for (var i = 0; i < rules.length; i++) {
			var e = rules[i].trim();

			var parts = e.split(/[:]/gi);

			if ( isBase64(e) ) parts = [parts[0], parts[1] + parts[2]];

            if (!parts || !parts.length) return;
			var key = parts[0].trim();
			var value = parts[1] ? parts[1].trim() : null;

			if (!value) {
				normal_rules[key] = "";
			} else if (me.options.vendorPrefixesReg.test(key)) {
				var rule_key = key.replace(me.options.vendorPrefixesReg, "");
				var values = value.split(/\s+/gi);
				var newValue = [];

				for (var j = 0; j < values.length; j++) {
					newValue.push(values[j].trim());
				}

				newValue = newValue.join(" ");

				if (prefixed_rules[rule_key] && prefixed_rules[rule_key] != newValue) {
					return style;
				}

				prefixed_rules[rule_key] = newValue;
			} else {
				normal_rules[key] = value;
			}
		}

		for (var k in prefixed_rules) {
			var v = prefixed_rules[k];

			v = v.split(/\s+/gi).select("val=>val.trim()").where("val=>val");

			if (!me.vendorMixins[k]) {
				me.vendorMixins[k] = v.length;
			}

			if (normal_rules[k]) {
				delete normal_rules[k];
				normal_rules[".vp-" + k + "(" + v.join(", ") + ")"] = "";
			}
		}

		var result = [];

		for (var k in normal_rules) {
			var v = normal_rules[k];
			var r = [k];

			if (v) {
				r.push(me.options.nameValueSeparator, v, ";\n");
			}

			result.push(r.join(""));
		}

		return result.join("");
	};

	me.addRule = function (tree, selectors, style) {
		if (!style) {
			return;
		}

		if (!selectors || !selectors.length) {
			if (me.options.updateColors) {
				style = me.matchColor(style)
			}

			if (me.options.vendorMixins) {
				style = me.matchVendorPrefixMixin(style);
			}

			if (!tree.style) {
				tree.style = style;
			} else {
				tree.style += style;
			}
		} else {
			var first = selectors[0].split(/\s*[,]\s*/gi).select("val=>val.trim()").where("val=>val").join(me.options.selectorSeparator);

			if (!tree.children) {
				tree.children = [];
			}

			if (!tree[first]) {
				tree[first] = {};
			}

			var node = tree[first];

			selectors.splice(0, 1);
			tree.children.push(node);
			me.addRule(node, selectors, style);
		}
	};

	me.generateTree = function () {
		var csss = me.css.split(/\n/gi);
		var temp = csss.select("val=>val.trim()").where("val=>val");

		temp = temp.join("");
		temp = temp.replace(/[/][*]+[^\*]*[*]+[/]/gi, "");
		temp = temp.replace(/[^{}]+[{]\s*[}]/ig, " ");
		temp = temp.split(/[{}]/gi).where("val=>val");

		var styles = [];

		for (var i = 0; i < temp.length; i++) {
			if (i % 2 === 0) {
				styles.push([temp[i]]);
			} else {
				styles[styles.length - 1].push(temp[i]);
			}
		}

		for (var i = 0; i < styles.length; i++) {
			var style = styles[i];
			var rules = style[0];

			if (rules.indexOf(">") >= 0) {
				rules = rules.replace(/\s*>\s*/gi, " &>");
			}

			if (rules.indexOf("@import") >= 0) {
				var import_rule = rules.match(/@import.*;/gi)[0];
				rules = rules.replace(/@import.*;/gi, "");
				me.addRule(me.tree, [], import_rule);
			}

			if (rules.indexOf(",") >= 0) {
				me.addRule(me.tree, [rules], style[1]);
			} else {
				var rules_split = rules.replace(/[:]/gi, " &:").split(/\s+/gi).select("val=>val.trim()").where("val=>val").select(function (it, i) {
					return it.replace(/[&][>]/gi, "& > ");
				});

				me.addRule(me.tree, rules_split, style[1]);
			}
		}
	};

	me.buildMixinList = function (indent) {
		var less = [];

		for (var k in me.vendorMixins) {
			var v = me.vendorMixins[k];
			var args = [];

			for (var i = 0; i < v; i++) {
				args.push("@p" + i);
			}

			less.push(".vp-", k, "(", args.join(", "), ")");

			if (me.options.blockFromNewLine) {
				less.push("\n");
			} else {
				less.push(" ");
			}

			less.push("{\n");

			me.options.vendorPrefixesList.forEach(function (vp, i) {
				less.push(getIndent(indent + me.options.indentSize));
				less.push(vp, "-", k, me.options.nameValueSeparator, args.join(" "), ";\n");
			});

			less.push(getIndent(indent + me.options.indentSize), k, me.options.nameValueSeparator, args.join(" "), ";\n");
			less.push(/*getIndent(indent), */"}\n");
		}

		if (less.any()) {
			less.push("\n");
		}

		return less.join("");
	};

	me.renderLess = function (tree, indent) {
		indent = indent || 0;

		if (!tree) {
			for (var k in me.colors) {
				var v = me.colors[k];
				me.less.push(v, me.options.nameValueSeparator, k, ";\n");
			}

			if (me.colors_index > 0) {
				me.less.push("\n");
			}

			if (me.options.vendorMixins) {
				me.less.push(me.buildMixinList(indent));
			}

			tree = me.tree;
		}

		var index = 0;

		for (var i in tree) {
			if (i == "children") {
				continue;
			}

			var element = tree[i];
			var children = element.children;

			if (i == "style") {
				me.less.push(me.convertRules(element).join(";\n"), "\n");
			} else {
				if (index > 0) {
					me.less.push(me.options.blockSeparator);
				}

				//Selector indent
				if (indent > 0) me.less.push(getIndent(indent), i);
				else me.less.push(/*getIndent(indent),*/ i);

				if (me.options.blockFromNewLine) {
					me.less.push("\n", getIndent(indent));
				} else {
					me.less.push(" ");
				}

				me.less.push("{\n");

				var style = element.style;
				delete element.style;

				if (style) {
					var temp = me.convertRules(style);

					temp = temp.select(function (it, i) {
						return getIndent(indent + me.options.indentSize) + it + ";";
					});

					me.less.push(temp.join("\n"), "\n");

					if (children && children.length) {
						me.less.push(me.options.blockSeparator);
					}
				}

				me.renderLess(element, indent + me.options.indentSize);

				if (indent > 0) me.less.push(getIndent(indent), "}\n");
				else me.less.push(/*getIndent(indent),*/ "}\n");

				index++;
			}
		}
	};

	function getIndent(size) {
		size = size || me.options.indentSize;

		var result = '',
			indent;

		var max = size,
			n = 0;
		for (; n < max; n++) {
			result += me.options.indentSymbol;
		}

		return result;
		/*return (new Array(size)).select(function (it, i) {
			return me.options.indentSymbol;
		}).join("");*/
	}

	ctor();
};


module.exports = function(cssString, options) {
	if (!cssString) {
		console.log('cssString require');
		return false;
	}

	var lessInst = new css2less(cssString, options || {});

	lessInst.processLess();

	return lessInst.less;
};
