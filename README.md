# node-bulk-insert
Simple SQL generator for bulk insert statements

Works nicely with [node-postgres](https://github.com/brianc/node-postgres).

## Install
`npm install @ataube/bulk-insert --save`

## Usage
```javascript
const BulkInsert = require('@ataube/bulk-insert');
const bulkInsert = BulkInsert(/* { return: 'id' } */);
const values = [{ name: 'Ben', age: 20 }, { name: 'Michael', age: 30 }]];

bulkInsert('myTable', values);

// INSERT INTO myTable (name,age) VALUES ($1,$2),($3,$4) RETURNING id;
```

More samples can also be found in the tests.