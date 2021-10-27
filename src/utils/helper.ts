export function removeEmpty(obj) {
  const _obj = { ...obj };
  Object.keys(_obj).forEach((k) => {
    !_obj[k] &&
      _obj[k] !== undefined &&
      k !== 'isDeleted' &&
      delete _obj[k];
  });
  return _obj;
}

export function swapItems(array, a, b) {
  let newArray = [...array];
  newArray[a] = newArray.splice(b, 1, newArray[a])[0];
  return newArray;
}
