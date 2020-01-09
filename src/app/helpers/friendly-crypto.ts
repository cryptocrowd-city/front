import * as BN from 'bn.js';

// converts really long crypto values into friendly numbers
export default function toFriendlyCryptoVal(
  longCryptoVal: number | string,
  decimalCount?: number
) {
  const tester = '1234567890123456789';
  console.log('tester:');
  console.log(tester);
  let longVal = new BN(tester);
  //1234567890123456789
  //1234567890123456
  //1000000000000000000
  // 0
  // console.log('1e18', longVal.div(1e18)); // num.isZero is not a function
  console.log('BN 1e18', longVal.div(new BN(1e18)));
  // console.log('');
  // console.log('');
  // console.log('');
  // console.log('');

  const friendlyCryptoVal = new BN(longCryptoVal).div(new BN(1));
  //-----------------------------------------------------------------
  // if (typeof longCryptoVal === 'number') {
  //   longCryptoVal = longCryptoVal.toString();
  // }
  // if (typeof longCryptoVal === 'string') {
  //   longCryptoVal = parseFloat(longCryptoVal);
  // }

  // const friendlyCryptoVal = longCryptoVal / Math.pow(10, 18);
  // //temp
  // longCryptoVal = 10000000000000000000;
  // if (new BN(longCryptoVal).isZero()) {
  //   return 0;
  // }

  // decimalCount = decimalCount || 3;
  // decimalCount = decimalCount > 17 ? 17 : decimalCount;
  // decimalCount = decimalCount < 0 ? 0 : decimalCount;

  // console.log('a', new BN(longCryptoVal).div(1));
  // console.log('b', new BN(longCryptoVal).div(new BN(1)));
  // console.log('c', new BN(longCryptoVal).div(new BN('1')));
  // console.log('d', new BN(longCryptoVal).div(10000000000000));
  // console.log('e', new BN(longCryptoVal).div('10000000000000'));
  // console.log('f', new BN(longCryptoVal).div(Math.pow(10, 18)));
  // // console.log('', new BN(longCryptoVal).div());
  // // console.log('', new BN(longCryptoVal).div());
  // // console.log('', new BN(longCryptoVal).div());
  // // console.log('', new BN(longCryptoVal).div());

  // // const friendlyCryptoVal = new BN(longCryptoVal).div(new BN(Math.pow(10, 18)));
  // console.log(friendlyCryptoVal);

  return friendlyCryptoVal === 0 ? 0 : friendlyCryptoVal;
}

// transform(number: number, decimals: number = 18) {
//   decimals = Math.pow(10, decimals);
//   return number / decimals;
// }

// a.divRound(b) - rounded division
