class Password {
  constructor() {
    this.bcrypt = require('bcryptjs');
  }

  compare(passwordStr, passwordHash){
    return this.bcrypt.compareSync(passwordStr, passwordHash);
  }

  generate(passwordStr) {
    const salt = this.bcrypt.genSaltSync(10);
    return this.bcrypt.hashSync(passwordStr, salt);
  }
}
module.exports = Password;
