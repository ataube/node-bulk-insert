function getParamsForObject(obj) {
  return `(${Object.values(obj).map((_, i) => `$${i + 1}`)})`;
}

function getParamsForArray(arr, fields) {
  return arr.reduce((memo) => {
    const next = (memo.length * fields.length) + 1;
    memo.push(`(${fields.map((_, i) => `$${i + next}`)})`);
    return memo;
  }, []);
}

/**
 * Generates a bulk insert SQL statement.
 * If a list of objects is given all of them must have the same structure.
 *
 * @param {string} table - the table name
 * @param {Object|Array} values - a object or array of objects
 * @returns {string|null}
 */
module.exports = function bulkInsert(table = '', values = []) {
  if (!table || table === '') return null;
  if (!values || values.length === 0) return null;

  const isArray = Array.isArray(values);
  const fields = isArray ?
    Object.keys(values[0]) : Object.keys(values);
  const params = isArray ?
    getParamsForArray(values, fields) : getParamsForObject(values);

  const sql = `INSERT INTO ${table} (${fields.map(f => f)}) VALUES ${params};`;

  return sql;
};
