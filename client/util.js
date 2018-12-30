function isNameValid(name) {
  return /^[a-z ,.'-]+$/i.test(name)
}

function isEmailValid(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function isPhoneNumberValid(number) {
  return /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(number)
}

function isStringValid(val) {
  return val !== '' && val !== null
}

function isBoolean(val) {
  return val === true || val === false
}

function isArrayEmpty(val) {
  return val && val.length === 0
}

function getSelectionFromOptions(val, options) {
  for (var option of options) {
    if (option.value === val) {
      return option
    }
  }

  return ''
}

module.exports = {
  isNameValid,
  isEmailValid,
  isPhoneNumberValid,
  isStringValid,
  isBoolean,
  isArrayEmpty,
  getSelectionFromOptions,
}
