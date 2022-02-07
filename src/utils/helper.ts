export function removeEmpty(obj) {
  const _obj = { ...obj };
  Object.keys(_obj).forEach(
    (k) =>
      !_obj[k] &&
      _obj[k] !== undefined &&
      k !== 'isDeleted' &&
      k !== 'page' &&
      delete _obj[k],
  );
  return _obj;
}

export function getCurrentDateString() {
  let date = new Date();
  let year = date.getFullYear().toString();

  let _month = date.getMonth() + 1;
  let month =
    _month < 10 ? '0' + _month.toString() : _month.toString();

  let _day = date.getDate();
  let day = _day < 10 ? '0' + _day.toString() : _day.toString();

  let _hour = date.getHours();
  let hour = _hour < 10 ? '0' + _hour.toString() : _hour.toString();

  let _minutes = date.getMinutes();
  let minites =
    _minutes < 10 ? '0' + _minutes.toString() : _minutes.toString();

  let _seconds = date.getSeconds();
  let seconds =
    _seconds < 10 ? '0' + _seconds.toString() : _seconds.toString();

  return year + month + day + hour + minites + seconds;
}

export function swapItems(array, a, b) {
  let newArray = [...array];
  newArray[a] = newArray.splice(b, 1, newArray[a])[0];
  return newArray;
}

export function generateHashCode(s) {
  return s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

export function getUniqueListBy(arr, key) {
  const resArr = [];
  const _arr = [...arr];
  _arr.forEach(function (item) {
    var i = resArr.findIndex((x) => x[key] === item[key]);
    if (i <= -1) {
      resArr.push(item);
    }
  });

  return resArr;
}
