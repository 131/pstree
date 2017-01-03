"use strict";


const cp    = require('child_process');


function getppid(chain) {
  var args = [].slice.apply(arguments),
      chain = args.pop(),
      pid = args.shift() || process.pid;

  var args = [
    "process",
    "where",
    `(ProcessId=${pid})`,
    "get", "ParentProcessId"
  ];


  var self = cp.execFile("wmic", args, function(exit, stdout) {
    var child, headers;

    stdout.split("\n").map( function(line) {

      line = line.trim().split(/\s+/);
      if(!headers) {
        headers = line;
        return;
      }

      var ret = {
        pid : Number(line[0]),
      };

      if(isFinite(line[0]) && line[0])
        child = ret;
    });


    chain(null, child);
  });


}

module.exports = getppid;
