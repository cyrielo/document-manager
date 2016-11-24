class Validate {

  constructor() {
    const PasswordHelper = require('./../helpers/password');
    this.password = new PasswordHelper();
  }

  email(email) {
    if (!this.isDefined(email)) {
      return false;
    }

    const re = /[a-z,0-9]/ig;
    const dotPos = email.lastIndexOf('.');
    const atPos = email.lastIndexOf('@');
    const wsp = email.lastIndexOf(' ');
    const atPosMinus = email.substring(atPos - 1, atPos);
    return (atPos > 0 && dotPos > atPos && wsp < 0 && re.test(atPosMinus));
  }

  isEmpty(str) {
    if (!this.isDefined(str)) {
      return true;
    }

    return (str.trim().length < 1);
  }

  isDefined(str) {
    return (typeof str !== 'undefined');
  }

  verifyPassword(password, hash) {
    return this.password.compare(password, hash);
  }

  hashPassword(str) {
    return this.password.generate(str);
  }

}

module.exports = Validate;
