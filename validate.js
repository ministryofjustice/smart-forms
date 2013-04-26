var $, validate={};

validate.postcodeRe = /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/

validate.validateForm = function(formId) {
  var isValid = true, inputs = $("#"+formId+" input"), i;
  for (i=0; i<inputs.length; i++) {
    inputElement = inputs[i];
    console.log(inputElement);
    if ($(inputElement).hasClass("valid-postcode")) {
      if (validate.postcodeRe.test($(inputElement).val())) {
        console.log("postcode ok");
      } else {
        alert("invalid postcode");
        isValid = false;
        break;
      }
    }
  }
  return isValid;
};