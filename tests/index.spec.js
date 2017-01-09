const expect = require('unexpected');
const bulkInsert = require('..');

describe('Bulk Insert Generator', () => {
  [
    {
      context: 'with simple object',
      input: ['myTable', { name: 'Ben', age: 20 }],
      expect: {
        sql: 'INSERT INTO myTable (name,age) VALUES ($1,$2) RETURNING *;',
        values: ['Ben', 20],
      },
    },
    {
      context: 'with simple object 2',
      input: ['myTable', { name: 'Ben', age: 20, city: 'Hamburg', country: 'Germany' }],
      expect: {
        sql: 'INSERT INTO myTable (name,age,city,country) VALUES ($1,$2,$3,$4) RETURNING *;',
        values: ['Ben', 20, 'Hamburg', 'Germany'],
      },
    },
    {
      context: 'with array of objects',
      input: ['myTable', [{ name: 'Ben', age: 20 }, { name: 'Michael', age: 30 }]],
      expect: {
        sql: 'INSERT INTO myTable (name,age) VALUES ($1,$2),($3,$4) RETURNING *;',
        values: ['Ben', 20, 'Michael', 30],
      },
    },
    {
      context: 'with custom return option',
      input: ['myTable', { name: 'Ben', age: 20 }],
      options: { return: 'id' },
      expect: {
        sql: 'INSERT INTO myTable (name,age) VALUES ($1,$2) RETURNING id;',
        values: ['Ben', 20],
      },
    },
    {
      context: 'with ignore fields',
      input: ['myTable', { name: 'Ben', age: 20 }],
      options: { ignore: ['age'] },
      expect: {
        sql: 'INSERT INTO myTable (name) VALUES ($1) RETURNING *;',
        values: ['Ben'],
      },
    },
    {
      context: 'with ignore all fields',
      input: ['myTable', { name: 'Ben', age: 20 }],
      options: { ignore: ['age', 'name'] },
      expect: {
        sql: null,
        values: [],
      },
    },
    {
      context: 'with null arguments',
      input: [null, null],
      expect: {
        sql: null,
        values: [],
      },
    },
    {
      context: 'with empty values',
      input: ['myTable', []],
      expect: {
        sql: null,
        values: [],
      },
    },
    {
      context: 'with empty table name',
      input: ['', [{ name: 'Ben' }]],
      expect: {
        sql: null,
        values: [],
      },
    },
  ].forEach((spec) => {
    context(spec.context, () => {
      it(spec.expect.sql || 'returns null', () => {
        const result = bulkInsert.apply(this, [...spec.input, spec.options]);

        expect(result, 'to satisfy', spec.expect);
      });
    });
  });
});
