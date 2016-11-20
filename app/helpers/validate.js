class Validate{

  constructor(){
    const passwordHelper = require('./../helpers/password');
    this.password = new passwordHelper();
  }

  email(email){
    if (!this.isDefined(email)) {
      return false;
    }
    var
      re = /[a-z,0-9]/ig,
      dotPos = email.lastIndexOf('.'),
      atPos  = email.lastIndexOf('@'),
      wsp    = email.lastIndexOf(' '),
      atPos_minus  = email.substring(atPos -1, atPos);
    return (atPos > 0 && dotPos > atPos && wsp < 0 && re.test(atPos_minus) );
  }

  isEmpty(str){
   if (!this.isDefined(str)) {
      return true;
    }
    return (str.trim().length < 1);
  }

  isDefined(str){
    return (typeof str !== 'undefined');
  }

  verifyPassword(password, hash){
    return this.password.compare(password, hash);
  }

  hashPassword(str){
    return this.password.generate(str);
  }

}

module.exports = Validate;