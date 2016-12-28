function getParamsForObject(obj) {
  return `(${Object.values(obj).map((_, i) => `$${i + 1}`)})`;
}

function getParamsForArray(fields, arr) {
  return arr.reduce((memo) => {
    const next = (memo.length * fields.length) + 1;
    memo.push(`(${fields.map((_, i) => `$${i + next}`)})`);
    return memo;
  }, []);
}

module.exports = function bulkInsert(table, values) {
  if (!table) throw new Error('No table name defined');
  if (!values) throw new Error('No values defined');

  const isArray = Array.isArray(values);
  const fields = isArray && values.length > 0 ?
    Object.keys(values[0]) : Object.keys(values);
  const params = isArray ?
    getParamsForArray(fields, values) : getParamsForObject(values);

  const sql = `INSERT INTO ${table} (${fields.map(f => f)}) VALUES ${params};`;

  return sql;
};
