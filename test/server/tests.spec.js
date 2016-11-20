var expect = require("chai").expect;
var helloApp = require('./../../app/hello');
console.log(helloApp);

describe("Test", function(){
  it("should expect to return same", function(){
    expect(helloApp('Hello world')).to.be.equal('Hello world');
  });
});
