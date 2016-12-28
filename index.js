
module.exports = function(table, values) {
  if (!table) throw new Error('No table name defined');
  if (!values) throw new Error('No values defined');

  const isArray = Array.isArray(values);
  const fields = isArray && values.length > 0 ? 
    Object.keys(values[0]) : Object.keys(values);
  const params = Object.values(values);
  
  const sql = `INSERT INTO ${table} (${fields.map(f => f)}) VALUES (${params.map((_,i) => `$${i + 1}`)});`
  
  return sql;
}