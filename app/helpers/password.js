class Password{
  constructor(){
    this.bcrypt = require('bcryptjs');
  }

  compare(password_str, password_hash){
    return this.bcrypt.compareSync(password_str, password_hash);
  }

  generate(password_str){
    let salt = this.bcrypt.genSaltSync(10);
    return this.bcrypt.hashSync(password_str, salt);
  }
}
module.exports = Password;