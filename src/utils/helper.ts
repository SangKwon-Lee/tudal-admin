export function removeEmpty(obj) {
  const _obj = { ...obj };
  Object.keys(_obj).forEach(
    (k) => !_obj[k] && _obj[k] !== undefined && delete _obj[k],
  );
  return _obj;
}
