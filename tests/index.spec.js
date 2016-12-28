var expect = require('unexpected');
var bulkInsert = require('..');

describe('Bulk Insert Generator', () => {
  [
    { 
      context: 'with simple object',
      input: [ 'myTable', { name: 'Ben', age: 20 } ],
      expect: `INSERT INTO myTable (name,age) VALUES ($1,$2);`
    },
    { 
      context: 'with simple object 2',
      input: [ 'myTable', { name: 'Ben', age: 20, city: 'Hamburg', country: 'Germany' } ],
      expect: `INSERT INTO myTable (name,age,city,country) VALUES ($1,$2,$3,$4);`
    },
    { 
      context: 'with array of objects',
      input: [ 'myTable', [{ name: 'Ben', age: 20 }, { name: 'Michael', age: 30 }] ],
      expect: `INSERT INTO myTable (name,age) VALUES ($1,$2),($3,$4);`
    }
  ].forEach(spec => {
    context(spec.context, () => {
      it(spec.expect, () => {
        const sql = bulkInsert.apply(null, spec.input);
        expect(sql, 'to equal', spec.expect)
      });
    })
  });
});