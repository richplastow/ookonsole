// Generated by CoffeeScript 1.9.2

/*! Ookonsole 0.0.9 //// MIT Licence //// http://ookonsole.richplastow.com/ */

(function() {
  var Main, Task, Tudor, tudor, zz, ª, ªA, ªB, ªC, ªE, ªF, ªN, ªO, ªR, ªS, ªU, ªV, ªX, ªcommonPrefix, ªex, ªhas, ªredefine, ªtype, ªuid,
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

  Tudor = (function() {
    Tudor.prototype.I = 'Tudor';

    Tudor.prototype.toString = function() {
      return "[object " + I + "]";
    };

    Tudor.prototype.articles = [];

    function Tudor(opt) {
      this.opt = opt != null ? opt : {};
      this["do"] = bind(this["do"], this);
      switch (this.opt.format) {
        case 'html':
          this.pageHead = function(summary) {
            return "<style>\n  body     { font-family: sans-serif; }\n  a        { outline: 0; }\n  b        { display: inline-block; width: .7em }\n\n  b.pass              { color: #393 }\n  b.fail              { color: #bbb }\n  article.fail b.pass { color: #bbb }\n  section.fail b.pass { color: #bbb }\n\n  pre      { padding: .5em; margin: .2em 0; border-radius: 4px; }\n  pre.fn   { background-color: #fde }\n  pre.pass { background-color: #cfc }\n  pre.fail { background-color: #d8e0e8 }\n\n  article  { margin-bottom: .5rem }\n  article h2 { padding-left:.5rem; margin:0; font-weight:normal }\n  article.pass { border-left: 5px solid #9c9 }\n  article.fail { border-left: 5px solid #9bf }\n  article.fail h2 { margin-bottom: .5rem }\n  article.pass >div { display: none }\n\n  section  { margin-bottom: .5rem }\n  section h3   { padding-left: .5rem; margin: 0; }\n  section.pass { border-left: 3px solid #9c9 }\n  section.fail { border-left: 3px solid #9bf }\n  section.fail h3 { margin-bottom: .5rem }\n  section.pass >div { display: none }\n\n  article.fail section.pass { border-left-color: #ccc }\n\n  div      { padding-left: .5em; }\n  div.fail { border-left: 3px solid #9bf; font-size: .8rem }\n  div h4   { margin: 0 }\n  div h4 { font: normal .8rem/1.2rem monaco, monospace }\n  div.fail, div.fail h4 { margin: .5rem 0 }\n\n</style>\n<h4><a href=\"#end\" id=\"top\">\u2b07</a>  " + summary + "</h4>";
          };
          this.pageFoot = function(summary) {
            return "<h4><a href=\"#top\" id=\"end\">\u2b06</a>  " + summary + "</h4>\n<script>\n  document.title='" + (summary.replace(/<\/?[^>]+>/g, '')) + "';\n</script>";
          };
          this.articleHead = function(heading, fail) {
            return ("<article class=\"" + (fail ? 'fail' : 'pass') + "\">") + ("<h2>" + (fail ? this.cross : this.tick) + heading + "</h2><div>");
          };
          this.articleFoot = '</div></article>';
          this.sectionHead = function(heading, fail) {
            return ("<section class=\"" + (fail ? 'fail' : 'pass') + "\">") + ("<h3>" + (fail ? this.cross : this.tick) + heading + "</h3><div>");
          };
          this.sectionFoot = '</div></section>';
          this.jobFormat = function(heading, result) {
            return ("<div class=\"" + (result ? 'fail' : 'pass') + "\">") + ("<h4>" + (result ? this.cross : this.tick) + heading + "</h4>") + ("" + (result ? this.formatError(result) : '')) + "</div>";
          };
          this.tick = '<b class="pass">\u2713</b> ';
          this.cross = '<b class="fail">\u2718</b> ';
          break;
        default:
          this.pageHead = function(summary) {
            return "" + summary;
          };
          this.pageFoot = function(summary) {
            return "\n" + summary;
          };
          this.articleHead = function(heading, fail) {
            return "\n" + (fail ? this.cross : this.tick) + " " + heading + "\n===" + (new Array(heading.length).join('=')) + "\n";
          };
          this.articleFoot = '';
          this.sectionHead = function(heading, fail) {
            return "\n" + (fail ? this.cross : this.tick) + " " + heading + "\n---" + (new Array(heading.length).join('-')) + "\n";
          };
          this.sectionFoot = '';
          this.jobFormat = function(heading, result) {
            return ((result ? this.cross : this.tick) + " " + heading) + ("" + (result ? '\n' + this.formatError(result) : ''));
          };
          this.jobFoot = '';
          this.tick = '\u2713';
          this.cross = '\u2718';
      }
    }

    Tudor.prototype.add = function(lines) {
      var article, i, line, runner, section;
      article = {
        sections: []
      };
      runner = null;
      section = null;
      if (ªA !== ªtype(lines)) {
        throw new Error("`lines` isn’t an array");
      }
      if (0 === lines.length) {
        throw new Error("`lines` has no elements");
      }
      if (ªS !== ªtype(lines[0])) {
        throw new Error("`lines[0]` isn’t a string");
      }
      article.heading = lines.shift();
      i = 0;
      while (i < lines.length) {
        line = lines[i];
        switch (ªtype(line)) {
          case ªO:
            if (!line.runner) {
              throw new Error("Errant object");
            }
            runner = line.runner;
            break;
          case ªF:
            section.jobs.push(line);
            break;
          case ªS:
            if (this.isAssertion(lines[i + 1], lines[i + 2])) {
              if (!section) {
                throw new Error("Cannot add an assertion here");
              }
              section.jobs.push([runner, line, lines[++i], lines[++i]]);
            } else {
              section = {
                heading: line,
                jobs: []
              };
              article.sections.push(section);
            }
        }
        i++;
      }
      return this.articles.push(article);
    };

    Tudor.prototype["do"] = function() {
      var actual, art, artFail, artPass, article, e, error, expect, heading, j, job, k, len, len1, len2, m, mock, pge, pgeFail, pgePass, ref, ref1, ref2, result, runner, sec, secFail, secPass, section, summary;
      pge = [];
      mock = null;
      pgePass = pgeFail = 0;
      ref = this.articles;
      for (j = 0, len = ref.length; j < len; j++) {
        article = ref[j];
        art = [];
        artPass = artFail = 0;
        ref1 = article.sections;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          section = ref1[k];
          sec = [];
          secPass = secFail = 0;
          ref2 = section.jobs;
          for (m = 0, len2 = ref2.length; m < len2; m++) {
            job = ref2[m];
            switch (ªtype(job)) {
              case ªF:
                try {
                  mock = job.apply(this, mock);
                } catch (_error) {
                  e = _error;
                  error = e.message;
                }
                if (error) {
                  sec.push(this.formatMockModifierError(job, error));
                }
                break;
              case ªA:
                runner = job[0], heading = job[1], expect = job[2], actual = job[3];
                result = runner(expect, actual, mock);
                if (!result) {
                  sec.push(this.jobFormat("" + (this.sanitize(heading))));
                  pgePass++;
                  artPass++;
                  secPass++;
                } else {
                  sec.push(this.jobFormat("" + (this.sanitize(heading)), result));
                  pgeFail++;
                  artFail++;
                  secFail++;
                }
            }
          }
          sec.unshift(this.sectionHead("" + (this.sanitize(section.heading)), secFail));
          sec.push(this.sectionFoot);
          art = art.concat(sec);
        }
        art.unshift(this.articleHead("" + (this.sanitize(article.heading)), artFail));
        art.push(this.articleFoot);
        pge = pge.concat(art);
        summary = pgeFail ? this.cross + " FAILED " + pgeFail + "/" + (pgePass + pgeFail) : this.tick + " Passed " + pgePass + "/" + (pgePass + pgeFail);
      }
      pge.unshift(this.pageHead(summary));
      pge.push(this.pageFoot(summary));
      return pge.join('\n');
    };

    Tudor.prototype.formatError = function(result) {
      switch (result.length + "-" + this.opt.format) {
        case '2-html':
          return result[0] + "\n<pre class=\"fail\">" + (this.sanitize(result[1].message)) + "</pre>";
        case '2-plain':
          return result[0] + "\n" + (this.sanitize(result[1].message));
        case '3-html':
          return "<pre class=\"fail\">" + (this.sanitize(this.reveal(result[0]))) + "</pre>\n..." + result[1] + "...\n<pre class=\"pass\">" + (this.sanitize(this.reveal(result[2]))) + "</pre>";
        case '3-plain':
          return (this.sanitize(this.reveal(result[0]))) + "\n..." + result[1] + "...\n" + (this.sanitize(this.reveal(result[2])));
        case '4-html':
          return "<pre class=\"fail\">" + (this.sanitize(this.reveal(result[0]))) + " (" + (ªtype(result[0])) + ")</pre>\n..." + result[1] + "...\n<pre class=\"pass\">" + (this.sanitize(this.reveal(result[2]))) + " (" + (ªtype(result[2])) + ")</pre>";
        case '4-plain':
          return (this.sanitize(this.reveal(result[0]))) + " (" + (ªtype(result[0])) + ")\n..." + result[1] + "...\n" + (this.sanitize(this.reveal(result[2]))) + " (" + (ªtype(result[2])) + ")";
        default:
          throw new Error("Cannot process '" + result.length + "-" + this.opt.format + "'");
      }
    };

    Tudor.prototype.formatMockModifierError = function(fn, error) {
      switch (this.opt.format) {
        case 'html':
          return "<pre class=\"fn\">" + (this.sanitize(fn + '')) + "</pre>\n...encountered an exception:\n<pre class=\"fail\">" + (this.sanitize(error)) + "</pre>";
        default:
          return (this.sanitize(fn + '')) + "\n...encountered an exception:\n" + (this.sanitize(error));
      }
    };

    Tudor.prototype.reveal = function(value) {
      return value != null ? value.toString().replace(/^\s+|\s+$/g, function(match) {
        return '\u00b7' + (new Array(match.length)).join('\u00b7');
      }) : void 0;
    };

    Tudor.prototype.sanitize = function(value) {
      switch (this.opt.format) {
        case 'html':
          return value != null ? value.toString().replace(/</g, '&lt;') : void 0;
        default:
          return value;
      }
    };

    Tudor.prototype["throw"] = {
      runner: function(expect, actual, mock) {
        var e, error;
        error = false;
        try {
          actual.apply(this, mock);
        } catch (_error) {
          e = _error;
          error = e;
        }
        if (!error) {
          return [
            'No exception thrown, expected', {
              message: expect
            }
          ];
        } else if (expect !== error.message) {
          return [error.message, 'was thrown, but expected', expect];
        }
      }
    };

    Tudor.prototype.equal = {
      runner: function(expect, actual, mock) {
        var e, error, result;
        error = false;
        try {
          result = actual.apply(this, mock);
        } catch (_error) {
          e = _error;
          error = e;
        }
        if (error) {
          return ['Unexpected exception', error];
        } else if (expect !== result) {
          if (result + '' === expect + '') {
            return [result, 'was returned, but expected', expect, true];
          } else {
            return [result, 'was returned, but expected', expect];
          }
        }
      }
    };

    Tudor.prototype.is = {
      runner: function(expect, actual, mock) {
        var e, error, result;
        error = false;
        try {
          result = actual.apply(this, mock);
        } catch (_error) {
          e = _error;
          error = e;
        }
        if (error) {
          return ['Unexpected exception', error];
        } else if (expect !== ªtype(result)) {
          return ["type " + (ªtype(result)), 'was returned, but expected', "type " + expect];
        }
      }
    };

    Tudor.prototype.match = {
      runner: function(expect, actual, mock) {
        var e, error, result;
        error = false;
        try {
          result = actual.apply(this, mock);
        } catch (_error) {
          e = _error;
          error = e;
        }
        if (error) {
          return ['Unexpected exception', error];
        } else if (ªF !== typeof expect.test) {
          return [
            '`test()` is not a function', {
              message: expect
            }
          ];
        } else if (!expect.test('' + result)) {
          return ['' + result, 'failed test', expect];
        }
      }
    };

    Tudor.prototype.isAssertion = function(line1, line2) {
      if (ªF !== ªtype(line2)) {
        return false;
      }
      if ((ªO === ªtype(line1)) && ªF === ªtype(line1.runner)) {
        return false;
      }
      return true;
    };

    return Tudor;

  })();

  tudor = new Tudor({
    format: ªO === typeof window ? 'html' : 'plain'
  });

  Main.runTest = tudor["do"];

  tudor.add([
    "01 Ookonsole Constructor Usage", tudor.is, "The class and instance are expected types", "The class is a function", ªF, function() {
      return Main;
    }, "The instance is an object", ªO, function() {
      return new Main;
    }, "`config` validates as expected", "`config.$wrap` can be undefined", ªO, function() {
      return new Main({
        $wrap: void 0
      });
    }, "If defined, `config.$wrap` should be an HTMLElement", ªO, function() {
      return new Main({
        $wrap: ªX.document.body
      });
    }, tudor["throw"], "`config.$wrap` cannot be a regular object", "`config.$wrap` is not an instance of `HTMLElement`", function() {
      return new Main({
        $wrap: 123
      });
    }
  ]);

  if (!ªX.HTMLElement) {
    ªX.HTMLElement = (function() {
      function _Class() {}

      _Class.prototype.innerHTML = '';

      _Class.prototype.getAttribute = function() {};

      _Class.prototype.setAttribute = function() {};

      _Class.prototype.appendChild = function() {};

      _Class.prototype.removeChild = function() {};

      _Class.prototype.focus = function() {};

      _Class.prototype.blur = function() {};

      _Class.prototype.addEventListener = function() {};

      return _Class;

    })();
  }

  if (!ªX.document) {
    ªX.document = {
      body: new ªX.HTMLElement,
      createElement: function() {
        return new ªX.HTMLElement;
      }
    };
  }

}).call(this);
