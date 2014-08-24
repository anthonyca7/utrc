var Modifiers = {};

Modifiers.def = function (value) {
	return value;
};

Modifiers.date = function (value) {
	return value;
};

Modifiers.float = function (value) {
	if (typeof value === "number") {
		return value.toFixed(2);
	}
	return value;
};

Modifiers.integerRepresentation = function (value, extra) {
	if (typeof extra !== 'object' || !Array.isArray(extra.representations)) {
		return null;
	}

	return extra.representations[parseInt(value)];
};

Modifiers.complexObject = function (value) {
	var result = [], i;
	var keys = Object.keys(value);

	for (i = 0; i < keys.length; i++) {
		result.push("(" + keys[i] + ":" + value[keys[i]] + ")");
	}

	return "( " + result.join(", ") + " )";
};

Modifiers.complexArray = function (value) {
	var result = [];

	value.forEach(function (element) {
		if (typeof element === 'object') {
			result.push(Modifiers.complexObject(element));
		}
		else {
			result.push(element);
		}
	});

	return result.join(", ");
};

module.exports = Modifiers;