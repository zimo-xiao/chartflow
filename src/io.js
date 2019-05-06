"use strict";
exports.__esModule = true;
var csv_1 = require("./csv");
var io = /** @class */ (function () {
    function io(root) {
        this._root = root;
    }
    io.prototype.csv2Json = function (file) {
        if (!this.isCSV(file)) {
            return false;
        }
        var data = this.read(file);
        data = this.replaceComma(data);
        var lines = data.split("\n");
        var result = [];
        var headers = lines[0].split(',');
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].includes('%c%')) {
                headers[i] = headers[i].replace(/(%c%)/gm, ',');
            }
            headers[i] = headers[i].trim();
        }
        for (var i = 1; i < lines.length; i++) {
            if (lines[i] == '') {
                break;
            }
            var obj = {};
            var currentLine = lines[i].split(',');
            for (var j = 0; j < headers.length; j++) {
                if (currentLine[j].includes('%c%')) {
                    currentLine[j] = currentLine[j].replace(/(%c%)/gm, ',');
                }
                obj[headers[j]] = currentLine[j].trim();
            }
            result.push(obj);
        }
        return result;
    };
    io.prototype.csv2Count = function (file, config) {
        if (!this.isCSV(file)) {
            return false;
        }
        var result = {};
        var data = this.read(file);
        var holder = "";
        var flag_quotation = false;
        var first_line = true;
        var counter = 0;
        var header = [];
        var pos = [];
        var query = {};
        var g = false;
        var ini_counter = {};
        var line_group = "";
        for (var j in config["count"]) {
            if (!j.includes("|and|")) {
                if (typeof config['count'][j] == 'string') {
                    if (config['count'][j] != 'all') {
                        ini_counter[j] = 0;
                    }
                }
                else {
                    for (var k in config['count'][j]) {
                        ini_counter[config['count'][j][k]] = 0;
                    }
                }
            }
        }
        var line_counter = Object.assign({}, ini_counter);
        var query_counter = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i] == '"' && !flag_quotation) {
                flag_quotation = true;
            }
            else if (data[i] == '"' && flag_quotation) {
                flag_quotation = false;
            }
            if (!flag_quotation && (data[i] == ',' || data[i] == '\n')) {
                if (first_line) {
                    header.push(holder);
                    if ("group" in config) {
                        if (config["group"] == holder) {
                            g = counter;
                        }
                    }
                    for (var j in config["count"]) {
                        if (j == holder) {
                            pos.push(counter);
                        }
                        else if (j.includes("|and|")) {
                            if (j.includes(holder)) {
                                var all_or_not = typeof config['count'][j] == 'string';
                                if (typeof query[j] == 'undefined') {
                                    query[j] = {};
                                }
                                var j_p = j.split("|and|");
                                for (var m = 0; m < j_p.length; m++) {
                                    if (all_or_not) {
                                        query[j][counter] = ["all", true, ""];
                                    }
                                    else {
                                        // now only support "all" operation
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    if (g == counter) {
                        if (!(holder in result)) {
                            result[holder] = Object.assign({}, ini_counter);
                        }
                        line_group = holder;
                    }
                    var pos_index = pos.indexOf(counter);
                    if (pos_index >= 0) {
                        if (typeof config["count"][header[pos[pos_index]]] == 'string') {
                            if (holder != '') {
                                if (config['count'][j] != 'all') {
                                    line_counter[header[pos[pos_index]]]++;
                                }
                                else {
                                    if (typeof line_counter[holder] != 'undefined') {
                                        line_counter[holder]++;
                                    }
                                    else {
                                        line_counter[holder] = 1;
                                        ini_counter[holder] = 0;
                                    }
                                }
                            }
                        }
                        else {
                            for (var s in config["count"][header[pos[pos_index]]]) {
                                if (holder.trim() == config["count"][header[pos[pos_index]]][s]) {
                                    line_counter[holder]++;
                                    break;
                                }
                            }
                        }
                    }
                    for (var as in query_counter) {
                        var query_index = typeof query_counter[as][counter];
                        if (query_index != 'undefined') {
                            if (query_counter[as][counter][0] == "all") {
                                query_counter[as][counter][1] = false;
                                query_counter[as][counter][2] = holder;
                            }
                        }
                    }
                }
                if (data[i] == ',') {
                    counter++;
                }
                else {
                    if (!first_line) {
                        for (var z in line_counter) {
                            if (typeof result[line_group][z] != 'undefined') {
                                result[line_group][z] += line_counter[z];
                            }
                            else {
                                result[line_group][z] = line_counter[z];
                            }
                        }
                        for (var z in query_counter) {
                            var flag = true;
                            var line_name = '';
                            for (var y in query_counter[z]) {
                                if (query_counter[z][y][1]) {
                                    flag = false;
                                }
                                else {
                                    line_name += '|and|' + query_counter[z][y][2];
                                }
                            }
                            line_name = line_name.slice(5);
                            if (flag) {
                                if (typeof result[line_group][line_name] != 'undefined') {
                                    result[line_group][line_name] += 1;
                                }
                                else {
                                    result[line_group][line_name] = 1;
                                }
                            }
                        }
                    }
                    else {
                        first_line = false;
                    }
                    counter = 0;
                    line_counter = Object.assign({}, ini_counter);
                    query_counter = Object.assign({}, query);
                    line_group = "";
                }
                holder = "";
            }
            else {
                if (data[i] != '"') {
                    holder += data[i];
                }
            }
        }
        return result;
    };
    io.prototype.csv2Map = function (file, hash, where) {
        if (where === void 0) { where = null; }
        if (!this.isCSV(file)) {
            return false;
        }
        var data = this.read(file);
        data = this.replaceComma(data);
        var lines = data.split("\n");
        var result = new Map();
        var headers = lines[0].split(',');
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].includes('%c%')) {
                headers[i] = headers[i].replace(/(%c%)/gm, ',');
            }
            headers[i] = headers[i].trim();
        }
        for (var i = 1; i < lines.length; i++) {
            if (lines[i] == '') {
                break;
            }
            var obj = {};
            var hold_hash = '';
            var currentLine = lines[i].split(',');
            for (var j = 0; j < headers.length; j++) {
                if (headers[j] == hash) {
                    hold_hash = currentLine[j];
                }
                if (currentLine[j].includes('%c%')) {
                    currentLine[j] = currentLine[j].replace(/(%c%)/gm, ',');
                }
                obj[headers[j]] = currentLine[j].trim();
            }
            if (where != null) {
                if (where(obj) && !result.has(hold_hash)) {
                    result.set(hold_hash, obj);
                }
            }
            else {
                if (!result.has(hold_hash)) {
                    result.set(hold_hash, obj);
                }
            }
        }
        return result;
    };
    io.prototype.write = function (file, data) {
        var location = this._root ? this._root + '/' + file : file;
        require('fs').writeFile(location, data, function (err) { });
    };
    io.prototype.read = function (file) {
        var location = this._root ? this._root + '/' + file : file;
        var fs = require('fs'); //file stream
        return fs.readFileSync(location, 'utf8');
    };
    // helper functions
    io.prototype.isCSV = function (file) {
        if (!file.includes('.csv')) {
            new Error('input file is not a CSV file');
            return false;
        }
        else {
            return true;
        }
    };
    io.prototype.replaceComma = function (data) {
        var flag = false;
        //replace comma with %c% within a double quotation
        for (var i = 0; i < data.length; i++) {
            if (data[i] == '"' && !flag) {
                //if encounter a starting quotation mark
                flag = true;
            }
            else if (data[i] == '"' && flag) {
                //if encounter an ending quotation mark
                flag = false;
            }
            if (flag && data[i] == ',') {
                // if we are in between two quotation marks and there is a comma
                data = data.substr(0, i) + '%c%' + data.substr(i + 3);
            }
        }
        return data;
    };
    io.prototype.json2CSV = function (data) {
        return new csv_1["default"](data);
    };
    return io;
}());
exports["default"] = io;
