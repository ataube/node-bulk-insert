const omit = require('lodash.omit');

function getParamsForArray(arr, fields) {
  return arr.reduce((memo) => {
    const next = (memo.length * fields.length) + 1;
    memo.push(`(${fields.map((_, i) => `$${i + next}`)})`);
    return memo;
  }, []);
}

function filterValues(values = [], ignoredFields) {
  const foo = values.map(v => omit(v, ignoredFields));
  console.log('>>>>', foo)
  return foo;
}

const defaultOptions = {
  return: '*',
  ignore: [],
};

/**
 * Generates a bulk insert SQL statement.
 * If a list of objects is given all of them must have the same structure.
 *
 * @param {string} table - the table name
 * @param {Object|Array} values - a object or array of objects
 * @returns {string|null}
 */
module.exports = function bulkInsert(options) {
  options = Object.assign({}, defaultOptions, options); // eslint-disable-line no-param-reassign
  return (table = '', values = []) => {
    if (!table || table === '') return null;
    if (!values || values.length === 0) return null;

    values = Array.isArray(values) ? values : [values]; // eslint-disable-line no-param-reassign
    const fields = Object.keys(values[0]);
    const filteredValues = options.ignore.length > 0 ?
      filterValues(values, options.ignore) : values;
    const params = getParamsForArray(filteredValues, fields, options);

    const sql = `INSERT INTO ${table} (${fields.map(f => f)}) VALUES ${params} RETURNING ${options.return};`;

    return sql;
  };
};
