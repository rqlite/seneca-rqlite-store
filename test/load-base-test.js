/* Copyright (c) 2017 e-soa Jacques Desodt, MIT License */
'use strict'

// Default plugin options
const pluginName = 'rqlite-store'
const role = pluginName + '-test'
const base = 'mybase'
const entityName = 'test'

// Prerequisites
const testConfig = require('./config')
const Seneca = require('seneca') // eslint-disable-line no-unused-vars
const testFunctions = require('./functions')

// Test prerequisites
const Code = require('code')
const Lab = require('lab', {timeout: testFunctions.timeout})
var lab = (exports.lab = Lab.script())
var describe = lab.describe
var it = lab.it
var expect = Code.expect

describe('load with base', function () {
  //
  // Calls the load without argument
  it('no arg', function (fin) {
    // Gets the Seneca instance
    var seneca = testFunctions.setSeneca(Seneca, testConfig, role, fin) // Add 'print' for debug
    // Loads with ID = null: never calls the plugin
    var entityFactory = seneca.make(base, entityName)
    entityFactory.load$(null, function (err, result) {
      if (err) { throw err }
      expect(result).to.not.exist()
      fin()
    })
  })
  // No such table: ignore the error
  it('ignore no such table', function (fin) {
    // Drops the table
    testFunctions.dropTable(testConfig, base, entityName)
    .then(function (result) {
      // Gets the Seneca instance
      // Tests with the option: ignore the 'no such table' error
      var oldOption = testConfig.ignore_no_such_table_error
      testConfig.ignore_no_such_table_error = true
      var seneca = testFunctions.setSeneca(Seneca, testConfig, role, fin) // Add 'print' for debug
      // Loads, but the table does not exist
      var id = '007'
      var entityFactory = seneca.make(base, entityName)
      entityFactory.load$(id, function (err, result) {
        testConfig.ignore_no_such_table_error = oldOption
        if (err) { throw err }
        expect(result).to.not.exist()
        fin()
      })
    })
  })
  // No such table: catch the error (default)
  it('catch no such table', function (fin) {
    // Drops the table
    testFunctions.dropTable(testConfig, base, entityName)
    .then(function (result) {
      // Gets the Seneca instance
      var oldOption = testConfig.ignore_no_such_table_error
      testConfig.ignore_no_such_table_error = false
      var seneca = testFunctions.setSeneca(Seneca, testConfig, role, fin) // Add 'print' for debug
      // Loads, but the table does not exist
      var id = '007'
      var entityFactory = seneca.make(base, entityName)
      entityFactory.load$(id, function (err, result) {
        testConfig.ignore_no_such_table_error = oldOption
        if (err) { throw err }
        expect(result).to.exist()
        expect(result.error.indexOf(testConfig.nosuchtable)).to.not.equal(-1)
        fin()
      })
    })
  })
  // Try to load and unknown ID
  it('unknown ID', function (fin) {
    // Truncates the table
    testFunctions.truncateTable(testConfig, base, entityName)
    .then(function (result) {
      // Gets the Seneca instance
      var seneca = testFunctions.setSeneca(Seneca, testConfig, role, fin) // Add 'print' for debug
      // Loads, but the table is empty
      var id = '007'
      var entityFactory = seneca.make(base, entityName)
      entityFactory.load$(id, function (err, result) {
        if (err) { throw err }
        expect(result).to.not.exist()
        fin()
      })
    })
  })
  // Load a known ID
  it('ID exists', function (fin) {
    // Truncates the table
    testFunctions.truncateTable(testConfig, base, entityName)
    .then(function (result) {
      // Inserts the entity
      var id = '007'
      var entity = {
        id: id,
        firstname: 'John',
        lastname: 'Doo'
      }
      testFunctions.insertEntity(testConfig, base, entityName, entity)
      .then(function (result) {
        // Gets the Seneca instance
        var seneca = testFunctions.setSeneca(Seneca, testConfig, role, fin) // Add 'print' for debug
        // Loads
        var entityFactory = seneca.make(base, entityName)
        entityFactory.load$(id, function (err, result) {
          if (err) { throw err }
          expect(result).to.exist()
          expect(result.id).to.equal(id)
          expect(result.lastname).to.equal(entity.lastname)
          fin()
        })
      })
    })
  })
  //
})
