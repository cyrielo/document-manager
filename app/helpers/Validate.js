import Password from './Password';

class Validate {

  constructor() {
    this.password = new Password();
  }

  email(email) {
    if (!Validate.isDefined(email)) {
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
    if (!Validate.isDefined(str)) {
      return true;
    }

    return (str.trim().length < 1);
  }

  static isDefined(str) {
    return (typeof str !== 'undefined');
  }

  verifyPassword(password, hash) {
    return this.password.compare(password, hash);
  }

  hashPassword(str) {
    return this.password.generate(str);
  }

}

export default Validate;
