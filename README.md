# node-bulk-insert
Simple SQL generator for bulk insert statements

Works nicely with [node-postgres](https://github.com/brianc/node-postgres).

## Install
`npm install @ataube/bulk-insert --save`

## Usage
```javascript
const bulkInsert = require('@ataube/bulk-insert');
const values = [{ name: 'Ben', age: 20 }, { name: 'Michael', age: 30 }]];

bulkInsert('myTable', values);

// INSERT INTO myTable (name,age) VALUES ($1,$2),($3,$4);
```

More samples can also be found in the tests.