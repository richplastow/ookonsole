Task
====

#### A task which can be run on an Ookonsole

    class Task
      C: 'Task'
      toString: -> "[object #{@C}]"

      constructor: (config={}) ->




Properties
----------


#### `summary <string>`
A one-line explanation, describing what this task does. 

        @summary = config.summary
        if ªS != ªtype @summary
          throw Error "`config.summary` is type #{ªtype @summary} not 'string'"


#### `details <string>`
Detailed instructions on how to use the task, with a full explanation of its 
options. The `help` task provides a typical example to follow. 

        @details = config.details
        if ªS != ªtype @details
          throw Error "`config.details` is type #{ªtype @details} not 'string'"


#### `runner <string>`
The function to be run. It will be passed two arguments:  
- `context <object>`
- `options <array>`

        @runner = config.runner
        if ªF != ªtype @runner
          throw Error "`config.runner` is type #{ªtype @runner} not 'function'"




Methods
-------


#### `run()`
- `context <object>`
- `options <array>`

Run the task. 

      run: -> @runner.apply context, options



