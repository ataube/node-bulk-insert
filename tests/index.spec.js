const expect = require('unexpected');
const BulkInsert = require('..');

describe('Bulk Insert Generator', () => {
  [
    {
      context: 'with simple object',
      input: ['myTable', { name: 'Ben', age: 20 }],
      expect: 'INSERT INTO myTable (name,age) VALUES ($1,$2) RETURNING *;',
    },
    {
      context: 'with simple object 2',
      input: ['myTable', { name: 'Ben', age: 20, city: 'Hamburg', country: 'Germany' }],
      expect: 'INSERT INTO myTable (name,age,city,country) VALUES ($1,$2,$3,$4) RETURNING *;',
    },
    {
      context: 'with array of objects',
      input: ['myTable', [{ name: 'Ben', age: 20 }, { name: 'Michael', age: 30 }]],
      expect: 'INSERT INTO myTable (name,age) VALUES ($1,$2),($3,$4) RETURNING *;',
    },
    {
      context: 'with custom return option',
      input: ['myTable', { name: 'Ben', age: 20 }],
      options: { return: 'id' },
      expect: 'INSERT INTO myTable (name,age) VALUES ($1,$2) RETURNING id;',
    },
    {
      context: 'with null arguments',
      input: [null, null],
      expect: null,
    },
    {
      context: 'with empty values',
      input: ['myTable', []],
      expect: null,
    },
    {
      context: 'with empty table name',
      input: ['', [{ name: 'Ben' }]],
      expect: null,
    },
  ].forEach((spec) => {
    context(spec.context, () => {
      it(spec.expect || 'returns null', () => {
        const bulkInsert = BulkInsert(spec.options);
        const sql = bulkInsert(...spec.input);
        expect(sql, 'to equal', spec.expect);
      });
    });
  });
});
