var url = require('url')
var request = require('request')
var split = require('split2')
var JSONStream = require('JSONStream')
var through = require('through2')

var urlObject = {
  protocol: 'http',
  host: 'www.ebi.ac.uk',
  pathname: '/eva/webservices/rest/v1/meta/studies/list',
  search: '?species=hsapiens_grch37'
}

var filterStream = through.obj(filter)

function filter(object, encoding, callback) {
this.push(JSON.stringify(object))
  callback()
}

var urlString = url.format(urlObject)

request(urlString)
.pipe(split())
.pipe(JSONStream.parse())
.pipe(filterStream)
.pipe(process.stdout)
