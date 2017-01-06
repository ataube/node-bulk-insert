/* eslint-disable no-param-reassign */
const omit = require('lodash.omit');

function getParamsForArray(arr, fields) {
  return arr.reduce((memo) => {
    const next = (memo.length * fields.length) + 1;
    memo.push(`(${fields.map((_, i) => `$${i + next}`)})`);
    return memo;
  }, []);
}

function filterValues(values, ignoredFields = []) {
  if (!values) return null;
  return values.map(v => omit(v, ignoredFields));
}

const empty = () => ({ sql: null, values: [] });

const flattenValues = values => values.reduce((memo, val) =>
    [...memo, ...Object.values(val)], []); // convert [{a: 1, b:2}] => [1, 2]

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
  options = Object.assign({}, defaultOptions, options);
  return (table = '', values = []) => {
    if (!table || table === '') return empty();
    if (!values || values.length === 0) return empty();

    values = Array.isArray(values) ? values : [values];

    const filteredFields = Object.keys(omit(values[0], options.ignore));

    if (filteredFields.length === 0) {
      return empty();
    }

    const filteredValues = filterValues(values, options.ignore);
    const params = getParamsForArray(filteredValues, filteredFields);

    const sql = `INSERT INTO ${table} (${filteredFields.map(f => f)}) VALUES ${params} RETURNING ${options.return};`;

    return {
      sql,
      values: flattenValues(filteredValues),
    };
  };
};
