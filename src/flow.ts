class flow {

    private j

    constructor(j) {
        if (j) {
            this.j = j;
        } else {
            new Error('we need an input json file');
        }
    }

    deleteCol(min, max = null) {
        if (typeof min === 'object') {
            delete_key = min;
        } else {
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
    }

    deleteRow(min, max = null) {
        var len = max - min;
        if (!max) {
            len = 1;
        }

        this.j.splice(min, len);

        return this;
    }

    leaveCol(min, max = null) {
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

        } else {

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
    }

    replace(flag, n) {
        if (typeof flag == 'object') {
            for (var i = 0; i < flag.length; i++) {
                this.map((input) => {
                    if (input == flag[i]) {
                        return n[i];
                    } else {
                        return input;
                    }
                });
            }
        } else {
            this.map((input) => {
                if (input == flag) {
                    return n;
                } else {
                    return input;
                }
            });
        }

        return this;
    }

    trim() {
        return this.map((input) => {
            if (typeof input == 'string') {
                return input.trim();
            }
        });
    }

    toNumber(exception = 0) {
        return this.map((input) => {
            if (typeof input === 'string') {
                var n: any = Number(input.trim());
            }
            if (!n || typeof n == 'undefined') {
                n = input;
            }
            if (n === '0') {
                n = 0;
            }
            return n;
        });
    }

    map(f) {
        for (var i = 0; i < this.j.length; i++) {
            for (var key in this.j[i]) {
                this.j[i][key] = f(this.j[i][key]);
            }
        }

        return this;
    }

    export() {
        return this.j;
    }

    transpose() {
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
    }

}

export default flow