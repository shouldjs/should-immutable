var Immutable = require('immutable');
var should = require('should');

require('./should-immutable');

it('should work with immutable.js', function() {
  var map1 = Immutable.Map({a:1, b:2, c:3});
  map1.should.have.key('a').which.is.exactly(1);
  map1.should.not.have.keys('d', 'e');
  map1.should.containEql(Immutable.Map({ a: 1 }));

  var seq = Immutable.Seq([ 1, {a: 10}, 3]);
  seq.should.containEql({ a: 10 });
});
