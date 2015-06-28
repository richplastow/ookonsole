Akaybe Mock DOM
===============


#### Mock the DOM for UAs which don’t have one, eg Node. 


`HTMLElement`. 

    if ! ªX.HTMLElement
      ªX.HTMLElement = class
        innerHTML: ''
        getAttribute: ->
        setAttribute: ->
        appendChild: ->
        removeChild: ->
        focus: ->
        blur: ->
        addEventListener: ->

`document`. 

    if ! ªX.document
      ªX.document =
        body: new ªX.HTMLElement
        createElement: ->
          new ªX.HTMLElement

