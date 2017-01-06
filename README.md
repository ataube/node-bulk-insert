# node-bulk-insert
Simple SQL generator for bulk insert statements

Works nicely with [node-postgres](https://github.com/brianc/node-postgres).

## Install
`npm install @ataube/bulk-insert --save`

## Usage
### Simple
```javascript
const BulkInsert = require('@ataube/bulk-insert');
const bulkInsert = BulkInsert();
const values = [{ name: 'Ben', age: 20 }, { name: 'Michael', age: 30 }]];

const { sql } bulkInsert('myTable', values);

// INSERT INTO myTable (name,age) VALUES ($1,$2),($3,$4) RETURNING *;
```

### Ignore Fields
```javascript
const BulkInsert = require('@ataube/bulk-insert');
const bulkInsert = BulkInsert(ignore: ['age'] });
const values = [{ name: 'Ben', age: 20 }, { name: 'Michael', age: 30 }]];

const { sql, values } bulkInsert('myTable', values);

// sql: INSERT INTO myTable (name) VALUES ($1),($2) RETURNING *;
// values: ['Ben', 'Michael']
```

More samples can also be found in the tests.

### Options
* return {string} - defines the returning fields of sql statements, ie. `{ return: 'id, name' }`
* ignore {Array<string>} - defines fields to be ignored