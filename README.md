## chartflow 📊

```sh
npm i chartflow
```

Statistic tools for reading and generating CSV reports

#### Benefits of Using chartflow
- **Light**: pure algorithm without dependencies
- **IO**: fast read/write with native Node.js IO stream
- **CSV**: native CSV read and render support
- **JSON**: native CSV <=> JSON double direction translate
- **Automation**: designed for large-scale report generating

#### Package Structure
there are two sets of tools in chartflow that you need to know
- **io**: handles read/export CSV files to different formats and data structures
- **flow**: performs calculation and transformation on the JSON representation of a CSV 

## io

Let's say a chart **students.csv** looks like this

| student ID | gender | ethnicity | year |
| ---------- | ------ | --------- | ---- |
| 1          | Male   | Hispanic  | 2017 |
| 2          | Female | White     | 2017 |
| 3          | Male   | Asian     | 2017 |


```js
const chartflow = require('chartflow')

// create an IO handler for reading and exporting CSV
var rootDir = '/dir/to/your/csv'
const io = chartflow.createIO(rootDir)

// returns JSON with string as index and data as value
// TODO: doesn't support filter yet
var outputJson = io.csv2Json('students.csv')

// outputJson returns
[
    {
        "student ID": 1,
        "gender": "Male",
        "ethnicity": "Hispanic"
    },
    {
        "student ID": 2,
        "gender": "Female",
        "ethnicity": "White"
    },
    {
        "student ID": 3,
        "gender": "Male",
        "ethnicity": "Asian"
    },
]



// returns a map object with string as index and data as value in the form of JSON
// set student-id as index
// [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map]
filter = (x) => { return x['student ID'] < 10 } // only returns lines when student ID is lesser than 10
var outputMap = io.csv2Map('students.csv', 'student ID', filter)

// outputMap returns structure
{
    1: {
        "student ID": 1,
        "gender": "Male",
        "ethnicity": "Hispanic"
    },
    2: {
        "student ID": 2,
        "gender": "Female",
        "ethnicity": "White"
    },
    3: {
        "student ID": 3,
        "gender": "Male",
        "ethnicity": "Asian"
    },
}



// returns a JSON object with the count as value
// TODO: doesn't support filter yet
var countA = root.csv2Count('students.csv', {
    group: "year",  // data will group by year
    count:  {
        // use array to define which data you want to match
        // in this case, we want to count the appearance of "man" in col "gender"
        "gender": ["man"],
        // use keyword "all" to count all different data and their appearance
        "ethnicity": "all",
        // count how many valid data (non-empty, not null or "")
        "student ID": "valid"
        // count all possible combination of a and b (only "all" operation is supported)
        "gender|and|ethnicity": "all"
    }
});

// countA returns
{
    '2017':
        {
            "Male": 2,
            "Asian": 1,
            "White": 1,
            "Hispanic": 1,
            "Student ID": 200,
            "male|and|Asian": 500, // |and| operator
            ...
        }
}



// generate csv from JSON data (format same as the return value of csv2Json)
var csvData = io.json2CSV(data)
    .trim() // trim whitespace
    .reorder(['gender', 'ethnicity', 'student ID', 'year']) // change the order of columns
    .title(['Student Chart', 'created by Zimo Xiao'])   // add chart title
    .renameCol(['g', 'e', 'id', 'y'])  // rename column in order
    .export('report.csv', 'your/export/dir')   // export CSV data
```

## flow

-   Column operations

```JavaScript
  // input must be a JSON object outputted by csv_to_json() function
  // leaveCol() delete every col except ['UNITID', 'EFTOTLT', 'EFTOTLM', 'EFTOTLW']
  // deleteCol() delete col ['UNITID', 'EFTOTLT']
  // export() outputs the transformed JSON with col ['EFTOTLM', 'EFTOTLW']
  var output = chartflow.createFlow(data)
    .leaveCol(['UNITID', 'EFTOTLT', 'EFTOTLM', 'EFTOTLW'])
    .deleteCol(['UNITID', 'EFTOTLT'])
    .deleteRow(0, 100)  // delete row in the range of 0 - 100
    .export();
```

-   Map operations

```JavaScript
  // map() applies a function to every single element
  // toNumber(exception) converts string that is convertible to number, else replace non-convertible with exception
  // trim() trim every element
  // replace(flag, n) if element is the same as flag, replace it with n
  var output = chartflow.createFlow(data)
    .trim()
    .toNumber()
    .map(x => x + 1)
    .replace([1,2],3)
    .export()
```

-   Transpose

```JavaScript
  // TODO: do not support transposing back yet
  var output = chartflow.createFlow(data).transpose()

  // before transpose()
  var data = [
    {
      a: 1,
      b: 2
    },
    {
      a: 3,
      b: 4
    }
  ];

  // after transpose()
  var data = {
    a: [1, 3],
    b: [2, 4]
  }
```
