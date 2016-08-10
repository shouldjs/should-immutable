(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['should', 'immutable'], factory);
  } else if (typeof module === 'object' && module.exports) {
    factory(require('should'), require('immutable'));
  } else {
    factory(root.should, root.Immutable);
  }
}(this, function(should, Immutable) {

var Iterable = Immutable.Iterable;
var Set = Immutable.Set;

var t = should.modules.type;
var format = should.modules.format;
var eql = should.modules.equal;
var defaultTypeAdaptorStorage = should.config.typeAdaptors;



var IMMUTABLE_ITERABLE = new t.Type(t.OBJECT, 'immutable-iterable');
var IMMUTABLE_INDEXED = new t.Type(t.OBJECT, 'immutable-iterable', 'indexed');
var IMMUTABLE_KEYED = new t.Type(t.OBJECT, 'immutable-iterable', 'keyed');
var IMMUTABLE_SET = new t.Type(t.OBJECT, 'immutable-iterable', 'set');

// XXX dirty hack
var objectCheck = t.checker.checks.pop();

t.checker.add(function(obj) {
  if (Iterable.isIndexed(obj)) {
    return IMMUTABLE_INDEXED;
  }
});

t.checker.add(function(obj) {
  if (Iterable.isKeyed(obj)) {
    return IMMUTABLE_KEYED;
  }
});

t.checker.add(function(obj) {
  if (Set.isSet(obj)) {
    return IMMUTABLE_SET;
  }
});

// must be last one
t.checker.add(function(obj) {
  if (Iterable.isIterable(obj)) {
    return IMMUTABLE_ITERABLE;
  }
});

t.checker.add(objectCheck);


defaultTypeAdaptorStorage.addType(IMMUTABLE_ITERABLE, {
  get: function(obj, key) {
    return obj.get(key);
  },

  has: function(obj, key) {
    return obj.has(key);
  },

  forEach: function(obj, f, context) {
    obj.forEach(f, context);
  },

  iterator: function(obj) {
    return obj.entries();
  },

  size: function(obj) {
    return obj.count();
  },

  isEmpty: function(obj) {
    return obj.isEmpty();
  }
});

format.Formatter.addType(IMMUTABLE_INDEXED, function(value) {
  return format.typeAdaptorForEachFormat.call(this, value, {
    formatKey: function() {
      return '';
    },
    brackets: ['[', ']']
  });
});

format.Formatter.addType(IMMUTABLE_KEYED, function(value) {
  return format.typeAdaptorForEachFormat.call(this, value, {
    keyValueSep: ' => '
  });
});

format.Formatter.addType(IMMUTABLE_SET, function(value) {
  return format.typeAdaptorForEachFormat.call(this, value, {
    formatKey: function() {
      return '';
    }
  });
});

eql.EQ.add(IMMUTABLE_ITERABLE.type, IMMUTABLE_ITERABLE.cls, function(a, b) {
  this.collectFail(!a.equals(b), 'Immutable iterables are not equal');
});

}));
