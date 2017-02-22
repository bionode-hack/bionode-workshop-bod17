var _ = require('lodash')
var through = require('through2')
var exec = require('child_process').exec;
var streamify = require('stream-array')
var multimeter = require('multimeter');
var multi = multimeter(process);

process.stdout.write('\033c'); // Clear the console

var jobs = 20

var progress = {
  fastStream: 1,
  slowStream: 1
}

var fastStreamProgressBar = multi(0, 1, {
    width : jobs,
    solid : { text : '█'},
    empty : { text : ' ' },
})

var slowStreamProgressBar = multi(0, 2, {
    width : jobs,
    solid : { text : '█'},
    empty : { text : ' ' },
})

sourceStream = streamify(_.range(jobs))


var fastStream = through.obj({highWaterMark: 16}, function (obj, enc, next) {
  var self = this
  exec('sleep 1', function (err, stdout, stderr) {
    fastStreamProgressBar.ratio(progress.fastStream++, jobs)
    self.push(obj)
    next()
  })
})

var slowStream = through.obj({highWaterMark: 16}, function (obj, enc, next) {
  var self = this
  exec('sleep 2', function (err, stdout, stderr) {
    slowStreamProgressBar.ratio(progress.slowStream++, jobs)
    self.push(obj)
    next()
  })
})

sourceStream.pipe(fastStream).pipe(slowStream)

slowStream.resume()
