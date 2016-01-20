'use strict'

// var debug = require('debug')('db:roles')
// var util = require('util')
// var utils = require('./utils')

// var _ = require('lodash')
var DBModel = require('./DBModel')

class Role extends DBModel {

  static tableName = 'role';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: {type: 'string'},
      name: {type: 'string'}
    }
  };

  static grant (userId, roleId, objectId) {
    // var sql = 'INSERT INTO access_predicate (user_id, role_id, object_id) VALUES ($1, $2, $3)'

    var knex = this.knex()

    return knex
      .insert({user_id: userId, role_id: roleId, object_id: objectId})
      .into('access_predicate')
  }

}

module.exports = Role
