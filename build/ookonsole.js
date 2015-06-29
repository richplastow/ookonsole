// Generated by CoffeeScript 1.9.2

/*! Ookonsole 0.0.4 //// MIT Licence //// http://ookonsole.richplastow.com/ */

(function() {
  var Main, Task, zz, ª, ªA, ªB, ªC, ªE, ªF, ªN, ªO, ªR, ªS, ªU, ªV, ªX, ªcommonPrefix, ªex, ªhas, ªredefine, ªtype, ªuid,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ªC = 'Ookonsole';

  ªV = '0.0.4';

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
      this.context = config.context || null;
      if (ªO !== typeof this.context) {
        throw Error("`config.context` is type " + (typeof this.context) + " not 'object'");
      }
      this.unrecognized = new Task({
        summary: "Used when the requested task does not exist",
        completions: [],
        details: "This task is not used directly",
        runner: function(context, options) {
          return "That task does not exist: type `help` to list commands";
        }
      });
      this.tasks = {
        help: new Task({
          summary: "Show this help. Type `help help` for more details",
          completions: ['help'],
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
                    return "That task does not exist: type `help` to list commands";
                  }
                  break;
                default:
                  return "Too many options: try `help " + options[0] + "`";
              }
            };
          })(this)
        }),
        clear: new Task({
          summary: "Delete the contents of the log",
          completions: ['clear display', 'clear storage', 'clear all'],
          details: "clear\n-----\nA built-in ookonsole task, which shows helpful usage information. \n\nclear display  Clears the log display, but leaves the in-storage log intact\nclear storage  Deletes localStorage (browser) or filesystem (server) logs\nclear all      Both of the above\nclear          With no options, runs `clear display`\n",
          runner: (function(_this) {
            return function(context, options) {
              switch (options.length) {
                case 0:
                  _this.$log.innerHTML = '';
                  return false;
                case 1:
                  if ('display' === options[0]) {
                    return _this.tasks.clear.runner(context, []);
                  } else {
                    return "@todo";
                  }
                  break;
                default:
                  return "Too many options: try `clear " + options[0] + "`";
              }
            };
          })(this)
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
        this.$box = null;
      } else {
        this.$box = ªX.document.createElement('div');
        this.$box.setAttribute('class', 'ookonsole-box');
      }
      if (!this.$wrap) {
        this.$style = null;
      } else {
        this.$style = ªX.document.createElement('style');
        this.$style.innerHTML = this.getStyle();
      }
      if (!this.$wrap) {
        this.$log = null;
      } else {
        this.$log = ªX.document.createElement('pre');
        this.$log.setAttribute('class', 'ookonsole-log');
        this.$box.appendChild(this.$log);
      }
      if (!this.$wrap) {
        this.$command = null;
      } else {
        this.$command = ªX.document.createElement('input');
        this.$command.setAttribute('class', 'ookonsole-command');
        this.$box.appendChild(this.$command);
      }
    }

    Main.prototype.show = function() {
      this.$wrap.appendChild(this.$style);
      return this.$wrap.appendChild(this.$box);
    };

    Main.prototype.hide = function() {
      this.$wrap.removeChild(this.$style);
      return this.$wrap.removeChild(this.$box);
    };

    Main.prototype.start = function() {
      this.$command.focus();
      return this.$command.addEventListener('keydown', this.onKeydown);
    };

    Main.prototype.stop = function() {
      return ª(456);
    };

    Main.prototype.onKeydown = function(event) {
      switch (event.keyCode) {
        case 13:
          return this.execute(this.$command.value);
        case 9:
          this.autocomplete(this.$command.value);
          return event.preventDefault();
        case 38:
          return ª('UP');
        case 40:
          return ª('DOWN');
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

    Main.prototype.execute = function(command) {
      var i, options, result, task;
      this.$log.innerHTML += "> " + command + "\n";
      this.$command.value = '';
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
      if (false !== result) {
        return this.$log.innerHTML += (result.replace(/</g, '&lt;')) + '\n';
      }
    };

    Main.prototype.getStyle = function() {
      return ".ookonsole-box {\n  padding:    0.5rem;\n  border:     1px solid #999;\n}\n.ookonsole-log {\n  margin:     0;\n  padding:    0.5rem;\n  border:     1px solid #999;\n  font:       1rem/1.3rem monaco, monospace;\n}\n.ookonsole-command {\n  display:    block;\n  box-sizing: border-box;\n  width:      100%;\n  padding:    0.5rem;\n  border:     1px solid #999;\n  font:       1rem/1.3rem monaco, monospace;\n}";
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
