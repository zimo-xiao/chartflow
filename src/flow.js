"use strict";
exports.__esModule = true;
var flow = /** @class */ (function () {
    function flow(j) {
        if (j) {
            this.j = j;
        }
        else {
            new Error('we need an input json file');
        }
    }
    flow.prototype.deleteCol = function (min, max) {
        if (max === void 0) { max = null; }
        if (typeof min === 'object') {
            delete_key = min;
        }
        else {
            if (!max) {
                max = min;
            }
            var count = 0;
            var delete_key = [];
            for (var key in this.j[0]) {
                if (count >= min && count <= max) {
                    delete_key.push(key);
                }
                count++;
            }
        }
        for (var i = 0; i < this.j.length; i++) {
            for (var j = 0; j < delete_key.length; j++) {
                delete this.j[i][delete_key[j]];
            }
        }
        return this;
    };
    flow.prototype.deleteRow = function (min, max) {
        if (max === void 0) { max = null; }
        var len = max - min;
        if (!max) {
            len = 1;
        }
        this.j.splice(min, len);
        return this;
    };
    flow.prototype.leaveCol = function (min, max) {
        if (max === void 0) { max = null; }
        if (typeof min === 'object') {
            var delete_key = [];
            for (var key in this.j[0]) {
                var add = true;
                for (var i = 0; i < min.length; i++) {
                    if (key === min[i]) {
                        add = false;
                    }
                }
                if (add) {
                    delete_key.push(key);
                }
            }
        }
        else {
            if (!max) {
                max = min;
            }
            var count = 0;
            var delete_key = [];
            for (var key in this.j[0]) {
                if (count < min && count > max) {
                    delete_key.push(key);
                }
                count++;
            }
        }
        for (var i = 0; i < this.j.length; i++) {
            for (var j = 0; j < delete_key.length; j++) {
                delete this.j[i][delete_key[j]];
            }
        }
        return this;
    };
    flow.prototype.replace = function (flag, n) {
        if (typeof flag == 'object') {
            for (var i = 0; i < flag.length; i++) {
                this.map(function (input) {
                    if (input == flag[i]) {
                        return n[i];
                    }
                    else {
                        return input;
                    }
                });
            }
        }
        else {
            this.map(function (input) {
                if (input == flag) {
                    return n;
                }
                else {
                    return input;
                }
            });
        }
        return this;
    };
    flow.prototype.trim = function () {
        return this.map(function (input) {
            if (typeof input == 'string') {
                return input.trim();
            }
        });
    };
    flow.prototype.toNumber = function (exception) {
        if (exception === void 0) { exception = 0; }
        return this.map(function (input) {
            if (typeof input === 'string') {
                var n = Number(input.trim());
            }
            if (!n || typeof n == 'undefined') {
                n = input;
            }
            if (n === '0') {
                n = 0;
            }
            return n;
        });
    };
    flow.prototype.map = function (f) {
        for (var i = 0; i < this.j.length; i++) {
            for (var key in this.j[i]) {
                this.j[i][key] = f(this.j[i][key]);
            }
        }
        return this;
    };
    flow.prototype["export"] = function () {
        return this.j;
    };
    flow.prototype.transpose = function () {
        var out = {};
        for (var i = 0; i < this.j.length; i++) {
            for (var key in this.j[i]) {
                if (typeof out[key] === 'undefined') {
                    out[key] = [];
                }
                out[key].push(this.j[i][key]);
            }
        }
        return out;
    };
    return flow;
}());
exports["default"] = flow;
