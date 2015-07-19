Main
====

#### The main class for Ookonsole

    class Main
      C: ªC
      toString: -> "[object #{@C}]"

      constructor: (config={}) ->




Properties
----------


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
            "That task does not exist: type `help` to list commands"


#### `tasks <object of Tasks>`
By default, `tasks` contains a few core tasks. More should be added by the app 
which implements Ookonsole. @todo link to examples

        @tasks =
          help: new Task
            summary: "Show this help. Type `help help` for more details"
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
                    "That task does not exist: type `help` to list commands"
                else
                  "Too many options: try `help #{options[0]}`"
          clear: new Task
            summary: "Delete the contents of the log"
            completions: ['clear display','clear storage','clear all']
            details: """
    clear
    -----
    A built-in ookonsole task, which shows helpful usage information. 

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
                  if 'display' == options[0]
                    @tasks.clear.runner context, []
                  else
                    "@todo" #@todo `clear *`, filtered clear, range clear
                else
                  "Too many options: try `clear #{options[0]}`"


#### `$wrap <HTMLElement|null>`
Optional HTML element which an ookonsole instance appends itself inside. If no 
not set, and if `$display` is not set, the ookonsole instance will continue 
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

          when 38
            ª 'UP'

          when 40
            ª 'DOWN'




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

Parse and execute a given command. 

      execute: (command) ->

Record the command in the log, and remove it from the `$command` element.  
@todo record in storage

        @$display.innerHTML += "> #{command}\n"
        @$command.value  = ''

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

Display the result, unless the command explicitly returns `false` (eg `clear`). 

        if false != result
          @$display.innerHTML += (result.replace /</g, '&lt;') + '\n'




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
        font:       1rem/1.3rem monaco, monospace;
      }
      .ookonsole-command {
        display:    block;
        box-sizing: border-box;
        width:      100%;
        padding:    0.5rem;
        border:     1px solid #999;
        font:       1rem/1.3rem monaco, monospace;
      }
      """




Functions
---------


#### `zz()`
- `xx <xx>`  Xx 

Xx. @todo describe

    zz = (xx) ->



