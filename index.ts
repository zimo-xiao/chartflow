import io from './src/io'
import flow from './src/flow'

var chartflow = {

    createIO: function (rootDir: string = __dirname + '/../..'): io {
        return new io(rootDir)
    },

    createFlow(data): flow {
        return new flow(data)
    }
}

var IO = chartflow.createIO()

var data = IO.csv2Json('ic2006.csv')

var F = chartflow.createFlow(data).leaveCol(['UNITID']).transpose()

IO.json2CSV(data).title('hello').export('1.csv')

module.exports = chartflow