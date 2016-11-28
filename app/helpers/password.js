import bcrypt from 'bcryptjs';

class Password {
  constructor() {
    this.bcrypt = bcrypt;
  }

  compare(passwordStr, passwordHash) {
    return this.bcrypt.compareSync(passwordStr, passwordHash);
  }

  generate(passwordStr) {
    const salt = this.bcrypt.genSaltSync(10);
    return this.bcrypt.hashSync(passwordStr, salt);
  }
}
export default Password;
