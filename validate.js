var $, validate={};

validate.postcodeRe = /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/
validate.dateRe = /^\d{2}\/\d{2}\/\d{4}/;

validate.validateForm = function(formId) {
  var isValid = true, inputs = $("#"+formId+" input"), i, regexp;
  for (i=0; i<inputs.length; i++) {
    inputElement = inputs[i];
    console.log(inputElement);

    // Validate postcode
    if ($(inputElement).hasClass("valid-postcode") && !validate.postcodeRe.test($(inputElement).val())) {
      alert("invalid postcode");
      isValid = false;
      break;
    }

    // validate date
    if ($(inputElement).hasClass("valid-date") && !validate.dateRe.test($(inputElement).val())) {
      alert("invalid date");
      isValid = false;
      break;
    }
  }
  return isValid;
};