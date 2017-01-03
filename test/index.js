"use strict";

const pstree = require('../');
const expect = require('expect.js');
const cp     = require('child_process');

describe("Main test suite", function(){

  this.timeout(30 * 1000);

  it("should find ONE child only", function(done){

    var child = cp.exec("node");

    pstree(function(err, children){
      expect(children).to.eql([{pid:child.pid, ppid:process.pid}]);

      expect(err).not.to.be.ok();
      child.kill();
      done();
    });

  });


  it("should find NO children ", function(done){


    pstree(process.pid, function(err, children){

      expect(children).to.eql([]);
      expect(err).not.to.be.ok();
      done();

    });

  });


});