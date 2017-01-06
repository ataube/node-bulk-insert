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
      context: 'with ignore fields',
      input: ['myTable', { name: 'Ben', age: 20 }],
      options: { ignore: ['age'] },
      expect: {
        sql: 'INSERT INTO myTable (name) VALUES ($1) RETURNING *;',
        values: [{ name: 'Ben' }],
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
        const inputValues = spec.input[1];
        const bulkInsert = BulkInsert(spec.options);
        const result = bulkInsert(...spec.input);

        function resolveExpectation(e) {
          if (typeof e === 'object') return e;
          return {
            sql: e,
            values: Array.isArray(inputValues) ? inputValues : [inputValues],
          };
        }
        expect(result, 'to satisfy', resolveExpectation(spec.expect));
      });
    });
  });
});
