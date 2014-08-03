var _ = require('lodash');

exports = module.exports = {
    arrays: function (value) {
        if (_.isArray(value)) {
            value = value.toString();
        }
        return value;
    },
    dates: function (value) {
        var date = new Date(value);
        value = date.toString();
        value = (date < new Date('1980-12-31T09:00:00-07:00')) ? null : value
        return value;
    },
    stringreg: function (value) {
        var o = { $regex: value, $options: 'i' };
        return o;
    },
    intSearch: function (value) {
        return parseInt(value, 10);
    },
    intervalMaker: function (value, cb, scb) {
        var values, o, valueFun;
        if (value.indexOf('<>') !== -1) {
            values = value.split('<>');
            return {$gte: cb(values[0].trim()), $lte: cb(values[1].trim())}
        }
        else if (value.indexOf('>') !== -1) {
            values = value.split('>');
            return { $lt: cb(values[0].trim()) }
        }
        else if (value.indexOf('<') !== -1) {
            values = value.split('<');
            return { $gt: cb(values[0].trim()) }
        }
        else {
            valueFun = scb || cb;
            return valueFun(value)
        }
    },

    obj2str: function (value) {
        var result = '';
        if (_.isObject(value) && !_.isArray(value)) {
            for (key in value) {
                result += key + ' - ' + value[key] + ' ';
            }
        }
        return result;
    },

    arrobj2str: function (value) {
        var result, last;

        function obj2str(val) {
            var result = '';
            if (_.isObject(val) && !_.isArray(val)) {
                for (key in val) {
                    result += key + ' - ' + val[key] + ' ';
                }
            }
            return result;
        }

        if (_.isArray(value)) {
            result = '( ' + obj2str(value.shift()) + ' )<br>';
            last = '( ' + obj2str(value.pop()) + ' )<br>';

            value.forEach(function (obj) {
                result += '( ' + obj2str(obj) + ' )<br>';
            });

            result += last;
            return result;
        }
        else {
            return value.toString();
        }
    }
};
