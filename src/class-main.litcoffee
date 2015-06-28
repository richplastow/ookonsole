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


#### `tasks <object of Tasks>`
By default, `tasks` contains a few core tasks. More should be added by the app 
which implements Ookonsole. 

        @tasks =
          unrecognized: new Task
            summary: 'Used when the requested task does not exist'
            runner: (context, options) -> 'That task does not exist'


#### `$wrap <HTMLElement|null>`
Optional HTML element which an ookonsole instance appends itself inside. 
If not set, the ookonsole instance will continue running, but won’t display 
anything in the document.  
@todo explain usage via browser console
@todo explain usage via API, from elsewhere in an app’s code

        if ªU == ªtype config.$wrap
          @$wrap = null
        else if config.$wrap instanceof ªX.HTMLElement
          @$wrap = config.$wrap
        else
          throw Error "`config.$wrap` is not an instance of `HTMLElement`"


#### `$box <HTMLDivElement|null>`
A `<DIV>` element to contain the various ookonsole elements. 

        if ! @$wrap
          @$box = null
        else
          @$box = ªX.document.createElement 'div'
          @$box.setAttribute 'class', 'ookonsole-box'


#### `$style <HTMLStyleElement|null>`
A `<STYLE>` element to display log output. 

        if ! @$wrap
          @$style = null
        else
          @$style = ªX.document.createElement 'style'
          @$style.innerHTML = @getStyle()


#### `$log <HTMLPreElement|null>`
A `<PRE>` element to display log output. 

        if ! @$wrap
          @$log = null
        else
          @$log = ªX.document.createElement 'pre'
          @$log.setAttribute 'class', 'ookonsole-log'
          @$box.appendChild @$log


#### `$command <HTMLInputElement|null>`
An `<INPUT>` element to allow command-line input. 

        if ! @$wrap
          @$command = null
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
        @$wrap.appendChild @$style
        @$wrap.appendChild @$box

      hide: ->
        @$wrap.removeChild @$style
        @$wrap.removeChild @$box




Start and Stop Methods
----------------------


#### `start()`
Xx. 

      start: ->

Give the commend-input field focus, so the user can start typing. 

        @$command.focus()

Certain keys have special functionality, handled by `onKeydown()`. 

        @$command.addEventListener 'keydown', @onKeydown




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

          when 13 #@todo ENTER
            @execute @$command.value

The `up` and `down` keys navigate through command history. 

          when 38
            ª 'UP'

          when 40
            ª 'DOWN'




Command Methods
---------------


#### `execute()`
- `command <string>`

Parse and execute a given command. 

      execute: (command) ->

Split the command into words, and remove extra spaces.  
@todo allow escaped spaces, and spaces inside quotes

        command = command.split ' '
        i = command.length
        while 0 < i--
          if '' == command[i] then command.splice i, 1

Deal with an unrecognized command. 

        task = @tasks[command.shift()]
        if ! task then task = @tasks.unrecognized

Run the command.  
@todo `try ... catch` and deal with exceptions in a graceful way

        result = task.runner @context, command

Display the result. 

        @$log.innerHTML += result + '\n'




Content Renderer Methods
------------------------


#### `getStyle()`
CSS for the `<PRE>` and `<INPUT>` elements. 

      getStyle: -> """
      .ookonsole-box {
        padding:    0.5rem;
        border:     1px solid #999;
      }
      .ookonsole-log {
        margin:     0;
        padding:    0.5rem;
        border:     1px solid #999;
        font:       1.1rem/1.4rem monaco, monospace;
      }
      .ookonsole-command {
        display:    block;
        box-sizing: border-box;
        width:      100%;
        padding:    0.5rem;
        border:     1px solid #999;
        font:       1.1rem/1.4rem monaco, monospace;
      }
      """




Functions
---------


#### `zz()`
- `xx <xx>`  Xx 

Xx. @todo describe

    zz = (xx) ->



