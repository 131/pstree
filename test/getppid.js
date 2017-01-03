"use strict";

const getppid = require('../getppid');
const expect = require('expect.js');
const cp     = require('child_process');

describe("Main test suite", function(){

  this.timeout(30 * 1000);


  it("should find current process parent", function(done){


    getppid(process.pid, function(err, parent){
console.log({parent});

/*

      expect(children).to.eql([]);
      expect(err).not.to.be.ok();
      done();
*/
    });

  });


});