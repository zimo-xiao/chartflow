"use strict";
exports.__esModule = true;
var io_1 = require("./src/io");
var flow_1 = require("./src/flow");
var chartflow = {
    createIO: function (rootDir) {
        if (rootDir === void 0) { rootDir = __dirname + '/../..'; }
        return new io_1["default"](rootDir);
    },
    createFlow: function (data) {
        return new flow_1["default"](data);
    }
};
var IO = chartflow.createIO();
var data = IO.csv2Json('ic2006.csv');
var F = chartflow.createFlow(data).leaveCol(['UNITID']).transpose();
IO.json2CSV(data).title('hello')["export"]('1.csv');
module.exports = chartflow;
