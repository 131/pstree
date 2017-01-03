# pstree.js

List all children of any (default current) process. 
A lightweight, no-dep, sugar-free alternative to ps-tree.


## How

The `pstree.js` module behaves differently on *nix vs. Windows by spawning different programs and parsing their output.


### Windows
1. `wmic PROCESS WHERE ParentProcessId=4604 GET Name,ParentProcessId,ProcessId,Status)`
2. The order of head columns is fixed
```shell
> wmic PROCESS GET Name,ProcessId,ParentProcessId,Status
Name                          ParentProcessId  ProcessId   Status
System Idle Process           0                0
System                        0                4
smss.exe                      4                228
```


# API 
``` js
var cp = require('child_process'),
    psTree = require('ps-tree');

var child = cp.exec("node -e 'while (true);'", function () {...});

// This will not actually kill the child it will kill the `sh` process.
child.kill();
```

wtf? it's because exec actually works like this:

``` js
function exec (cmd, cb) {
  spawn('sh', ['-c', cmd]);
  ...
}
```

`sh` starts parses the command string and starts processes, and waits for them to terminate, but `exec` returns a process object with the pid of the `sh` process.
However, since it is in `wait` mode killing it does not kill the children.

Use `ps-tree` like this:

``` js
var cp = require('child_process'),
    psTree = require('ps-tree');

var child = cp.exec("node -e 'while (true);'", function () { /*...*/ });

psTree(child.pid, function (err, children) {
  cp.spawn('kill', ['-9'].concat(children.map(function (p) { return p.PID })));
});
```

If you prefer to run **psTree** from the command line, use: `node ./bin/ps-tree.js`


#### *nix

1. " <defunct> " need to be striped
```bash
$ ps -A -o comm,ppid,pid,stat
COMMAND          PPID   PID STAT
bbsd             2899 16958 Ss
watch <defunct>  1914 16964 Z
ps              20688 16965 R+
```


### LICENSE: MIT