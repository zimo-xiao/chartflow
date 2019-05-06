class csv {

    private csv_array

    private line_count

    private _title

    constructor(input_json) {
        this.line_count = 0;
        this.csv_array = [];
        this._title = [];
        var header = [];
        for (var key in input_json[0]) {
            header.push(key);
            this.line_count++;
        }
        this.csv_array.push(header);
        var holder = [];
        for (var i = 0; i < input_json.length; i++) {
            holder = [];
            for (var j = 0; j < header.length; j++) {
                holder.push(input_json[i][header[j]]);
            }
            this.csv_array.push(holder);
        }
    }

    renameCol(input_header) {
        this.csv_array[0] = input_header;
        return this;
    }

    reorder(order) {
        var order_in_num = [];
        for (var j = 0; j < order.length; j++) {
            for (var i = 0; i < this.csv_array[0].length; i++) {
                if (order[j] === this.csv_array[0][i]) {
                    order_in_num.push(i);
                    break;
                }
            }
        }

        var big_holder = [];
        for (var i = 0; i < this.csv_array.length; i++) {
            var holder = [];
            for (var j = 0; j < order_in_num.length; j++) {
                holder.push(this.csv_array[i][order_in_num[j]]);
            }
            big_holder.push(holder);
        }
        this.csv_array = big_holder;

        return this;
    }

    after(line_after, f, header = '') {

        if (typeof line_after === 'string') {
            for (var i = 0; i < this.csv_array[0].length; i++) {
                if (line_after === this.csv_array[0][i]) {
                    line_after = i;
                    break;
                }
            }
        }

        var clone = JSON.parse(JSON.stringify(this.csv_array));
        if (typeof line_after === 'object') {
            this.line_count += line_after.length;
            for (var j = 0; j < line_after.length; j++) {
                clone[0].splice(line_after[j] + j + 1, 0, header);
                for (var i = 1; i < clone.length; i++) {
                    clone[i].splice(line_after[j] + j + 1, 0, f(this.csv_array[i], line_after[j]));
                }
            }
        } else {
            this.line_count++;
            clone[0].splice(line_after + 1, 0, header);
            for (var i = 1; i < clone.length; i++) {
                clone[i].splice(line_after + 1, 0, f(this.csv_array[i], line_after));
            }
        }

        this.csv_array = clone;
        return this;
    }

    title(input_title) {
        if (typeof input_title === 'object') {
            for (var i = 0; i < input_title.length; i++) {
                if (typeof input_title === 'object') {
                    this._title.push(input_title[i]);
                } else {
                    this._title.push([input_title[i]]);
                }
            }
        } else {
            this._title.push([input_title]);
        }
        return this;
    }

    print() {
        console.log(this._title);
        console.log('-----------')
        console.log(this.csv_array);
        return this;
    }

    export(name: string, rootDat: string = __dirname + '/../../..') {
        this._title.reverse();
        for (var i = 0; i < this._title.length; i++) {
            this.csv_array.unshift([this._title[i]]);
        }
        for (var i = 0; i < this.csv_array.length; i++) {
            if (this.csv_array[i].length < this.line_count) {
                for (var j = 0; j < (this.line_count - this.csv_array[i].length); j++) {
                    this.csv_array[i].push('');
                }
            }
        }

        var out_string = '';
        for (var i = 0; i < this.csv_array.length; i++) {
            for (var j = 0; j < this.csv_array[i].length; j++) {
                out_string += this.csv_array[i][j];
                if (j != (this.csv_array[i].length - 1)) {
                    out_string += ',';
                }
            }
            out_string += '\n';
        }

        rootDat += '/' + name;
        require('fs').writeFile(rootDat, out_string, (err) => { });
    }

}

export default csv