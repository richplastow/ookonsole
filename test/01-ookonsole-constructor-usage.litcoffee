01 Ookonsole Constructor Usage
==============================



    tudor.add [
      "01 Ookonsole Constructor Usage"
      tudor.is




      "The class and instance are expected types"


      "The class is a function"
      ªF
      -> Main


      "The instance is an object"
      ªO
      -> new Main




      "`config` validates as expected"


      "`config.$wrap` can be undefined"
      ªO
      -> new Main { $wrap:undefined }


      "If defined, `config.$wrap` should be an HTMLElement"
      ªO
      -> new Main { $wrap:ªX.document.body }


      tudor.throw

      "`config.$wrap` cannot be a regular object"
      "`config.$wrap` is not an instance of `HTMLElement`"
      -> new Main { $wrap:123 }

    ]
