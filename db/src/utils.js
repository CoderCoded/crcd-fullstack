
// var util = require('util')
// var debug = require('debug')('db:utils')

var Joi = require('joi')

exports.validate = function (schema) {
  return (object) => {
    return new Promise((resolve, reject) => {
      Joi.validate(object, schema, {stripUnknown: true}, (err, validated) => {
        if (err) return reject(err)

        // Check if the validation produced an empty object
        if (Object.keys(validated).length === 0) return reject(new Error('empty?'))

        resolve(validated)
      })
    })
  }
}

exports.toQueryParams = function (o) {
  var cols = []
  var params = []
  var i = 1
  for (let key in o) {
    cols.push(`${key}=($${i})`)
    params.push(o[key])
    i++
    // key + ' = ($' + (i + 1) + ')'
  }
  cols = cols.join(', ')
  return {cols, params}
}
