// Generated by CoffeeScript 1.9.2

/*! Ookonsole 0.0.9 //// MIT Licence //// http://ookonsole.richplastow.com/ */

(function() {
  var Main, Task, zz, ª, ªA, ªB, ªC, ªE, ªF, ªN, ªO, ªR, ªS, ªU, ªV, ªX, ªcommonPrefix, ªex, ªhas, ªredefine, ªtype, ªuid,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ªC = 'Ookonsole';

  ªV = '0.0.9';

  ªA = 'array';

  ªB = 'boolean';

  ªE = 'error';

  ªF = 'function';

  ªN = 'number';

  ªO = 'object';

  ªR = 'regexp';

  ªS = 'string';

  ªU = 'undefined';

  ªX = this;

  ª = console.log.bind(console);

  ªex = function(x, a, b) {
    var pos;
    if (-1 === (pos = a.indexOf(x))) {
      return x;
    } else {
      return b.charAt(pos);
    }
  };

  ªhas = function(h, n, t, f) {
    if (t == null) {
      t = true;
    }
    if (f == null) {
      f = false;
    }
    if (-1 !== h.indexOf(n)) {
      return t;
    } else {
      return f;
    }
  };

  ªtype = function(x) {
    return {}.toString.call(x).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  };

  ªuid = function(p) {
    return p + '_' + (Math.random() + '1111111111111111').slice(2, 18);
  };

  ªcommonPrefix = function(strings) {
    var a, first, i, l, last;
    a = strings.concat().sort();
    first = a[0];
    last = a[a.length - 1];
    l = first.length;
    i = 0;
    while (i < l && first.charAt(i) === last.charAt(i)) {
      i++;
    }
    return first.slice(0, i);
  };

  ªredefine = function(obj, name, value, kind) {
    switch (kind) {
      case 'constant':
        return Object.defineProperty(obj, name, {
          value: value,
          enumerable: true
        });
      case 'private':
        return Object.defineProperty(obj, name, {
          value: value,
          enumerable: false
        });
    }
  };

  Main = (function() {
    Main.prototype.C = ªC;

    Main.prototype.toString = function() {
      return "[object " + this.C + "]";
    };

    function Main(config) {
      if (config == null) {
        config = {};
      }
      this.onKeydown = bind(this.onKeydown, this);
      this.addTask = bind(this.addTask, this);
      this.context = config.context || null;
      if (ªO !== typeof this.context) {
        throw Error("`config.context` is type " + (typeof this.context) + " not 'object'");
      }
      this.unrecognized = new Task({
        summary: "Used when the requested task does not exist",
        completions: [],
        details: "This task is not used directly",
        runner: function(context, options) {
          return "! That task does not exist: type `help` to list commands";
        }
      });
      this.tasks = {
        help: new Task({
          summary: "Show this help, or type `help help` for more details",
          completions: ['help '],
          details: "help\n----\nA built-in ookonsole task, which shows helpful usage information. \n\nhelp         With no options, lists and summarizes all available tasks\nhelp <task>  Shows details about the given task, eg `help clear`, to \n             display details on `clear` and its options\n",
          runner: (function(_this) {
            return function(context, options) {
              var name, task;
              switch (options.length) {
                case 0:
                  return ((function() {
                    var ref, results;
                    ref = this.tasks;
                    results = [];
                    for (name in ref) {
                      task = ref[name];
                      results.push(name + ": " + task.summary);
                    }
                    return results;
                  }).call(_this)).join('\n');
                case 1:
                  if (_this.tasks[options[0]]) {
                    return _this.tasks[options[0]].details;
                  } else {
                    return "! That task does not exist: type `help` to list commands";
                  }
                  break;
                default:
                  return "! Too many options: try `help " + options[0] + "`";
              }
            };
          })(this)
        }),
        clear: new Task({
          summary: "Delete the contents of the log",
          completions: ['clear display', 'clear storage', 'clear all'],
          details: "clear\n-----\nA built-in ookonsole task, which clears the log display and/or log storage. \n\nclear display  Clears the log display, but leaves the in-storage log intact\nclear storage  Deletes localStorage (browser) or filesystem (server) logs\nclear all      Both of the above\nclear          With no options, runs `clear display`\n",
          runner: (function(_this) {
            return function(context, options) {
              switch (options.length) {
                case 0:
                  _this.$display.innerHTML = '';
                  return false;
                case 1:
                  if ('display' === options[0]) {
                    _this.tasks.clear.runner(context, []);
                    return false;
                  } else if ('storage' === options[0]) {
                    window.localStorage.removeItem('ookonsole.log');
                    return "Cleared the storage";
                  } else if ('all' === options[0]) {
                    _this.tasks.clear.runner(context, []);
                    window.localStorage.removeItem('ookonsole.log');
                    return false;
                  } else {
                    return "@todo More options for clear";
                  }
                  break;
                default:
                  return "! Too many options: try `clear " + options[0] + "`";
              }
            };
          })(this)
        }),
        echo: new Task({
          summary: "Writes options to the log",
          completions: ['echo '],
          details: "echo\n----\nA built-in ookonsole task, which writes the given options to the log. \n\necho                With no options, just log an empty line\necho <word> <word>  Each <word> is concatenated, separated by a single space\n",
          runner: function(context, options) {
            if (!options.length) {
              return "";
            } else {
              return options.join(' ');
            }
          }
        })
      };
      if (ªU === ªtype(config.$wrap)) {
        this.$wrap = null;
      } else if (config.$wrap instanceof ªX.HTMLElement) {
        this.$wrap = config.$wrap;
      } else {
        throw Error("`config.$wrap` is not an instance of `HTMLElement`");
      }
      if (!this.$wrap) {
        this.$style = null;
      } else {
        this.$style = ªX.document.createElement('style');
        this.$style.innerHTML = this.getStyle();
      }
      if (!this.$wrap) {
        this.$box = null;
      } else {
        this.$box = ªX.document.createElement('div');
        this.$box.setAttribute('class', 'ookonsole-box');
      }
      if (!this.$wrap) {
        this.$display = config.$display || null;
      } else {
        this.$display = ªX.document.createElement('pre');
        this.$display.setAttribute('class', 'ookonsole-display');
        this.$box.appendChild(this.$display);
      }
      if (!this.$wrap) {
        this.$command = config.$command || null;
      } else {
        this.$command = ªX.document.createElement('input');
        this.$command.setAttribute('class', 'ookonsole-command');
        this.$box.appendChild(this.$command);
      }
      this.pointer = null;
    }

    Main.prototype.show = function() {
      var ref, ref1;
      if ((ref = this.$wrap) != null) {
        ref.appendChild(this.$style);
      }
      return (ref1 = this.$wrap) != null ? ref1.appendChild(this.$box) : void 0;
    };

    Main.prototype.hide = function() {
      var ref, ref1;
      if ((ref = this.$wrap) != null) {
        ref.removeChild(this.$style);
      }
      return (ref1 = this.$wrap) != null ? ref1.removeChild(this.$box) : void 0;
    };

    Main.prototype.start = function() {
      var ref, ref1;
      if ((ref = this.$command) != null) {
        ref.focus();
      }
      return (ref1 = this.$command) != null ? ref1.addEventListener('keydown', this.onKeydown) : void 0;
    };

    Main.prototype.stop = function() {
      return ª(456);
    };

    Main.prototype.addTask = function(name, config) {
      return this.tasks[name] = new Task(config);
    };

    Main.prototype.onKeydown = function(event) {
      var log, nextCommandEnd, nextCommandStart, prevCommandEnd, prevCommandStart;
      switch (event.keyCode) {
        case 13:
          return this.execute(this.$command.value);
        case 9:
          this.autocomplete(this.$command.value);
          return event.preventDefault();
        case 38:
          log = this.$display.innerHTML;
          this.pointer = null === this.pointer ? log.length : this.pointer;
          prevCommandStart = log.lastIndexOf('§ ', this.pointer);
          if (-1 === prevCommandStart) {
            return;
          }
          prevCommandEnd = log.indexOf('\n', prevCommandStart);
          if (-1 === prevCommandEnd) {
            return;
          }
          this.pointer = prevCommandStart - 1;
          this.$command.value = log.slice(prevCommandStart + 2, prevCommandEnd);
          return event.preventDefault();
        case 40:
          log = this.$display.innerHTML;
          this.pointer = null === this.pointer ? log.length : this.pointer + 2;
          nextCommandStart = log.indexOf('§ ', this.pointer);
          if (-1 === nextCommandStart) {
            return;
          }
          nextCommandEnd = log.indexOf('\n', nextCommandStart);
          if (-1 === nextCommandEnd) {
            return;
          }
          this.pointer = nextCommandStart;
          return this.$command.value = log.slice(nextCommandStart + 2, nextCommandEnd);
      }
    };

    Main.prototype.autocomplete = function(command) {
      var candidates, completion, j, len, name, ref, ref1, task;
      candidates = [];
      ref = this.tasks;
      for (name in ref) {
        task = ref[name];
        ref1 = task.completions;
        for (j = 0, len = ref1.length; j < len; j++) {
          completion = ref1[j];
          if ((completion.slice(0, command.length)) === command) {
            candidates.push(completion);
          }
        }
      }
      if (1 === candidates.length) {
        return this.$command.value = candidates[0];
      } else if (0 !== candidates.length) {
        return this.$command.value = ªcommonPrefix(candidates);
      }
    };

    Main.prototype.execute = function(command, config) {
      var hasScrolledToEnd, i, log, options, prefix, result, task;
      if (config == null) {
        config = {
          storage: 'command',
          display: 'all'
        };
      }
      this.pointer = null;
      this.$command.value = '';
      hasScrolledToEnd = this.$display.scrollTop > this.$display.scrollHeight - this.$display.offsetHeight;
      options = command.split(' ');
      i = options.length;
      while (0 < i--) {
        if ('' === options[i]) {
          options.splice(i, 1);
        }
      }
      if (options.length) {
        task = this.tasks[options.shift()];
      } else {
        return;
      }
      if (!task) {
        task = this.unrecognized;
      }
      result = task.runner(this.context, options);
      if (false === result) {
        prefix = '§';
      } else if ('!' === result.slice(0, 1)) {
        prefix = '!';
      } else if ('command' === config.storage || 'all' === config.storage) {
        log = window.localStorage.getItem('ookonsole.log');
        window.localStorage.setItem('ookonsole.log', "" + (null === log ? '' : log + '§') + command);
        prefix = '§';
      } else {
        prefix = '>';
      }
      if ('command' === config.display || 'all' === config.display) {
        this.$display.innerHTML += prefix + " " + command + "\n";
      }
      if (false === result) {
        'noop';
      } else if ('!' === result.slice(0, 1)) {
        if ('none' !== config.display) {
          this.$display.innerHTML += (result.replace(/</g, '&lt;')) + '\n';
        }
      } else if ('result' === config.display || 'all' === config.display) {
        if (false !== result) {
          this.$display.innerHTML += (result.replace(/</g, '&lt;')) + '\n';
        }
      }
      if (hasScrolledToEnd) {
        return this.$display.scrollTop = this.$display.scrollHeight;
      }
    };

    Main.prototype.getStyle = function() {
      return ".ookonsole-box {\n  padding:    0.5rem;\n  border:     1px solid #999;\n}\n.ookonsole-display {\n  margin:     0;\n  padding:    0.5rem;\n  border:     1px solid #999;\n  font:       1em/1.4em monaco, monospace;\n}\n.ookonsole-command {\n  display:    block;\n  box-sizing: border-box;\n  width:      100%;\n  padding:    0.5rem;\n  border:     1px solid #999;\n  font:       1em/1.4em monaco, monospace;\n}";
    };

    return Main;

  })();

  zz = function(xx) {};

  Task = (function() {
    Task.prototype.C = 'Task';

    Task.prototype.toString = function() {
      return "[object " + this.C + "]";
    };

    function Task(config) {
      var completion, j, len, ref;
      if (config == null) {
        config = {};
      }
      this.summary = config.summary;
      if (ªS !== ªtype(this.summary)) {
        throw Error("`config.summary` is '" + (ªtype(this.summary)) + "' not 'string'");
      }
      this.completions = config.completions;
      if (ªA !== ªtype(this.completions)) {
        throw Error("`config.completions` is '" + (ªtype(this.completions)) + "' not 'array'");
      }
      ref = this.completions;
      for (j = 0, len = ref.length; j < len; j++) {
        completion = ref[j];
        if (ªS !== ªtype(completion)) {
          throw Error("`config.completions` contains '" + (ªtype(completion)) + "' not 'string'");
        }
      }
      this.details = config.details;
      if (ªS !== ªtype(this.details)) {
        throw Error("`config.details` is '" + (ªtype(this.details)) + "' not 'string'");
      }
      this.runner = config.runner;
      if (ªF !== ªtype(this.runner)) {
        throw Error("`config.runner` is '" + (ªtype(this.runner)) + "' not 'function'");
      }
    }

    Task.prototype.run = function() {
      return this.runner.apply(context, options);
    };

    return Task;

  })();

  if (ªF === typeof define && define.amd) {
    define(function() {
      return Main;
    });
  } else if (ªO === typeof module && module && module.exports) {
    module.exports = Main;
  } else {
    this[ªC] = Main;
  }

}).call(this);
