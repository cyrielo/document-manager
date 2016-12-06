import bcrypt from 'bcryptjs';

/**
 * Password helper for generating and comparing passwords
 * @class Password
*/
class Password {
  /**
   * Setup bcrypt
   * @method constructor
   */
  constructor() {
    this.bcrypt = bcrypt;
  }

  /**
   * Compares password string against a hash
   * @method compare
   * @param {String} passwordStr
   * @param {String} passwordHash
   * @return Boolean
   */
  compare(passwordStr, passwordHash) {
    return this.bcrypt.compareSync(passwordStr, passwordHash);
  }

  /**
   * Generate a hash from a password string
   * @method generate
   * @param {String} passwordStr
   * @return String
   */
  generate(passwordStr) {
    const salt = this.bcrypt.genSaltSync(10);
    return this.bcrypt.hashSync(passwordStr, salt);
  }
}
export default Password;
