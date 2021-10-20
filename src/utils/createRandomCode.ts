export const decimal = [];
const baseList =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const baseSize = baseList.length;
let hashRaw = 0;

/** 임의의 문자열 생성 * */
// 앞 8자리 base62 ex) n5mVqiJ1

const getRandomInt = (mininum, maximum) => {
  const min = Math.ceil(mininum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min)) + min; // 최댓값은 제외, 최솟값은 포함
};

const getBase62 = (n: any) => {
  let num = n;
  const res = [];
  do {
    const mod = num % baseSize;
    //@ts-ignore
    num = parseInt(num / baseSize);
    res.push(baseList[mod]);
  } while (num > 0);

  return res.reverse().join('');
};

const frontCode = () => {
  let front = '';
  for (let i = 0; i < 8; i++) {
    const n = getRandomInt(0, 62);
    decimal.push(n);
    front += getBase62(n);
  }
  return front;
};

/** Hash Code 생성 * */
// 2자리.최대로 나올 수 있는 최대 HashCode는 61 * 8 = 488 => 7S

const HashCode = () => {
  if (decimal) {
    let res = '';
    let ttl = 0;
    for (let i = 0; i < 8; i++) {
      ttl += decimal[i];
    }
    hashRaw = ttl;
    res = getBase62(ttl);

    decimal.length = 0; // 배열 초기화
    return res;
  }
};

/** ID, 마지막 6자리 생성 * */
// 이렇게 되면 사용하기 할때 decode 해서 해당 id 삭제하거나 PUT 해야됨

const getId = (id) => {
  const id62 = getBase62(id);
  const strLen = id62.length;
  let res = [];
  if (strLen < 6) {
    for (let i = 0; i < 6 - strLen; i++) {
      res.push('0');
    }
  }
  const arr = id62.split('');
  res = res.concat(arr);

  return res;
};

const IdRotate = (id) => {
  const arrId = getId(id);
  const rotateNum = hashRaw % 6;
  for (let i = 0; i < rotateNum; i++) {
    arrId.push(arrId[0]);
    arrId.shift();
  }
  let res = '';
  for (let i = 0; i < arrId.length; i++) {
    res += arrId[i];
  }
  return res;
};

/** Main 함수 * */

export const CouponGenerator = (id) => {
  const frontNum = frontCode();
  const hashNum = HashCode();
  const lastNum = IdRotate(id);
  const code = frontNum + hashNum + lastNum;
  const arrCode = code.split('');
  let couponCode = '';
  for (let i = 0; i < arrCode.length; i++) {
    couponCode += arrCode[i];
    if (i === 3 || i === 7 || i === 11) {
      couponCode += '-';
    }
  }
  return couponCode;
};
