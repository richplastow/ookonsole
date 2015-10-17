Clientside List Shortcode
=========================

#### Included by /supplemental/01-initial-state-experiment.html

To watch and compile automatically, from the top-level of the repo: 
```bash
coffee --watch --compile supplemental/01-initial-state-experiment.litcoffee
```



1
Helpers
-------

#### `ª()`
Shorthand `console.log()`. 

    ª = console.log.bind console




AppState Class
--------------

    class AppState

      constructor: (config) ->
        M = "/supplemental/01-initial-state-experiment.litcoffee
          AppState()\n  "




AppState `config` Properties
----------------------------


#### `ookonsole <Ookonsole>`
An `ookonsole` instance. 

        @ookonsole = config.ookonsole


#### `$wrap <HTMLElement|null>`
Optional HTML element which an appState instance appends itself inside. 
If not set, the appState instance will continue running, but won’t display 
anything in the document.  

        if 'undefined' == typeof config.$wrap
          @$wrap = null
        else if config.$wrap instanceof window.HTMLElement
          @$wrap = config.$wrap
        else throw Error "
          #{M}`config.$wrap` is not an instance of `HTMLElement`"


#### `$style <HTMLStyleElement|null>`
A `<STYLE>` element which styles the `$list` and `$record` elements. 

        if ! @$wrap
          @$style = null
        else
          @$style = document.createElement 'style'
          @$style.innerHTML = '#list { outline: 4px solid red; }'


#### `$list <HTMLDivElement|null>`
A `<UL>` element to contain the various appState elements. 

        if ! @$wrap
          @$list = null
        else
          @$list = document.createElement 'ul'
          @$list.setAttribute 'class', 'app-state-list'




AppState Self-Assigned Properties
---------------------------------


#### `state <object>`
The current, canonical, application state. The DOM (if available) may (or may 
not) contain an HTML representation of the `state` object. 

        @state =
          theList: []


#### `transactionTime <integer|null>`
The unix start-time of the current transaction, or `null` if no transaction is 
currently running. 

        @transactionTime = null




AppState Show and Hide Methods
------------------------------


#### `show()` and `hide()`
Display and remove the `<STYLE>` and `<UL>` elements. 

      show: ->
        @$wrap?.appendChild @$style
        @$wrap?.appendChild @$list

      hide: ->
        @$wrap?.removeChild @$style
        @$wrap?.removeChild @$list




AppState Start and Stop Methods
-------------------------------


#### `start()`

      start: ->

        @ookonsole.addTask 'add', 
          summary: "Creates a record, and appends it to the list"
          completions: ['add ']
          details: """
    add
    ---
    Xx. 

    add           With no options, xx
    add <record>  Create <record>, and append it to the list

    """
          runner: (context, options) ->
            context.state.theList.push options[0]
            if null == context.transactionTime
              context.$list.innerHTML += "
                <li id='#{options[0]}'>#{options[0]}</li>"
            "added #{options[0]}"


        @ookonsole.addTask 'delete', 
          summary: "Removes a record to the list"
          completions: ['delete ']
          details: """
    delete
    ---
    Xx. 

    delete           With no options, xx
    delete <record>  Remove <record> from the list

    """
          runner: (context, options) ->
            index = context.state.theList.indexOf options[0]
            if -1 == index
              "! Cannot delete: that record does not exist"
            else
              context.state.theList.splice index, 1
              if null == context.transactionTime
                $el = document.getElementById options[0]
                $el.parentNode.removeChild $el
              "deleted #{options[0]}"


        @ookonsole.addTask 'render', 
          summary: "Deletes the rendered view, and rebuilds it from scratch"
          completions: ['render']
          details: """
    render
    ---
    Xx. 

    render  Delete the rendered view, and rebuild it from scratch

    """
          runner: (context, options) ->
            if null != context.transactionTime
              "! Cannot render during a transaction: use `transaction end`"
            else
              html = ("<li id='#{el}'>#{el}</li>" for el in context.state.theList)
              context.$list.innerHTML = html.join '';
              "rendered the list"


        @ookonsole.addTask 'transaction', 
          summary: "Begins or ends a set of related commands"
          completions: ['transaction ','transaction begin','transaction end']
          details: """
    transaction
    ---
    Xx. @todo discussion about transactions

    transaction        Echo information about the current transaction
    transaction begin  Mark the start of a set of related commands
    transaction end    Mark the completion of a set of related commands

    """
          runner: (context, options) ->
            if ! options.length
              if null == context.transactionTime
                "! No transaction is currently running: try `transaction begin`"
              else
                "Current transaction has been running for
                 #{(+new Date - context.transactionTime)}ms"
            else if 'begin' == options[0]
              if null != context.transactionTime
                "! Cannot start a transaction: one is already running"
              else
                #@todo save a snapshot, to allow state to be rewound in case of error
                context.transactionTime = +new Date
                "Transaction begun, use `transaction end` to finish it"
            else if 'end' == options[0]
              if null == context.transactionTime
                "! Cannot end a transaction: no transaction is running"
              else
                context.transactionTime = null
                "Transaction ended"

Get a handy reference to Ookonsole’s `execute()` method. 

        run = @ookonsole.execute.bind @ookonsole

Define some handy objects to pass to the `config` argument of `run()`. 

        noCmdDisp = { storage:'none', display:'result' } # used for 'echo'
        noNothing = { storage:'none', display:'error'  } # used during rebuild
        noStorage = { storage:'none', display:'all'    } # used for 'render'

Test whether Ookive persistant storage has been set up. This may be implemented 
using the filesystem, or using localStorage.  
@todo filesystem  
@todo move all of this into Ookonsole  

        log = window.localStorage.getItem 'ookonsole.log'

If this is the first run, add sample data...

        if null == log
          run "echo First-run: adding sample data...", noCmdDisp
          run 'add Fred'
          run "echo ...sample data added.", noCmdDisp

Otherwise, rebuild app state by running each stored command in turn. 

        else
          run "echo Rebuilding app state from storage...", noCmdDisp
          run 'transaction begin', noNothing
          run command, noNothing for command in log.split '§'
          run 'transaction end'  , noNothing
          run "echo ...app state rebuilt.", noCmdDisp
          run 'render'           , noStorage




Export the Module
-----------------

#### The module’s only entry-point is the `AppState` class

First, try defining an AMD module, eg for [RequireJS](http://requirejs.org/). 

    if 'function' == typeof define and define.amd
      define -> AppState

Next, try exporting for CommonJS, eg for [Node](http://goo.gl/Lf84YI):  
`var foo = require('foo');`

    else if 'object' == typeof module and module and module.exports
      module.exports = AppState

Otherwise, add the `AppState` class to global scope. Browser usage would be:  
`var appState = new window.AppState();`

    else @.AppState = AppState




