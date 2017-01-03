"use strict";


const cp    = require('child_process');

function combine(line, keys) {
  var ret = {};
  line.map(function(v, k){
    ret[keys[k]] = v;
  });
  return ret;
}


function list_children(/*pid, chain*/){
  var args = [].slice.apply(arguments),
      chain = args.pop(),
      pid = args.shift() || process.pid;

  var args = [
    "process",
    "where",
    `(ParentProcessId=${pid})`,
    "get", "ProcessId,ParentProcessId"
  ];


  var self = cp.execFile("wmic", args, function(exit, stdout) {
    var children = [], headers;

    stdout.split("\n").map( function(line) {
      line = line.trim().split(/\s+/);
      if(!headers) {
        headers = line;
        return;
      }
      line = combine(line, headers);
      var child = {
        pid : Number(line.ProcessId),
        ppid : Number(line.ParentProcessId),
      };

      if(isFinite(line.ProcessId) && child.pid && child.pid != self.pid)
        children.push(child);
    });


    chain(null, children);
  });


}

module.exports = list_children;
