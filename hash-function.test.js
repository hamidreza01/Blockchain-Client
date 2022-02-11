const cryptoHash = require('./hash-function');

describe('بررسی هش فانکشن', () => {
  const hash = cryptoHash('test');
  it('بررسی عملکرد الگوریتم', () => {
    expect(hash).toEqual(
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    );
  });
  it('بررسی ترتیب ورودی', () => {
    expect(cryptoHash('hello', 'world')).toEqual(cryptoHash('world', 'hello'));
  });
});
