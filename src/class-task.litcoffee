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
        if ªS != ªtype @summary then throw Error """
          `config.summary` is '#{ªtype @summary}' not 'string'"""


#### `completions <array of strings>`
Candidates for Ookonsole’s autocomplete feature. 

        @completions = config.completions
        if ªA != ªtype @completions then throw Error """
          `config.completions` is '#{ªtype @completions}' not 'array'"""
        for completion in @completions
          if ªS != ªtype completion then throw Error """
            `config.completions` contains '#{ªtype completion}' not 'string'"""


#### `details <string>`
Detailed instructions on how to use the task, with a full explanation of its 
options. The `help` task provides a typical example to follow. 

        @details = config.details
        if ªS != ªtype @details then throw Error """
          `config.details` is '#{ªtype @details}' not 'string'"""


#### `runner <string>`
The function to be run. It will be passed two arguments:  
- `context <object>`
- `options <array>`

        @runner = config.runner
        if ªF != ªtype @runner then throw Error """
          `config.runner` is '#{ªtype @runner}' not 'function'"""




Methods
-------


#### `run()`
- `context <object>`
- `options <array>`

Run the task. 

      run: -> @runner.apply context, options



