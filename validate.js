/* exported validate */
var $;

var validate = (function () {
  "use strict";
  var
    postcodeRe = /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/,
    dateRe = /^\d{2}\/\d{2}\/\d{4}/;

  return {
    "validateForm": function (formId) {

      var isValid = true, inputs = $("#" + formId + " input, #" + formId + " textarea"), i, inputElement, inputElementName;
      for (i=0; i < inputs.length; i++) {
        inputElement = $(inputs[i]);
        inputElementName = inputElement.attr("name");

        if (!inputElement.hasClass("valid-optional") && inputElement.val() === "") {
          alert("The field called '" + inputElementName + "' must be filled out.");
          isValid = false;
          break;
        }

        // Validate postcode
        if (inputElement.hasClass("valid-postcode") && !postcodeRe.test(inputElement.val())) {
          alert("Invalid value for: \"" + inputElementName + "\"");
          isValid = false;
          break;
        }

        // validate date
        if (inputElement.hasClass("valid-date") && !dateRe.test(inputElement.val())) {
          alert("Invalid value for: \""+inputElementName + "\"");
          isValid = false;
          break;
        }
      }
      return isValid;
    }
  };
})();
