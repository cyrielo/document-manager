import Password from './Password';

/**
 * Validate helper to validate input
 * @class Validate
*/
class Validate {

  /**
   * Creates password helper instance
   * @method constructor
   */
  constructor() {
    this.password = new Password();
  }

  /**
   * Validate email
   * @method email
   * @param {String} email
   * @return {Boolean} true if email is valid
   */
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

  /**
   * Asserts if a string is empty or undefined
   * @method isEmpty
   * @param {String} str
   * @return {Boolean} true if string is empty
   */
  isEmpty(str) {
    if (!Validate.isDefined(str)) {
      return true;
    }

    return (str.trim().length < 1);
  }

  /**
   * Asserts if a string is undefined
   * @method isDefined
   * @param {String} str
   * @return {Boolean} true if string is defined
   */
  static isDefined(str) {
    return (typeof str !== 'undefined');
  }

  /**
   * Verifies a password string against a hash
   * @method verifyPassword
   * @param {String} password
   * @param {String} hash
   * @return {Boolean} if password match returns true
   */
  verifyPassword(password, hash) {
    return this.password.compare(password, hash);
  }

  /**
   * Create a hash from a password string
   * @method hashPassword
   * @param {String} str
   * @return {String} returns a generate password hash
   */
  hashPassword(str) {
    return this.password.generate(str);
  }

}

export default Validate;
