Main
====

#### The main class for Ookonsole

    class Main
      C: ªC
      toString: -> "[object #{@C}]"

      constructor: (config={}) ->




Main `config` Properties
------------------------


#### `context <object>`
An optional context, which all tasks will be run in. 

        @context = config.context or null
        if ªO != typeof @context # nb, `typeof` sees `null` as an object
          throw Error "`config.context` is type #{typeof @context} not 'object'"


#### `unrecognized <Tasks>`
A special task, run when the requested task does not exist. 

        @unrecognized = new Task
          summary: "Used when the requested task does not exist"
          completions: []
          details: "This task is not used directly"
          runner: (context, options) ->
            "! That task does not exist: type `help` to list commands"


#### `tasks <object of Tasks>`
By default, `tasks` contains a few core tasks. More should be added by the app 
which implements Ookonsole. @todo link to examples

        @tasks =
          help: new Task
            summary: "Show this help, or type `help help` for more details"
            completions: ['help '] #@todo dynamic set of 'help <task>'
            details: """
    help
    ----
    A built-in ookonsole task, which shows helpful usage information. 

    help         With no options, lists and summarizes all available tasks
    help <task>  Shows details about the given task, eg `help clear`, to 
                 display details on `clear` and its options

    """
            runner: (context, options) => # => not ->
              switch options.length
                when 0
                  ("#{name}: #{task.summary}" for name,task of @tasks).join '\n'
                when 1
                  if @tasks[ options[0] ]
                    @tasks[ options[0] ].details
                  else
                    "! That task does not exist: type `help` to list commands"
                else
                  "! Too many options: try `help #{options[0]}`"

          clear: new Task
            summary: "Delete the contents of the log"
            completions: ['clear display','clear storage','clear all']
            details: """
    clear
    -----
    A built-in ookonsole task, which clears the log display and/or log storage. 

    clear display  Clears the log display, but leaves the in-storage log intact
    clear storage  Deletes localStorage (browser) or filesystem (server) logs
    clear all      Both of the above
    clear          With no options, runs `clear display`

    """
            runner: (context, options) => # => not ->
              switch options.length
                when 0
                  @$display.innerHTML = ''
                  false
                when 1
                  if 'display'      == options[0]
                    @tasks.clear.runner context, []
                    false
                  else if 'storage' == options[0]
                    window.localStorage.removeItem 'ookonsole.log'
                    "Cleared the storage"
                  else if 'all'     == options[0]
                    @tasks.clear.runner context, []
                    window.localStorage.removeItem 'ookonsole.log'
                    false
                  else
                    "@todo More options for clear" #@todo `clear *`, filtered clear, range clear
                else
                  "! Too many options: try `clear #{options[0]}`"


          echo: new Task
            summary: "Writes options to the log"
            completions: ['echo ']
            details: """
    echo
    ----
    A built-in ookonsole task, which writes the given options to the log. 

    echo                With no options, just log an empty line
    echo <word> <word>  Each <word> is concatenated, separated by a single space

    """
            runner: (context, options) ->
              if ! options.length
                ""
              else
                options.join ' '


#### `$wrap <HTMLElement|null>`
Optional HTML element which an ookonsole instance appends itself inside. 
If not set, and if `$display` is not set, the ookonsole instance will continue 
running, but won’t display anything in the document.  
@todo explain usage via browser console
@todo explain usage via API, from elsewhere in an app’s code

        if ªU == ªtype config.$wrap
          @$wrap = null
        else if config.$wrap instanceof ªX.HTMLElement
          @$wrap = config.$wrap
        else
          throw Error "`config.$wrap` is not an instance of `HTMLElement`"


#### `$style <HTMLStyleElement|null>`
A `<STYLE>` element which styles `$box`, `$display` and `$command` elements. 

        if ! @$wrap
          @$style = null
        else
          @$style = ªX.document.createElement 'style'
          @$style.innerHTML = @getStyle()


#### `$box <HTMLDivElement|null>`
A `<DIV>` element to contain the various ookonsole elements. 

        if ! @$wrap
          @$box = null
        else
          @$box = ªX.document.createElement 'div'
          @$box.setAttribute 'class', 'ookonsole-box'


#### `$display <HTMLPreElement|null>`
A `<PRE>` element to display part or all of the log. 

        if ! @$wrap
          @$display = config.$display or null
        else
          @$display = ªX.document.createElement 'pre'
          @$display.setAttribute 'class', 'ookonsole-display'
          @$box.appendChild @$display


#### `$command <HTMLInputElement|null>`
An `<INPUT>` element to allow command-line input. 

        if ! @$wrap
          @$command = config.$command or null
        else
          @$command = ªX.document.createElement 'input'
          @$command.setAttribute 'class', 'ookonsole-command'
          @$box.appendChild @$command


#### `$pointer <integer|null>`
Used when the up or down keys are pressed, to step through the log history. 

        @pointer = null




Init
----

Xx. 




Show and Hide Methods
---------------------


#### `show()` and `hide()`
Display and remove the `<STYLE>`, `<DIV>`, `<PRE>` and `<INPUT>` elements. 

      show: ->
        @$wrap?.appendChild @$style
        @$wrap?.appendChild @$box

      hide: ->
        @$wrap?.removeChild @$style
        @$wrap?.removeChild @$box




Start and Stop Methods
----------------------


#### `start()`
Xx. 

      start: ->

Give the commend-input field focus, so the user can start typing. 

        @$command?.focus()

Certain keys have special functionality, handled by `onKeydown()`. 

        @$command?.addEventListener 'keydown', @onKeydown




#### `stop()`
Xx. 

      stop: ->
        ª 456




Task Management Methods
-----------------------


#### `addTask()`
- `name <string>`
- `config <object>`

Xx. 

      addTask: (name, config) => # `=>` not `->`
        @tasks[name] = new Task config




Event Handler Methods
---------------------


#### `onKeydown()`
- `event <KeyboardEvent>`

Xx. 

      onKeydown: (event) => # `=>` not `->`

        switch event.keyCode

The `return` and `enter` keys execute a command. 

          when 13
            @execute @$command.value

`tab` attempts to autocomplete the current command. 

          when 9
            @autocomplete @$command.value
            event.preventDefault() # prevent focus moving away

The `up` and `down` keys navigate through command history.  
@todo refine this functionality, so that DOWN followed by UP does not lag

          when 38
            log = @$display.innerHTML
            @pointer = if null == @pointer then log.length else @pointer
            prevCommandStart = log.lastIndexOf '§ ', @pointer
            if -1 == prevCommandStart then return
            prevCommandEnd = log.indexOf '\n', prevCommandStart
            if -1 == prevCommandEnd then return
            @pointer = prevCommandStart - 1
            @$command.value = log.slice prevCommandStart + 2, prevCommandEnd
            event.preventDefault() # prevent caret jumping to start of text

          when 40
            log = @$display.innerHTML
            @pointer = if null == @pointer then log.length else @pointer + 2
            nextCommandStart = log.indexOf '§ ', @pointer
            if -1 == nextCommandStart then return
            nextCommandEnd = log.indexOf '\n', nextCommandStart
            if -1 == nextCommandEnd then return
            @pointer = nextCommandStart
            @$command.value = log.slice nextCommandStart + 2, nextCommandEnd




Command Methods
---------------


#### `autocomplete()`
- `command <string>`

Attempt to guess what the user is typing. Triggered by the `tab` key. 

      autocomplete: (command) ->

Get a list of candidate completions. 

        candidates = []
        for name,task of @tasks
          for completion in task.completions
            if (completion.slice 0, command.length) == command
              candidates.push completion


If there is only one possible candidate, use that. If there are two or more 
candidates, use thier common start-string. Otherwise, do nothing. 

        if 1 == candidates.length
          @$command.value = candidates[0]
        else if 0 != candidates.length
          @$command.value = ªcommonPrefix candidates




#### `execute()`
- `command <string>`
- `config <object>`

Parse and execute a given command. 

      execute: (command, config={ storage:'command', display:'all' }) ->

Reset the log-history pointer, ready for the next time the up key is pressed. 

        @pointer = null

Remove all text from the `$command` element.  

        @$command.value = ''

Determine whether the scrollbar is currently at (or near) the end of the log. 

        hasScrolledToEnd =
          @$display.scrollTop > @$display.scrollHeight - @$display.offsetHeight

Split the command into words, and remove extra spaces.  
@todo allow escaped spaces, and spaces inside quotes

        options = command.split ' '
        i = options.length
        while 0 < i--
          if '' == options[i] then options.splice i, 1

Get the task, and deal with a blank command. 

        if options.length then task = @tasks[options.shift()] else return

Deal with an unrecognized command. 

        if ! task then task = @unrecognized

Run the command.  
@todo `try ... catch` and deal with exceptions in a graceful way

        result = task.runner @context, options

Store the command, unless the result is `false`, there was an error, or `config`
says otherwise. Also, set `prefix` to '!' if there was an error, '§' if the 
command has been stored, or else '>'.  
@todo an Ookive config could allow storage of commands which cause errors  
@todo another Ookive config could allow the error-messages to be stored, too

Display nothing if the result is `false` (returned by, for example, 'clear'). 

        if false == result
          prefix = '§'
        else if '!' == result.slice 0, 1
          prefix = '!'
        else if 'command' == config.storage or 'all' == config.storage
          log = window.localStorage.getItem 'ookonsole.log'
          window.localStorage.setItem 'ookonsole.log', "
            #{if null == log then '' else log + '§'}#{command}"
          prefix = '§'
        else
          prefix = '>'

Display the command, unless `config` says otherwise. 

        if 'command' == config.display or 'all' == config.display
          @$display.innerHTML += "#{prefix} #{command}\n"

Store the result, unless `config` says otherwise, or the result is `false` (for 
example, 'clear storage'). 

        #@todo

Display nothing if the result is `false` (returned by, for example, 'clear'). 

        if false == result
          'noop'

Display an error result (starts '!') unless `config` says otherwise. 

        else if '!' == result.slice 0, 1
          if 'none' != config.display # eg, `{ display:'error' }`
            @$display.innerHTML += (result.replace /</g, '&lt;') + '\n'

Display a successful result unless `config` says otherwise. 

        else if 'result' == config.display or 'all' == config.display
          if false != result
            @$display.innerHTML += (result.replace /</g, '&lt;') + '\n'

Keep the scrollbar at the end of the log, unless the user has scrolled up. 

        if hasScrolledToEnd
          @$display.scrollTop = @$display.scrollHeight





Content Renderer Methods
------------------------


#### `getStyle()`
CSS for the `<PRE>` and `<INPUT>` elements. 

      getStyle: -> """
      .ookonsole-box {
        padding:    0.5rem;
        border:     1px solid #999;
      }
      .ookonsole-display {
        margin:     0;
        padding:    0.5rem;
        border:     1px solid #999;
        font:       1em/1.4em monaco, monospace;
      }
      .ookonsole-command {
        display:    block;
        box-sizing: border-box;
        width:      100%;
        padding:    0.5rem;
        border:     1px solid #999;
        font:       1em/1.4em monaco, monospace;
      }
      """




Functions
---------


#### `zz()`
- `xx <xx>`  Xx 

Xx. @todo describe

    zz = (xx) ->



