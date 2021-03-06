/* Copyright (c) 2017 e-soa Jacques Desodt, MIT License */
'use strict'

var config = {}

// Seneca store options
// When updates, merges the data of the previous and current entity
// otherwise writes only the current entity data
config.merge = true
// When the table does not exist, ignores the error and returns a result
// otherwise fires the error
config.ignore_no_such_table_error = false

// RQLite configuration
// See: https://github.com/rqlite/rqlite
// See: https://github.com/rqlite/rqlite/blob/master/doc/DATA_API.md
config.protocol = 'http' // http or https
config.host = '127.0.0.1'
config.port = 4001
// See: https://github.com/rqlite/rqlite/blob/master/doc/CONSISTENCY.md
config.consistency_level = 'weak' // none, weak or strong
// See: https://github.com/rqlite/rqlite/blob/master/doc/DATA_API.md#sending-requests-to-followers
config.maxredirects = 10

// Seneca web UI options
// See: https://github.com/senecajs/seneca-web
config.prefix = '/rqlite-store'
config.web = {
  dump: false
}

// This plugin messages
config.badarguments = 'bad arguments for this function'
config.nosuchcolumn = 'no such column'
config.nosuchtable = 'no such table'
config.unique = 'UNIQUE constraint failed'
config.toomuchredirects = 'the maximum number of attempts to redirect to the leader is reached'

// Exports this configuration
module.exports = config
