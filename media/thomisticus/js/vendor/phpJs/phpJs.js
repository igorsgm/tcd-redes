/**
 * ARRAYS
 */

function array_change_key_case (array, cs) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_change_key_case/
  //   example 1: array_change_key_case(42)
  //   returns 1: false
  //   example 2: array_change_key_case([ 3, 5 ])
  //   returns 2: [3, 5]
  //   example 3: array_change_key_case({ FuBaR: 42 })
  //   returns 3: {"fubar": 42}
  //   example 4: array_change_key_case({ FuBaR: 42 }, 'CASE_LOWER')
  //   returns 4: {"fubar": 42}
  //   example 5: array_change_key_case({ FuBaR: 42 }, 'CASE_UPPER')
  //   returns 5: {"FUBAR": 42}
  //   example 6: array_change_key_case({ FuBaR: 42 }, 2)
  //   returns 6: {"FUBAR": 42}

  var caseFnc
  var key
  var tmpArr = {}

  if (Object.prototype.toString.call(array) === '[object Array]') {
    return array
  }

  if (array && typeof array === 'object') {
    caseFnc = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase'
    for (key in array) {
      tmpArr[key[caseFnc]()] = array[key]
    }
    return tmpArr
  }

  return false
}

function array_chunk (input, size, preserveKeys) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_chunk/
  //      note 1: Important note: Per the ECMAScript specification,
  //      note 1: objects may not always iterate in a predictable order
  //   example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2)
  //   returns 1: [['Kevin', 'van'], ['Zonneveld']]
  //   example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true)
  //   returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
  //   example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2)
  //   returns 3: [['Kevin', 'van'], ['Zonneveld']]
  //   example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true)
  //   returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]

  var x
  var p = ''
  var i = 0
  var c = -1
  var l = input.length || 0
  var n = []

  if (size < 1) {
    return null
  }

  if (Object.prototype.toString.call(input) === '[object Array]') {
    if (preserveKeys) {
      while (i < l) {
        (x = i % size)
          ? n[c][i] = input[i]
          : n[++c] = {}; n[c][i] = input[i]
        i++
      }
    } else {
      while (i < l) {
        (x = i % size)
          ? n[c][x] = input[i]
          : n[++c] = [input[i]]
        i++
      }
    }
  } else {
    if (preserveKeys) {
      for (p in input) {
        if (input.hasOwnProperty(p)) {
          (x = i % size)
            ? n[c][p] = input[p]
            : n[++c] = {}; n[c][p] = input[p]
          i++
        }
      }
    } else {
      for (p in input) {
        if (input.hasOwnProperty(p)) {
          (x = i % size)
            ? n[c][x] = input[p]
            : n[++c] = [input[p]]
          i++
        }
      }
    }
  }

  return n
}

function array_combine (keys, values) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_combine/
  //   example 1: array_combine([0,1,2], ['kevin','van','zonneveld'])
  //   returns 1: {0: 'kevin', 1: 'van', 2: 'zonneveld'}

  var newArray = {}
  var i = 0

  // input sanitation
  // Only accept arrays or array-like objects
  // Require arrays to have a count
  if (typeof keys !== 'object') {
    return false
  }
  if (typeof values !== 'object') {
    return false
  }
  if (typeof keys.length !== 'number') {
    return false
  }
  if (typeof values.length !== 'number') {
    return false
  }
  if (!keys.length) {
    return false
  }

  // number of elements does not match
  if (keys.length !== values.length) {
    return false
  }

  for (i = 0; i < keys.length; i++) {
    newArray[keys[i]] = values[i]
  }

  return newArray
}

function array_count_values (array) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_count_values/
  //    input by: sankai
  //    input by: Shingo
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_count_values([ 3, 5, 3, "foo", "bar", "foo" ])
  //   returns 1: {3:2, 5:1, "foo":2, "bar":1}
  //   example 2: array_count_values({ p1: 3, p2: 5, p3: 3, p4: "foo", p5: "bar", p6: "foo" })
  //   returns 2: {3:2, 5:1, "foo":2, "bar":1}
  //   example 3: array_count_values([ true, 4.2, 42, "fubar" ])
  //   returns 3: {42:1, "fubar":1}

  var tmpArr = {}
  var key = ''
  var t = ''

  var _getType = function (obj) {
    // Objects are php associative arrays.
    var t = typeof obj
    t = t.toLowerCase()
    if (t === 'object') {
      t = 'array'
    }
    return t
  }

  var _countValue = function (tmpArr, value) {
    if (typeof value === 'number') {
      if (Math.floor(value) !== value) {
        return
      }
    } else if (typeof value !== 'string') {
      return
    }

    if (value in tmpArr && tmpArr.hasOwnProperty(value)) {
      ++tmpArr[value]
    } else {
      tmpArr[value] = 1
    }
  }

  t = _getType(array)
  if (t === 'array') {
    for (key in array) {
      if (array.hasOwnProperty(key)) {
        _countValue.call(this, tmpArr, array[key])
      }
    }
  }

  return tmpArr
}

function array_diff (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff/
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld'])
  //   returns 1: {0:'Kevin'}

  var retArr = {}
  var argl = arguments.length
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < argl; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1]) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_diff_assoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_assoc/
  // bugfixed by: 0m3r
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_diff_assoc({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'})
  //   returns 1: {1: 'van', 2: 'Zonneveld'}

  var retArr = {}
  var argl = arguments.length
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < argl; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && k === k1) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_diff_key (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_key/
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //    input by: Everlasto
  //   example 1: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5})
  //   returns 1: {"green":2, "blue":3, "white":4}
  //   example 2: array_diff_key({red: 1, green: 2, blue: 3, white: 4}, {red: 5}, {red: 5})
  //   returns 2: {"green":2, "blue":3, "white":4}

  var argl = arguments.length
  var retArr = {}
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < argl; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (k === k1) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_diff_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_uassoc/
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_diff_uassoc($array1, $array2, function (key1, key2) { return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)) })
  //   returns 1: {b: 'brown', c: 'blue', 0: 'red'}
  //        test: skip-1

  var retArr = {}
  var arglm1 = arguments.length - 1
  var cb = arguments[arglm1]
  var arr = {}
  var i = 1
  var k1 = ''
  var k = ''

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_diff_ukey (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_diff_ukey/
  //   example 1: var $array1 = {blue: 1, red: 2, green: 3, purple: 4}
  //   example 1: var $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
  //   example 1: array_diff_ukey($array1, $array2, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
  //   returns 1: {red: 2, purple: 4}

  var retArr = {}
  var arglm1 = arguments.length - 1
  // var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var k1 = ''
  var i = 1
  var arr = {}
  var k = ''

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (cb(k, k1) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_fill (startIndex, num, mixedVal) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_fill/
  //   example 1: array_fill(5, 6, 'banana')
  //   returns 1: { 5: 'banana', 6: 'banana', 7: 'banana', 8: 'banana', 9: 'banana', 10: 'banana' }

  var key
  var tmpArr = {}

  if (!isNaN(startIndex) && !isNaN(num)) {
    for (key = 0; key < num; key++) {
      tmpArr[(key + startIndex)] = mixedVal
    }
  }

  return tmpArr
}

function array_fill_keys (keys, value) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_fill_keys/
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $keys = {'a': 'foo', 2: 5, 3: 10, 4: 'bar'}
  //   example 1: array_fill_keys($keys, 'banana')
  //   returns 1: {"foo": "banana", 5: "banana", 10: "banana", "bar": "banana"}

  var retObj = {}
  var key = ''

  for (key in keys) {
    retObj[keys[key]] = value
  }

  return retObj
}

function array_filter (arr, func) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_filter/
  //    input by: max4ever
  //      note 1: Takes a function as an argument, not a function's name
  //   example 1: var odd = function (num) {return (num & 1);}
  //   example 1: array_filter({"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}, odd)
  //   returns 1: {"a": 1, "c": 3, "e": 5}
  //   example 2: var even = function (num) {return (!(num & 1));}
  //   example 2: array_filter([6, 7, 8, 9, 10, 11, 12], even)
  //   returns 2: [ 6, , 8, , 10, , 12 ]
  //   example 3: array_filter({"a": 1, "b": false, "c": -1, "d": 0, "e": null, "f":'', "g":undefined})
  //   returns 3: {"a":1, "c":-1}

  var retObj = {}
  var k

  func = func || function (v) {
    return v
  }

  // @todo: Issue #73
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    retObj = []
  }

  for (k in arr) {
    if (func(arr[k])) {
      retObj[k] = arr[k]
    }
  }

  return retObj
}

function array_flip (trans) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_flip/
  //   example 1: array_flip( {a: 1, b: 1, c: 2} )
  //   returns 1: {1: 'b', 2: 'c'}

  var key
  var tmpArr = {}

  for (key in trans) {
    if (!trans.hasOwnProperty(key)) {
      continue
    }
    tmpArr[trans[key]] = key
  }

  return tmpArr
}

function array_intersect (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect/
  //      note 1: These only output associative arrays (would need to be
  //      note 1: all numeric and counting from zero to be numeric)
  //   example 1: var $array1 = {'a' : 'green', 0:'red', 1: 'blue'}
  //   example 1: var $array2 = {'b' : 'green', 0:'yellow', 1:'red'}
  //   example 1: var $array3 = ['green', 'red']
  //   example 1: var $result = array_intersect($array1, $array2, $array3)
  //   returns 1: {0: 'red', a: 'green'}

  var retArr = {}
  var argl = arguments.length
  var arglm1 = argl - 1
  var k1 = ''
  var arr = {}
  var i = 0
  var k = ''

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1]) {
          if (i === arglm1) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs// eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys// eslint-disable-line no-labels
    }
  }

  return retArr
}

function array_intersect_assoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_assoc/
  //      note 1: These only output associative arrays (would need to be
  //      note 1: all numeric and counting from zero to be numeric)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
  //   example 1: array_intersect_assoc($array1, $array2)
  //   returns 1: {a: 'green'}

  var retArr = {}
  var argl = arguments.length
  var arglm1 = argl - 1
  var k1 = ''
  var arr = {}
  var i = 0
  var k = ''

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && k === k1) {
          if (i === arglm1) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }

  return retArr
}

function array_intersect_key (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_key/
  //      note 1: These only output associative arrays (would need to be
  //      note 1: all numeric and counting from zero to be numeric)
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'green', 0: 'yellow', 1: 'red'}
  //   example 1: array_intersect_key($array1, $array2)
  //   returns 1: {0: 'red', a: 'green'}

  var retArr = {}
  var argl = arguments.length
  var arglm1 = argl - 1
  var k1 = ''
  var arr = {}
  var i = 0
  var k = ''

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    if (!arr1.hasOwnProperty(k1)) {
      continue
    }
    arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (!arr.hasOwnProperty(k)) {
          continue
        }
        if (k === k1) {
          if (i === arglm1) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }

  return retArr
}

function array_intersect_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_uassoc/
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_intersect_uassoc($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {b: 'brown'}

  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  // var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  // cb0 = (typeof cb0 === 'string')
  //   ? $global[cb0]
  //   : (Object.prototype.toString.call(cb0) === '[object Array]')
  //     ? $global[cb0[0]][cb0[1]]
  //     : cb0

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
          if (i === arglm2) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }

  return retArr
}

function array_intersect_ukey (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_intersect_ukey/
  //   example 1: var $array1 = {blue: 1, red: 2, green: 3, purple: 4}
  //   example 1: var $array2 = {green: 5, blue: 6, yellow: 7, cyan: 8}
  //   example 1: array_intersect_ukey ($array1, $array2, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
  //   returns 1: {blue: 1, green: 3}

  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  // var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  // cb0 = (typeof cb0 === 'string')
  //   ? $global[cb0]
  //   : (Object.prototype.toString.call(cb0) === '[object Array]')
  //     ? $global[cb0[0]][cb0[1]]
  //     : cb0

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb(k, k1) === 0) {
          if (i === arglm2) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }

  return retArr
}

function array_key_exists (key, search) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_key_exists/
  //   example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'})
  //   returns 1: true

  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
    return false
  }

  return key in search
}

function array_keys (input, searchValue, argStrict) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_keys/
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: P
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} )
  //   returns 1: [ 'firstname', 'surname' ]

  var search = typeof searchValue !== 'undefined'
  var tmpArr = []
  var strict = !!argStrict
  var include = true
  var key = ''

  for (key in input) {
    if (input.hasOwnProperty(key)) {
      include = true
      if (search) {
        if (strict && input[key] !== searchValue) {
          include = false
        } else if (input[key] !== searchValue) {
          include = false
        }
      }

      if (include) {
        tmpArr[tmpArr.length] = key
      }
    }
  }

  return tmpArr
}

function array_map (callback) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_map/
  //    input by: thekid
  //      note 1: If the callback is a string (or object, if an array is supplied),
  //      note 1: it can only work if the function name is in the global context
  //   example 1: array_map( function (a){return (a * a * a)}, [1, 2, 3, 4, 5] )
  //   returns 1: [ 1, 8, 27, 64, 125 ]

  var argc = arguments.length
  var argv = arguments
  var obj = null
  var cb = callback
  var j = argv[1].length
  var i = 0
  var k = 1
  var m = 0
  var tmp = []
  var tmpArr = []

  var $global = (typeof window !== 'undefined' ? window : global)

  while (i < j) {
    while (k < argc) {
      tmp[m++] = argv[k++][i]
    }

    m = 0
    k = 1

    if (callback) {
      if (typeof callback === 'string') {
        cb = $global[callback]
      } else if (typeof callback === 'object' && callback.length) {
        obj = typeof callback[0] === 'string' ? $global[callback[0]] : callback[0]
        if (typeof obj === 'undefined') {
          throw new Error('Object not found: ' + callback[0])
        }
        cb = typeof callback[1] === 'string' ? obj[callback[1]] : callback[1]
      }
      tmpArr[i++] = cb.apply(obj, tmp)
    } else {
      tmpArr[i++] = tmp
    }

    tmp = []
  }

  return tmpArr
}

function array_merge () { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_merge/
  // bugfixed by: Nate
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: josh
  //   example 1: var $arr1 = {"color": "red", 0: 2, 1: 4}
  //   example 1: var $arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  //   example 1: array_merge($arr1, $arr2)
  //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  //   example 2: var $arr1 = []
  //   example 2: var $arr2 = {1: "data"}
  //   example 2: array_merge($arr1, $arr2)
  //   returns 2: {0: "data"}

  var args = Array.prototype.slice.call(arguments)
  var argl = args.length
  var arg
  var retObj = {}
  var k = ''
  var argil = 0
  var j = 0
  var i = 0
  var ct = 0
  var toStr = Object.prototype.toString
  var retArr = true

  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false
      break
    }
  }

  if (retArr) {
    retArr = []
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i])
    }
    return retArr
  }

  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i]
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j]
      }
    } else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k]
          } else {
            retObj[k] = arg[k]
          }
        }
      }
    }
  }

  return retObj
}

function array_merge_recursive (arr1, arr2) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_merge_recursive/
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: var $arr1 = {'color': {'favorite': 'red'}, 0: 5}
  //   example 1: var $arr2 = {0: 10, 'color': {'favorite': 'green', 0: 'blue'}}
  //   example 1: array_merge_recursive($arr1, $arr2)
  //   returns 1: {'color': {'favorite': {0: 'red', 1: 'green'}, 0: 'blue'}, 1: 5, 1: 10}
  //        test: skip-1

  var arrayMerge = require('../array/array_merge')
  var idx = ''

  if (arr1 && Object.prototype.toString.call(arr1) === '[object Array]' &&
    arr2 && Object.prototype.toString.call(arr2) === '[object Array]') {
    for (idx in arr2) {
      arr1.push(arr2[idx])
    }
  } else if ((arr1 && (arr1 instanceof Object)) && (arr2 && (arr2 instanceof Object))) {
    for (idx in arr2) {
      if (idx in arr1) {
        if (typeof arr1[idx] === 'object' && typeof arr2 === 'object') {
          arr1[idx] = arrayMerge(arr1[idx], arr2[idx])
        } else {
          arr1[idx] = arr2[idx]
        }
      } else {
        arr1[idx] = arr2[idx]
      }
    }
  }

  return arr1
}

function array_multisort (arr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_multisort/
  //   example 1: array_multisort([1, 2, 1, 2, 1, 2], [1, 2, 3, 4, 5, 6])
  //   returns 1: true
  //   example 2: var $characters = {A: 'Edward', B: 'Locke', C: 'Sabin', D: 'Terra', E: 'Edward'}
  //   example 2: var $jobs = {A: 'Warrior', B: 'Thief', C: 'Monk', D: 'Mage', E: 'Knight'}
  //   example 2: array_multisort($characters, 'SORT_DESC', 'SORT_STRING', $jobs, 'SORT_ASC', 'SORT_STRING')
  //   returns 2: true
  //   example 3: var $lastnames = [ 'Carter','Adams','Monroe','Tyler','Madison','Kennedy','Adams']
  //   example 3: var $firstnames = ['James', 'John' ,'James', 'John', 'James',  'John',   'John']
  //   example 3: var $president = [ 39, 6, 5, 10, 4, 35, 2 ]
  //   example 3: array_multisort($firstnames, 'SORT_DESC', 'SORT_STRING', $lastnames, 'SORT_ASC', 'SORT_STRING', $president, 'SORT_NUMERIC')
  //   returns 3: true
  //      note 1: flags: Translation table for sort arguments.
  //      note 1: Each argument turns on certain bits in the flag byte through addition.
  //      note 1: bits: HGFE DCBA
  //      note 1: args: Holds pointer to arguments for reassignment

  var g
  var i
  var j
  var k
  var l
  var sal
  var vkey
  var elIndex
  var lastSorts
  var tmpArray
  var zlast

  var sortFlag = [0]
  var thingsToSort = []
  var nLastSort = []
  var lastSort = []
  // possibly redundant
  var args = arguments

  var flags = {
    'SORT_REGULAR': 16,
    'SORT_NUMERIC': 17,
    'SORT_STRING': 18,
    'SORT_ASC': 32,
    'SORT_DESC': 40
  }

  var sortDuplicator = function (a, b) {
    return nLastSort.shift()
  }

  var sortFunctions = [
    [

      function (a, b) {
        lastSort.push(a > b ? 1 : (a < b ? -1 : 0))
        return a > b ? 1 : (a < b ? -1 : 0)
      },
      function (a, b) {
        lastSort.push(b > a ? 1 : (b < a ? -1 : 0))
        return b > a ? 1 : (b < a ? -1 : 0)
      }
    ],
    [

      function (a, b) {
        lastSort.push(a - b)
        return a - b
      },
      function (a, b) {
        lastSort.push(b - a)
        return b - a
      }
    ],
    [

      function (a, b) {
        lastSort.push((a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0))
        return (a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0)
      },
      function (a, b) {
        lastSort.push((b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0))
        return (b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0)
      }
    ]
  ]

  var sortArrs = [
    []
  ]

  var sortKeys = [
    []
  ]

  // Store first argument into sortArrs and sortKeys if an Object.
  // First Argument should be either a Javascript Array or an Object,
  // otherwise function would return FALSE like in PHP
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    sortArrs[0] = arr
  } else if (arr && typeof arr === 'object') {
    for (i in arr) {
      if (arr.hasOwnProperty(i)) {
        sortKeys[0].push(i)
        sortArrs[0].push(arr[i])
      }
    }
  } else {
    return false
  }

  // arrMainLength: Holds the length of the first array.
  // All other arrays must be of equal length, otherwise function would return FALSE like in PHP
  // sortComponents: Holds 2 indexes per every section of the array
  // that can be sorted. As this is the start, the whole array can be sorted.
  var arrMainLength = sortArrs[0].length
  var sortComponents = [0, arrMainLength]

  // Loop through all other arguments, checking lengths and sort flags
  // of arrays and adding them to the above variables.
  var argl = arguments.length
  for (j = 1; j < argl; j++) {
    if (Object.prototype.toString.call(arguments[j]) === '[object Array]') {
      sortArrs[j] = arguments[j]
      sortFlag[j] = 0
      if (arguments[j].length !== arrMainLength) {
        return false
      }
    } else if (arguments[j] && typeof arguments[j] === 'object') {
      sortKeys[j] = []
      sortArrs[j] = []
      sortFlag[j] = 0
      for (i in arguments[j]) {
        if (arguments[j].hasOwnProperty(i)) {
          sortKeys[j].push(i)
          sortArrs[j].push(arguments[j][i])
        }
      }
      if (sortArrs[j].length !== arrMainLength) {
        return false
      }
    } else if (typeof arguments[j] === 'string') {
      var lFlag = sortFlag.pop()
      // Keep extra parentheses around latter flags check
      // to avoid minimization leading to CDATA closer
      if (typeof flags[arguments[j]] === 'undefined' ||
        ((((flags[arguments[j]]) >>> 4) & (lFlag >>> 4)) > 0)) {
        return false
      }
      sortFlag.push(lFlag + flags[arguments[j]])
    } else {
      return false
    }
  }

  for (i = 0; i !== arrMainLength; i++) {
    thingsToSort.push(true)
  }

  // Sort all the arrays....
  for (i in sortArrs) {
    if (sortArrs.hasOwnProperty(i)) {
      lastSorts = []
      tmpArray = []
      elIndex = 0
      nLastSort = []
      lastSort = []

      // If there are no sortComponents, then no more sorting is neeeded.
      // Copy the array back to the argument.
      if (sortComponents.length === 0) {
        if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
          args[i] = sortArrs[i]
        } else {
          for (k in arguments[i]) {
            if (arguments[i].hasOwnProperty(k)) {
              delete arguments[i][k]
            }
          }
          sal = sortArrs[i].length
          for (j = 0, vkey = 0; j < sal; j++) {
            vkey = sortKeys[i][j]
            args[i][vkey] = sortArrs[i][j]
          }
        }
        delete sortArrs[i]
        delete sortKeys[i]
        continue
      }

      // Sort function for sorting. Either sorts asc or desc, regular/string or numeric.
      var sFunction = sortFunctions[(sortFlag[i] & 3)][((sortFlag[i] & 8) > 0) ? 1 : 0]

      // Sort current array.
      for (l = 0; l !== sortComponents.length; l += 2) {
        tmpArray = sortArrs[i].slice(sortComponents[l], sortComponents[l + 1] + 1)
        tmpArray.sort(sFunction)
        // Is there a better way to copy an array in Javascript?
        lastSorts[l] = [].concat(lastSort)
        elIndex = sortComponents[l]
        for (g in tmpArray) {
          if (tmpArray.hasOwnProperty(g)) {
            sortArrs[i][elIndex] = tmpArray[g]
            elIndex++
          }
        }
      }

      // Duplicate the sorting of the current array on future arrays.
      sFunction = sortDuplicator
      for (j in sortArrs) {
        if (sortArrs.hasOwnProperty(j)) {
          if (sortArrs[j] === sortArrs[i]) {
            continue
          }
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortArrs[j].slice(sortComponents[l], sortComponents[l + 1] + 1)
            // alert(l + ':' + nLastSort);
            nLastSort = [].concat(lastSorts[l])
            tmpArray.sort(sFunction)
            elIndex = sortComponents[l]
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortArrs[j][elIndex] = tmpArray[g]
                elIndex++
              }
            }
          }
        }
      }

      // Duplicate the sorting of the current array on array keys
      for (j in sortKeys) {
        if (sortKeys.hasOwnProperty(j)) {
          for (l = 0; l !== sortComponents.length; l += 2) {
            tmpArray = sortKeys[j].slice(sortComponents[l], sortComponents[l + 1] + 1)
            nLastSort = [].concat(lastSorts[l])
            tmpArray.sort(sFunction)
            elIndex = sortComponents[l]
            for (g in tmpArray) {
              if (tmpArray.hasOwnProperty(g)) {
                sortKeys[j][elIndex] = tmpArray[g]
                elIndex++
              }
            }
          }
        }
      }

      // Generate the next sortComponents
      zlast = null
      sortComponents = []
      for (j in sortArrs[i]) {
        if (sortArrs[i].hasOwnProperty(j)) {
          if (!thingsToSort[j]) {
            if ((sortComponents.length & 1)) {
              sortComponents.push(j - 1)
            }
            zlast = null
            continue
          }
          if (!(sortComponents.length & 1)) {
            if (zlast !== null) {
              if (sortArrs[i][j] === zlast) {
                sortComponents.push(j - 1)
              } else {
                thingsToSort[j] = false
              }
            }
            zlast = sortArrs[i][j]
          } else {
            if (sortArrs[i][j] !== zlast) {
              sortComponents.push(j - 1)
              zlast = sortArrs[i][j]
            }
          }
        }
      }

      if (sortComponents.length & 1) {
        sortComponents.push(j)
      }
      if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
        args[i] = sortArrs[i]
      } else {
        for (j in arguments[i]) {
          if (arguments[i].hasOwnProperty(j)) {
            delete arguments[i][j]
          }
        }

        sal = sortArrs[i].length
        for (j = 0, vkey = 0; j < sal; j++) {
          vkey = sortKeys[i][j]
          args[i][vkey] = sortArrs[i][j]
        }
      }
      delete sortArrs[i]
      delete sortKeys[i]
    }
  }
  return true
}

function array_pad (input, padSize, padValue) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_pad/
  //   example 1: array_pad([ 7, 8, 9 ], 2, 'a')
  //   returns 1: [ 7, 8, 9]
  //   example 2: array_pad([ 7, 8, 9 ], 5, 'a')
  //   returns 2: [ 7, 8, 9, 'a', 'a']
  //   example 3: array_pad([ 7, 8, 9 ], 5, 2)
  //   returns 3: [ 7, 8, 9, 2, 2]
  //   example 4: array_pad([ 7, 8, 9 ], -5, 'a')
  //   returns 4: [ 'a', 'a', 7, 8, 9 ]

  var pad = []
  var newArray = []
  var newLength
  var diff = 0
  var i = 0

  if (Object.prototype.toString.call(input) === '[object Array]' && !isNaN(padSize)) {
    newLength = ((padSize < 0) ? (padSize * -1) : padSize)
    diff = newLength - input.length

    if (diff > 0) {
      for (i = 0; i < diff; i++) {
        newArray[i] = padValue
      }
      pad = ((padSize < 0) ? newArray.concat(input) : input.concat(newArray))
    } else {
      pad = input
    }
  }

  return pad
}

function array_pop (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_pop/
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Theriault (https://github.com/Theriault)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: While IE (and other browsers) support iterating an object's
  //      note 1: own properties in order, if one attempts to add back properties
  //      note 1: in IE, they may end up in their former position due to their position
  //      note 1: being retained. So use of this function with "associative arrays"
  //      note 1: (objects) may lead to unexpected behavior in an IE environment if
  //      note 1: you add back properties with the same keys that you removed
  //   example 1: array_pop([0,1,2])
  //   returns 1: 2
  //   example 2: var $data = {firstName: 'Kevin', surName: 'van Zonneveld'}
  //   example 2: var $lastElem = array_pop($data)
  //   example 2: var $result = $data
  //   returns 2: {firstName: 'Kevin'}

  var key = ''
  var lastKey = ''

  if (inputArr.hasOwnProperty('length')) {
    // Indexed
    if (!inputArr.length) {
      // Done popping, are we?
      return null
    }
    return inputArr.pop()
  } else {
    // Associative
    for (key in inputArr) {
      if (inputArr.hasOwnProperty(key)) {
        lastKey = key
      }
    }
    if (lastKey) {
      var tmp = inputArr[lastKey]
      delete (inputArr[lastKey])
      return tmp
    } else {
      return null
    }
  }
}

function array_product (input) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_product/
  //   example 1: array_product([ 2, 4, 6, 8 ])
  //   returns 1: 384

  var idx = 0
  var product = 1
  var il = 0

  if (Object.prototype.toString.call(input) !== '[object Array]') {
    return null
  }

  il = input.length
  while (idx < il) {
    product *= (!isNaN(input[idx]) ? input[idx] : 0)
    idx++
  }

  return product
}

function array_push (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_push/
  //      note 1: Note also that IE retains information about property position even
  //      note 1: after being supposedly deleted, so if you delete properties and then
  //      note 1: add back properties with the same keys (including numeric) that had
  //      note 1: been deleted, the order will be as before; thus, this function is not
  //      note 1: really recommended with associative arrays (objects) in IE environments
  //   example 1: array_push(['kevin','van'], 'zonneveld')
  //   returns 1: 3

  var i = 0
  var pr = ''
  var argv = arguments
  var argc = argv.length
  var allDigits = /^\d$/
  var size = 0
  var highestIdx = 0
  var len = 0

  if (inputArr.hasOwnProperty('length')) {
    for (i = 1; i < argc; i++) {
      inputArr[inputArr.length] = argv[i]
    }
    return inputArr.length
  }

  // Associative (object)
  for (pr in inputArr) {
    if (inputArr.hasOwnProperty(pr)) {
      ++len
      if (pr.search(allDigits) !== -1) {
        size = parseInt(pr, 10)
        highestIdx = size > highestIdx ? size : highestIdx
      }
    }
  }
  for (i = 1; i < argc; i++) {
    inputArr[++highestIdx] = argv[i]
  }

  return len + i - 1
}

function array_rand (array, num) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/array_rand/
  //      original by: Waldo Malqui Silva (http://waldo.malqui.info)
  // reimplemented by: Rafał Kukawski
  //        example 1: array_rand( ['Kevin'], 1 )
  //        returns 1: '0'

  // By using Object.keys we support both, arrays and objects
  // which phpjs wants to support
  var keys = Object.keys(array)

  if (typeof num === 'undefined' || num === null) {
    num = 1
  } else {
    num = +num
  }

  if (isNaN(num) || num < 1 || num > keys.length) {
    return null
  }

  // shuffle the array of keys
  for (var i = keys.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)) // 0 ≤ j ≤ i

    var tmp = keys[j]
    keys[j] = keys[i]
    keys[i] = tmp
  }

  return num === 1 ? keys[0] : keys.slice(0, num)
}

function array_reduce (aInput, callback) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_reduce/
  //      note 1: Takes a function as an argument, not a function's name
  //   example 1: array_reduce([1, 2, 3, 4, 5], function (v, w){v += w;return v;})
  //   returns 1: 15

  var lon = aInput.length
  var res = 0
  var i = 0
  var tmp = []

  for (i = 0; i < lon; i += 2) {
    tmp[0] = aInput[i]
    if (aInput[(i + 1)]) {
      tmp[1] = aInput[(i + 1)]
    } else {
      tmp[1] = 0
    }
    res += callback.apply(null, tmp)
    tmp = []
  }

  return res
}

function array_replace (arr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_replace/
  //   example 1: array_replace(["orange", "banana", "apple", "raspberry"], {0 : "pineapple", 4 : "cherry"}, {0:"grape"})
  //   returns 1: {0: 'grape', 1: 'banana', 2: 'apple', 3: 'raspberry', 4: 'cherry'}

  var retObj = {}
  var i = 0
  var p = ''
  var argl = arguments.length

  if (argl < 2) {
    throw new Error('There should be at least 2 arguments passed to array_replace()')
  }

  // Although docs state that the arguments are passed in by reference,
  // it seems they are not altered, but rather the copy that is returned
  // (just guessing), so we make a copy here, instead of acting on arr itself
  for (p in arr) {
    retObj[p] = arr[p]
  }

  for (i = 1; i < argl; i++) {
    for (p in arguments[i]) {
      retObj[p] = arguments[i][p]
    }
  }

  return retObj
}

function array_replace_recursive (arr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_replace_recursive/
  //   example 1: array_replace_recursive({'citrus' : ['orange'], 'berries' : ['blackberry', 'raspberry']}, {'citrus' : ['pineapple'], 'berries' : ['blueberry']})
  //   returns 1: {citrus : ['pineapple'], berries : ['blueberry', 'raspberry']}

  var i = 0
  var p = ''
  var argl = arguments.length
  var retObj

  if (argl < 2) {
    throw new Error('There should be at least 2 arguments passed to array_replace_recursive()')
  }

  // Although docs state that the arguments are passed in by reference,
  // it seems they are not altered, but rather the copy that is returned
  // So we make a copy here, instead of acting on arr itself
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    retObj = []
    for (p in arr) {
      retObj.push(arr[p])
    }
  } else {
    retObj = {}
    for (p in arr) {
      retObj[p] = arr[p]
    }
  }

  for (i = 1; i < argl; i++) {
    for (p in arguments[i]) {
      if (retObj[p] && typeof retObj[p] === 'object') {
        retObj[p] = array_replace_recursive(retObj[p], arguments[i][p])
      } else {
        retObj[p] = arguments[i][p]
      }
    }
  }

  return retObj
}

function array_reverse (array, preserveKeys) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_reverse/
  //   example 1: array_reverse( [ 'php', '4.0', ['green', 'red'] ], true)
  //   returns 1: { 2: ['green', 'red'], 1: '4.0', 0: 'php'}

  var isArray = Object.prototype.toString.call(array) === '[object Array]'
  var tmpArr = preserveKeys ? {} : []
  var key

  if (isArray && !preserveKeys) {
    return array.slice(0).reverse()
  }

  if (preserveKeys) {
    var keys = []
    for (key in array) {
      keys.push(key)
    }

    var i = keys.length
    while (i--) {
      key = keys[i]
      // @todo: don't rely on browsers keeping keys in insertion order
      // it's implementation specific
      // eg. the result will differ from expected in Google Chrome
      tmpArr[key] = array[key]
    }
  } else {
    for (key in array) {
      tmpArr.unshift(array[key])
    }
  }

  return tmpArr
}

function array_search (needle, haystack, argStrict) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_search/
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Reynier de la Rosa (http://scriptinside.blogspot.com.es/)
  //        test: skip-all
  //   example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'})
  //   returns 1: 'surname'
  //   example 2: array_search('3', {a: 3, b: 5, c: 7})
  //   returns 2: 'a'

  var strict = !!argStrict
  var key = ''

  if (typeof needle === 'object' && needle.exec) {
    // Duck-type for RegExp
    if (!strict) {
      // Let's consider case sensitive searches as strict
      var flags = 'i' + (needle.global ? 'g' : '') +
        (needle.multiline ? 'm' : '') +
        // sticky is FF only
        (needle.sticky ? 'y' : '')
      needle = new RegExp(needle.source, flags)
    }
    for (key in haystack) {
      if (haystack.hasOwnProperty(key)) {
        if (needle.test(haystack[key])) {
          return key
        }
      }
    }
    return false
  }

  for (key in haystack) {
    if (haystack.hasOwnProperty(key)) {
      if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) { // eslint-disable-line eqeqeq
        return key
      }
    }
  }

  return false
}

function array_shift (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_shift/
  //      note 1: Currently does not handle objects
  //   example 1: array_shift(['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'Kevin'

  var _checkToUpIndices = function (arr, ct, key) {
    // Deal with situation, e.g., if encounter index 4 and try
    // to set it to 0, but 0 exists later in loop (need to
    // increment all subsequent (skipping current key, since
    // we need its value below) until find unused)
    if (arr[ct] !== undefined) {
      var tmp = ct
      ct += 1
      if (ct === key) {
        ct += 1
      }
      ct = _checkToUpIndices(arr, ct, key)
      arr[ct] = arr[tmp]
      delete arr[tmp]
    }

    return ct
  }

  if (inputArr.length === 0) {
    return null
  }
  if (inputArr.length > 0) {
    return inputArr.shift()
  }
}

function array_slice (arr, offst, lgth, preserveKeys) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_slice/
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      note 1: Relies on is_int because !isNaN accepts floats
  //   example 1: array_slice(["a", "b", "c", "d", "e"], 2, -1)
  //   returns 1: [ 'c', 'd' ]
  //   example 2: array_slice(["a", "b", "c", "d", "e"], 2, -1, true)
  //   returns 2: {2: 'c', 3: 'd'}

  var isInt = require('../var/is_int')

  /*
    if ('callee' in arr && 'length' in arr) {
      arr = Array.prototype.slice.call(arr);
    }
  */

  var key = ''

  if (Object.prototype.toString.call(arr) !== '[object Array]' || (preserveKeys && offst !== 0)) {
    // Assoc. array as input or if required as output
    var lgt = 0
    var newAssoc = {}
    for (key in arr) {
      lgt += 1
      newAssoc[key] = arr[key]
    }
    arr = newAssoc

    offst = (offst < 0) ? lgt + offst : offst
    lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth

    var assoc = {}
    var start = false
    var it = -1
    var arrlgth = 0
    var noPkIdx = 0

    for (key in arr) {
      ++it
      if (arrlgth >= lgth) {
        break
      }
      if (it === offst) {
        start = true
      }
      if (!start) {
        continue
      }++arrlgth
      if (isInt(key) && !preserveKeys) {
        assoc[noPkIdx++] = arr[key]
      } else {
        assoc[key] = arr[key]
      }
    }
    // Make as array-like object (though length will not be dynamic)
    // assoc.length = arrlgth;
    return assoc
  }

  if (lgth === undefined) {
    return arr.slice(offst)
  } else if (lgth >= 0) {
    return arr.slice(offst, offst + lgth)
  } else {
    return arr.slice(offst, lgth)
  }
}

function array_splice (arr, offst, lgth, replacement) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_splice/
  //    input by: Theriault (https://github.com/Theriault)
  //      note 1: Order does get shifted in associative array input with numeric indices,
  //      note 1: since PHP behavior doesn't preserve keys, but I understand order is
  //      note 1: not reliable anyways
  //      note 1: Note also that IE retains information about property position even
  //      note 1: after being supposedly deleted, so use of this function may produce
  //      note 1: unexpected results in IE if you later attempt to add back properties
  //      note 1: with the same keys that had been deleted
  //   example 1: var $input = {4: "red", 'abc': "green", 2: "blue", 'dud': "yellow"}
  //   example 1: array_splice($input, 2)
  //   returns 1: {4: "red", 'abc': "green"}
  //   example 2: var $input = ["red", "green", "blue", "yellow"]
  //   example 2: array_splice($input, 3, 0, "purple")
  //   returns 2: []
  //   example 3: var $input = ["red", "green", "blue", "yellow"]
  //   example 3: array_splice($input, -1, 1, ["black", "maroon"])
  //   returns 3: ["yellow"]
  //        test: skip-1

  var isInt = require('../var/is_int')

  var _checkToUpIndices = function (arr, ct, key) {
    // Deal with situation, e.g., if encounter index 4 and try
    // to set it to 0, but 0 exists later in loop (need to
    // increment all subsequent (skipping current key,
    // since we need its value below) until find unused)
    if (arr[ct] !== undefined) {
      var tmp = ct
      ct += 1
      if (ct === key) {
        ct += 1
      }
      ct = _checkToUpIndices(arr, ct, key)
      arr[ct] = arr[tmp]
      delete arr[tmp]
    }
    return ct
  }

  if (replacement && typeof replacement !== 'object') {
    replacement = [replacement]
  }
  if (lgth === undefined) {
    lgth = offst >= 0 ? arr.length - offst : -offst
  } else if (lgth < 0) {
    lgth = (offst >= 0 ? arr.length - offst : -offst) + lgth
  }

  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    /* if (arr.length !== undefined) {
     // Deal with array-like objects as input
    delete arr.length;
    } */
    var lgt = 0
    var ct = -1
    var rmvd = []
    var rmvdObj = {}
    var replCt = -1
    var intCt = -1
    var returnArr = true
    var rmvdCt = 0
    // var rmvdLngth = 0
    var key = ''
    // rmvdObj.length = 0;
    for (key in arr) {
      // Can do arr.__count__ in some browsers
      lgt += 1
    }
    offst = (offst >= 0) ? offst : lgt + offst
    for (key in arr) {
      ct += 1
      if (ct < offst) {
        if (isInt(key)) {
          intCt += 1
          if (parseInt(key, 10) === intCt) {
            // Key is already numbered ok, so don't need to change key for value
            continue
          }
          // Deal with situation, e.g.,
          _checkToUpIndices(arr, intCt, key)
          // if encounter index 4 and try to set it to 0, but 0 exists later in loop
          arr[intCt] = arr[key]
          delete arr[key]
        }
        continue
      }
      if (returnArr && isInt(key)) {
        rmvd.push(arr[key])
        // PHP starts over here too
        rmvdObj[rmvdCt++] = arr[key]
      } else {
        rmvdObj[key] = arr[key]
        returnArr = false
      }
      // rmvdLngth += 1
      // rmvdObj.length += 1;
      if (replacement && replacement[++replCt]) {
        arr[key] = replacement[replCt]
      } else {
        delete arr[key]
      }
    }
    // Make (back) into an array-like object
    // arr.length = lgt - rmvdLngth + (replacement ? replacement.length : 0);
    return returnArr ? rmvd : rmvdObj
  }

  if (replacement) {
    replacement.unshift(offst, lgth)
    return Array.prototype.splice.apply(arr, replacement)
  }

  return arr.splice(offst, lgth)
}

function array_sum (array) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_sum/
  // bugfixed by: Nate
  // bugfixed by: Gilbert
  //   example 1: array_sum([4, 9, 182.6])
  //   returns 1: 195.6
  //   example 2: var $total = []
  //   example 2: var $index = 0.1
  //   example 2: for (var $y = 0; $y < 12; $y++){ $total[$y] = $y + $index }
  //   example 2: array_sum($total)
  //   returns 2: 67.2

  var key
  var sum = 0

  // input sanitation
  if (typeof array !== 'object') {
    return null
  }

  for (key in array) {
    if (!isNaN(parseFloat(array[key]))) {
      sum += parseFloat(array[key])
    }
  }

  return sum
}

function array_udiff (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_udiff/
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_udiff($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {c: 'blue'}

  var retArr = {}
  var arglm1 = arguments.length - 1
  var cb = arguments[arglm1]
  var arr = ''
  var i = 1
  var k1 = ''
  var k = ''

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb(arr[k], arr1[k1]) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_udiff_assoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_udiff_assoc/
  //   example 1: array_udiff_assoc({0: 'kevin', 1: 'van', 2: 'Zonneveld'}, {0: 'Kevin', 4: 'van', 5: 'Zonneveld'}, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {1: 'van', 2: 'Zonneveld'}

  var retArr = {}
  var arglm1 = arguments.length - 1
  var cb = arguments[arglm1]
  var arr = {}
  var i = 1
  var k1 = ''
  var k = ''

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm1; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (cb(arr[k], arr1[k1]) === 0 && k === k1) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_udiff_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_udiff_uassoc/
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_udiff_uassoc($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;}, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {0: 'red', c: 'blue'}

  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  cb0 = (typeof cb0 === 'string')
    ? $global[cb0]
    : (Object.prototype.toString.call(cb0) === '[object Array]')
      ? $global[cb0[0]][cb0[1]]
      : cb0

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    for (i = 1; i < arglm2; i++) {
      arr = arguments[i]
      for (k in arr) {
        if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
          // If it reaches here, it was found in at least one array, so try next value
          continue arr1keys // eslint-disable-line no-labels
        }
      }
      retArr[k1] = arr1[k1]
    }
  }

  return retArr
}

function array_uintersect (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_uintersect/
  // bugfixed by: Demosthenes Koptsis
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_uintersect($array1, $array2, function( f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {a: 'green', b: 'brown', 0: 'red'}

  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var k1 = ''
  var i = 1
  var arr = {}
  var k = ''

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm1; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb(arr[k], arr1[k1]) === 0) {
          if (i === arglm2) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }

  return retArr
}

function array_uintersect_uassoc (arr1) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_uintersect_uassoc/
  //   example 1: var $array1 = {a: 'green', b: 'brown', c: 'blue', 0: 'red'}
  //   example 1: var $array2 = {a: 'GREEN', B: 'brown', 0: 'yellow', 1: 'red'}
  //   example 1: array_uintersect_uassoc($array1, $array2, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;}, function (f_string1, f_string2){var string1 = (f_string1+'').toLowerCase(); var string2 = (f_string2+'').toLowerCase(); if (string1 > string2) return 1; if (string1 === string2) return 0; return -1;})
  //   returns 1: {a: 'green', b: 'brown'}

  var retArr = {}
  var arglm1 = arguments.length - 1
  var arglm2 = arglm1 - 1
  var cb = arguments[arglm1]
  var cb0 = arguments[arglm2]
  var k1 = ''
  var i = 1
  var k = ''
  var arr = {}

  var $global = (typeof window !== 'undefined' ? window : global)

  cb = (typeof cb === 'string')
    ? $global[cb]
    : (Object.prototype.toString.call(cb) === '[object Array]')
      ? $global[cb[0]][cb[1]]
      : cb

  cb0 = (typeof cb0 === 'string')
    ? $global[cb0]
    : (Object.prototype.toString.call(cb0) === '[object Array]')
      ? $global[cb0[0]][cb0[1]]
      : cb0

  arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
    arrs: for (i = 1; i < arglm2; i++) { // eslint-disable-line no-labels
      arr = arguments[i]
      for (k in arr) {
        if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
          if (i === arguments.length - 3) {
            retArr[k1] = arr1[k1]
          }
          // If the innermost loop always leads at least once to an equal value,
          // continue the loop until done
          continue arrs // eslint-disable-line no-labels
        }
      }
      // If it reaches here, it wasn't found in at least one array, so try next value
      continue arr1keys // eslint-disable-line no-labels
    }
  }

  return retArr
}

function array_unique (inputArr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_unique/
  //    input by: duncan
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Nate
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: The second argument, sort_flags is not implemented;
  //      note 1: also should be sorted (asort?) first according to docs
  //   example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin'])
  //   returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
  //   example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'})
  //   returns 2: {a: 'green', 0: 'red', 1: 'blue'}

  var key = ''
  var tmpArr2 = {}
  var val = ''

  var _arraySearch = function (needle, haystack) {
    var fkey = ''
    for (fkey in haystack) {
      if (haystack.hasOwnProperty(fkey)) {
        if ((haystack[fkey] + '') === (needle + '')) {
          return fkey
        }
      }
    }
    return false
  }

  for (key in inputArr) {
    if (inputArr.hasOwnProperty(key)) {
      val = inputArr[key]
      if (_arraySearch(val, tmpArr2) === false) {
        tmpArr2[key] = val
      }
    }
  }

  return tmpArr2
}

function array_unshift (array) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_unshift/
  //      note 1: Currently does not handle objects
  //   example 1: array_unshift(['van', 'Zonneveld'], 'Kevin')
  //   returns 1: 3

  var i = arguments.length

  while (--i !== 0) {
    arguments[0].unshift(arguments[i])
  }

  return arguments[0].length
}

function array_values (input) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_values/
  //   example 1: array_values( {firstname: 'Kevin', surname: 'van Zonneveld'} )
  //   returns 1: [ 'Kevin', 'van Zonneveld' ]

  var tmpArr = []
  var key = ''

  for (key in input) {
    tmpArr[tmpArr.length] = input[key]
  }

  return tmpArr
}

function array_walk (array, funcname, userdata) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/array_walk/
  // bugfixed by: David
  //      note 1: Only works with user-defined functions, not built-in functions like void()
  //   example 1: array_walk ([3, 4], function () {}, 'userdata')
  //   returns 1: true
  //   example 2: array_walk ('mystring', function () {})
  //   returns 2: false
  //   example 3: array_walk ({"title":"my title"}, function () {})
  //   returns 3: true

  if (!array || typeof array !== 'object') {
    return false
  }

  try {
    if (typeof funcname === 'function') {
      for (var key in array) {
        if (arguments.length > 2) {
          funcname(array[key], key, userdata)
        } else {
          funcname(array[key], key)
        }
      }
    } else {
      return false
    }
  } catch (e) {
    return false
  }

  return true
}

function array_walk_recursive (array, funcname, userdata) { // eslint-disable-line camelcase
  //      note 1: Only works with user-defined functions, not built-in functions like void()
  //   example 1: array_walk_recursive([3, 4], function () {}, 'userdata')
  //   returns 1: true
  //   example 2: array_walk_recursive([3, [4]], function () {}, 'userdata')
  //   returns 2: true
  //   example 3: array_walk_recursive([3, []], function () {}, 'userdata')
  //   returns 3: true

  if (!array || typeof array !== 'object') {
    return false
  }

  if (typeof funcname !== 'function') {
    return false
  }

  for (var key in array) {
    // apply "funcname" recursively only on arrays
    if (Object.prototype.toString.call(array[key]) === '[object Array]') {
      var funcArgs = [array[key], funcname]
      if (arguments.length > 2) {
        funcArgs.push(userdata)
      }
      if (array_walk_recursive.apply(null, funcArgs) === false) {
        return false
      }
      continue
    }
    try {
      if (arguments.length > 2) {
        funcname(array[key], key, userdata)
      } else {
        funcname(array[key], key)
      }
    } catch (e) {
      return false
    }
  }

  return true
}

function arsort (inputArr, sortFlags) {
  //  discuss at: http://locutus.io/php/arsort/
  //      note 1: SORT_STRING (as well as natsort and natcasesort) might also be
  //      note 1: integrated into all of these functions by adapting the code at
  //      note 1: http://sourcefrog.net/projects/natsort/natcompare.js
  //      note 1: The examples are correct, this is a new way
  //      note 1: Credits to: http://javascript.internet.com/math-related/bubble-sort.html
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //      note 1: Since JS objects' keys are always strings, and (the
  //      note 1: default) SORT_REGULAR flag distinguishes by key type,
  //      note 1: if the content is a numeric string, we treat the
  //      note 1: "original type" as numeric.
  //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 1: arsort($data)
  //   example 1: var $result = $data
  //   returns 1: {a: 'orange', d: 'lemon', b: 'banana', c: 'apple'}
  //   example 2: ini_set('locutus.sortByReference', true)
  //   example 2: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 2: arsort($data)
  //   example 2: var $result = $data
  //   returns 2: {a: 'orange', d: 'lemon', b: 'banana', c: 'apple'}
  //        test: skip-1

  var i18lgd = require('../i18n/i18n_loc_get_default')
  var strnatcmp = require('../strings/strnatcmp')
  var valArr = []
  var valArrLen = 0
  var k
  var i
  var sorter
  var sortByReference = false
  var populateArr = {}

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  switch (sortFlags) {
    case 'SORT_STRING':
      // compare items as strings
      sorter = function (a, b) {
        return strnatcmp(b, a)
      }
      break
    case 'SORT_LOCALE_STRING':
      // compare items as strings, based on the current locale
      // (set with i18n_loc_set_default() as of PHP6)
      var loc = i18lgd()
      sorter = $locutus.php.locales[loc].sorting
      break
    case 'SORT_NUMERIC':
      // compare items numerically
      sorter = function (a, b) {
        return (a - b)
      }
      break
    case 'SORT_REGULAR':
      // compare items normally (don't change types)
      break
    default:
      sorter = function (b, a) {
        var aFloat = parseFloat(a)
        var bFloat = parseFloat(b)
        var aNumeric = aFloat + '' === a
        var bNumeric = bFloat + '' === b

        if (aNumeric && bNumeric) {
          return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
        } else if (aNumeric && !bNumeric) {
          return 1
        } else if (!aNumeric && bNumeric) {
          return -1
        }

        return a > b ? 1 : a < b ? -1 : 0
      }
      break
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'

  // Get key and value arrays
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      valArr.push([k, inputArr[k]])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }
  valArr.sort(function (a, b) {
    return sorter(a[1], b[1])
  })

  // Repopulate the old array
  for (i = 0, valArrLen = valArr.length; i < valArrLen; i++) {
    populateArr[valArr[i][0]] = valArr[i][1]
    if (sortByReference) {
      inputArr[valArr[i][0]] = valArr[i][1]
    }
  }

  return sortByReference || populateArr
}


function asort (inputArr, sortFlags) {
  //  discuss at: http://locutus.io/php/asort/
  //    input by: paulo kuong
  // bugfixed by: Adam Wallner (http://web2.bitbaro.hu/)
  //      note 1: SORT_STRING (as well as natsort and natcasesort) might also be
  //      note 1: integrated into all of these functions by adapting the code at
  //      note 1: http://sourcefrog.net/projects/natsort/natcompare.js
  //      note 1: The examples are correct, this is a new way
  //      note 1: Credits to: http://javascript.internet.com/math-related/bubble-sort.html
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //      note 1: Since JS objects' keys are always strings, and (the
  //      note 1: default) SORT_REGULAR flag distinguishes by key type,
  //      note 1: if the content is a numeric string, we treat the
  //      note 1: "original type" as numeric.
  //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 1: asort($data)
  //   example 1: var $result = $data
  //   returns 1: {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}
  //   example 2: ini_set('locutus.sortByReference', true)
  //   example 2: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 2: asort($data)
  //   example 2: var $result = $data
  //   returns 2: {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}

  var strnatcmp = require('../strings/strnatcmp')
  var i18nlgd = require('../i18n/i18n_loc_get_default')

  var valArr = []
  var valArrLen = 0
  var k
  var i
  var sorter
  var sortByReference = false
  var populateArr = {}

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  switch (sortFlags) {
    case 'SORT_STRING':
      // compare items as strings
      sorter = function (a, b) {
        return strnatcmp(a, b)
      }
      break
    case 'SORT_LOCALE_STRING':
      // compare items as strings, based on the current locale
      // (set with i18n_loc_set_default() as of PHP6)
      var loc = i18nlgd()
      sorter = $locutus.php.locales[loc].sorting
      break
    case 'SORT_NUMERIC':
      // compare items numerically
      sorter = function (a, b) {
        return (a - b)
      }
      break
    case 'SORT_REGULAR':
      // compare items normally (don't change types)
      break
    default:
      sorter = function (a, b) {
        var aFloat = parseFloat(a)
        var bFloat = parseFloat(b)
        var aNumeric = aFloat + '' === a
        var bNumeric = bFloat + '' === b
        if (aNumeric && bNumeric) {
          return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
        } else if (aNumeric && !bNumeric) {
          return 1
        } else if (!aNumeric && bNumeric) {
          return -1
        }
        return a > b ? 1 : a < b ? -1 : 0
      }
      break
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  // Get key and value arrays
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      valArr.push([k, inputArr[k]])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }

  valArr.sort(function (a, b) {
    return sorter(a[1], b[1])
  })

  // Repopulate the old array
  for (i = 0, valArrLen = valArr.length; i < valArrLen; i++) {
    populateArr[valArr[i][0]] = valArr[i][1]
  }

  return sortByReference || populateArr
}

function count (mixedVar, mode) {
  //  discuss at: http://locutus.io/php/count/
  //    input by: Waldo Malqui Silva (http://waldo.malqui.info)
  //    input by: merabi
  // bugfixed by: Soren Hansen
  // bugfixed by: Olivier Louvignes (http://mg-crea.com/)
  //   example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE')
  //   returns 1: 6
  //   example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE')
  //   returns 2: 6

  var key
  var cnt = 0

  if (mixedVar === null || typeof mixedVar === 'undefined') {
    return 0
  } else if (mixedVar.constructor !== Array && mixedVar.constructor !== Object) {
    return 1
  }

  if (mode === 'COUNT_RECURSIVE') {
    mode = 1
  }
  if (mode !== 1) {
    mode = 0
  }

  for (key in mixedVar) {
    if (mixedVar.hasOwnProperty(key)) {
      cnt++
      if (mode === 1 && mixedVar[key] &&
        (mixedVar[key].constructor === Array ||
          mixedVar[key].constructor === Object)) {
        cnt += count(mixedVar[key], 1)
      }
    }
  }

  return cnt
}

function current (arr) {
  //  discuss at: http://locutus.io/php/current/
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $transport = ['foot', 'bike', 'car', 'plane']
  //   example 1: current($transport)
  //   returns 1: 'foot'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers

  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }
  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    return arr[cursor] || false
  }
  var ct = 0
  for (var k in arr) {
    if (ct === cursor) {
      return arr[k]
    }
    ct++
  }
  // Empty
  return false
}

function each (arr) {
  //  discuss at: http://locutus.io/php/each/
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: each({a: "apple", b: "balloon"})
  //   returns 1: {0: "a", 1: "apple", key: "a", value: "apple"}

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers

  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }

  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  var pos = 0

  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor) {
        pointers[arrpos + 1] += 1
        if (each.returnArrayOnly) {
          return [k, arr[k]]
        } else {
          return {
            1: arr[k],
            value: arr[k],
            0: k,
            key: k
          }
        }
      }
      ct++
    }
    // Empty
    return false
  }
  if (arr.length === 0 || cursor === arr.length) {
    return false
  }
  pos = cursor
  pointers[arrpos + 1] += 1
  if (each.returnArrayOnly) {
    return [pos, arr[pos]]
  } else {
    return {
      1: arr[pos],
      value: arr[pos],
      0: pos,
      key: pos
    }
  }
}

function end (arr) {
  //  discuss at: http://locutus.io/php/end/
  // bugfixed by: Legaev Andrey
  //  revised by: J A R
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: end({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 1: 'Zonneveld'
  //   example 2: end(['Kevin', 'van', 'Zonneveld'])
  //   returns 2: 'Zonneveld'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers

  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }

  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    var val
    for (var k in arr) {
      ct++
      val = arr[k]
    }
    if (ct === 0) {
      // Empty
      return false
    }
    pointers[arrpos + 1] = ct - 1
    return val
  }
  if (arr.length === 0) {
    return false
  }
  pointers[arrpos + 1] = arr.length - 1
  return arr[pointers[arrpos + 1]]
}

function in_array (needle, haystack, argStrict) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/in_array/
  //    input by: Billy
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: in_array('van', ['Kevin', 'van', 'Zonneveld'])
  //   returns 1: true
  //   example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'})
  //   returns 2: false
  //   example 3: in_array(1, ['1', '2', '3'])
  //   example 3: in_array(1, ['1', '2', '3'], false)
  //   returns 3: true
  //   returns 3: true
  //   example 4: in_array(1, ['1', '2', '3'], true)
  //   returns 4: false

  var key = ''
  var strict = !!argStrict

  // we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] === ndl)
  // in just one for, in order to improve the performance
  // deciding wich type of comparation will do before walk array
  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) { // eslint-disable-line eqeqeq
        return true
      }
    }
  }

  return false
}

function key (arr) {
  //  discuss at: http://locutus.io/php/key/
  //    input by: Riddler (http://www.frontierwebdev.com/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $array = {fruit1: 'apple', 'fruit2': 'orange'}
  //   example 1: key($array)
  //   returns 1: 'fruit1'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers

  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }

  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }

  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var cursor = pointers[pointers.indexOf(arr) + 1]
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor) {
        return k
      }
      ct++
    }
    // Empty
    return false
  }
  if (arr.length === 0) {
    return false
  }

  return cursor
}

function krsort (inputArr, sortFlags) {
  //  discuss at: http://locutus.io/php/krsort/
  // bugfixed by: pseudaria (https://github.com/pseudaria)
  //      note 1: The examples are correct, this is a new way
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //      note 1: Since JS objects' keys are always strings, and (the
  //      note 1: default) SORT_REGULAR flag distinguishes by key type,
  //      note 1: if the content is a numeric string, we treat the
  //      note 1: "original type" as numeric.
  //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 1: krsort($data)
  //   example 1: var $result = $data
  //   returns 1: {d: 'lemon', c: 'apple', b: 'banana', a: 'orange'}
  //   example 2: ini_set('locutus.sortByReference', true)
  //   example 2: var $data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'}
  //   example 2: krsort($data)
  //   example 2: var $result = $data
  //   returns 2: {3: 'Zonneveld', 2: 'van', 1: 'Kevin'}

  var i18nlgd = require('../i18n/i18n_loc_get_default')
  var strnatcmp = require('../strings/strnatcmp')

  var tmpArr = {}
  var keys = []
  var sorter
  var i
  var k
  var sortByReference = false
  var populateArr = {}

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  switch (sortFlags) {
    case 'SORT_STRING':
      // compare items as strings
      sorter = function (a, b) {
        return strnatcmp(b, a)
      }
      break
    case 'SORT_LOCALE_STRING':
      // compare items as strings, based on the current locale
      // (set with i18n_loc_set_default() as of PHP6)
      var loc = i18nlgd()
      sorter = $locutus.locales[loc].sorting
      break
    case 'SORT_NUMERIC':
      // compare items numerically
      sorter = function (a, b) {
        return (b - a)
      }
      break
    case 'SORT_REGULAR':
    default:
      // compare items normally (don't change types)
      sorter = function (b, a) {
        var aFloat = parseFloat(a)
        var bFloat = parseFloat(b)
        var aNumeric = aFloat + '' === a
        var bNumeric = bFloat + '' === b
        if (aNumeric && bNumeric) {
          return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
        } else if (aNumeric && !bNumeric) {
          return 1
        } else if (!aNumeric && bNumeric) {
          return -1
        }
        return a > b ? 1 : a < b ? -1 : 0
      }
      break
  }

  // Make a list of key names
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      keys.push(k)
    }
  }
  keys.sort(sorter)

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  // Rebuild array with sorted key names
  for (i = 0; i < keys.length; i++) {
    k = keys[i]
    tmpArr[k] = inputArr[k]
    if (sortByReference) {
      delete inputArr[k]
    }
  }
  for (i in tmpArr) {
    if (tmpArr.hasOwnProperty(i)) {
      populateArr[i] = tmpArr[i]
    }
  }

  return sortByReference || populateArr
}

function ksort (inputArr, sortFlags) {
  //  discuss at: http://locutus.io/php/ksort/
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //      note 1: Since JS objects' keys are always strings, and (the
  //      note 1: default) SORT_REGULAR flag distinguishes by key type,
  //      note 1: if the content is a numeric string, we treat the
  //      note 1: "original type" as numeric.
  //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 1: ksort($data)
  //   example 1: var $result = $data
  //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
  //   example 2: ini_set('locutus.sortByReference', true)
  //   example 2: var $data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'}
  //   example 2: ksort($data)
  //   example 2: var $result = $data
  //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}

  var i18nlgd = require('../i18n/i18n_loc_get_default')
  var strnatcmp = require('../strings/strnatcmp')

  var tmpArr = {}
  var keys = []
  var sorter
  var i
  var k
  var sortByReference = false
  var populateArr = {}

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  switch (sortFlags) {
    case 'SORT_STRING':
      // compare items as strings
      sorter = function (a, b) {
        return strnatcmp(b, a)
      }
      break
    case 'SORT_LOCALE_STRING':
      // compare items as strings, based on the current locale
      // (set with i18n_loc_set_default() as of PHP6)
      var loc = i18nlgd()
      sorter = $locutus.locales[loc].sorting
      break
    case 'SORT_NUMERIC':
      // compare items numerically
      sorter = function (a, b) {
        return ((a + 0) - (b + 0))
      }
      break
    default:
      // case 'SORT_REGULAR': // compare items normally (don't change types)
      sorter = function (a, b) {
        var aFloat = parseFloat(a)
        var bFloat = parseFloat(b)
        var aNumeric = aFloat + '' === a
        var bNumeric = bFloat + '' === b
        if (aNumeric && bNumeric) {
          return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
        } else if (aNumeric && !bNumeric) {
          return 1
        } else if (!aNumeric && bNumeric) {
          return -1
        }
        return a > b ? 1 : a < b ? -1 : 0
      }
      break
  }

  // Make a list of key names
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      keys.push(k)
    }
  }
  keys.sort(sorter)

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  // Rebuild array with sorted key names
  for (i = 0; i < keys.length; i++) {
    k = keys[i]
    tmpArr[k] = inputArr[k]
    if (sortByReference) {
      delete inputArr[k]
    }
  }
  for (i in tmpArr) {
    if (tmpArr.hasOwnProperty(i)) {
      populateArr[i] = tmpArr[i]
    }
  }

  return sortByReference || populateArr
}

function natcasesort (inputArr) {
  //  discuss at: http://locutus.io/php/natcasesort/
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //      note 1: We cannot use numbers as keys and have them be reordered since they
  //      note 1: adhere to numerical order in some implementations
  //   example 1: var $array1 = {a:'IMG0.png', b:'img12.png', c:'img10.png', d:'img2.png', e:'img1.png', f:'IMG3.png'}
  //   example 1: natcasesort($array1)
  //   example 1: var $result = $array1
  //   returns 1: {a: 'IMG0.png', e: 'img1.png', d: 'img2.png', f: 'IMG3.png', c: 'img10.png', b: 'img12.png'}

  var strnatcasecmp = require('../strings/strnatcasecmp')
  var valArr = []
  var k
  var i
  var sortByReference = false
  var populateArr = {}

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  // Get key and value arrays
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      valArr.push([k, inputArr[k]])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }
  valArr.sort(function (a, b) {
    return strnatcasecmp(a[1], b[1])
  })

  // Repopulate the old array
  for (i = 0; i < valArr.length; i++) {
    populateArr[valArr[i][0]] = valArr[i][1]
  }

  return sortByReference || populateArr
}

function natsort (inputArr) {
  //  discuss at: http://locutus.io/php/natsort/
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //   example 1: var $array1 = {a:"img12.png", b:"img10.png", c:"img2.png", d:"img1.png"}
  //   example 1: natsort($array1)
  //   example 1: var $result = $array1
  //   returns 1: {d: 'img1.png', c: 'img2.png', b: 'img10.png', a: 'img12.png'}

  var strnatcmp = require('../strings/strnatcmp')

  var valArr = []
  var k
  var i
  var sortByReference = false
  var populateArr = {}

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  // Get key and value arrays
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      valArr.push([k, inputArr[k]])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }
  valArr.sort(function (a, b) {
    return strnatcmp(a[1], b[1])
  })

  // Repopulate the old array
  for (i = 0; i < valArr.length; i++) {
    populateArr[valArr[i][0]] = valArr[i][1]
  }

  return sortByReference || populateArr
}

function next (arr) {
  //  discuss at: http://locutus.io/php/next/
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $transport = ['foot', 'bike', 'car', 'plane']
  //   example 1: next($transport)
  //   example 1: next($transport)
  //   returns 1: 'car'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers

  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }

  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor + 1) {
        pointers[arrpos + 1] += 1
        return arr[k]
      }
      ct++
    }
    // End
    return false
  }
  if (arr.length === 0 || cursor === (arr.length - 1)) {
    return false
  }
  pointers[arrpos + 1] += 1
  return arr[pointers[arrpos + 1]]
}

function pos (arr) {
  //  discuss at: http://locutus.io/php/pos/
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $transport = ['foot', 'bike', 'car', 'plane']
  //   example 1: pos($transport)
  //   returns 1: 'foot'

  var current = require('../array/current')
  return current(arr)
}

function prev (arr) {
  //  discuss at: http://locutus.io/php/prev/
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: var $transport = ['foot', 'bike', 'car', 'plane']
  //   example 1: prev($transport)
  //   returns 1: false

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers

  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }

  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  var arrpos = pointers.indexOf(arr)
  var cursor = pointers[arrpos + 1]
  if (pointers.indexOf(arr) === -1 || cursor === 0) {
    return false
  }
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    var ct = 0
    for (var k in arr) {
      if (ct === cursor - 1) {
        pointers[arrpos + 1] -= 1
        return arr[k]
      }
      ct++
    }
    // Shouldn't reach here
  }
  if (arr.length === 0) {
    return false
  }
  pointers[arrpos + 1] -= 1
  return arr[pointers[arrpos + 1]]
}

function range (low, high, step) {
  //  discuss at: http://locutus.io/php/range/
  //   example 1: range ( 0, 12 )
  //   returns 1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  //   example 2: range( 0, 100, 10 )
  //   returns 2: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  //   example 3: range( 'a', 'i' )
  //   returns 3: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
  //   example 4: range( 'c', 'a' )
  //   returns 4: ['c', 'b', 'a']

  var matrix = []
  var iVal
  var endval
  var plus
  var walker = step || 1
  var chars = false

  if (!isNaN(low) && !isNaN(high)) {
    iVal = low
    endval = high
  } else if (isNaN(low) && isNaN(high)) {
    chars = true
    iVal = low.charCodeAt(0)
    endval = high.charCodeAt(0)
  } else {
    iVal = (isNaN(low) ? 0 : low)
    endval = (isNaN(high) ? 0 : high)
  }

  plus = !(iVal > endval)
  if (plus) {
    while (iVal <= endval) {
      matrix.push(((chars) ? String.fromCharCode(iVal) : iVal))
      iVal += walker
    }
  } else {
    while (iVal >= endval) {
      matrix.push(((chars) ? String.fromCharCode(iVal) : iVal))
      iVal -= walker
    }
  }

  return matrix
}

function reset (arr) {
  //  discuss at: http://locutus.io/php/reset/
  // bugfixed by: Legaev Andrey
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Uses global: locutus to store the array pointer
  //   example 1: reset({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 1: 'Kevin'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.pointers = $locutus.php.pointers || []
  var pointers = $locutus.php.pointers

  var indexOf = function (value) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === value) {
        return i
      }
    }
    return -1
  }

  if (!pointers.indexOf) {
    pointers.indexOf = indexOf
  }
  if (pointers.indexOf(arr) === -1) {
    pointers.push(arr, 0)
  }
  var arrpos = pointers.indexOf(arr)
  if (Object.prototype.toString.call(arr) !== '[object Array]') {
    for (var k in arr) {
      if (pointers.indexOf(arr) === -1) {
        pointers.push(arr, 0)
      } else {
        pointers[arrpos + 1] = 0
      }
      return arr[k]
    }
    // Empty
    return false
  }
  if (arr.length === 0) {
    return false
  }
  pointers[arrpos + 1] = 0
  return arr[pointers[arrpos + 1]]
}

function rsort (inputArr, sortFlags) {
  //  discuss at: http://locutus.io/php/rsort/
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: SORT_STRING (as well as natsort and natcasesort) might also be
  //      note 1: integrated into all of these functions by adapting the code at
  //      note 1: http://sourcefrog.net/projects/natsort/natcompare.js
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //      note 1: Since JS objects' keys are always strings, and (the
  //      note 1: default) SORT_REGULAR flag distinguishes by key type,
  //      note 1: if the content is a numeric string, we treat the
  //      note 1: "original type" as numeric.
  //   example 1: var $arr = ['Kevin', 'van', 'Zonneveld']
  //   example 1: rsort($arr)
  //   example 1: var $result = $arr
  //   returns 1: ['van', 'Zonneveld', 'Kevin']
  //   example 2: ini_set('locutus.sortByReference', true)
  //   example 2: var $fruits = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 2: rsort($fruits)
  //   example 2: var $result = $fruits
  //   returns 2: {0: 'orange', 1: 'lemon', 2: 'banana', 3: 'apple'}
  //        test: skip-1

  var i18nlgd = require('../i18n/i18n_loc_get_default')
  var strnatcmp = require('../strings/strnatcmp')

  var sorter
  var i
  var k
  var sortByReference = false
  var populateArr = {}

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  switch (sortFlags) {
    case 'SORT_STRING':
      // compare items as strings
      sorter = function (a, b) {
        return strnatcmp(b, a)
      }
      break
    case 'SORT_LOCALE_STRING':
      // compare items as strings, based on the current locale
      // (set with i18n_loc_set_default() as of PHP6)
      var loc = i18nlgd()
      sorter = $locutus.locales[loc].sorting
      break
    case 'SORT_NUMERIC':
      // compare items numerically
      sorter = function (a, b) {
        return (b - a)
      }
      break
    case 'SORT_REGULAR':
    default:
      // compare items normally (don't change types)
      sorter = function (b, a) {
        var aFloat = parseFloat(a)
        var bFloat = parseFloat(b)
        var aNumeric = aFloat + '' === a
        var bNumeric = bFloat + '' === b
        if (aNumeric && bNumeric) {
          return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
        } else if (aNumeric && !bNumeric) {
          return 1
        } else if (!aNumeric && bNumeric) {
          return -1
        }
        return a > b ? 1 : a < b ? -1 : 0
      }
      break
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr
  var valArr = []

  for (k in inputArr) {
    // Get key and value arrays
    if (inputArr.hasOwnProperty(k)) {
      valArr.push(inputArr[k])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }

  valArr.sort(sorter)

  for (i = 0; i < valArr.length; i++) {
    // Repopulate the old array
    populateArr[i] = valArr[i]
  }

  return sortByReference || populateArr
}

function shuffle (inputArr) {
  //  discuss at: http://locutus.io/php/shuffle/
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $data = {5:'a', 2:'3', 3:'c', 4:5, 'q':5}
  //   example 1: ini_set('locutus.sortByReference', true)
  //   example 1: shuffle($data)
  //   example 1: var $result = $data.q
  //   returns 1: 5

  var valArr = []
  var k = ''
  var i = 0
  var sortByReference = false
  var populateArr = []

  for (k in inputArr) {
    // Get key and value arrays
    if (inputArr.hasOwnProperty(k)) {
      valArr.push(inputArr[k])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }
  valArr.sort(function () {
    return 0.5 - Math.random()
  })

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  for (i = 0; i < valArr.length; i++) {
    // Repopulate the old array
    populateArr[i] = valArr[i]
  }

  return sortByReference || populateArr
}

function sizeof (mixedVar, mode) {
  //  discuss at: http://locutus.io/php/sizeof/
  //   example 1: sizeof([[0,0],[0,-4]], 'COUNT_RECURSIVE')
  //   returns 1: 6
  //   example 2: sizeof({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE')
  //   returns 2: 6

  var count = require('../array/count')

  return count(mixedVar, mode)
}

function sort (inputArr, sortFlags) {
  //  discuss at: http://locutus.io/php/sort/
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: SORT_STRING (as well as natsort and natcasesort) might also be
  //      note 1: integrated into all of these functions by adapting the code at
  //      note 1: http://sourcefrog.net/projects/natsort/natcompare.js
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //      note 1: Since JS objects' keys are always strings, and (the
  //      note 1: default) SORT_REGULAR flag distinguishes by key type,
  //      note 1: if the content is a numeric string, we treat the
  //      note 1: "original type" as numeric.
  //   example 1: var $arr = ['Kevin', 'van', 'Zonneveld']
  //   example 1: sort($arr)
  //   example 1: var $result = $arr
  //   returns 1: ['Kevin', 'Zonneveld', 'van']
  //   example 2: ini_set('locutus.sortByReference', true)
  //   example 2: var $fruits = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 2: sort($fruits)
  //   example 2: var $result = $fruits
  //   returns 2: {0: 'apple', 1: 'banana', 2: 'lemon', 3: 'orange'}
  //        test: skip-1

  var i18nlgd = require('../i18n/i18n_loc_get_default')

  var sorter
  var i
  var k
  var sortByReference = false
  var populateArr = {}

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  switch (sortFlags) {
    case 'SORT_STRING':
      // compare items as strings
      // leave sorter undefined, so built-in comparison is used
      break
    case 'SORT_LOCALE_STRING':
      // compare items as strings, based on the current locale
      // (set with i18n_loc_set_default() as of PHP6)
      var loc = $locutus.php.locales[i18nlgd()]

      if (loc && loc.sorting) {
        // if sorting exists on locale object, use it
        // otherwise let sorter be undefined
        // to fallback to built-in behavior
        sorter = loc.sorting
      }
      break
    case 'SORT_NUMERIC':
      // compare items numerically
      sorter = function (a, b) {
        return (a - b)
      }
      break
    case 'SORT_REGULAR':
    default:
      sorter = function (a, b) {
        var aFloat = parseFloat(a)
        var bFloat = parseFloat(b)
        var aNumeric = aFloat + '' === a
        var bNumeric = bFloat + '' === b

        if (aNumeric && bNumeric) {
          return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0
        } else if (aNumeric && !bNumeric) {
          return 1
        } else if (!aNumeric && bNumeric) {
          return -1
        }

        return a > b ? 1 : a < b ? -1 : 0
      }
      break
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  var valArr = []
  for (k in inputArr) {
    // Get key and value arrays
    if (inputArr.hasOwnProperty(k)) {
      valArr.push(inputArr[k])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }

  valArr.sort(sorter)

  for (i = 0; i < valArr.length; i++) {
    // Repopulate the old array
    populateArr[i] = valArr[i]
  }
  return sortByReference || populateArr
}

function uasort (inputArr, sorter) {
  //  discuss at: http://locutus.io/php/uasort/
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //   example 1: var $sorter = function (a, b) { if (a > b) {return 1;}if (a < b) {return -1;} return 0;}
  //   example 1: var $fruits = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 1: uasort($fruits, $sorter)
  //   example 1: var $result = $fruits
  //   returns 1: {c: 'apple', b: 'banana', d: 'lemon', a: 'orange'}

  var valArr = []
  var k = ''
  var i = 0
  var sortByReference = false
  var populateArr = {}

  if (typeof sorter === 'string') {
    sorter = this[sorter]
  } else if (Object.prototype.toString.call(sorter) === '[object Array]') {
    sorter = this[sorter[0]][sorter[1]]
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  for (k in inputArr) {
    // Get key and value arrays
    if (inputArr.hasOwnProperty(k)) {
      valArr.push([k, inputArr[k]])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }
  valArr.sort(function (a, b) {
    return sorter(a[1], b[1])
  })

  for (i = 0; i < valArr.length; i++) {
    // Repopulate the old array
    populateArr[valArr[i][0]] = valArr[i][1]
  }

  return sortByReference || populateArr
}

function uksort (inputArr, sorter) {
  //  discuss at: http://locutus.io/php/uksort/
  //      note 1: The examples are correct, this is a new way
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //   example 1: var $data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'}
  //   example 1: uksort($data, function (key1, key2){ return (key1 === key2 ? 0 : (key1 > key2 ? 1 : -1)); })
  //   example 1: var $result = $data
  //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}

  var tmpArr = {}
  var keys = []
  var i = 0
  var k = ''
  var sortByReference = false
  var populateArr = {}

  if (typeof sorter === 'string') {
    sorter = this.window[sorter]
  }

  // Make a list of key names
  for (k in inputArr) {
    if (inputArr.hasOwnProperty(k)) {
      keys.push(k)
    }
  }

  // Sort key names
  try {
    if (sorter) {
      keys.sort(sorter)
    } else {
      keys.sort()
    }
  } catch (e) {
    return false
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  // Rebuild array with sorted key names
  for (i = 0; i < keys.length; i++) {
    k = keys[i]
    tmpArr[k] = inputArr[k]
    if (sortByReference) {
      delete inputArr[k]
    }
  }
  for (i in tmpArr) {
    if (tmpArr.hasOwnProperty(i)) {
      populateArr[i] = tmpArr[i]
    }
  }

  return sortByReference || populateArr
}

function usort (inputArr, sorter) {
  //  discuss at: http://locutus.io/php/usort/
  //      note 1: This function deviates from PHP in returning a copy of the array instead
  //      note 1: of acting by reference and returning true; this was necessary because
  //      note 1: IE does not allow deleting and re-adding of properties without caching
  //      note 1: of property position; you can set the ini of "locutus.sortByReference" to true to
  //      note 1: get the PHP behavior, but use this only if you are in an environment
  //      note 1: such as Firefox extensions where for-in iteration order is fixed and true
  //      note 1: property deletion is supported. Note that we intend to implement the PHP
  //      note 1: behavior by default if IE ever does allow it; only gives shallow copy since
  //      note 1: is by reference in PHP anyways
  //   example 1: var $stuff = {d: '3', a: '1', b: '11', c: '4'}
  //   example 1: usort($stuff, function (a, b) { return (a - b) })
  //   example 1: var $result = $stuff
  //   returns 1: {0: '1', 1: '3', 2: '4', 3: '11'}

  var valArr = []
  var k = ''
  var i = 0
  var sortByReference = false
  var populateArr = {}

  if (typeof sorter === 'string') {
    sorter = this[sorter]
  } else if (Object.prototype.toString.call(sorter) === '[object Array]') {
    sorter = this[sorter[0]][sorter[1]]
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.sortByReference') : undefined) || 'on'
  sortByReference = iniVal === 'on'
  populateArr = sortByReference ? inputArr : populateArr

  for (k in inputArr) {
    // Get key and value arrays
    if (inputArr.hasOwnProperty(k)) {
      valArr.push(inputArr[k])
      if (sortByReference) {
        delete inputArr[k]
      }
    }
  }
  try {
    valArr.sort(sorter)
  } catch (e) {
    return false
  }
  for (i = 0; i < valArr.length; i++) {
    // Repopulate the old array
    populateArr[i] = valArr[i]
  }

  return sortByReference || populateArr
}

/**
 * BC
 */

function bcadd (leftOperand, rightOperand, scale) {
  //  discuss at: http://locutus.io/php/bcadd/
  //   example 1: bcadd('1', '2')
  //   returns 1: '3'
  //   example 2: bcadd('-1', '5', 4)
  //   returns 2: '4.0000'
  //   example 3: bcadd('1928372132132819737213', '8728932001983192837219398127471', 2)
  //   returns 3: '8728932003911564969352217864684.00'

  var bc = require('../_helpers/_bc')
  var libbcmath = bc()

  var first, second, result

  if (typeof scale === 'undefined') {
    scale = libbcmath.scale
  }
  scale = ((scale < 0) ? 0 : scale)

  // create objects
  first = libbcmath.bc_init_num()
  second = libbcmath.bc_init_num()
  result = libbcmath.bc_init_num()

  first = libbcmath.php_str2num(leftOperand.toString())
  second = libbcmath.php_str2num(rightOperand.toString())

  result = libbcmath.bc_add(first, second, scale)

  if (result.n_scale > scale) {
    result.n_scale = scale
  }

  return result.toString()
}

function bccomp (leftOperand, rightOperand, scale) {
  //  discuss at: http://locutus.io/php/bccomp/
  //   example 1: bccomp('-1', '5', 4)
  //   returns 1: -1
  //   example 2: bccomp('1928372132132819737213', '8728932001983192837219398127471')
  //   returns 2: -1
  //   example 3: bccomp('1.00000000000000000001', '1', 2)
  //   returns 3: 0
  //   example 4: bccomp('97321', '2321')
  //   returns 4: 1

  var bc = require('../_helpers/_bc')
  var libbcmath = bc()

  // bc_num
  var first, second
  if (typeof scale === 'undefined') {
    scale = libbcmath.scale
  }
  scale = ((scale < 0) ? 0 : scale)

  first = libbcmath.bc_init_num()
  second = libbcmath.bc_init_num()

  // note bc_ not php_str2num
  first = libbcmath.bc_str2num(leftOperand.toString(), scale)
  // note bc_ not php_str2num
  second = libbcmath.bc_str2num(rightOperand.toString(), scale)
  return libbcmath.bc_compare(first, second, scale)
}

function bcdiv (leftOperand, rightOperand, scale) {
  //  discuss at: http://locutus.io/php/bcdiv/
  //   example 1: bcdiv('1', '2')
  //   returns 1: '0'
  //   example 2: bcdiv('1', '2', 2)
  //   returns 2: '0.50'
  //   example 3: bcdiv('-1', '5', 4)
  //   returns 3: '-0.2000'
  //   example 4: bcdiv('8728932001983192837219398127471', '1928372132132819737213', 2)
  //   returns 4: '4526580661.75'

  var _bc = require('../_helpers/_bc')
  var libbcmath = _bc()

  var first, second, result

  if (typeof scale === 'undefined') {
    scale = libbcmath.scale
  }
  scale = ((scale < 0) ? 0 : scale)

  // create objects
  first = libbcmath.bc_init_num()
  second = libbcmath.bc_init_num()
  result = libbcmath.bc_init_num()

  first = libbcmath.php_str2num(leftOperand.toString())
  second = libbcmath.php_str2num(rightOperand.toString())

  result = libbcmath.bc_divide(first, second, scale)
  if (result === -1) {
    // error
    throw new Error(11, '(BC) Division by zero')
  }
  if (result.n_scale > scale) {
    result.n_scale = scale
  }

  return result.toString()
}

function bcmul (leftOperand, rightOperand, scale) {
  //  discuss at: http://locutus.io/php/bcmul/
  //   example 1: bcmul('1', '2')
  //   returns 1: '2'
  //   example 2: bcmul('-3', '5')
  //   returns 2: '-15'
  //   example 3: bcmul('1234567890', '9876543210')
  //   returns 3: '12193263111263526900'
  //   example 4: bcmul('2.5', '1.5', 2)
  //   returns 4: '3.75'

  var _bc = require('../_helpers/_bc')
  var libbcmath = _bc()

  var first, second, result

  if (typeof scale === 'undefined') {
    scale = libbcmath.scale
  }
  scale = ((scale < 0) ? 0 : scale)

  // create objects
  first = libbcmath.bc_init_num()
  second = libbcmath.bc_init_num()
  result = libbcmath.bc_init_num()

  first = libbcmath.php_str2num(leftOperand.toString())
  second = libbcmath.php_str2num(rightOperand.toString())

  result = libbcmath.bc_multiply(first, second, scale)

  if (result.n_scale > scale) {
    result.n_scale = scale
  }
  return result.toString()
}

function bcround (val, precision) {
  //  discuss at: http://locutus.io/php/bcround/
  //   example 1: bcround(1, 2)
  //   returns 1: '1.00'

  var _bc = require('../_helpers/_bc')
  var libbcmath = _bc()

  var temp, result, digit
  var rightOperand

  // create number
  temp = libbcmath.bc_init_num()
  temp = libbcmath.php_str2num(val.toString())

  // check if any rounding needs
  if (precision >= temp.n_scale) {
    // nothing to round, just add the zeros.
    while (temp.n_scale < precision) {
      temp.n_value[temp.n_len + temp.n_scale] = 0
      temp.n_scale++
    }
    return temp.toString()
  }

  // get the digit we are checking (1 after the precision)
  // loop through digits after the precision marker
  digit = temp.n_value[temp.n_len + precision]

  rightOperand = libbcmath.bc_init_num()
  rightOperand = libbcmath.bc_new_num(1, precision)

  if (digit >= 5) {
    // round away from zero by adding 1 (or -1) at the "precision"..
    // ie 1.44999 @ 3dp = (1.44999 + 0.001).toString().substr(0,5)
    rightOperand.n_value[rightOperand.n_len + rightOperand.n_scale - 1] = 1
    if (temp.n_sign === libbcmath.MINUS) {
      // round down
      rightOperand.n_sign = libbcmath.MINUS
    }
    result = libbcmath.bc_add(temp, rightOperand, precision)
  } else {
    // leave-as-is.. just truncate it.
    result = temp
  }

  if (result.n_scale > precision) {
    result.n_scale = precision
  }

  return result.toString()
}

function bcscale (scale) {
  //  discuss at: http://locutus.io/php/bcscale/
  //   example 1: bcscale(1)
  //   returns 1: true

  var _bc = require('../_helpers/_bc')
  var libbcmath = _bc()

  scale = parseInt(scale, 10)
  if (isNaN(scale)) {
    return false
  }
  if (scale < 0) {
    return false
  }
  libbcmath.scale = scale

  return true
}

function bcsub (leftOperand, rightOperand, scale) {
  //  discuss at: http://locutus.io/php/bcsub/
  //   example 1: bcsub('1', '2')
  //   returns 1: '-1'
  //   example 2: bcsub('-1', '5', 4)
  //   returns 2: '-6.0000'
  //   example 3: bcsub('8728932001983192837219398127471', '1928372132132819737213', 2)
  //   returns 3: '8728932000054820705086578390258.00'

  var _bc = require('../_helpers/_bc')
  var libbcmath = _bc()

  var first, second, result

  if (typeof scale === 'undefined') {
    scale = libbcmath.scale
  }
  scale = ((scale < 0) ? 0 : scale)

  // create objects
  first = libbcmath.bc_init_num()
  second = libbcmath.bc_init_num()
  result = libbcmath.bc_init_num()

  first = libbcmath.php_str2num(leftOperand.toString())
  second = libbcmath.php_str2num(rightOperand.toString())

  result = libbcmath.bc_sub(first, second, scale)

  if (result.n_scale > scale) {
    result.n_scale = scale
  }

  return result.toString()
}

/**
 * CTYPE
 */

function ctype_alnum (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_alnum/
  //   example 1: ctype_alnum('AbC12')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }

  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.an) !== -1
}

function ctype_alpha (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_alpha/
  //   example 1: ctype_alpha('Az')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.al) !== -1
}

function ctype_cntrl (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_cntrl/
  //   example 1: ctype_cntrl('\u0020')
  //   returns 1: false
  //   example 2: ctype_cntrl('\u001F')
  //   returns 2: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.ct) !== -1
}

function ctype_digit (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_digit/
  //   example 1: ctype_digit('150')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.dg) !== -1
}

function ctype_graph (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_graph/
  //   example 1: ctype_graph('!%')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')

  if (typeof text !== 'string') {
    return false
  }

  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.gr) !== -1
}

function ctype_lower (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_lower/
  //   example 1: ctype_lower('abc')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }

  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.lw) !== -1
}

function ctype_print (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_print/
  //   example 1: ctype_print('AbC!#12')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.pr) !== -1
}

function ctype_punct (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_punct/
  //   example 1: ctype_punct('!?')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.pu) !== -1
}

function ctype_space (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_space/
  //   example 1: ctype_space('\t\n')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')
  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.sp) !== -1
}

function ctype_upper (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_upper/
  //   example 1: ctype_upper('AZ')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')

  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.up) !== -1
}

function ctype_xdigit (text) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ctype_xdigit/
  //   example 1: ctype_xdigit('01dF')
  //   returns 1: true

  var setlocale = require('../strings/setlocale')

  if (typeof text !== 'string') {
    return false
  }
  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var p = $locutus.php

  return text.search(p.locales[p.localeCategories.LC_CTYPE].LC_CTYPE.xd) !== -1
}

/**
 * DATETIME
 */


function checkdate (m, d, y) {
  //  discuss at: http://locutus.io/php/checkdate/
  //   example 1: checkdate(12, 31, 2000)
  //   returns 1: true
  //   example 2: checkdate(2, 29, 2001)
  //   returns 2: false
  //   example 3: checkdate(3, 31, 2008)
  //   returns 3: true
  //   example 4: checkdate(1, 390, 2000)
  //   returns 4: false

  return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0))
    .getDate()
}

function date (format, timestamp) {
  //  discuss at: http://locutus.io/php/date/
  //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: majak
  //    input by: Alex
  //    input by: Martin
  //    input by: Alex Wilson
  //    input by: Haravikk
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: majak
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: omid (http://locutus.io/php/380:380#comment_137122)
  // bugfixed by: Chris (http://www.devotis.nl/)
  //      note 1: Uses global: locutus to store the default timezone
  //      note 1: Although the function potentially allows timezone info
  //      note 1: (see notes), it currently does not set
  //      note 1: per a timezone specified by date_default_timezone_set(). Implementers might use
  //      note 1: $locutus.currentTimezoneOffset and
  //      note 1: $locutus.currentTimezoneDST set by that function
  //      note 1: in order to adjust the dates in this function
  //      note 1: (or our other date functions!) accordingly
  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400)
  //   returns 1: '07:09:40 m is month'
  //   example 2: date('F j, Y, g:i a', 1062462400)
  //   returns 2: 'September 2, 2003, 12:26 am'
  //   example 3: date('Y W o', 1062462400)
  //   returns 3: '2003 36 2003'
  //   example 4: var $x = date('Y m d', (new Date()).getTime() / 1000)
  //   example 4: $x = $x + ''
  //   example 4: var $result = $x.length // 2009 01 09
  //   returns 4: 10
  //   example 5: date('W', 1104534000)
  //   returns 5: '52'
  //   example 6: date('B t', 1104534000)
  //   returns 6: '999 31'
  //   example 7: date('W U', 1293750000.82); // 2010-12-31
  //   returns 7: '52 1293750000'
  //   example 8: date('W', 1293836400); // 2011-01-01
  //   returns 8: '52'
  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  //   returns 9: '52 2011-01-02'
  //        test: skip-1 skip-2 skip-5

  var jsdate, f
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txtWords = [
    'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s
  }
  var _pad = function (n, c) {
    n = String(n)
    while (n.length < c) {
      n = '0' + n
    }
    return n
  }
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2)
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l()
        .slice(0, 3)
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate()
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txtWords[f.w()] + 'day'
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j()
      var i = j % 10
      if (i <= 3 && parseInt((j % 100) / 10, 10) === 1) {
        i = 0
      }
      return ['st', 'nd', 'rd'][i - 1] || 'th'
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay()
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j())
      var b = new Date(f.Y(), 0, 1)
      return Math.round((a - b) / 864e5)
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3)
      var b = new Date(a.getFullYear(), 0, 4)
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2)
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txtWords[6 + f.n()]
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2)
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F()
        .slice(0, 3)
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1
    },
    t: function () {
      // Days in month; 28...31
      return (new Date(f.Y(), f.n(), 0))
        .getDate()
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y()
      return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0
    },
    o: function () {
      // ISO-8601 year
      var n = f.n()
      var W = f.W()
      var Y = f.Y()
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0)
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear()
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y()
        .toString()
        .slice(-2)
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? 'pm' : 'am'
    },
    A: function () {
      // AM or PM
      return f.a()
        .toUpperCase()
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2
      // Hours
      var i = jsdate.getUTCMinutes() * 60
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds()
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3)
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours()
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2)
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2)
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2)
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2)
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6)
    },

    // Timezone
    e: function () {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      var msg = 'Not supported (see source code of date() for timezone on how to add support)'
      throw new Error(msg)
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0)
      // Jan 1
      var c = Date.UTC(f.Y(), 0)
      // Jan 1 UTC
      var b = new Date(f.Y(), 6)
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6)
      return ((a - c) !== (b - d)) ? 1 : 0
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset()
      var a = Math.abs(tzo)
      return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4)
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O()
      return (O.substr(0, 3) + ':' + O.substr(3, 2))
    },
    T: function () {
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
      if (!tal.length) {
        tal = that.timezone_abbreviations_list();
      }
      if ($locutus && $locutus.default_timezone) {
        _default = $locutus.default_timezone;
        for (abbr in tal) {
          for (i = 0; i < tal[abbr].length; i++) {
            if (tal[abbr][i].timezone_id === _default) {
              return abbr.toUpperCase();
            }
          }
        }
      }
      for (abbr in tal) {
        for (i = 0; i < tal[abbr].length; i++) {
          os = -jsdate.getTimezoneOffset() * 60;
          if (tal[abbr][i].offset === os) {
            return abbr.toUpperCase();
          }
        }
      }
      */
      return 'UTC'
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb)
    },
    r: function () {
      // RFC 2822
      return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb)
    },
    U: function () {
      // Seconds since UNIX epoch
      return jsdate / 1000 | 0
    }
  }

  var _date = function (format, timestamp) {
    jsdate = (timestamp === undefined ? new Date() // Not provided
      : (timestamp instanceof Date) ? new Date(timestamp) // JS Date()
      : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
    )
    return format.replace(formatChr, formatChrCb)
  }

  return _date(format, timestamp)
}

function date_parse (date) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/date_parse/
  //   example 1: date_parse('2006-12-12 10:00:00')
  //   returns 1: {year : 2006, month: 12, day: 12, hour: 10, minute: 0, second: 0, fraction: 0, is_localtime: false}

  var strtotime = require('../datetime/strtotime')
  var ts

  try {
    ts = strtotime(date)
  } catch (e) {
    ts = false
  }

  if (!ts) {
    return false
  }

  var dt = new Date(ts * 1000)

  var retObj = {}

  retObj.year = dt.getFullYear()
  retObj.month = dt.getMonth() + 1
  retObj.day = dt.getDate()
  retObj.hour = dt.getHours()
  retObj.minute = dt.getMinutes()
  retObj.second = dt.getSeconds()
  retObj.fraction = parseFloat('0.' + dt.getMilliseconds())
  retObj.is_localtime = dt.getTimezoneOffset() !== 0

  return retObj
}

function getdate (timestamp) {
  //  discuss at: http://locutus.io/php/getdate/
  //    input by: Alex
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: getdate(1055901520)
  //   returns 1: {'seconds': 40, 'minutes': 58, 'hours': 1, 'mday': 18, 'wday': 3, 'mon': 6, 'year': 2003, 'yday': 168, 'weekday': 'Wednesday', 'month': 'June', '0': 1055901520}

  var _w = [
    'Sun',
    'Mon',
    'Tues',
    'Wednes',
    'Thurs',
    'Fri',
    'Satur'
  ]
  var _m = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  var d = ((typeof timestamp === 'undefined') ? new Date()
    : (timestamp instanceof Date) ? new Date(timestamp)  // Not provided
    : new Date(timestamp * 1000) // Javascript Date() // UNIX timestamp (auto-convert to int)
  )
  var w = d.getDay()
  var m = d.getMonth()
  var y = d.getFullYear()
  var r = {}

  r.seconds = d.getSeconds()
  r.minutes = d.getMinutes()
  r.hours = d.getHours()
  r.mday = d.getDate()
  r.wday = w
  r.mon = m + 1
  r.year = y
  r.yday = Math.floor((d - (new Date(y, 0, 1))) / 86400000)
  r.weekday = _w[w] + 'day'
  r.month = _m[m]
  r['0'] = parseInt(d.getTime() / 1000, 10)

  return r
}

function gettimeofday (returnFloat) {
  //  discuss at: http://locutus.io/php/gettimeofday/
  //    parts by: Breaking Par Consulting Inc (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7)
  //  revised by: Theriault (https://github.com/Theriault)
  //   example 1: var $obj = gettimeofday()
  //   example 1: var $result = ('sec' in $obj && 'usec' in $obj && 'minuteswest' in $obj &&80, 'dsttime' in $obj)
  //   returns 1: true
  //   example 2: var $timeStamp = gettimeofday(true)
  //   example 2: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
  //   returns 2: true

  var t = new Date()
  var y = 0

  if (returnFloat) {
    return t.getTime() / 1000
  }

  // Store current year.
  y = t.getFullYear()
  return {
    sec: t.getUTCSeconds(),
    usec: t.getUTCMilliseconds() * 1000,
    minuteswest: t.getTimezoneOffset(),
    // Compare Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC to see if DST is observed.
    dsttime: 0 + (((new Date(y, 0)) - Date.UTC(y, 0)) !== ((new Date(y, 6)) - Date.UTC(y, 6)))
  }
}

function gmdate (format, timestamp) {
  //  discuss at: http://locutus.io/php/gmdate/
  //    input by: Alex
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
  //   returns 1: '07:09:40 m is month'

  var date = require('../datetime/date')

  var dt = typeof timestamp === 'undefined' ? new Date() // Not provided
    : timestamp instanceof Date ? new Date(timestamp) // Javascript Date()
    : new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)

  timestamp = Date.parse(dt.toUTCString().slice(0, -4)) / 1000

  return date(format, timestamp)
}

function gmmktime () {
  //  discuss at: http://locutus.io/php/gmmktime/
  //   example 1: gmmktime(14, 10, 2, 2, 1, 2008)
  //   returns 1: 1201875002
  //   example 2: gmmktime(0, 0, -1, 1, 1, 1970)
  //   returns 2: -1

  var d = new Date()
  var r = arguments
  var i = 0
  var e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear']

  for (i = 0; i < e.length; i++) {
    if (typeof r[i] === 'undefined') {
      r[i] = d['getUTC' + e[i]]()
      // +1 to fix JS months.
      r[i] += (i === 3)
    } else {
      r[i] = parseInt(r[i], 10)
      if (isNaN(r[i])) {
        return false
      }
    }
  }

  // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
  r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0)

  // Set year, month (-1 to fix JS months), and date.
  // !This must come before the call to setHours!
  d.setUTCFullYear(r[5], r[3] - 1, r[4])

  // Set hours, minutes, and seconds.
  d.setUTCHours(r[0], r[1], r[2])

  var time = d.getTime()

  // Divide milliseconds by 1000 to return seconds and drop decimal.
  // Add 1 second if negative or it'll be off from PHP by 1 second.
  return (time / 1e3 >> 0) - (time < 0)
}

function gmstrftime (format, timestamp) {
  //  discuss at: http://locutus.io/php/gmstrftime/
  //    input by: Alex
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: gmstrftime("%A", 1062462400)
  //   returns 1: 'Tuesday'

  var strftime = require('../datetime/strftime')

  var _date = (typeof timestamp === 'undefined')
    ? new Date()
    : (timestamp instanceof Date)
      ? new Date(timestamp)
      : new Date(timestamp * 1000)

  timestamp = Date.parse(_date.toUTCString().slice(0, -4)) / 1000

  return strftime(format, timestamp)
}

function idate (format, timestamp) {
  //  discuss at: http://locutus.io/php/idate/
  //    input by: Alex
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: idate('y', 1255633200)
  //   returns 1: 9

  if (format === undefined) {
    throw new Error('idate() expects at least 1 parameter, 0 given')
  }
  if (!format.length || format.length > 1) {
    throw new Error('idate format is one char')
  }

  // @todo: Need to allow date_default_timezone_set() (check for $locutus.default_timezone and use)
  var _date = (typeof timestamp === 'undefined')
    ? new Date()
    : (timestamp instanceof Date)
      ? new Date(timestamp)
      : new Date(timestamp * 1000)
  var a

  switch (format) {
    case 'B':
      return Math.floor((
        (_date.getUTCHours() * 36e2) +
        (_date.getUTCMinutes() * 60) +
        _date.getUTCSeconds() + 36e2
      ) / 86.4) % 1e3
    case 'd':
      return _date.getDate()
    case 'h':
      return _date.getHours() % 12 || 12
    case 'H':
      return _date.getHours()
    case 'i':
      return _date.getMinutes()
    case 'I':
    // capital 'i'
    // Logic original by getimeofday().
    // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
    // If they are not equal, then DST is observed.
      a = _date.getFullYear()
      return 0 + (((new Date(a, 0)) - Date.UTC(a, 0)) !== ((new Date(a, 6)) - Date.UTC(a, 6)))
    case 'L':
      a = _date.getFullYear()
      return (!(a & 3) && (a % 1e2 || !(a % 4e2))) ? 1 : 0
    case 'm':
      return _date.getMonth() + 1
    case 's':
      return _date.getSeconds()
    case 't':
      return (new Date(_date.getFullYear(), _date.getMonth() + 1, 0))
      .getDate()
    case 'U':
      return Math.round(_date.getTime() / 1000)
    case 'w':
      return _date.getDay()
    case 'W':
      a = new Date(
        _date.getFullYear(),
        _date.getMonth(),
        _date.getDate() - (_date.getDay() || 7) + 3
      )
      return 1 + Math.round((a - (new Date(a.getFullYear(), 0, 4))) / 864e5 / 7)
    case 'y':
      return parseInt((_date.getFullYear() + '')
      .slice(2), 10) // This function returns an integer, unlike _date()
    case 'Y':
      return _date.getFullYear()
    case 'z':
      return Math.floor((_date - new Date(_date.getFullYear(), 0, 1)) / 864e5)
    case 'Z':
      return -_date.getTimezoneOffset() * 60
    default:
      throw new Error('Unrecognized _date format token')
  }
}

function microtime (getAsFloat) {
  //  discuss at: http://locutus.io/php/microtime/
  //   example 1: var $timeStamp = microtime(true)
  //   example 1: $timeStamp > 1000000000 && $timeStamp < 2000000000
  //   returns 1: true
  //   example 2: /^0\.[0-9]{1,6} [0-9]{10,10}$/.test(microtime())
  //   returns 2: true

  var s
  var now
  if (typeof performance !== 'undefined' && performance.now) {
    now = (performance.now() + performance.timing.navigationStart) / 1e3
    if (getAsFloat) {
      return now
    }

    // Math.round(now)
    s = now | 0

    return (Math.round((now - s) * 1e6) / 1e6) + ' ' + s
  } else {
    now = (Date.now ? Date.now() : new Date().getTime()) / 1e3
    if (getAsFloat) {
      return now
    }

    // Math.round(now)
    s = now | 0

    return (Math.round((now - s) * 1e3) / 1e3) + ' ' + s
  }
}

function mktime () {
  //  discuss at: http://locutus.io/php/mktime/
  //    input by: gabriel paderni
  //    input by: Yannoo
  //    input by: jakes
  //    input by: 3D-GRAF
  //    input by: Chris
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Marc Palau
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Theriault (https://github.com/Theriault)
  //      note 1: The return values of the following examples are
  //      note 1: received only if your system's timezone is UTC.
  //   example 1: mktime(14, 10, 2, 2, 1, 2008)
  //   returns 1: 1201875002
  //   example 2: mktime(0, 0, 0, 0, 1, 2008)
  //   returns 2: 1196467200
  //   example 3: var $make = mktime()
  //   example 3: var $td = new Date()
  //   example 3: var $real = Math.floor($td.getTime() / 1000)
  //   example 3: var $diff = ($real - $make)
  //   example 3: $diff < 5
  //   returns 3: true
  //   example 4: mktime(0, 0, 0, 13, 1, 1997)
  //   returns 4: 883612800
  //   example 5: mktime(0, 0, 0, 1, 1, 1998)
  //   returns 5: 883612800
  //   example 6: mktime(0, 0, 0, 1, 1, 98)
  //   returns 6: 883612800
  //   example 7: mktime(23, 59, 59, 13, 0, 2010)
  //   returns 7: 1293839999
  //   example 8: mktime(0, 0, -1, 1, 1, 1970)
  //   returns 8: -1

  var d = new Date()
  var r = arguments
  var i = 0
  var e = ['Hours', 'Minutes', 'Seconds', 'Month', 'Date', 'FullYear']

  for (i = 0; i < e.length; i++) {
    if (typeof r[i] === 'undefined') {
      r[i] = d['get' + e[i]]()
      // +1 to fix JS months.
      r[i] += (i === 3)
    } else {
      r[i] = parseInt(r[i], 10)
      if (isNaN(r[i])) {
        return false
      }
    }
  }

  // Map years 0-69 to 2000-2069 and years 70-100 to 1970-2000.
  r[5] += (r[5] >= 0 ? (r[5] <= 69 ? 2e3 : (r[5] <= 100 ? 1900 : 0)) : 0)

  // Set year, month (-1 to fix JS months), and date.
  // !This must come before the call to setHours!
  d.setFullYear(r[5], r[3] - 1, r[4])

  // Set hours, minutes, and seconds.
  d.setHours(r[0], r[1], r[2])

  var time = d.getTime()

  // Divide milliseconds by 1000 to return seconds and drop decimal.
  // Add 1 second if negative or it'll be off from PHP by 1 second.
  return (time / 1e3 >> 0) - (time < 0)
}

function strftime (fmt, timestamp) {
  //       discuss at: http://locutus.io/php/strftime/
  //      original by: Blues (http://tech.bluesmoon.info/)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //         input by: Alex
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //           note 1: Uses global: locutus to store locale info
  //        example 1: strftime("%A", 1062462400); // Return value will depend on date and locale
  //        returns 1: 'Tuesday'

  var setlocale = require('../strings/setlocale')

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus

  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var _xPad = function (x, pad, r) {
    if (typeof r === 'undefined') {
      r = 10
    }
    for (; parseInt(x, 10) < r && r > 1; r /= 10) {
      x = pad.toString() + x
    }
    return x.toString()
  }

  var locale = $locutus.php.localeCategories.LC_TIME
  var lcTime = $locutus.php.locales[locale].LC_TIME

  var _formats = {
    a: function (d) {
      return lcTime.a[d.getDay()]
    },
    A: function (d) {
      return lcTime.A[d.getDay()]
    },
    b: function (d) {
      return lcTime.b[d.getMonth()]
    },
    B: function (d) {
      return lcTime.B[d.getMonth()]
    },
    C: function (d) {
      return _xPad(parseInt(d.getFullYear() / 100, 10), 0)
    },
    d: ['getDate', '0'],
    e: ['getDate', ' '],
    g: function (d) {
      return _xPad(parseInt(this.G(d) / 100, 10), 0)
    },
    G: function (d) {
      var y = d.getFullYear()
      var V = parseInt(_formats.V(d), 10)
      var W = parseInt(_formats.W(d), 10)

      if (W > V) {
        y++
      } else if (W === 0 && V >= 52) {
        y--
      }

      return y
    },
    H: ['getHours', '0'],
    I: function (d) {
      var I = d.getHours() % 12
      return _xPad(I === 0 ? 12 : I, 0)
    },
    j: function (d) {
      var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT')
      // Line differs from Yahoo implementation which would be
      // equivalent to replacing it here with:
      ms += d.getTimezoneOffset() * 60000
      var doy = parseInt(ms / 60000 / 60 / 24, 10) + 1
      return _xPad(doy, 0, 100)
    },
    k: ['getHours', '0'],
    // not in PHP, but implemented here (as in Yahoo)
    l: function (d) {
      var l = d.getHours() % 12
      return _xPad(l === 0 ? 12 : l, ' ')
    },
    m: function (d) {
      return _xPad(d.getMonth() + 1, 0)
    },
    M: ['getMinutes', '0'],
    p: function (d) {
      return lcTime.p[d.getHours() >= 12 ? 1 : 0]
    },
    P: function (d) {
      return lcTime.P[d.getHours() >= 12 ? 1 : 0]
    },
    s: function (d) {
      // Yahoo uses return parseInt(d.getTime()/1000, 10);
      return Date.parse(d) / 1000
    },
    S: ['getSeconds', '0'],
    u: function (d) {
      var dow = d.getDay()
      return ((dow === 0) ? 7 : dow)
    },
    U: function (d) {
      var doy = parseInt(_formats.j(d), 10)
      var rdow = 6 - d.getDay()
      var woy = parseInt((doy + rdow) / 7, 10)
      return _xPad(woy, 0)
    },
    V: function (d) {
      var woy = parseInt(_formats.W(d), 10)
      var dow11 = (new Date('' + d.getFullYear() + '/1/1')).getDay()
      // First week is 01 and not 00 as in the case of %U and %W,
      // so we add 1 to the final result except if day 1 of the year
      // is a Monday (then %W returns 01).
      // We also need to subtract 1 if the day 1 of the year is
      // Friday-Sunday, so the resulting equation becomes:
      var idow = woy + (dow11 > 4 || dow11 <= 1 ? 0 : 1)
      if (idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4) {
        idow = 1
      } else if (idow === 0) {
        idow = _formats.V(new Date('' + (d.getFullYear() - 1) + '/12/31'))
      }
      return _xPad(idow, 0)
    },
    w: 'getDay',
    W: function (d) {
      var doy = parseInt(_formats.j(d), 10)
      var rdow = 7 - _formats.u(d)
      var woy = parseInt((doy + rdow) / 7, 10)
      return _xPad(woy, 0, 10)
    },
    y: function (d) {
      return _xPad(d.getFullYear() % 100, 0)
    },
    Y: 'getFullYear',
    z: function (d) {
      var o = d.getTimezoneOffset()
      var H = _xPad(parseInt(Math.abs(o / 60), 10), 0)
      var M = _xPad(o % 60, 0)
      return (o > 0 ? '-' : '+') + H + M
    },
    Z: function (d) {
      return d.toString().replace(/^.*\(([^)]+)\)$/, '$1')
    },
    '%': function (d) {
      return '%'
    }
  }

  var _date = (typeof timestamp === 'undefined')
    ? new Date()
    : (timestamp instanceof Date)
      ? new Date(timestamp)
      : new Date(timestamp * 1000)

  var _aggregates = {
    c: 'locale',
    D: '%m/%d/%y',
    F: '%y-%m-%d',
    h: '%b',
    n: '\n',
    r: 'locale',
    R: '%H:%M',
    t: '\t',
    T: '%H:%M:%S',
    x: 'locale',
    X: 'locale'
  }

  // First replace aggregates (run in a loop because an agg may be made up of other aggs)
  while (fmt.match(/%[cDFhnrRtTxX]/)) {
    fmt = fmt.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
      var f = _aggregates[m1]
      return (f === 'locale' ? lcTime[m1] : f)
    })
  }

  // Now replace formats - we need a closure so that the date object gets passed through
  var str = fmt.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, function (m0, m1) {
    var f = _formats[m1]
    if (typeof f === 'string') {
      return _date[f]()
    } else if (typeof f === 'function') {
      return f(_date)
    } else if (typeof f === 'object' && typeof f[0] === 'string') {
      return _xPad(_date[f[0]](), f[1])
    } else {
      // Shouldn't reach here
      return m1
    }
  })

  return str
}

function strptime (dateStr, format) {
  //  discuss at: http://locutus.io/php/strptime/
  //   example 1: strptime('20091112222135', '%Y%m%d%H%M%S') // Return value will depend on date and locale
  //   returns 1: {tm_sec: 35, tm_min: 21, tm_hour: 22, tm_mday: 12, tm_mon: 10, tm_year: 109, tm_wday: 4, tm_yday: 315, unparsed: ''}
  //   example 2: strptime('2009extra', '%Y')
  //   returns 2: {tm_sec:0, tm_min:0, tm_hour:0, tm_mday:0, tm_mon:0, tm_year:109, tm_wday:3, tm_yday: -1, unparsed: 'extra'}

  var setlocale = require('../strings/setlocale')
  var arrayMap = require('../array/array_map')

  var retObj = {
    tm_sec: 0,
    tm_min: 0,
    tm_hour: 0,
    tm_mday: 0,
    tm_mon: 0,
    tm_year: 0,
    tm_wday: 0,
    tm_yday: 0,
    unparsed: ''
  }
  var i = 0
  var j = 0
  var amPmOffset = 0
  var prevHour = false
  var _reset = function (dateObj, realMday) {
    // realMday is to allow for a value of 0 in return results (but without
    // messing up the Date() object)
    var jan1
    var o = retObj
    var d = dateObj
    o.tm_sec = d.getUTCSeconds()
    o.tm_min = d.getUTCMinutes()
    o.tm_hour = d.getUTCHours()
    o.tm_mday = realMday === 0 ? realMday : d.getUTCDate()
    o.tm_mon = d.getUTCMonth()
    o.tm_year = d.getUTCFullYear() - 1900
    o.tm_wday = realMday === 0 ? (d.getUTCDay() > 0 ? d.getUTCDay() - 1 : 6) : d.getUTCDay()
    jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    o.tm_yday = Math.ceil((d - jan1) / (1000 * 60 * 60 * 24))
  }
  var _date = function () {
    var o = retObj
    // We set date to at least 1 to ensure year or month doesn't go backwards
    return _reset(new Date(Date.UTC(
      o.tm_year + 1900,
      o.tm_mon,
      o.tm_mday || 1,
      o.tm_hour,
      o.tm_min,
      o.tm_sec
    )),
    o.tm_mday)
  }

  var _NWS = /\S/
  var _WS = /\s/

  var _aggregates = {
    c: 'locale',
    D: '%m/%d/%y',
    F: '%y-%m-%d',
    r: 'locale',
    R: '%H:%M',
    T: '%H:%M:%S',
    x: 'locale',
    X: 'locale'
  }

  /* Fix: Locale alternatives are supported though not documented in PHP; see http://linux.die.net/man/3/strptime
    Ec
    EC
    Ex
    EX
    Ey
    EY
    Od or Oe
    OH
    OI
    Om
    OM
    OS
    OU
    Ow
    OW
    Oy
  */
  var _pregQuote = function (str) {
    return (str + '').replace(/([\\.+*?[^\]$(){}=!<>|:])/g, '\\$1')
  }

  // ensure setup of localization variables takes place
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  var locale = $locutus.php.localeCategories.LC_TIME
  var lcTime = $locutus.php.locales[locale].LC_TIME

  // First replace aggregates (run in a loop because an agg may be made up of other aggs)
  while (format.match(/%[cDFhnrRtTxX]/)) {
    format = format.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
      var f = _aggregates[m1]
      return (f === 'locale' ? lcTime[m1] : f)
    })
  }

  var _addNext = function (j, regex, cb) {
    if (typeof regex === 'string') {
      regex = new RegExp('^' + regex, 'i')
    }
    var check = dateStr.slice(j)
    var match = regex.exec(check)
    // Even if the callback returns null after assigning to the
    // return object, the object won't be saved anyways
    var testNull = match ? cb.apply(null, match) : null
    if (testNull === null) {
      throw new Error('No match in string')
    }
    return j + match[0].length
  }

  var _addLocalized = function (j, formatChar, category) {
    // Could make each parenthesized instead and pass index to callback:
    return _addNext(j, arrayMap(_pregQuote, lcTime[formatChar]).join('|'),
      function (m) {
        var match = lcTime[formatChar].search(new RegExp('^' + _pregQuote(m) + '$', 'i'))
        if (match) {
          retObj[category] = match[0]
        }
      })
  }

  // BEGIN PROCESSING CHARACTERS
  for (i = 0, j = 0; i < format.length; i++) {
    if (format.charAt(i) === '%') {
      var literalPos = ['%', 'n', 't'].indexOf(format.charAt(i + 1))
      if (literalPos !== -1) {
        if (['%', '\n', '\t'].indexOf(dateStr.charAt(j)) === literalPos) {
          // a matched literal
          ++i
          // skip beyond
          ++j
          continue
        }
        // Format indicated a percent literal, but not actually present
        return false
      }
      var formatChar = format.charAt(i + 1)
      try {
        switch (formatChar) {
          case 'a':
          case 'A':
            // Sunday-Saturday
            // Changes nothing else
            j = _addLocalized(j, formatChar, 'tm_wday')
            break
          case 'h':
          case 'b':
            // Jan-Dec
            j = _addLocalized(j, 'b', 'tm_mon')
            // Also changes wday, yday
            _date()
            break
          case 'B':
            // January-December
            j = _addLocalized(j, formatChar, 'tm_mon')
            // Also changes wday, yday
            _date()
            break
          case 'C':
            // 0+; century (19 for 20th)
            // PHP docs say two-digit, but accepts one-digit (two-digit max):
            j = _addNext(j, /^\d?\d/,

            function (d) {
              var year = (parseInt(d, 10) - 19) * 100
              retObj.tm_year = year
              _date()
              if (!retObj.tm_yday) {
                retObj.tm_yday = -1
              }
              // Also changes wday; and sets yday to -1 (always?)
            })
            break
          case 'd':
          case 'e':
            // 1-31 day
            j = _addNext(j, formatChar === 'd'
              ? /^(0[1-9]|[1-2]\d|3[0-1])/
              : /^([1-2]\d|3[0-1]|[1-9])/,
            function (d) {
              var dayMonth = parseInt(d, 10)
              retObj.tm_mday = dayMonth
              // Also changes w_day, y_day
              _date()
            })
            break
          case 'g':
            // No apparent effect; 2-digit year (see 'V')
            break
          case 'G':
            // No apparent effect; 4-digit year (see 'V')'
            break
          case 'H':
            // 00-23 hours
            j = _addNext(j, /^([0-1]\d|2[0-3])/, function (d) {
              var hour = parseInt(d, 10)
              retObj.tm_hour = hour
              // Changes nothing else
            })
            break
          case 'l':
          case 'I':
            // 01-12 hours
            j = _addNext(j, formatChar === 'l'
              ? /^([1-9]|1[0-2])/
              : /^(0[1-9]|1[0-2])/,
            function (d) {
              var hour = parseInt(d, 10) - 1 + amPmOffset
              retObj.tm_hour = hour
              // Used for coordinating with am-pm
              prevHour = true
              // Changes nothing else, but affected by prior 'p/P'
            })
            break
          case 'j':
            // 001-366 day of year
            j = _addNext(j, /^(00[1-9]|0[1-9]\d|[1-2]\d\d|3[0-6][0-6])/, function (d) {
              var dayYear = parseInt(d, 10) - 1
              retObj.tm_yday = dayYear
              // Changes nothing else
              // (oddly, since if original by a given year, could calculate other fields)
            })
            break
          case 'm':
            // 01-12 month
            j = _addNext(j, /^(0[1-9]|1[0-2])/, function (d) {
              var month = parseInt(d, 10) - 1
              retObj.tm_mon = month
            // Also sets wday and yday
              _date()
            })
            break
          case 'M':
            // 00-59 minutes
            j = _addNext(j, /^[0-5]\d/, function (d) {
              var minute = parseInt(d, 10)
              retObj.tm_min = minute
            // Changes nothing else
            })
            break
          case 'P':
            // Seems not to work; AM-PM
            // Could make fall-through instead since supposed to be a synonym despite PHP docs
            return false
          case 'p':
            // am-pm
            j = _addNext(j, /^(am|pm)/i, function (d) {
              // No effect on 'H' since already 24 hours but
              //   works before or after setting of l/I hour
              amPmOffset = (/a/)
              .test(d) ? 0 : 12
              if (prevHour) {
                retObj.tm_hour += amPmOffset
              }
            })
            break
          case 's':
            // Unix timestamp (in seconds)
            j = _addNext(j, /^\d+/, function (d) {
              var timestamp = parseInt(d, 10)
              var date = new Date(Date.UTC(timestamp * 1000))
              _reset(date)
              // Affects all fields, but can't be negative (and initial + not allowed)
            })
            break
          case 'S':
            // 00-59 seconds
            j = _addNext(j, /^[0-5]\d/, // strptime also accepts 60-61 for some reason

            function (d) {
              var second = parseInt(d, 10)
              retObj.tm_sec = second
              // Changes nothing else
            })
            break
          case 'u':
          case 'w':
            // 0 (Sunday)-6(Saturday)
            j = _addNext(j, /^\d/, function (d) {
              retObj.tm_wday = d - (formatChar === 'u')
              // Changes nothing else apparently
            })
            break
          case 'U':
          case 'V':
          case 'W':
            // Apparently ignored (week of year, from 1st Monday)
            break
          case 'y':
            // 69 (or higher) for 1969+, 68 (or lower) for 2068-
             // PHP docs say two-digit, but accepts one-digit (two-digit max):
            j = _addNext(j, /^\d?\d/,

            function (d) {
              d = parseInt(d, 10)
              var year = d >= 69 ? d : d + 100
              retObj.tm_year = year
              _date()
              if (!retObj.tm_yday) {
                retObj.tm_yday = -1
              }
              // Also changes wday; and sets yday to -1 (always?)
            })
            break
          case 'Y':
            // 2010 (4-digit year)
            // PHP docs say four-digit, but accepts one-digit (four-digit max):
            j = _addNext(j, /^\d{1,4}/,

            function (d) {
              var year = (parseInt(d, 10)) - 1900
              retObj.tm_year = year
              _date()
              if (!retObj.tm_yday) {
                retObj.tm_yday = -1
              }
              // Also changes wday; and sets yday to -1 (always?)
            })
            break
          case 'z':
            // Timezone; on my system, strftime gives -0800,
            // but strptime seems not to alter hour setting
            break
          case 'Z':
            // Timezone; on my system, strftime gives PST, but strptime treats text as unparsed
            break
          default:
            throw new Error('Unrecognized formatting character in strptime()')
        }
      } catch (e) {
        if (e === 'No match in string') {
          // Allow us to exit
          // There was supposed to be a matching format but there wasn't
          return false
        }
        // Calculate skipping beyond initial percent too
      }
      ++i
    } else if (format.charAt(i) !== dateStr.charAt(j)) {
      // If extra whitespace at beginning or end of either, or between formats, no problem
      // (just a problem when between % and format specifier)

      // If the string has white-space, it is ok to ignore
      if (dateStr.charAt(j).search(_WS) !== -1) {
        j++
        // Let the next iteration try again with the same format character
        i--
      } else if (format.charAt(i).search(_NWS) !== -1) {
        // Any extra formatting characters besides white-space causes
        // problems (do check after WS though, as may just be WS in string before next character)
        return false
      }
      // Extra WS in format
      // Adjust strings when encounter non-matching whitespace, so they align in future checks above
      // Will check on next iteration (against same (non-WS) string character)
    } else {
      j++
    }
  }

  // POST-PROCESSING
  // Will also get extra whitespace; empty string if none
  retObj.unparsed = dateStr.slice(j)
  return retObj
}

function strtotime (text, now) {
  //  discuss at: http://locutus.io/php/strtotime/
  //    input by: David
  // bugfixed by: Wagner B. Soares
  // bugfixed by: Artur Tchernychev
  // bugfixed by: Stephan Bösch-Plepelits (http://github.com/plepe)
  //      note 1: Examples all have a fixed timestamp to prevent
  //      note 1: tests to fail because of variable time(zones)
  //   example 1: strtotime('+1 day', 1129633200)
  //   returns 1: 1129719600
  //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200)
  //   returns 2: 1130425202
  //   example 3: strtotime('last month', 1129633200)
  //   returns 3: 1127041200
  //   example 4: strtotime('2009-05-04 08:30:00 GMT')
  //   returns 4: 1241425800
  //   example 5: strtotime('2009-05-04 08:30:00+00')
  //   returns 5: 1241425800
  //   example 6: strtotime('2009-05-04 08:30:00+02:00')
  //   returns 6: 1241418600
  //   example 7: strtotime('2009-05-04T08:30:00Z')
  //   returns 7: 1241425800

  var parsed
  var match
  var today
  var year
  var date
  var days
  var ranges
  var len
  var times
  var regex
  var i
  var fail = false

  if (!text) {
    return fail
  }

  // Unecessary spaces
  text = text.replace(/^\s+|\s+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\t\r\n]/g, '')
    .toLowerCase()

  // in contrast to php, js Date.parse function interprets:
  // dates given as yyyy-mm-dd as in timezone: UTC,
  // dates with "." or "-" as MDY instead of DMY
  // dates with two-digit years differently
  // etc...etc...
  // ...therefore we manually parse lots of common date formats
  var pattern = new RegExp([
    '^(\\d{1,4})',
    '([\\-\\.\\/:])',
    '(\\d{1,2})',
    '([\\-\\.\\/:])',
    '(\\d{1,4})',
    '(?:\\s(\\d{1,2}):(\\d{2})?:?(\\d{2})?)?',
    '(?:\\s([A-Z]+)?)?$'
  ].join(''))
  match = text.match(pattern)

  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
        case '-':
          // YYYY-M-D
          if (match[3] > 12 || match[5] > 31) {
            return fail
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':
          // YYYY.M.D is not parsed by strtotime()
          return fail
        case '/':
          // YYYY/M/D
          if (match[3] > 12 || match[5] > 31) {
            return fail
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
        case '-':
          // D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':
          // D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '/':
          // M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail
          }

          return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
      }
    } else {
      switch (match[2]) {
        case '-':
          // YY-M-D
          if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
            return fail
          }

          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1]
          return new Date(year, parseInt(match[3], 10) - 1, match[5],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case '.':
          // D.M.YY or H.MM.SS
          if (match[5] >= 70) {
            // D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
          }
          if (match[5] < 60 && !match[6]) {
            // H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail
            }

            today = new Date()
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
            match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000
          }

          // invalid format, cannot be parsed
          return fail
        case '/':
          // M/D/YY
          if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
            return fail
          }

          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5]
          return new Date(year, parseInt(match[1], 10) - 1, match[3],
          match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000
        case ':':
          // HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail
          }

          today = new Date()
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
          match[1] || 0, match[3] || 0, match[5] || 0) / 1000
      }
    }
  }

  // other formats and "now" should be parsed by Date.parse()
  if (text === 'now') {
    return now === null || isNaN(now)
      ? new Date().getTime() / 1000 | 0
      : now | 0
  }
  if (!isNaN(parsed = Date.parse(text))) {
    return parsed / 1000 | 0
  }
  // Browsers !== Chrome have problems parsing ISO 8601 date strings, as they do
  // not accept lower case characters, space, or shortened time zones.
  // Therefore, fix these problems and try again.
  // Examples:
  //   2015-04-15 20:33:59+02
  //   2015-04-15 20:33:59z
  //   2015-04-15t20:33:59+02:00
  pattern = new RegExp([
    '^([0-9]{4}-[0-9]{2}-[0-9]{2})',
    '[ t]',
    '([0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?)',
    '([\\+-][0-9]{2}(:[0-9]{2})?|z)'
  ].join(''))
  match = text.match(pattern)
  if (match) {
    // @todo: time zone information
    if (match[4] === 'z') {
      match[4] = 'Z'
    } else if (match[4].match(/^([+-][0-9]{2})$/)) {
      match[4] = match[4] + ':00'
    }

    if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
      return parsed / 1000 | 0
    }
  }

  date = now ? new Date(now * 1000) : new Date()
  days = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  }
  ranges = {
    'yea': 'FullYear',
    'mon': 'Month',
    'day': 'Date',
    'hou': 'Hours',
    'min': 'Minutes',
    'sec': 'Seconds'
  }

  function lastNext (type, range, modifier) {
    var diff
    var day = days[range]

    if (typeof day !== 'undefined') {
      diff = day - date.getDay()

      if (diff === 0) {
        diff = 7 * modifier
      } else if (diff > 0 && type === 'last') {
        diff -= 7
      } else if (diff < 0 && type === 'next') {
        diff += 7
      }

      date.setDate(date.getDate() + diff)
    }
  }

  function process (val) {
    // @todo: Reconcile this with regex using \s, taking into account
    // browser issues with split and regexes
    var splt = val.split(' ')
    var type = splt[0]
    var range = splt[1].substring(0, 3)
    var typeIsNumber = /\d+/.test(type)
    var ago = splt[2] === 'ago'
    var num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1)

    if (typeIsNumber) {
      num *= parseInt(type, 10)
    }

    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date['set' + ranges[range]](date['get' + ranges[range]]() + num)
    }

    if (range === 'wee') {
      return date.setDate(date.getDate() + (num * 7))
    }

    if (type === 'next' || type === 'last') {
      lastNext(type, range, num)
    } else if (!typeIsNumber) {
      return false
    }

    return true
  }

  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
    '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
    '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)'
  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?'

  match = text.match(new RegExp(regex, 'gi'))
  if (!match) {
    return fail
  }

  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail
    }
  }

  return (date.getTime() / 1000)
}

function time () {
  //  discuss at: http://locutus.io/php/time/
  //   example 1: var $timeStamp = time()
  //   example 1: var $result = $timeStamp > 1000000000 && $timeStamp < 2000000000
  //   returns 1: true

  return Math.floor(new Date().getTime() / 1000)
}

/**
 * EXEC
 */

function escapeshellarg (arg) {
  //  discuss at: http://locutus.io/php/escapeshellarg/
  //   example 1: escapeshellarg("kevin's birthday")
  //   returns 1: "'kevin\\'s birthday'"

  var ret = ''

  ret = arg.replace(/[^\\]'/g, function (m, i, s) {
    return m.slice(0, 1) + '\\\''
  })

  return "'" + ret + "'"
}

/**
 * FILESYSTEM
 */

function basename (path, suffix) {
  //  discuss at: http://locutus.io/php/basename/
  //   example 1: basename('/www/site/home.htm', '.htm')
  //   returns 1: 'home'
  //   example 2: basename('ecra.php?p=1')
  //   returns 2: 'ecra.php?p=1'
  //   example 3: basename('/some/path/')
  //   returns 3: 'path'
  //   example 4: basename('/some/path_ext.ext/','.ext')
  //   returns 4: 'path_ext'

  var b = path
  var lastChar = b.charAt(b.length - 1)

  if (lastChar === '/' || lastChar === '\\') {
    b = b.slice(0, -1)
  }

  b = b.replace(/^.*[/\\]/g, '')

  if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
    b = b.substr(0, b.length - suffix.length)
  }

  return b
}

function dirname (path) {
  //  discuss at: http://locutus.io/php/dirname/
  //   example 1: dirname('/etc/passwd')
  //   returns 1: '/etc'
  //   example 2: dirname('c:/Temp/x')
  //   returns 2: 'c:/Temp'
  //   example 3: dirname('/dir/test/')
  //   returns 3: '/dir'

  return path.replace(/\\/g, '/')
    .replace(/\/[^/]*\/?$/, '')
}

function file_get_contents (url, flags, context, offset, maxLen) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/file_get_contents/
  //      original by: Legaev Andrey
  //         input by: Jani Hartikainen
  //         input by: Raphael (Ao) RUDLER
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  // reimplemented by: Kevin van Zonneveld (http://kvz.io)
  //           note 1: This used to work in the browser via blocking ajax
  //           note 1: requests in 1.3.2 and earlier
  //           note 1: but then people started using that for real app,
  //           note 1: so we deprecated this behavior,
  //           note 1: so this function is now Node-only
  //        example 1: var $buf = file_get_contents('test/never-change.txt')
  //        example 1: var $result = $buf.indexOf('hash') !== -1
  //        returns 1: true

  var fs = require('fs')

  return fs.readFileSync(url, 'utf-8')
}

function pathinfo (path, options) {
  //  discuss at: http://locutus.io/php/pathinfo/
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Timo
  //      note 1: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
  //      note 1: The way the bitwise arguments are handled allows for greater flexibility
  //      note 1: & compatability. We might even standardize this
  //      note 1: code and use a similar approach for
  //      note 1: other bitwise PHP functions
  //      note 1: Locutus tries very hard to stay away from a core.js
  //      note 1: file with global dependencies, because we like
  //      note 1: that you can just take a couple of functions and be on your way.
  //      note 1: But by way we implemented this function,
  //      note 1: if you want you can still declare the PATHINFO_*
  //      note 1: yourself, and then you can use:
  //      note 1: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
  //      note 1: which makes it fully compliant with PHP syntax.
  //   example 1: pathinfo('/www/htdocs/index.html', 1)
  //   returns 1: '/www/htdocs'
  //   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME')
  //   returns 2: 'index.html'
  //   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION')
  //   returns 3: 'html'
  //   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME')
  //   returns 4: 'index'
  //   example 5: pathinfo('/www/htdocs/index.html', 2 | 4)
  //   returns 5: {basename: 'index.html', extension: 'html'}
  //   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL')
  //   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
  //   example 7: pathinfo('/www/htdocs/index.html')
  //   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}

  var basename = require('../filesystem/basename')
  var opt = ''
  var realOpt = ''
  var optName = ''
  var optTemp = 0
  var tmpArr = {}
  var cnt = 0
  var i = 0
  var haveBasename = false
  var haveExtension = false
  var haveFilename = false

  // Input defaulting & sanitation
  if (!path) {
    return false
  }
  if (!options) {
    options = 'PATHINFO_ALL'
  }

  // Initialize binary arguments. Both the string & integer (constant) input is
  // allowed
  var OPTS = {
    'PATHINFO_DIRNAME': 1,
    'PATHINFO_BASENAME': 2,
    'PATHINFO_EXTENSION': 4,
    'PATHINFO_FILENAME': 8,
    'PATHINFO_ALL': 0
  }
  // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
  for (optName in OPTS) {
    if (OPTS.hasOwnProperty(optName)) {
      OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName]
    }
  }
  if (typeof options !== 'number') {
    // Allow for a single string or an array of string flags
    options = [].concat(options)
    for (i = 0; i < options.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[options[i]]) {
        optTemp = optTemp | OPTS[options[i]]
      }
    }
    options = optTemp
  }

  // Internal Functions
  var _getExt = function (path) {
    var str = path + ''
    var dotP = str.lastIndexOf('.') + 1
    return !dotP ? false : dotP !== str.length ? str.substr(dotP) : ''
  }

  // Gather path infos
  if (options & OPTS.PATHINFO_DIRNAME) {
    var dirName = path
      .replace(/\\/g, '/')
      .replace(/\/[^/]*\/?$/, '') // dirname
    tmpArr.dirname = dirName === path ? '.' : dirName
  }

  if (options & OPTS.PATHINFO_BASENAME) {
    if (haveBasename === false) {
      haveBasename = basename(path)
    }
    tmpArr.basename = haveBasename
  }

  if (options & OPTS.PATHINFO_EXTENSION) {
    if (haveBasename === false) {
      haveBasename = basename(path)
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename)
    }
    if (haveExtension !== false) {
      tmpArr.extension = haveExtension
    }
  }

  if (options & OPTS.PATHINFO_FILENAME) {
    if (haveBasename === false) {
      haveBasename = basename(path)
    }
    if (haveExtension === false) {
      haveExtension = _getExt(haveBasename)
    }
    if (haveFilename === false) {
      haveFilename = haveBasename.slice(0, haveBasename.length - (haveExtension
        ? haveExtension.length + 1
        : haveExtension === false
          ? 0
          : 1
        )
      )
    }

    tmpArr.filename = haveFilename
  }

  // If array contains only 1 element: return string
  cnt = 0
  for (opt in tmpArr) {
    if (tmpArr.hasOwnProperty(opt)) {
      cnt++
      realOpt = opt
    }
  }
  if (cnt === 1) {
    return tmpArr[realOpt]
  }

  // Return full-blown array
  return tmpArr
}

function realpath (path) {
  //  discuss at: http://locutus.io/php/realpath/
  //      note 1: Returned path is an url like e.g. 'http://yourhost.tld/path/'
  //   example 1: realpath('some/dir/.././_supporters/pj_test_supportfile_1.htm')
  //   returns 1: 'some/_supporters/pj_test_supportfile_1.htm'

  if (typeof window === 'undefined') {
    var nodePath = require('path')
    return nodePath.normalize(path)
  }

  var p = 0
  var arr = [] // Save the root, if not given
  var r = this.window.location.href // Avoid input failures

  // Check if there's a port in path (like 'http://')
  path = (path + '').replace('\\', '/')
  if (path.indexOf('://') !== -1) {
    p = 1
  }

  // Ok, there's not a port in path, so let's take the root
  if (!p) {
    path = r.substring(0, r.lastIndexOf('/') + 1) + path
  }

  // Explode the given path into it's parts
  arr = path.split('/') // The path is an array now
  path = [] // Foreach part make a check
  for (var k in arr) { // This is'nt really interesting
    if (arr[k] === '.') {
      continue
    }
    // This reduces the realpath
    if (arr[k] === '..') {
      /* But only if there more than 3 parts in the path-array.
       * The first three parts are for the uri */
      if (path.length > 3) {
        path.pop()
      }
    } else {
      // This adds parts to the realpath
      // But only if the part is not empty or the uri
      // (the first three parts ar needed) was not
      // saved
      if ((path.length < 2) || (arr[k] !== '')) {
        path.push(arr[k])
      }
    }
  }

  // Returns the absloute path as a string
  return path.join('/')
}

/**
 * FUNCHAND
 */

function call_user_func (cb, parameters) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/call_user_func/
  //      note 1: Depends on call_user_func_array which in turn depends on the `cb` that is passed,
  //      note 1: this function can use `eval`.
  //      note 1: The `eval` input is however checked to only allow valid function names,
  //      note 1: So it should not be unsafer than uses without eval (seeing as you can)
  //      note 1: already pass any function to be executed here.
  //   example 1: call_user_func('isNaN', 'a')
  //   returns 1: true

  var callUserFuncArray = require('../funchand/call_user_func_array')
  parameters = Array.prototype.slice.call(arguments, 1)
  return callUserFuncArray(cb, parameters)
}

function call_user_func_array (cb, parameters) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/call_user_func_array/
  //  revised by: Jon Hohle
  //      note 1: Depending on the `cb` that is passed,
  //      note 1: this function can use `eval` and/or `new Function`.
  //      note 1: The `eval` input is however checked to only allow valid function names,
  //      note 1: So it should not be unsafer than uses without eval (seeing as you can)
  //      note 1: already pass any function to be executed here.
  //   example 1: call_user_func_array('isNaN', ['a'])
  //   returns 1: true
  //   example 2: call_user_func_array('isNaN', [1])
  //   returns 2: false

  var $global = (typeof window !== 'undefined' ? window : global)
  var func
  var scope = null

  var validJSFunctionNamePattern = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/

  if (typeof cb === 'string') {
    if (typeof $global[cb] === 'function') {
      func = $global[cb]
    } else if (cb.match(validJSFunctionNamePattern)) {
      func = (new Function(null, 'return ' + cb)()) // eslint-disable-line no-new-func
    }
  } else if (Object.prototype.toString.call(cb) === '[object Array]') {
    if (typeof cb[0] === 'string') {
      if (cb[0].match(validJSFunctionNamePattern)) {
        func = eval(cb[0] + "['" + cb[1] + "']") // eslint-disable-line no-eval
      }
    } else {
      func = cb[0][cb[1]]
    }

    if (typeof cb[0] === 'string') {
      if (typeof $global[cb[0]] === 'function') {
        scope = $global[cb[0]]
      } else if (cb[0].match(validJSFunctionNamePattern)) {
        scope = eval(cb[0]) // eslint-disable-line no-eval
      }
    } else if (typeof cb[0] === 'object') {
      scope = cb[0]
    }
  } else if (typeof cb === 'function') {
    func = cb
  }

  if (typeof func !== 'function') {
    throw new Error(func + ' is not a valid function')
  }

  return func.apply(scope, parameters)
}

function create_function (args, code) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/create_function/
  //      original by: Johnny Mast (http://www.phpvrouwen.nl)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: var $f = create_function('a, b', 'return (a + b)')
  //        example 1: $f(1, 2)
  //        returns 1: 3

  try {
    return Function.apply(null, args.split(',').concat(code))
  } catch (e) {
    return false
  }
}

function function_exists (funcName) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/function_exists/
  //   example 1: function_exists('isFinite')
  //   returns 1: true
  //        test: skip-1

  var $global = (typeof window !== 'undefined' ? window : global)

  if (typeof funcName === 'string') {
    funcName = $global[funcName]
  }

  return typeof funcName === 'function'
}

function get_defined_functions () { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/get_defined_functions/
  //      note 1: Test case 1: If get_defined_functions can find
  //      note 1: itself in the defined functions, it worked :)
  //   example 1: function test_in_array (array, p_val) {for(var i = 0, l = array.length; i < l; i++) {if (array[i] === p_val) return true} return false}
  //   example 1: var $funcs = get_defined_functions()
  //   example 1: var $found = test_in_array($funcs, 'get_defined_functions')
  //   example 1: var $result = $found
  //   returns 1: true
  //        test: skip-1

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  var i = ''
  var arr = []
  var already = {}

  for (i in $global) {
    try {
      if (typeof $global[i] === 'function') {
        if (!already[i]) {
          already[i] = 1
          arr.push(i)
        }
      } else if (typeof $global[i] === 'object') {
        for (var j in $global[i]) {
          if (typeof $global[j] === 'function' && $global[j] && !already[j]) {
            already[j] = 1
            arr.push(j)
          }
        }
      }
    } catch (e) {
      // Some objects in Firefox throw exceptions when their
      // properties are accessed (e.g., sessionStorage)
    }
  }

  return arr
}

/**
 * i18n
 */

function i18n_loc_get_default () { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/i18n_loc_get_default/
  //      note 1: Renamed in PHP6 from locale_get_default(). Not listed yet at php.net.
  //      note 1: List of locales at <http://demo.icu-project.org/icu-bin/locexp>
  //      note 1: To be usable with sort() if it is passed the `SORT_LOCALE_STRING`
  //      note 1: sorting flag: http://php.net/manual/en/function.sort.php
  //   example 1: i18n_loc_get_default()
  //   returns 1: 'en_US_POSIX'
  //   example 2: i18n_loc_set_default('pt_PT')
  //   example 2: i18n_loc_get_default()
  //   returns 2: 'pt_PT'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  return $locutus.php.locale_default || 'en_US_POSIX'
}

function i18n_loc_set_default (name) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/i18n_loc_set_default/
  //      note 1: Renamed in PHP6 from locale_set_default(). Not listed yet at php.net
  //      note 1: List of locales at http://demo.icu-project.org/icu-bin/locexp (use for implementing other locales here)
  //      note 1: To be usable with sort() if it is passed the SORT_LOCALE_STRING sorting flag: http://php.net/manual/en/function.sort.php
  //   example 1: i18n_loc_set_default('pt_PT')
  //   returns 1: true

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.locales = $locutus.php.locales || {}

  $locutus.php.locales.en_US_POSIX = {
    sorting: function (str1, str2) {
      // @todo: This one taken from strcmp, but need for other locales;
      // we don't use localeCompare since its locale is not settable
      return (str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1)
    }
  }

  $locutus.php.locale_default = name
  return true
}

/**
 * INFO
 */

function assert_options (what, value) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/assert_options/
  //   example 1: assert_options('ASSERT_CALLBACK')
  //   returns 1: null

  var iniKey, defaultVal
  switch (what) {
    case 'ASSERT_ACTIVE':
      iniKey = 'assert.active'
      defaultVal = 1
      break
    case 'ASSERT_WARNING':
      iniKey = 'assert.warning'
      defaultVal = 1
      var msg = 'We have not yet implemented warnings for us to throw '
      msg += 'in JavaScript (assert_options())'
      throw new Error(msg)
    case 'ASSERT_BAIL':
      iniKey = 'assert.bail'
      defaultVal = 0
      break
    case 'ASSERT_QUIET_EVAL':
      iniKey = 'assert.quiet_eval'
      defaultVal = 0
      break
    case 'ASSERT_CALLBACK':
      iniKey = 'assert.callback'
      defaultVal = null
      break
    default:
      throw new Error('Improper type for assert_options()')
  }

  // I presume this is to be the most recent value, instead of the default value
  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')(iniKey) : undefined) || defaultVal

  return iniVal
}

function getenv (varname) {
  //  discuss at: http://locutus.io/php/getenv/
  //   example 1: getenv('LC_ALL')
  //   returns 1: false

  if (typeof process !== 'undefined' || !process.env || !process.env[varname]) {
    return false
  }

  return process.env[varname]
}

function ini_get (varname) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ini_get/
  //      note 1: The ini values must be set by ini_set or manually within an ini file
  //   example 1: ini_set('date.timezone', 'Asia/Hong_Kong')
  //   example 1: ini_get('date.timezone')
  //   returns 1: 'Asia/Hong_Kong'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.ini = $locutus.php.ini || {}

  if ($locutus.php.ini[varname] && $locutus.php.ini[varname].local_value !== undefined) {
    if ($locutus.php.ini[varname].local_value === null) {
      return ''
    }
    return $locutus.php.ini[varname].local_value
  }

  return ''
}

function ini_set (varname, newvalue) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/ini_set/
  //      note 1: This will not set a global_value or access level for the ini item
  //   example 1: ini_set('date.timezone', 'Asia/Hong_Kong')
  //   example 1: ini_set('date.timezone', 'America/Chicago')
  //   returns 1: 'Asia/Hong_Kong'

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}
  $locutus.php.ini = $locutus.php.ini || {}

  $locutus.php.ini = $locutus.php.ini || {}
  $locutus.php.ini[varname] = $locutus.php.ini[varname] || {}

  var oldval = $locutus.php.ini[varname].local_value

  var lowerStr = (newvalue + '').toLowerCase().trim()
  if (newvalue === true || lowerStr === 'on' || lowerStr === '1') {
    newvalue = 'on'
  }
  if (newvalue === false || lowerStr === 'off' || lowerStr === '0') {
    newvalue = 'off'
  }

  var _setArr = function (oldval) {
    // Although these are set individually, they are all accumulated
    if (typeof oldval === 'undefined') {
      $locutus.ini[varname].local_value = []
    }
    $locutus.ini[varname].local_value.push(newvalue)
  }

  switch (varname) {
    case 'extension':
      _setArr(oldval, newvalue)
      break
    default:
      $locutus.php.ini[varname].local_value = newvalue
      break
  }

  return oldval
}

function set_time_limit (seconds) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/set_time_limit/
  //        test: skip-all
  //   example 1: set_time_limit(4)
  //   returns 1: undefined

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  setTimeout(function () {
    if (!$locutus.php.timeoutStatus) {
      $locutus.php.timeoutStatus = true
    }
    throw new Error('Maximum execution time exceeded')
  }, seconds * 1000)
}

function version_compare (v1, v2, operator) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/version_compare/
  //      original by: Philippe Jausions (http://pear.php.net/user/jausions)
  //      original by: Aidan Lister (http://aidanlister.com/)
  // reimplemented by: Kankrelune (http://www.webfaktory.info/)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //      improved by: Scott Baker
  //      improved by: Theriault (https://github.com/Theriault)
  //        example 1: version_compare('8.2.5rc', '8.2.5a')
  //        returns 1: 1
  //        example 2: version_compare('8.2.50', '8.2.52', '<')
  //        returns 2: true
  //        example 3: version_compare('5.3.0-dev', '5.3.0')
  //        returns 3: -1
  //        example 4: version_compare('4.1.0.52','4.01.0.51')
  //        returns 4: 1

  // Important: compare must be initialized at 0.
  var i
  var x
  var compare = 0

  // vm maps textual PHP versions to negatives so they're less than 0.
  // PHP currently defines these as CASE-SENSITIVE. It is important to
  // leave these as negatives so that they can come before numerical versions
  // and as if no letters were there to begin with.
  // (1alpha is < 1 and < 1.1 but > 1dev1)
  // If a non-numerical value can't be mapped to this table, it receives
  // -7 as its value.
  var vm = {
    'dev': -6,
    'alpha': -5,
    'a': -5,
    'beta': -4,
    'b': -4,
    'RC': -3,
    'rc': -3,
    '#': -2,
    'p': 1,
    'pl': 1
  }

  // This function will be called to prepare each version argument.
  // It replaces every _, -, and + with a dot.
  // It surrounds any nonsequence of numbers/dots with dots.
  // It replaces sequences of dots with a single dot.
  //    version_compare('4..0', '4.0') === 0
  // Important: A string of 0 length needs to be converted into a value
  // even less than an unexisting value in vm (-7), hence [-8].
  // It's also important to not strip spaces because of this.
  //   version_compare('', ' ') === 1
  var _prepVersion = function (v) {
    v = ('' + v).replace(/[_\-+]/g, '.')
    v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.')
    return (!v.length ? [-8] : v.split('.'))
  }
  // This converts a version component to a number.
  // Empty component becomes 0.
  // Non-numerical component becomes a negative number.
  // Numerical component becomes itself as an integer.
  var _numVersion = function (v) {
    return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10))
  }

  v1 = _prepVersion(v1)
  v2 = _prepVersion(v2)
  x = Math.max(v1.length, v2.length)
  for (i = 0; i < x; i++) {
    if (v1[i] === v2[i]) {
      continue
    }
    v1[i] = _numVersion(v1[i])
    v2[i] = _numVersion(v2[i])
    if (v1[i] < v2[i]) {
      compare = -1
      break
    } else if (v1[i] > v2[i]) {
      compare = 1
      break
    }
  }
  if (!operator) {
    return compare
  }

  // Important: operator is CASE-SENSITIVE.
  // "No operator" seems to be treated as "<."
  // Any other values seem to make the function return null.
  switch (operator) {
    case '>':
    case 'gt':
      return (compare > 0)
    case '>=':
    case 'ge':
      return (compare >= 0)
    case '<=':
    case 'le':
      return (compare <= 0)
    case '===':
    case '=':
    case 'eq':
      return (compare === 0)
    case '<>':
    case '!==':
    case 'ne':
      return (compare !== 0)
    case '':
    case '<':
    case 'lt':
      return (compare < 0)
    default:
      return null
  }
}

/**
 * JSON
 */

function json_decode (strJson) { // eslint-disable-line camelcase
  //       discuss at: http://phpjs.org/functions/json_decode/
  //      original by: Public Domain (http://www.json.org/json2.js)
  // reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      improved by: T.J. Leahy
  //      improved by: Michael White
  //           note 1: If node or the browser does not offer JSON.parse,
  //           note 1: this function falls backslash
  //           note 1: to its own implementation using eval, and hence should be considered unsafe
  //        example 1: json_decode('[ 1 ]')
  //        returns 1: [1]

  /*
    http://www.JSON.org/json2.js
    2008-11-19
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
  */

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  var json = $global.JSON
  if (typeof json === 'object' && typeof json.parse === 'function') {
    try {
      return json.parse(strJson)
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        throw new Error('Unexpected error type in json_decode()')
      }

      // usable by json_last_error()
      $locutus.php.last_error_json = 4
      return null
    }
  }

  var chars = [
    '\u0000',
    '\u00ad',
    '\u0600-\u0604',
    '\u070f',
    '\u17b4',
    '\u17b5',
    '\u200c-\u200f',
    '\u2028-\u202f',
    '\u2060-\u206f',
    '\ufeff',
    '\ufff0-\uffff'
  ].join('')
  var cx = new RegExp('[' + chars + ']', 'g')
  var j
  var text = strJson

  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  cx.lastIndex = 0
  if (cx.test(text)) {
    text = text.replace(cx, function (a) {
      return '\\u' + ('0000' + a.charCodeAt(0)
        .toString(16))
        .slice(-4)
    })
  }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

  var m = (/^[\],:{}\s]*$/)
    .test(text.replace(/\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))

  if (m) {
    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.
    j = eval('(' + text + ')') // eslint-disable-line no-eval
    return j
  }

  // usable by json_last_error()
  $locutus.php.last_error_json = 4
  return null
}

function json_encode (mixedVal) { // eslint-disable-line camelcase
  //       discuss at: http://phpjs.org/functions/json_encode/
  //      original by: Public Domain (http://www.json.org/json2.js)
  // reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      improved by: Michael White
  //         input by: felix
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //        example 1: json_encode('Kevin')
  //        returns 1: '"Kevin"'

  /*
    http://www.JSON.org/json2.js
    2008-11-19
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
  */

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  var json = $global.JSON
  var retVal
  try {
    if (typeof json === 'object' && typeof json.stringify === 'function') {
      // Errors will not be caught here if our own equivalent to resource
      retVal = json.stringify(mixedVal)
      if (retVal === undefined) {
        throw new SyntaxError('json_encode')
      }
      return retVal
    }

    var value = mixedVal

    var quote = function (string) {
      var escapeChars = [
        '\u0000-\u001f',
        '\u007f-\u009f',
        '\u00ad',
        '\u0600-\u0604',
        '\u070f',
        '\u17b4',
        '\u17b5',
        '\u200c-\u200f',
        '\u2028-\u202f',
        '\u2060-\u206f',
        '\ufeff',
        '\ufff0-\uffff'
      ].join('')
      var escapable = new RegExp('[\\"' + escapeChars + ']', 'g')
      var meta = {
        // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
      }

      escapable.lastIndex = 0
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a]
        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0)
          .toString(16))
          .slice(-4)
      }) + '"' : '"' + string + '"'
    }

    var _str = function (key, holder) {
      var gap = ''
      var indent = '    '
      // The loop counter.
      var i = 0
      // The member key.
      var k = ''
      // The member value.
      var v = ''
      var length = 0
      var mind = gap
      var partial = []
      var value = holder[key]

      // If the value has a toJSON method, call it to obtain a replacement value.
      if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
        value = value.toJSON(key)
      }

      // What happens next depends on the value's type.
      switch (typeof value) {
        case 'string':
          return quote(value)

        case 'number':
          // JSON numbers must be finite. Encode non-finite numbers as null.
          return isFinite(value) ? String(value) : 'null'

        case 'boolean':
        case 'null':
          // If the value is a boolean or null, convert it to a string. Note:
          // typeof null does not produce 'null'. The case is included here in
          // the remote chance that this gets fixed someday.
          return String(value)

        case 'object':
          // If the type is 'object', we might be dealing with an object or an array or
          // null.
          // Due to a specification blunder in ECMAScript, typeof null is 'object',
          // so watch out for that case.
          if (!value) {
            return 'null'
          }

          // Make an array to hold the partial results of stringifying this object value.
          gap += indent
          partial = []

          // Is the value an array?
          if (Object.prototype.toString.apply(value) === '[object Array]') {
            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.
            length = value.length
            for (i = 0; i < length; i += 1) {
              partial[i] = _str(i, value) || 'null'
            }

            // Join all of the elements together, separated with commas, and wrap them in
            // brackets.
            v = partial.length === 0 ? '[]' : gap
              ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
              : '[' + partial.join(',') + ']'
            gap = mind
            return v
          }

          // Iterate through all of the keys in the object.
          for (k in value) {
            if (Object.hasOwnProperty.call(value, k)) {
              v = _str(k, value)
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v)
              }
            }
          }

          // Join all of the member texts together, separated with commas,
          // and wrap them in braces.
          v = partial.length === 0 ? '{}' : gap
            ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
            : '{' + partial.join(',') + '}'
          gap = mind
          return v
        case 'undefined':
        case 'function':
        default:
          throw new SyntaxError('json_encode')
      }
    }

    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return _str('', {
      '': value
    })
  } catch (err) {
    // @todo: ensure error handling above throws a SyntaxError in all cases where it could
    // (i.e., when the JSON global is not available and there is an error)
    if (!(err instanceof SyntaxError)) {
      throw new Error('Unexpected error type in json_encode()')
    }
    // usable by json_last_error()
    $locutus.php.last_error_json = 4
    return null
  }
}

function json_last_error () { // eslint-disable-line camelcase
  //  discuss at: http://phpjs.org/functions/json_last_error/
  //   example 1: json_last_error()
  //   returns 1: 0

  // JSON_ERROR_NONE = 0
  // max depth limit to be removed per PHP comments in json.c (not possible in JS?):
  // JSON_ERROR_DEPTH = 1
  // internal use? also not documented:
  // JSON_ERROR_STATE_MISMATCH = 2
  // [\u0000-\u0008\u000B-\u000C\u000E-\u001F] if used directly within json_decode():
  // JSON_ERROR_CTRL_CHAR = 3
  // but JSON functions auto-escape these, so error not possible in JavaScript
  // JSON_ERROR_SYNTAX = 4

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  return $locutus.php && $locutus.php.last_error_json ? $locutus.php.last_error_json : 0
}

/**
 * MATH
 */

function asinh (arg) {
  //  discuss at: http://locutus.io/php/asinh/
  //   example 1: asinh(8723321.4)
  //   returns 1: 16.67465779841863

  return Math.log(arg + Math.sqrt(arg * arg + 1))
}

function abs (mixedNumber) {
  //  discuss at: http://locutus.io/php/abs/
  //   example 1: abs(4.2)
  //   returns 1: 4.2
  //   example 2: abs(-4.2)
  //   returns 2: 4.2
  //   example 3: abs(-5)
  //   returns 3: 5
  //   example 4: abs('_argos')
  //   returns 4: 0

  return Math.abs(mixedNumber) || 0
}

function dechex (number) {
  //  discuss at: http://locutus.io/php/dechex/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: pilus
  //   example 1: dechex(10)
  //   returns 1: 'a'
  //   example 2: dechex(47)
  //   returns 2: '2f'
  //   example 3: dechex(-1415723993)
  //   returns 3: 'ab9dc427'

  if (number < 0) {
    number = 0xFFFFFFFF + number + 1
  }
  return parseInt(number, 10)
    .toString(16)
}

function acosh (arg) {
  //  discuss at: http://locutus.io/php/acosh/
  //   example 1: acosh(8723321.4)
  //   returns 1: 16.674657798418625

  return Math.log(arg + Math.sqrt(arg * arg - 1))
}

function log10 (arg) {
  //  discuss at: http://locutus.io/php/log10/
  //   example 1: log10(10)
  //   returns 1: 1
  //   example 2: log10(1)
  //   returns 2: 0

  return Math.log(arg) / 2.302585092994046 // Math.LN10
}

function decoct (number) {
  //  discuss at: http://locutus.io/php/decoct/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: pilus
  //   example 1: decoct(15)
  //   returns 1: '17'
  //   example 2: decoct(264)
  //   returns 2: '410'

  if (number < 0) {
    number = 0xFFFFFFFF + number + 1
  }
  return parseInt(number, 10)
    .toString(8)
}

function floor (value) {
  //  discuss at: http://locutus.io/php/floor/
  //   example 1: floor(8723321.4)
  //   returns 1: 8723321

  return Math.floor(value)
}

function hexdec (hexString) {
  //  discuss at: http://locutus.io/php/hexdec/
  //   example 1: hexdec('that')
  //   returns 1: 10
  //   example 2: hexdec('a0')
  //   returns 2: 160

  hexString = (hexString + '').replace(/[^a-f0-9]/gi, '')
  return parseInt(hexString, 16)
}

function min () {
  //  discuss at: http://locutus.io/php/min/
  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
  //      note 1: Long code cause we're aiming for maximum PHP compatibility
  //   example 1: min(1, 3, 5, 6, 7)
  //   returns 1: 1
  //   example 2: min([2, 4, 5])
  //   returns 2: 2
  //   example 3: min(0, 'hello')
  //   returns 3: 0
  //   example 4: min('hello', 0)
  //   returns 4: 'hello'
  //   example 5: min(-1, 'hello')
  //   returns 5: -1
  //   example 6: min([2, 4, 8], [2, 5, 7])
  //   returns 6: [2, 4, 8]

  var ar
  var retVal
  var i = 0
  var n = 0
  var argv = arguments
  var argc = argv.length
  var _obj2Array = function (obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      return obj
    }
    var ar = []
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        ar.push(obj[i])
      }
    }
    return ar
  }

  var _compare = function (current, next) {
    var i = 0
    var n = 0
    var tmp = 0
    var nl = 0
    var cl = 0

    if (current === next) {
      return 0
    } else if (typeof current === 'object') {
      if (typeof next === 'object') {
        current = _obj2Array(current)
        next = _obj2Array(next)
        cl = current.length
        nl = next.length
        if (nl > cl) {
          return 1
        } else if (nl < cl) {
          return -1
        }
        for (i = 0, n = cl; i < n; ++i) {
          tmp = _compare(current[i], next[i])
          if (tmp === 1) {
            return 1
          } else if (tmp === -1) {
            return -1
          }
        }
        return 0
      }
      return -1
    } else if (typeof next === 'object') {
      return 1
    } else if (isNaN(next) && !isNaN(current)) {
      if (current === 0) {
        return 0
      }
      return (current < 0 ? 1 : -1)
    } else if (isNaN(current) && !isNaN(next)) {
      if (next === 0) {
        return 0
      }
      return (next > 0 ? 1 : -1)
    }

    if (next === current) {
      return 0
    }

    return (next > current ? 1 : -1)
  }

  if (argc === 0) {
    throw new Error('At least one value should be passed to min()')
  } else if (argc === 1) {
    if (typeof argv[0] === 'object') {
      ar = _obj2Array(argv[0])
    } else {
      throw new Error('Wrong parameter count for min()')
    }

    if (ar.length === 0) {
      throw new Error('Array must contain at least one element for min()')
    }
  } else {
    ar = argv
  }

  retVal = ar[0]

  for (i = 1, n = ar.length; i < n; ++i) {
    if (_compare(retVal, ar[i]) === -1) {
      retVal = ar[i]
    }
  }

  return retVal
}

function hypot (x, y) {
  //  discuss at: http://locutus.io/php/hypot/
  // imprived by: Robert Eisele (http://www.xarg.org/)
  //   example 1: hypot(3, 4)
  //   returns 1: 5
  //   example 2: hypot([], 'a')
  //   returns 2: null

  x = Math.abs(x)
  y = Math.abs(y)

  var t = Math.min(x, y)
  x = Math.max(x, y)
  t = t / x

  return x * Math.sqrt(1 + t * t) || null
}

function is_finite (val) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_finite/
  //   example 1: is_finite(Infinity)
  //   returns 1: false
  //   example 2: is_finite(-Infinity)
  //   returns 2: false
  //   example 3: is_finite(0)
  //   returns 3: true

  var warningType = ''

  if (val === Infinity || val === -Infinity) {
    return false
  }

  // Some warnings for maximum PHP compatibility
  if (typeof val === 'object') {
    warningType = (Object.prototype.toString.call(val) === '[object Array]' ? 'array' : 'object')
  } else if (typeof val === 'string' && !val.match(/^[+-]?\d/)) {
    // simulate PHP's behaviour: '-9a' doesn't give a warning, but 'a9' does.
    warningType = 'string'
  }
  if (warningType) {
    var msg = 'Warning: is_finite() expects parameter 1 to be double, ' + warningType + ' given'
    throw new Error(msg)
  }

  return true
}

function log (arg, base) {
  //  discuss at: http://locutus.io/php/log/
  //   example 1: log(8723321.4, 7)
  //   returns 1: 8.212871815082147

  return (typeof base === 'undefined')
    ? Math.log(arg)
    : Math.log(arg) / Math.log(base)
}

function log1p (x) {
  //  discuss at: http://locutus.io/php/log1p/
  //      note 1: Precision 'n' can be adjusted as desired
  //   example 1: log1p(1e-15)
  //   returns 1: 9.999999999999995e-16

  var ret = 0
  // degree of precision
  var n = 50

  if (x <= -1) {
    // JavaScript style would be to return Number.NEGATIVE_INFINITY
    return '-INF'
  }
  if (x < 0 || x > 1) {
    return Math.log(1 + x)
  }
  for (var i = 1; i < n; i++) {
    ret += Math.pow(-x, i) / i
  }

  return -ret
}

function mt_rand (min, max) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/mt_rand/
  //    input by: Kongo
  //   example 1: mt_rand(1, 1)
  //   returns 1: 1

  var argc = arguments.length
  if (argc === 0) {
    min = 0
    max = 2147483647
  } else if (argc === 1) {
    throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given')
  } else {
    min = parseInt(min, 10)
    max = parseInt(max, 10)
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pow (base, exp) {
  //  discuss at: http://locutus.io/php/pow/
  //   example 1: pow(8723321.4, 7)
  //   returns 1: 3.8439091680778995e+48

  return Math.pow(base, exp)
}

function sin (arg) {
  //  discuss at: http://locutus.io/php/sin/
  //   example 1: Math.ceil(sin(8723321.4) * 10000000)
  //   returns 1: -9834330

  return Math.sin(arg)
}

function sinh (arg) {
  //  discuss at: http://locutus.io/php/sinh/
  //   example 1: sinh(-0.9834330348825909)
  //   returns 1: -1.1497971402636502

  return (Math.exp(arg) - Math.exp(-arg)) / 2
}

function sqrt (arg) {
  //  discuss at: http://locutus.io/php/sqrt/
  //   example 1: sqrt(8723321.4)
  //   returns 1: 2953.5269424875746

  return Math.sqrt(arg)
}

function tan (arg) {
  //  discuss at: http://locutus.io/php/tan/
  //   example 1: Math.ceil(tan(8723321.4) * 10000000)
  //   returns 1: 54251849

  return Math.tan(arg)
}

function tanh (arg) {
  //  discuss at: http://locutus.io/php/tanh/
  // imprived by: Robert Eisele (http://www.xarg.org/)
  //   example 1: tanh(5.4251848798444815)
  //   returns 1: 0.9999612058841574

  return 1 - 2 / (Math.exp(2 * arg) + 1)
}

function acos (arg) {
  //  discuss at: http://locutus.io/php/acos/
  //      note 1: Sorry about the crippled test. Needed because precision differs accross platforms.
  //   example 1: (acos(0.3) + '').substr(0, 17)
  //   returns 1: "1.266103672779499"

  return Math.acos(arg)
}

function asin (arg) {
  //  discuss at: http://locutus.io/php/asin/
  //      note 1: Sorry about the crippled test. Needed because precision differs accross platforms.
  //   example 1: (asin(0.3) + '').substr(0, 17)
  //   returns 1: "0.304692654015397"

  return Math.asin(arg)
}

function atan (arg) {
  //  discuss at: http://locutus.io/php/atan/
  //   example 1: atan(8723321.4)
  //   returns 1: 1.5707962121596615

  return Math.atan(arg)
}

function atan2 (y, x) {
  //  discuss at: http://locutus.io/php/atan2/
  //   example 1: atan2(1, 1)
  //   returns 1: 0.7853981633974483

  return Math.atan2(y, x)
}

function atanh (arg) {
  //  discuss at: http://locutus.io/php/atanh/
  //   example 1: atanh(0.3)
  //   returns 1: 0.3095196042031118

  return 0.5 * Math.log((1 + arg) / (1 - arg))
}

function base_convert (number, frombase, tobase) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/base_convert/
  //   example 1: base_convert('A37334', 16, 2)
  //   returns 1: '101000110111001100110100'

  return parseInt(number + '', frombase | 0)
    .toString(tobase | 0)
}

function bindec (binaryString) {
  //  discuss at: http://locutus.io/php/bindec/
  //   example 1: bindec('110011')
  //   returns 1: 51
  //   example 2: bindec('000110011')
  //   returns 2: 51
  //   example 3: bindec('111')
  //   returns 3: 7

  binaryString = (binaryString + '').replace(/[^01]/gi, '')

  return parseInt(binaryString, 2)
}

function ceil (value) {
  //  discuss at: http://locutus.io/php/ceil/
  //   example 1: ceil(8723321.4)
  //   returns 1: 8723322

  return Math.ceil(value)
}

function cos (arg) {
  //  discuss at: http://locutus.io/php/cos/
  //   example 1: Math.ceil(cos(8723321.4) * 10000000)
  //   returns 1: -1812718

  return Math.cos(arg)
}

function cosh (arg) {
  //  discuss at: http://locutus.io/php/cosh/
  //   example 1: cosh(-0.18127180117607017)
  //   returns 1: 1.0164747716114113

  return (Math.exp(arg) + Math.exp(-arg)) / 2
}

function decbin (number) {
  //  discuss at: http://locutus.io/php/decbin/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: pilus
  //    input by: nord_ua
  //   example 1: decbin(12)
  //   returns 1: '1100'
  //   example 2: decbin(26)
  //   returns 2: '11010'
  //   example 3: decbin('26')
  //   returns 3: '11010'

  if (number < 0) {
    number = 0xFFFFFFFF + number + 1
  }
  return parseInt(number, 10)
    .toString(2)
}

function deg2rad (angle) {
  //  discuss at: http://locutus.io/php/deg2rad/
  //   example 1: deg2rad(45)
  //   returns 1: 0.7853981633974483

  return angle * 0.017453292519943295 // (angle / 180) * Math.PI;
}

function exp (arg) {
  //  discuss at: http://locutus.io/php/exp/
  //   example 1: exp(0.3)
  //   returns 1: 1.3498588075760032

  return Math.exp(arg)
}

function expm1 (x) {
  //  discuss at: http://locutus.io/php/expm1/
  //      note 1: Precision 'n' can be adjusted as desired
  //   example 1: expm1(1e-15)
  //   returns 1: 1.0000000000000007e-15

  return (x < 1e-5 && x > -1e-5)
    ? x + 0.5 * x * x
    : Math.exp(x) - 1
}

function fmod (x, y) {
  //  discuss at: http://locutus.io/php/fmod/
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: fmod(5.7, 1.3)
  //   returns 1: 0.5

  var tmp
  var tmp2
  var p = 0
  var pY = 0
  var l = 0.0
  var l2 = 0.0

  tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/)
  p = parseInt(tmp[2], 10) - (tmp[1] + '').length
  tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/)
  pY = parseInt(tmp[2], 10) - (tmp[1] + '').length

  if (pY > p) {
    p = pY
  }

  tmp2 = (x % y)

  if (p < -100 || p > 20) {
    // toFixed will give an out of bound error so we fix it like this:
    l = Math.round(Math.log(tmp2) / Math.log(10))
    l2 = Math.pow(10, l)

    return (tmp2 / l2).toFixed(l - p) * l2
  } else {
    return parseFloat(tmp2.toFixed(-p))
  }
}

function getrandmax () {
  //  discuss at: http://locutus.io/php/getrandmax/
  //   example 1: getrandmax()
  //   returns 1: 2147483647

  return 2147483647
}

function is_infinite (val) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_infinite/
  //   example 1: is_infinite(Infinity)
  //   returns 1: true
  //   example 2: is_infinite(-Infinity)
  //   returns 2: true
  //   example 3: is_infinite(0)
  //   returns 3: false

  var warningType = ''

  if (val === Infinity || val === -Infinity) {
    return true
  }

  // Some warnings for maximum PHP compatibility
  if (typeof val === 'object') {
    warningType = (Object.prototype.toString.call(val) === '[object Array]' ? 'array' : 'object')
  } else if (typeof val === 'string' && !val.match(/^[+-]?\d/)) {
    // simulate PHP's behaviour: '-9a' doesn't give a warning, but 'a9' does.
    warningType = 'string'
  }
  if (warningType) {
    var msg = 'Warning: is_infinite() expects parameter 1 to be double, ' + warningType + ' given'
    throw new Error(msg)
  }

  return false
}

function is_nan (val) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_nan/
  //    input by: Robin
  //   example 1: is_nan(NaN)
  //   returns 1: true
  //   example 2: is_nan(0)
  //   returns 2: false

  var warningType = ''

  if (typeof val === 'number' && isNaN(val)) {
    return true
  }

  // Some errors for maximum PHP compatibility
  if (typeof val === 'object') {
    warningType = (Object.prototype.toString.call(val) === '[object Array]' ? 'array' : 'object')
  } else if (typeof val === 'string' && !val.match(/^[+-]?\d/)) {
    // simulate PHP's behaviour: '-9a' doesn't give a warning, but 'a9' does.
    warningType = 'string'
  }
  if (warningType) {
    throw new Error('Warning: is_nan() expects parameter 1 to be double, ' + warningType + ' given')
  }

  return false
}

function lcg_value () { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/lcg_value/
  //   example 1: var $rnd = lcg_value()
  //   example 1: var $result = $rnd >= 0 && $rnd <= 1
  //   returns 1: true

  return Math.random()
}

function max () {
  //  discuss at: http://locutus.io/php/max/
  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
  //      note 1: Long code cause we're aiming for maximum PHP compatibility
  //   example 1: max(1, 3, 5, 6, 7)
  //   returns 1: 7
  //   example 2: max([2, 4, 5])
  //   returns 2: 5
  //   example 3: max(0, 'hello')
  //   returns 3: 0
  //   example 4: max('hello', 0)
  //   returns 4: 'hello'
  //   example 5: max(-1, 'hello')
  //   returns 5: 'hello'
  //   example 6: max([2, 4, 8], [2, 5, 7])
  //   returns 6: [2, 5, 7]

  var ar
  var retVal
  var i = 0
  var n = 0
  var argv = arguments
  var argc = argv.length
  var _obj2Array = function (obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      return obj
    } else {
      var ar = []
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          ar.push(obj[i])
        }
      }
      return ar
    }
  }
  var _compare = function (current, next) {
    var i = 0
    var n = 0
    var tmp = 0
    var nl = 0
    var cl = 0

    if (current === next) {
      return 0
    } else if (typeof current === 'object') {
      if (typeof next === 'object') {
        current = _obj2Array(current)
        next = _obj2Array(next)
        cl = current.length
        nl = next.length
        if (nl > cl) {
          return 1
        } else if (nl < cl) {
          return -1
        }
        for (i = 0, n = cl; i < n; ++i) {
          tmp = _compare(current[i], next[i])
          if (tmp === 1) {
            return 1
          } else if (tmp === -1) {
            return -1
          }
        }
        return 0
      }
      return -1
    } else if (typeof next === 'object') {
      return 1
    } else if (isNaN(next) && !isNaN(current)) {
      if (current === 0) {
        return 0
      }
      return (current < 0 ? 1 : -1)
    } else if (isNaN(current) && !isNaN(next)) {
      if (next === 0) {
        return 0
      }
      return (next > 0 ? 1 : -1)
    }

    if (next === current) {
      return 0
    }

    return (next > current ? 1 : -1)
  }

  if (argc === 0) {
    throw new Error('At least one value should be passed to max()')
  } else if (argc === 1) {
    if (typeof argv[0] === 'object') {
      ar = _obj2Array(argv[0])
    } else {
      throw new Error('Wrong parameter count for max()')
    }
    if (ar.length === 0) {
      throw new Error('Array must contain at least one element for max()')
    }
  } else {
    ar = argv
  }

  retVal = ar[0]
  for (i = 1, n = ar.length; i < n; ++i) {
    if (_compare(retVal, ar[i]) === 1) {
      retVal = ar[i]
    }
  }

  return retVal
}

function mt_getrandmax () { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/mt_getrandmax/
  //   example 1: mt_getrandmax()
  //   returns 1: 2147483647

  return 2147483647
}

function octdec (octString) {
  //  discuss at: http://locutus.io/php/octdec/
  //   example 1: octdec('77')
  //   returns 1: 63

  octString = (octString + '').replace(/[^0-7]/gi, '')
  return parseInt(octString, 8)
}

function pi () {
  //  discuss at: http://locutus.io/php/pi/
  //   example 1: pi(8723321.4)
  //   returns 1: 3.141592653589793

  return 3.141592653589793 // Math.PI
}

function rad2deg (angle) {
  //  discuss at: http://locutus.io/php/rad2deg/
  //   example 1: rad2deg(3.141592653589793)
  //   returns 1: 180

  return angle * 57.29577951308232 // angle / Math.PI * 180
}

function rand (min, max) {
  //  discuss at: http://locutus.io/php/rand/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      note 1: See the commented out code below for a version which
  //      note 1: will work with our experimental (though probably unnecessary)
  //      note 1: srand() function)
  //   example 1: rand(1, 1)
  //   returns 1: 1

  var argc = arguments.length
  if (argc === 0) {
    min = 0
    max = 2147483647
  } else if (argc === 1) {
    throw new Error('Warning: rand() expects exactly 2 parameters, 1 given')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function round (value, precision, mode) {
  //  discuss at: http://locutus.io/php/round/
  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: T.Wild
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
  //    input by: Greenseed
  //    input by: meo
  //    input by: William
  //    input by: Josep Sanz (http://www.ws3.es/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Great work. Ideas for improvement:
  //      note 1: - code more compliant with developer guidelines
  //      note 1: - for implementing PHP constant arguments look at
  //      note 1: the pathinfo() function, it offers the greatest
  //      note 1: flexibility & compatibility possible
  //   example 1: round(1241757, -3)
  //   returns 1: 1242000
  //   example 2: round(3.6)
  //   returns 2: 4
  //   example 3: round(2.835, 2)
  //   returns 3: 2.84
  //   example 4: round(1.1749999999999, 2)
  //   returns 4: 1.17
  //   example 5: round(58551.799999999996, 2)
  //   returns 5: 58551.8

  var m, f, isHalf, sgn // helper variables
  // making sure precision is integer
  precision |= 0
  m = Math.pow(10, precision)
  value *= m
  // sign of the number
  sgn = (value > 0) | -(value < 0)
  isHalf = value % 1 === 0.5 * sgn
  f = Math.floor(value)

  if (isHalf) {
    switch (mode) {
      case 'PHP_ROUND_HALF_DOWN':
      // rounds .5 toward zero
        value = f + (sgn < 0)
        break
      case 'PHP_ROUND_HALF_EVEN':
      // rouds .5 towards the next even integer
        value = f + (f % 2 * sgn)
        break
      case 'PHP_ROUND_HALF_ODD':
      // rounds .5 towards the next odd integer
        value = f + !(f % 2)
        break
      default:
      // rounds .5 away from zero
        value = f + (sgn > 0)
    }
  }

  return (isHalf ? value : Math.round(value)) / m
}

/**
 * MISC
 */

function uniqid (prefix, moreEntropy) {
  //  discuss at: http://locutus.io/php/uniqid/
  //  revised by: Kankrelune (http://www.webfaktory.info/)
  //      note 1: Uses an internal counter (in locutus global) to avoid collision
  //   example 1: var $id = uniqid()
  //   example 1: var $result = $id.length === 13
  //   returns 1: true
  //   example 2: var $id = uniqid('foo')
  //   example 2: var $result = $id.length === (13 + 'foo'.length)
  //   returns 2: true
  //   example 3: var $id = uniqid('bar', true)
  //   example 3: var $result = $id.length === (23 + 'bar'.length)
  //   returns 3: true

  if (typeof prefix === 'undefined') {
    prefix = ''
  }

  var retId
  var _formatSeed = function (seed, reqWidth) {
    seed = parseInt(seed, 10).toString(16) // to hex str
    if (reqWidth < seed.length) {
      // so long we split
      return seed.slice(seed.length - reqWidth)
    }
    if (reqWidth > seed.length) {
      // so short we pad
      return Array(1 + (reqWidth - seed.length)).join('0') + seed
    }
    return seed
  }

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  if (!$locutus.php.uniqidSeed) {
    // init seed with big random int
    $locutus.php.uniqidSeed = Math.floor(Math.random() * 0x75bcd15)
  }
  $locutus.php.uniqidSeed++

  // start with prefix, add current milliseconds hex string
  retId = prefix
  retId += _formatSeed(parseInt(new Date().getTime() / 1000, 10), 8)
  // add seed hex string
  retId += _formatSeed($locutus.php.uniqidSeed, 5)
  if (moreEntropy) {
    // for more entropy we add a float lower to 10
    retId += (Math.random() * 10).toFixed(8).toString()
  }

  return retId
}

function pack (format) {
  //  discuss at: http://locutus.io/php/pack/
  //    parts by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Tim de Koning (http://www.kingsquare.nl)
  //      note 1: Float encoding by: Jonas Raoni Soares Silva
  //      note 1: Home: http://www.kingsquare.nl/blog/12-12-2009/13507444
  //      note 1: Feedback: phpjs-pack@kingsquare.nl
  //      note 1: "machine dependent byte order and size" aren't
  //      note 1: applicable for JavaScript; pack works as on a 32bit,
  //      note 1: little endian machine.
  //   example 1: pack('nvc*', 0x1234, 0x5678, 65, 66)
  //   returns 1: '\u00124xVAB'
  //   example 2: pack('H4', '2345')
  //   returns 2: '#E'
  //   example 3: pack('H*', 'D5')
  //   returns 3: 'Õ'
  //   example 4: pack('d', -100.876)
  //   returns 4: "\u0000\u0000\u0000\u0000\u00008YÀ"
  //        test: skip-1

  var formatPointer = 0
  var argumentPointer = 1
  var result = ''
  var argument = ''
  var i = 0
  var r = []
  var instruction, quantifier, word, precisionBits, exponentBits, extraNullCount

  // vars used by float encoding
  var bias
  var minExp
  var maxExp
  var minUnnormExp
  var status
  var exp
  var len
  var bin
  var signal
  var n
  var intPart
  var floatPart
  var lastBit
  var rounded
  var j
  var k
  var tmpResult

  while (formatPointer < format.length) {
    instruction = format.charAt(formatPointer)
    quantifier = ''
    formatPointer++
    while ((formatPointer < format.length) && (format.charAt(formatPointer)
        .match(/[\d*]/) !== null)) {
      quantifier += format.charAt(formatPointer)
      formatPointer++
    }
    if (quantifier === '') {
      quantifier = '1'
    }

    // Now pack variables: 'quantifier' times 'instruction'
    switch (instruction) {
      case 'a':
      case 'A':
        // NUL-padded string
        // SPACE-padded string
        if (typeof arguments[argumentPointer] === 'undefined') {
          throw new Error('Warning:  pack() Type ' + instruction + ': not enough arguments')
        } else {
          argument = String(arguments[argumentPointer])
        }
        if (quantifier === '*') {
          quantifier = argument.length
        }
        for (i = 0; i < quantifier; i++) {
          if (typeof argument[i] === 'undefined') {
            if (instruction === 'a') {
              result += String.fromCharCode(0)
            } else {
              result += ' '
            }
          } else {
            result += argument[i]
          }
        }
        argumentPointer++
        break
      case 'h':
      case 'H':
        // Hex string, low nibble first
        // Hex string, high nibble first
        if (typeof arguments[argumentPointer] === 'undefined') {
          throw new Error('Warning: pack() Type ' + instruction + ': not enough arguments')
        } else {
          argument = arguments[argumentPointer]
        }
        if (quantifier === '*') {
          quantifier = argument.length
        }
        if (quantifier > argument.length) {
          var msg = 'Warning: pack() Type ' + instruction + ': not enough characters in string'
          throw new Error(msg)
        }

        for (i = 0; i < quantifier; i += 2) {
          // Always get per 2 bytes...
          word = argument[i]
          if (((i + 1) >= quantifier) || typeof argument[i + 1] === 'undefined') {
            word += '0'
          } else {
            word += argument[i + 1]
          }
          // The fastest way to reverse?
          if (instruction === 'h') {
            word = word[1] + word[0]
          }
          result += String.fromCharCode(parseInt(word, 16))
        }
        argumentPointer++
        break

      case 'c':
      case 'C':
        // signed char
        // unsigned char
        // c and C is the same in pack
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer])
          argumentPointer++
        }
        break

      case 's':
      case 'S':
      case 'v':
        // signed short (always 16 bit, machine byte order)
        // unsigned short (always 16 bit, machine byte order)
        // s and S is the same in pack
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
          argumentPointer++
        }
        break

      case 'n':
        // unsigned short (always 16 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning: pack() Type ' + instruction + ': too few arguments')
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
          argumentPointer++
        }
        break

      case 'i':
      case 'I':
      case 'l':
      case 'L':
      case 'V':
        // signed integer (machine dependent size and byte order)
        // unsigned integer (machine dependent size and byte order)
        // signed long (always 32 bit, machine byte order)
        // unsigned long (always 32 bit, machine byte order)
        // unsigned long (always 32 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF)
          argumentPointer++
        }

        break
      case 'N':
        // unsigned long (always 32 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
        }

        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF)
          result += String.fromCharCode(arguments[argumentPointer] & 0xFF)
          argumentPointer++
        }
        break

      case 'f':
      case 'd':
        // float (machine dependent size and representation)
        // double (machine dependent size and representation)
        // version based on IEEE754
        precisionBits = 23
        exponentBits = 8
        if (instruction === 'd') {
          precisionBits = 52
          exponentBits = 11
        }

        if (quantifier === '*') {
          quantifier = arguments.length - argumentPointer
        }
        if (quantifier > (arguments.length - argumentPointer)) {
          throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments')
        }
        for (i = 0; i < quantifier; i++) {
          argument = arguments[argumentPointer]
          bias = Math.pow(2, exponentBits - 1) - 1
          minExp = -bias + 1
          maxExp = bias
          minUnnormExp = minExp - precisionBits
          status = isNaN(n = parseFloat(argument)) || n === -Infinity || n === +Infinity ? n : 0
          exp = 0
          len = 2 * bias + 1 + precisionBits + 3
          bin = new Array(len)
          signal = (n = status !== 0 ? 0 : n) < 0
          n = Math.abs(n)
          intPart = Math.floor(n)
          floatPart = n - intPart

          for (k = len; k;) {
            bin[--k] = 0
          }
          for (k = bias + 2; intPart && k;) {
            bin[--k] = intPart % 2
            intPart = Math.floor(intPart / 2)
          }
          for (k = bias + 1; floatPart > 0 && k; --floatPart) {
            (bin[++k] = ((floatPart *= 2) >= 1) - 0)
          }
          for (k = -1; ++k < len && !bin[k];) {}

          // @todo: Make this more readable:
          var key = (lastBit = precisionBits - 1 +
            (k =
              (exp = bias + 1 - k) >= minExp &&
              exp <= maxExp ? k + 1 : bias + 1 - (exp = minExp - 1))) + 1

          if (bin[key]) {
            if (!(rounded = bin[lastBit])) {
              for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]) {}
            }
            for (j = lastBit + 1; rounded && --j >= 0;
            (bin[j] = !bin[j] - 0) && (rounded = 0)) {}
          }

          for (k = k - 2 < 0 ? -1 : k - 3; ++k < len && !bin[k];) {}

          if ((exp = bias + 1 - k) >= minExp && exp <= maxExp) {
            ++k
          } else {
            if (exp < minExp) {
              if (exp !== bias + 1 - len && exp < minUnnormExp) {
                // "encodeFloat::float underflow"
              }
              k = bias + 1 - (exp = minExp - 1)
            }
          }

          if (intPart || status !== 0) {
            exp = maxExp + 1
            k = bias + 2
            if (status === -Infinity) {
              signal = 1
            } else if (isNaN(status)) {
              bin[k] = 1
            }
          }

          n = Math.abs(exp + bias)
          tmpResult = ''

          for (j = exponentBits + 1; --j;) {
            tmpResult = (n % 2) + tmpResult
            n = n >>= 1
          }

          n = 0
          j = 0
          k = (tmpResult = (signal ? '1' : '0') + tmpResult + (bin
            .slice(k, k + precisionBits)
            .join(''))
          ).length
          r = []

          for (; k;) {
            n += (1 << j) * tmpResult.charAt(--k)
            if (j === 7) {
              r[r.length] = String.fromCharCode(n)
              n = 0
            }
            j = (j + 1) % 8
          }

          r[r.length] = n ? String.fromCharCode(n) : ''
          result += r.join('')
          argumentPointer++
        }
        break

      case 'x':
        // NUL byte
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type x: \'*\' ignored')
        }
        for (i = 0; i < quantifier; i++) {
          result += String.fromCharCode(0)
        }
        break

      case 'X':
        // Back up one byte
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type X: \'*\' ignored')
        }
        for (i = 0; i < quantifier; i++) {
          if (result.length === 0) {
            throw new Error('Warning: pack(): Type X:' + ' outside of string')
          } else {
            result = result.substring(0, result.length - 1)
          }
        }
        break

      case '@':
        // NUL-fill to absolute position
        if (quantifier === '*') {
          throw new Error('Warning: pack(): Type X: \'*\' ignored')
        }
        if (quantifier > result.length) {
          extraNullCount = quantifier - result.length
          for (i = 0; i < extraNullCount; i++) {
            result += String.fromCharCode(0)
          }
        }
        if (quantifier < result.length) {
          result = result.substring(0, quantifier)
        }
        break

      default:
        throw new Error('Warning: pack() Type ' + instruction + ': unknown format code')
    }
  }
  if (argumentPointer < arguments.length) {
    var msg2 = 'Warning: pack(): ' + (arguments.length - argumentPointer) + ' arguments unused'
    throw new Error(msg2)
  }

  return result
}

/**
 * NET-GOPHER
 */

function gopher_parsedir (dirent) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/gopher_parsedir/
  //   example 1: var entry = gopher_parsedir('0All about my gopher site.\t/allabout.txt\tgopher.example.com\t70\u000d\u000a')
  //   example 1: entry.title
  //   returns 1: 'All about my gopher site.'

  /* Types
   * 0 = plain text file
   * 1 = directory menu listing
   * 2 = CSO search query
   * 3 = error message
   * 4 = BinHex encoded text file
   * 5 = binary archive file
   * 6 = UUEncoded text file
   * 7 = search engine query
   * 8 = telnet session pointer
   * 9 = binary file
   * g = Graphics file format, primarily a GIF file
   * h = HTML file
   * i = informational message
   * s = Audio file format, primarily a WAV file
   */

  var entryPattern = /^(.)(.*?)\t(.*?)\t(.*?)\t(.*?)\u000d\u000a$/
  var entry = dirent.match(entryPattern)

  if (entry === null) {
    throw new Error('Could not parse the directory entry')
    // return false;
  }

  var type = entry[1]
  switch (type) {
    case 'i':
    // GOPHER_INFO
      type = 255
      break
    case '1':
    // GOPHER_DIRECTORY
      type = 1
      break
    case '0':
    // GOPHER_DOCUMENT
      type = 0
      break
    case '4':
    // GOPHER_BINHEX
      type = 4
      break
    case '5':
    // GOPHER_DOSBINARY
      type = 5
      break
    case '6':
    // GOPHER_UUENCODED
      type = 6
      break
    case '9':
    // GOPHER_BINARY
      type = 9
      break
    case 'h':
    // GOPHER_HTTP
      type = 254
      break
    default:
      return {
        type: -1,
        data: dirent
      } // GOPHER_UNKNOWN
  }
  return {
    type: type,
    title: entry[2],
    path: entry[3],
    host: entry[4],
    port: entry[5]
  }
}

/**
 * NETWORK
 */

function inet_ntop (a) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/inet_ntop/
  //   example 1: inet_ntop('\x7F\x00\x00\x01')
  //   returns 1: '127.0.0.1'
  //   _example 2: inet_ntop('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\1')
  //   _returns 2: '::1'

  var i = 0
  var m = ''
  var c = []

  a += ''
  if (a.length === 4) {
    // IPv4
    return [
      a.charCodeAt(0),
      a.charCodeAt(1),
      a.charCodeAt(2),
      a.charCodeAt(3)
    ].join('.')
  } else if (a.length === 16) {
    // IPv6
    for (i = 0; i < 16; i++) {
      c.push(((a.charCodeAt(i++) << 8) + a.charCodeAt(i)).toString(16))
    }
    return c.join(':')
      .replace(/((^|:)0(?=:|$))+:?/g, function (t) {
        m = (t.length > m.length) ? t : m
        return t
      })
      .replace(m || ' ', '::')
  } else {
    // Invalid length
    return false
  }
}

function long2ip (ip) {
  //  discuss at: http://locutus.io/php/long2ip/
  //   example 1: long2ip( 3221234342 )
  //   returns 1: '192.0.34.166'

  if (!isFinite(ip)) {
    return false
  }

  return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.')
}

function setrawcookie (name, value, expires, path, domain, secure) {
  //  discuss at: http://locutus.io/php/setrawcookie/
  //    input by: Michael
  //      note 1: This function requires access to the `window` global and is Browser-only
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: setrawcookie('author_name', 'Kevin van Zonneveld')
  //   returns 1: true

  if (typeof window === 'undefined') {
    return true
  }

  if (typeof expires === 'string' && (/^\d+$/).test(expires)) {
    expires = parseInt(expires, 10)
  }

  if (expires instanceof Date) {
    expires = expires.toUTCString()
  } else if (typeof expires === 'number') {
    expires = (new Date(expires * 1e3)).toUTCString()
  }

  var r = [name + '=' + value]
  var i = ''
  var s = {
    expires: expires,
    path: path,
    domain: domain
  }
  for (i in s) {
    if (s.hasOwnProperty(i)) {
      // Exclude items on Object.prototype
      s[i] && r.push(i + '=' + s[i])
    }
  }

  if (secure) {
    r.push('secure')
  }

  window.document.cookie = r.join(';')

  return true
}

function setcookie (name, value, expires, path, domain, secure) {
  //  discuss at: http://locutus.io/php/setcookie/
  // bugfixed by: Andreas
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: setcookie('author_name', 'Kevin van Zonneveld')
  //   returns 1: true

  var setrawcookie = require('../network/setrawcookie')
  return setrawcookie(name, encodeURIComponent(value), expires, path, domain, secure)
}

function ip2long (argIP) {
  //  discuss at: http://locutus.io/php/ip2long/
  //  revised by: fearphage (http://http/my.opera.com/fearphage/)
  //  revised by: Theriault (https://github.com/Theriault)
  //    estarget: es2015
  //   example 1: ip2long('192.0.34.166')
  //   returns 1: 3221234342
  //   example 2: ip2long('0.0xABCDEF')
  //   returns 2: 11259375
  //   example 3: ip2long('255.255.255.256')
  //   returns 3: false

  var i = 0;
  // PHP allows decimal, octal, and hexadecimal IP components.
  // PHP allows between 1 (e.g. 127) to 4 (e.g 127.0.0.1) components.

  const pattern = new RegExp([
    '^([1-9]\\d*|0[0-7]*|0x[\\da-f]+)',
    '(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?',
    '(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?',
    '(?:\\.([1-9]\\d*|0[0-7]*|0x[\\da-f]+))?$'
  ].join(''), 'i')

  argIP = argIP.match(pattern) // Verify argIP format.
  if (!argIP) {
    // Invalid format.
    return false
  }
  // Reuse argIP variable for component counter.
  argIP[0] = 0
  for (i = 1; i < 5; i += 1) {
    argIP[0] += !!((argIP[i] || '').length)
    argIP[i] = parseInt(argIP[i]) || 0
  }
  // Continue to use argIP for overflow values.
  // PHP does not allow any component to overflow.
  argIP.push(256, 256, 256, 256)
  // Recalculate overflow of last component supplied to make up for missing components.
  argIP[4 + argIP[0]] *= Math.pow(256, 4 - argIP[0])
  if (argIP[1] >= argIP[5] ||
    argIP[2] >= argIP[6] ||
    argIP[3] >= argIP[7] ||
    argIP[4] >= argIP[8]) {
    return false
  }

  return argIP[1] * (argIP[0] === 1 || 16777216) +
    argIP[2] * (argIP[0] <= 2 || 65536) +
    argIP[3] * (argIP[0] <= 3 || 256) +
    argIP[4] * 1
}

function inet_pton (a) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/inet_pton/
  //   example 1: inet_pton('::')
  //   returns 1: '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0'
  //   example 2: inet_pton('127.0.0.1')
  //   returns 2: '\x7F\x00\x00\x01'

  var r
  var m
  var x
  var i
  var j
  var f = String.fromCharCode

  // IPv4
  m = a.match(/^(?:\d{1,3}(?:\.|$)){4}/)
  if (m) {
    m = m[0].split('.')
    m = f(m[0]) + f(m[1]) + f(m[2]) + f(m[3])
    // Return if 4 bytes, otherwise false.
    return m.length === 4 ? m : false
  }
  r = /^((?:[\da-f]{1,4}(?::|)){0,8})(::)?((?:[\da-f]{1,4}(?::|)){0,8})$/

  // IPv6
  m = a.match(r)
  if (m) {
    // Translate each hexadecimal value.
    for (j = 1; j < 4; j++) {
      // Indice 2 is :: and if no length, continue.
      if (j === 2 || m[j].length === 0) {
        continue
      }
      m[j] = m[j].split(':')
      for (i = 0; i < m[j].length; i++) {
        m[j][i] = parseInt(m[j][i], 16)
        // Would be NaN if it was blank, return false.
        if (isNaN(m[j][i])) {
          // Invalid IP.
          return false
        }
        m[j][i] = f(m[j][i] >> 8) + f(m[j][i] & 0xFF)
      }
      m[j] = m[j].join('')
    }
    x = m[1].length + m[3].length
    if (x === 16) {
      return m[1] + m[3]
    } else if (x < 16 && m[2].length > 0) {
      return m[1] + (new Array(16 - x + 1))
        .join('\x00') + m[3]
    }
  }

  // Invalid IP
  return false
}

function preg_quote (str, delimiter) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/preg_quote/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: preg_quote("$40")
  //   returns 1: '\\$40'
  //   example 2: preg_quote("*RRRING* Hello?")
  //   returns 2: '\\*RRRING\\* Hello\\?'
  //   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:")
  //   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'

  return (str + '')
    .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&')
}

function sql_regcase (str) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/sql_regcase/
  //   example 1: sql_regcase('Foo - bar.')
  //   returns 1: '[Ff][Oo][Oo] - [Bb][Aa][Rr].'

  var setlocale = require('../strings/setlocale')
  var i = 0
  var upper = ''
  var lower = ''
  var pos = 0
  var retStr = ''

  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  upper = $locutus.php.locales[$locutus.php.localeCategories.LC_CTYPE].LC_CTYPE.upper
  lower = $locutus.php.locales[$locutus.php.localeCategories.LC_CTYPE].LC_CTYPE.lower

  // @todo: Make this more readable
  for (i = 0; i < str.length; i++) {
    if (((pos = upper.indexOf(str.charAt(i))) !== -1) ||
      ((pos = lower.indexOf(str.charAt(i))) !== -1)) {
      retStr += '[' + upper.charAt(pos) + lower.charAt(pos) + ']'
    } else {
      retStr += str.charAt(i)
    }
  }

  return retStr
}

/**
 * SCRIPT
 */

function addslashes (str) {
  //  discuss at: http://locutus.io/php/addslashes/
  //    input by: Denny Wardhana
  //   example 1: addslashes("kevin's birthday")
  //   returns 1: "kevin\\'s birthday"

  return (str + '')
    .replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0')
}

function html_entity_decode (string, quoteStyle) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/html_entity_decode/
  //    input by: ger
  //    input by: Ratheous
  //    input by: Nick Kolosov (http://sammy.ru)
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Fox
  //   example 1: html_entity_decode('Kevin &amp; van Zonneveld')
  //   returns 1: 'Kevin & van Zonneveld'
  //   example 2: html_entity_decode('&amp;lt;')
  //   returns 2: '&lt;'

  var getHtmlTranslationTable = require('../strings/get_html_translation_table')
  var tmpStr = ''
  var entity = ''
  var symbol = ''
  tmpStr = string.toString()

  var hashMap = getHtmlTranslationTable('HTML_ENTITIES', quoteStyle)
  if (hashMap === false) {
    return false
  }

  // @todo: &amp; problem
  // http://locutus.io/php/get_html_translation_table:416#comment_97660
  delete (hashMap['&'])
  hashMap['&'] = '&amp;'

  for (symbol in hashMap) {
    entity = hashMap[symbol]
    tmpStr = tmpStr.split(entity).join(symbol)
  }
  tmpStr = tmpStr.split('&#039;').join("'")

  return tmpStr
}

function htmlentities (string, quoteStyle, charset, doubleEncode) {
  //  discuss at: http://locutus.io/php/htmlentities/
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: Ratheous
  //      note 1: function is compatible with PHP 5.2 and older
  //   example 1: htmlentities('Kevin & van Zonneveld')
  //   returns 1: 'Kevin &amp; van Zonneveld'
  //   example 2: htmlentities("foo'bar","ENT_QUOTES")
  //   returns 2: 'foo&#039;bar'

  var getHtmlTranslationTable = require('../strings/get_html_translation_table')
  var hashMap = getHtmlTranslationTable('HTML_ENTITIES', quoteStyle)

  string = string === null ? '' : string + ''

  if (!hashMap) {
    return false
  }

  if (quoteStyle && quoteStyle === 'ENT_QUOTES') {
    hashMap["'"] = '&#039;'
  }

  doubleEncode = doubleEncode === null || !!doubleEncode

  var regex = new RegExp('&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[' +
    Object.keys(hashMap)
    .join('')
    // replace regexp special chars
    .replace(/([()[\]{}\-.*+?^$|/\\])/g, '\\$1') + ']',
    'g')

  return string.replace(regex, function (ent) {
    if (ent.length > 1) {
      return doubleEncode ? hashMap['&'] + ent.substr(1) : ent
    }

    return hashMap[ent]
  })
}

function chunk_split (body, chunklen, end) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/chunk_split/
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: chunk_split('Hello world!', 1, '*')
  //   returns 1: 'H*e*l*l*o* *w*o*r*l*d*!*'
  //   example 2: chunk_split('Hello world!', 10, '*')
  //   returns 2: 'Hello worl*d!*'

  chunklen = parseInt(chunklen, 10) || 76
  end = end || '\r\n'

  if (chunklen < 1) {
    return false
  }

  return body.match(new RegExp('.{0,' + chunklen + '}', 'g'))
    .join(end)
}

function htmlspecialchars (string, quoteStyle, charset, doubleEncode) {
  //       discuss at: http://locutus.io/php/htmlspecialchars/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Nathan
  //      bugfixed by: Arno
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //       revised by: Kevin van Zonneveld (http://kvz.io)
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //         input by: felix
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //           note 1: charset argument not supported
  //        example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES')
  //        returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
  //        example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES'])
  //        returns 2: 'ab"c&#039;d'
  //        example 3: htmlspecialchars('my "&entity;" is still here', null, null, false)
  //        returns 3: 'my &quot;&entity;&quot; is still here'

  var optTemp = 0
  var i = 0
  var noquotes = false
  if (typeof quoteStyle === 'undefined' || quoteStyle === null) {
    quoteStyle = 2
  }
  string = string || ''
  string = string.toString()

  if (doubleEncode !== false) {
    // Put this first to avoid double-encoding
    string = string.replace(/&/g, '&amp;')
  }

  string = string
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  }
  if (quoteStyle === 0) {
    noquotes = true
  }
  if (typeof quoteStyle !== 'number') {
    // Allow for a single string or an array of string flags
    quoteStyle = [].concat(quoteStyle)
    for (i = 0; i < quoteStyle.length; i++) {
      // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
      if (OPTS[quoteStyle[i]] === 0) {
        noquotes = true
      } else if (OPTS[quoteStyle[i]]) {
        optTemp = optTemp | OPTS[quoteStyle[i]]
      }
    }
    quoteStyle = optTemp
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    string = string.replace(/'/g, '&#039;')
  }
  if (!noquotes) {
    string = string.replace(/"/g, '&quot;')
  }

  return string
}

function convert_uuencode (str) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/convert_uuencode/
  //      original by: Ole Vrijenhoek
  //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  // reimplemented by: Ole Vrijenhoek
  //        example 1: convert_uuencode("test\ntext text\r\n")
  //        returns 1: "0=&5S=`IT97AT('1E>'0-\"@\n`\n"

  var isScalar = require('../var/is_scalar')

  var chr = function (c) {
    return String.fromCharCode(c)
  }

  if (!str || str === '') {
    return chr(0)
  } else if (!isScalar(str)) {
    return false
  }

  var c = 0
  var u = 0
  var i = 0
  var a = 0
  var encoded = ''
  var tmp1 = ''
  var tmp2 = ''
  var bytes = {}

  // divide string into chunks of 45 characters
  var chunk = function () {
    bytes = str.substr(u, 45).split('')
    for (i in bytes) {
      bytes[i] = bytes[i].charCodeAt(0)
    }
    return bytes.length || 0
  }

  while ((c = chunk()) !== 0) {
    u += 45

    // New line encoded data starts with number of bytes encoded.
    encoded += chr(c + 32)

    // Convert each char in bytes[] to a byte
    for (i in bytes) {
      tmp1 = bytes[i].toString(2)
      while (tmp1.length < 8) {
        tmp1 = '0' + tmp1
      }
      tmp2 += tmp1
    }

    while (tmp2.length % 6) {
      tmp2 = tmp2 + '0'
    }

    for (i = 0; i <= (tmp2.length / 6) - 1; i++) {
      tmp1 = tmp2.substr(a, 6)
      if (tmp1 === '000000') {
        encoded += chr(96)
      } else {
        encoded += chr(parseInt(tmp1, 2) + 32)
      }
      a += 6
    }
    a = 0
    tmp2 = ''
    encoded += '\n'
  }

  // Add termination characters
  encoded += chr(96) + '\n'

  return encoded
}

function chop (str, charlist) {
  //  discuss at: http://locutus.io/php/chop/
  //   example 1: chop('    Kevin van Zonneveld    ')
  //   returns 1: '    Kevin van Zonneveld'

  var rtrim = require('../strings/rtrim')
  return rtrim(str, charlist)
}

function count_chars (str, mode) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/count_chars/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Theriault (https://github.com/Theriault)
  //   example 1: count_chars("Hello World!", 3)
  //   returns 1: " !HWdelor"
  //   example 2: count_chars("Hello World!", 1)
  //   returns 2: {32:1,33:1,72:1,87:1,100:1,101:1,108:3,111:2,114:1}

  var result = {}
  var resultArr = []
  var i

  str = ('' + str)
    .split('')
    .sort()
    .join('')
    .match(/(.)\1*/g)

  if ((mode & 1) === 0) {
    for (i = 0; i !== 256; i++) {
      result[i] = 0
    }
  }

  if (mode === 2 || mode === 4) {
    for (i = 0; i !== str.length; i += 1) {
      delete result[str[i].charCodeAt(0)]
    }
    for (i in result) {
      result[i] = (mode === 4) ? String.fromCharCode(i) : 0
    }
  } else if (mode === 3) {
    for (i = 0; i !== str.length; i += 1) {
      result[i] = str[i].slice(0, 1)
    }
  } else {
    for (i = 0; i !== str.length; i += 1) {
      result[str[i].charCodeAt(0)] = str[i].length
    }
  }
  if (mode < 3) {
    return result
  }

  for (i in result) {
    resultArr.push(result[i])
  }

  return resultArr.join('')
}

function explode (delimiter, string, limit) {
  //  discuss at: http://locutus.io/php/explode/
  //   example 1: explode(' ', 'Kevin van Zonneveld')
  //   returns 1: [ 'Kevin', 'van', 'Zonneveld' ]

  if (arguments.length < 2 ||
    typeof delimiter === 'undefined' ||
    typeof string === 'undefined') {
    return null
  }
  if (delimiter === '' ||
    delimiter === false ||
    delimiter === null) {
    return false
  }
  if (typeof delimiter === 'function' ||
    typeof delimiter === 'object' ||
    typeof string === 'function' ||
    typeof string === 'object') {
    return {
      0: ''
    }
  }
  if (delimiter === true) {
    delimiter = '1'
  }

  // Here we go...
  delimiter += ''
  string += ''

  var s = string.split(delimiter)

  if (typeof limit === 'undefined') return s

  // Support for limit
  if (limit === 0) limit = 1

  // Positive limit
  if (limit > 0) {
    if (limit >= s.length) {
      return s
    }
    return s
      .slice(0, limit - 1)
      .concat([s.slice(limit - 1)
        .join(delimiter)
      ])
  }

  // Negative limit
  if (-limit >= s.length) {
    return []
  }

  s.splice(s.length + limit)
  return s
}

function implode (glue, pieces) {
  //  discuss at: http://locutus.io/php/implode/
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
  //   returns 2: 'Kevin van Zonneveld'

  var i = ''
  var retVal = ''
  var tGlue = ''

  if (arguments.length === 1) {
    pieces = glue
    glue = ''
  }

  if (typeof pieces === 'object') {
    if (Object.prototype.toString.call(pieces) === '[object Array]') {
      return pieces.join(glue)
    }
    for (i in pieces) {
      retVal += tGlue + pieces[i]
      tGlue = glue
    }
    return retVal
  }

  return pieces
}

function join (glue, pieces) {
  //  discuss at: http://locutus.io/php/join/
  //   example 1: join(' ', ['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'Kevin van Zonneveld'

  var implode = require('../strings/implode')
  return implode(glue, pieces)
}

function levenshtein (s1, s2, costIns, costRep, costDel) {
  //       discuss at: http://locutus.io/php/levenshtein/
  //      original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //       revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  // reimplemented by: Alexander M Beedie
  // reimplemented by: Rafał Kukawski (http://blog.kukawski.pl)
  //        example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld')
  //        returns 1: 3
  //        example 2: levenshtein("carrrot", "carrots")
  //        returns 2: 2
  //        example 3: levenshtein("carrrot", "carrots", 2, 3, 4)
  //        returns 3: 6

  // var LEVENSHTEIN_MAX_LENGTH = 255 // PHP limits the function to max 255 character-long strings

  costIns = costIns == null ? 1 : +costIns
  costRep = costRep == null ? 1 : +costRep
  costDel = costDel == null ? 1 : +costDel

  if (s1 === s2) {
    return 0
  }

  var l1 = s1.length
  var l2 = s2.length

  if (l1 === 0) {
    return l2 * costIns
  }
  if (l2 === 0) {
    return l1 * costDel
  }

  // Enable the 3 lines below to set the same limits on string length as PHP does
  // if (l1 > LEVENSHTEIN_MAX_LENGTH || l2 > LEVENSHTEIN_MAX_LENGTH) {
  //   return -1;
  // }

  var split = false
  try {
    split = !('0')[0]
  } catch (e) {
    // Earlier IE may not support access by string index
    split = true
  }

  if (split) {
    s1 = s1.split('')
    s2 = s2.split('')
  }

  var p1 = new Array(l2 + 1)
  var p2 = new Array(l2 + 1)

  var i1, i2, c0, c1, c2, tmp

  for (i2 = 0; i2 <= l2; i2++) {
    p1[i2] = i2 * costIns
  }

  for (i1 = 0; i1 < l1; i1++) {
    p2[0] = p1[0] + costDel

    for (i2 = 0; i2 < l2; i2++) {
      c0 = p1[i2] + ((s1[i1] === s2[i2]) ? 0 : costRep)
      c1 = p1[i2 + 1] + costDel

      if (c1 < c0) {
        c0 = c1
      }

      c2 = p2[i2] + costIns

      if (c2 < c0) {
        c0 = c2
      }

      p2[i2 + 1] = c0
    }

    tmp = p1
    p1 = p2
    p2 = tmp
  }

  c0 = p1[l2]

  return c0
}

function md5_file (str_filename) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/md5_file/
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      note 1: Relies on file_get_contents which does not work in the browser, so Node only.
  //      note 2: Keep in mind that in accordance with PHP, the whole file is buffered and then
  //      note 2: hashed. We'd recommend Node's native crypto modules for faster and more
  //      note 2: efficient hashing
  //   example 1: md5_file('test/never-change.txt')
  //   returns 1: 'bc3aa724b0ec7dce4c26e7f4d0d9b064'

  var fileGetContents = require('../filesystem/file_get_contents')
  var md5 = require('../strings/md5')
  var buf = fileGetContents(str_filename)

  if (buf === false) {
    return false
  }

  return md5(buf)
}

function metaphone (word, maxPhonemes) {
  //  discuss at: http://locutus.io/php/metaphone/
  //   example 1: metaphone('Gnu')
  //   returns 1: 'N'
  //   example 2: metaphone('bigger')
  //   returns 2: 'BKR'
  //   example 3: metaphone('accuracy')
  //   returns 3: 'AKKRS'
  //   example 4: metaphone('batch batcher')
  //   returns 4: 'BXBXR'

  var type = typeof word

  if (type === 'undefined' || type === 'object' && word !== null) {
    // weird!
    return null
  }

  // infinity and NaN values are treated as strings
  if (type === 'number') {
    if (isNaN(word)) {
      word = 'NAN'
    } else if (!isFinite(word)) {
      word = 'INF'
    }
  }

  if (maxPhonemes < 0) {
    return false
  }

  maxPhonemes = Math.floor(+maxPhonemes) || 0

  // alpha depends on locale, so this var might need an update
  // or should be turned into a regex
  // for now assuming pure a-z
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var vowel = 'AEIOU'
  var soft = 'EIY'
  var leadingNonAlpha = new RegExp('^[^' + alpha + ']+')

  word = typeof word === 'string' ? word : ''
  word = word.toUpperCase().replace(leadingNonAlpha, '')

  if (!word) {
    return ''
  }

  var is = function (p, c) {
    return c !== '' && p.indexOf(c) !== -1
  }

  var i = 0
  var cc = word.charAt(0) // current char. Short name because it's used all over the function
  var nc = word.charAt(1)  // next char
  var nnc // after next char
  var pc // previous char
  var l = word.length
  var meta = ''
  // traditional is an internal param that could be exposed for now let it be a local var
  var traditional = true

  switch (cc) {
    case 'A':
      meta += nc === 'E' ? nc : cc
      i += 1
      break
    case 'G':
    case 'K':
    case 'P':
      if (nc === 'N') {
        meta += nc
        i += 2
      }
      break
    case 'W':
      if (nc === 'R') {
        meta += nc
        i += 2
      } else if (nc === 'H' || is(vowel, nc)) {
        meta += 'W'
        i += 2
      }
      break
    case 'X':
      meta += 'S'
      i += 1
      break
    case 'E':
    case 'I':
    case 'O':
    case 'U':
      meta += cc
      i++
      break
  }

  for (; i < l && (maxPhonemes === 0 || meta.length < maxPhonemes); i += 1) { // eslint-disable-line no-unmodified-loop-condition,max-len
    cc = word.charAt(i)
    nc = word.charAt(i + 1)
    pc = word.charAt(i - 1)
    nnc = word.charAt(i + 2)

    if (cc === pc && cc !== 'C') {
      continue
    }

    switch (cc) {
      case 'B':
        if (pc !== 'M') {
          meta += cc
        }
        break
      case 'C':
        if (is(soft, nc)) {
          if (nc === 'I' && nnc === 'A') {
            meta += 'X'
          } else if (pc !== 'S') {
            meta += 'S'
          }
        } else if (nc === 'H') {
          meta += !traditional && (nnc === 'R' || pc === 'S') ? 'K' : 'X'
          i += 1
        } else {
          meta += 'K'
        }
        break
      case 'D':
        if (nc === 'G' && is(soft, nnc)) {
          meta += 'J'
          i += 1
        } else {
          meta += 'T'
        }
        break
      case 'G':
        if (nc === 'H') {
          if (!(is('BDH', word.charAt(i - 3)) || word.charAt(i - 4) === 'H')) {
            meta += 'F'
            i += 1
          }
        } else if (nc === 'N') {
          if (is(alpha, nnc) && word.substr(i + 1, 3) !== 'NED') {
            meta += 'K'
          }
        } else if (is(soft, nc) && pc !== 'G') {
          meta += 'J'
        } else {
          meta += 'K'
        }
        break
      case 'H':
        if (is(vowel, nc) && !is('CGPST', pc)) {
          meta += cc
        }
        break
      case 'K':
        if (pc !== 'C') {
          meta += 'K'
        }
        break
      case 'P':
        meta += nc === 'H' ? 'F' : cc
        break
      case 'Q':
        meta += 'K'
        break
      case 'S':
        if (nc === 'I' && is('AO', nnc)) {
          meta += 'X'
        } else if (nc === 'H') {
          meta += 'X'
          i += 1
        } else if (!traditional && word.substr(i + 1, 3) === 'CHW') {
          meta += 'X'
          i += 2
        } else {
          meta += 'S'
        }
        break
      case 'T':
        if (nc === 'I' && is('AO', nnc)) {
          meta += 'X'
        } else if (nc === 'H') {
          meta += '0'
          i += 1
        } else if (word.substr(i + 1, 2) !== 'CH') {
          meta += 'T'
        }
        break
      case 'V':
        meta += 'F'
        break
      case 'W':
      case 'Y':
        if (is(vowel, nc)) {
          meta += cc
        }
        break
      case 'X':
        meta += 'KS'
        break
      case 'Z':
        meta += 'S'
        break
      case 'F':
      case 'J':
      case 'L':
      case 'M':
      case 'N':
      case 'R':
        meta += cc
        break
    }
  }

  return meta
}

function md5 (str) {
  //  discuss at: http://locutus.io/php/md5/
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      note 1: Keep in mind that in accordance with PHP, the whole string is buffered and then
  //      note 1: hashed. If available, we'd recommend using Node's native crypto modules directly
  //      note 1: in a steaming fashion for faster and more efficient hashing
  //   example 1: md5('Kevin van Zonneveld')
  //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

  var hash
  try {
    var crypto = require('crypto')
    var md5sum = crypto.createHash('md5')
    md5sum.update(str)
    hash = md5sum.digest('hex')
  } catch (e) {
    hash = undefined
  }

  if (hash !== undefined) {
    return hash
  }

  var utf8Encode = require('../xml/utf8_encode')
  var xl

  var _rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
  }

  var _addUnsigned = function (lX, lY) {
    var lX4, lY4, lX8, lY8, lResult
    lX8 = (lX & 0x80000000)
    lY8 = (lY & 0x80000000)
    lX4 = (lX & 0x40000000)
    lY4 = (lY & 0x40000000)
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
      }
    } else {
      return (lResult ^ lX8 ^ lY8)
    }
  }

  var _F = function (x, y, z) {
    return (x & y) | ((~x) & z)
  }
  var _G = function (x, y, z) {
    return (x & z) | (y & (~z))
  }
  var _H = function (x, y, z) {
    return (x ^ y ^ z)
  }
  var _I = function (x, y, z) {
    return (y ^ (x | (~z)))
  }

  var _FF = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_F(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _GG = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_G(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _HH = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_H(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _II = function (a, b, c, d, x, s, ac) {
    a = _addUnsigned(a, _addUnsigned(_addUnsigned(_I(b, c, d), x), ac))
    return _addUnsigned(_rotateLeft(a, s), b)
  }

  var _convertToWordArray = function (str) {
    var lWordCount
    var lMessageLength = str.length
    var lNumberOfWordsTemp1 = lMessageLength + 8
    var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64
    var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16
    var lWordArray = new Array(lNumberOfWords - 1)
    var lBytePosition = 0
    var lByteCount = 0
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4
      lBytePosition = (lByteCount % 4) * 8
      lWordArray[lWordCount] = (lWordArray[lWordCount] |
        (str.charCodeAt(lByteCount) << lBytePosition))
      lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4
    lBytePosition = (lByteCount % 4) * 8
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
    return lWordArray
  }

  var _wordToHex = function (lValue) {
    var wordToHexValue = ''
    var wordToHexValueTemp = ''
    var lByte
    var lCount

    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255
      wordToHexValueTemp = '0' + lByte.toString(16)
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2)
    }
    return wordToHexValue
  }

  var x = []
  var k
  var AA
  var BB
  var CC
  var DD
  var a
  var b
  var c
  var d
  var S11 = 7
  var S12 = 12
  var S13 = 17
  var S14 = 22
  var S21 = 5
  var S22 = 9
  var S23 = 14
  var S24 = 20
  var S31 = 4
  var S32 = 11
  var S33 = 16
  var S34 = 23
  var S41 = 6
  var S42 = 10
  var S43 = 15
  var S44 = 21

  str = utf8Encode(str)
  x = _convertToWordArray(str)
  a = 0x67452301
  b = 0xEFCDAB89
  c = 0x98BADCFE
  d = 0x10325476

  xl = x.length
  for (k = 0; k < xl; k += 16) {
    AA = a
    BB = b
    CC = c
    DD = d
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453)
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244)
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314)
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
    a = _addUnsigned(a, AA)
    b = _addUnsigned(b, BB)
    c = _addUnsigned(c, CC)
    d = _addUnsigned(d, DD)
  }

  var temp = _wordToHex(a) + _wordToHex(b) + _wordToHex(c) + _wordToHex(d)

  return temp.toLowerCase()
}

function money_format (format, number) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/money_format/
  //    input by: daniel airton wermann (http://wermann.com.br)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: This depends on setlocale having the appropriate
  //      note 1: locale (these examples use 'en_US')
  //   example 1: money_format('%i', 1234.56)
  //   returns 1: ' USD 1,234.56'
  //   example 2: money_format('%14#8.2n', 1234.5678)
  //   returns 2: ' $     1,234.57'
  //   example 3: money_format('%14#8.2n', -1234.5678)
  //   returns 3: '-$     1,234.57'
  //   example 4: money_format('%(14#8.2n', 1234.5678)
  //   returns 4: ' $     1,234.57 '
  //   example 5: money_format('%(14#8.2n', -1234.5678)
  //   returns 5: '($     1,234.57)'
  //   example 6: money_format('%=014#8.2n', 1234.5678)
  //   returns 6: ' $000001,234.57'
  //   example 7: money_format('%=014#8.2n', -1234.5678)
  //   returns 7: '-$000001,234.57'
  //   example 8: money_format('%=*14#8.2n', 1234.5678)
  //   returns 8: ' $*****1,234.57'
  //   example 9: money_format('%=*14#8.2n', -1234.5678)
  //   returns 9: '-$*****1,234.57'
  //  example 10: money_format('%=*^14#8.2n', 1234.5678)
  //  returns 10: '  $****1234.57'
  //  example 11: money_format('%=*^14#8.2n', -1234.5678)
  //  returns 11: ' -$****1234.57'
  //  example 12: money_format('%=*!14#8.2n', 1234.5678)
  //  returns 12: ' *****1,234.57'
  //  example 13: money_format('%=*!14#8.2n', -1234.5678)
  //  returns 13: '-*****1,234.57'
  //  example 14: money_format('%i', 3590)
  //  returns 14: ' USD 3,590.00'

  var setlocale = require('../strings/setlocale')

  // Per PHP behavior, there seems to be no extra padding
  // for sign when there is a positive number, though my
  // understanding of the description is that there should be padding;
  // need to revisit examples

  // Helpful info at http://ftp.gnu.org/pub/pub/old-gnu/Manuals/glibc-2.2.3/html_chapter/libc_7.html
  // and http://publib.boulder.ibm.com/infocenter/zos/v1r10/index.jsp?topic=/com.ibm.zos.r10.bpxbd00/strfmp.htm

  if (typeof number !== 'number') {
    return null
  }
  // 1: flags, 3: width, 5: left, 7: right, 8: conversion
  var regex = /%((=.|[+^(!-])*?)(\d*?)(#(\d+))?(\.(\d+))?([in%])/g

  // Ensure the locale data we need is set up
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  var monetary = $locutus.php.locales[$locutus.php.localeCategories.LC_MONETARY].LC_MONETARY

  var doReplace = function (n0, flags, n2, width, n4, left, n6, right, conversion) {
    var value = ''
    var repl = ''
    if (conversion === '%') {
      // Percent does not seem to be allowed with intervening content
      return '%'
    }
    var fill = flags && (/=./).test(flags) ? flags.match(/=(.)/)[1] : ' ' // flag: =f (numeric fill)
    // flag: ! (suppress currency symbol)
    var showCurrSymbol = !flags || flags.indexOf('!') === -1
    // field width: w (minimum field width)
    width = parseInt(width, 10) || 0

    var neg = number < 0
    // Convert to string
    number = number + ''
    // We don't want negative symbol represented here yet
    number = neg ? number.slice(1) : number

    var decpos = number.indexOf('.')
    // Get integer portion
    var integer = decpos !== -1 ? number.slice(0, decpos) : number
    // Get decimal portion
    var fraction = decpos !== -1 ? number.slice(decpos + 1) : ''

    var _strSplice = function (integerStr, idx, thouSep) {
      var integerArr = integerStr.split('')
      integerArr.splice(idx, 0, thouSep)
      return integerArr.join('')
    }

    var intLen = integer.length
    left = parseInt(left, 10)
    var filler = intLen < left
    if (filler) {
      var fillnum = left - intLen
      integer = new Array(fillnum + 1).join(fill) + integer
    }
    if (flags.indexOf('^') === -1) {
      // flag: ^ (disable grouping characters (of locale))
      // use grouping characters
      // ','
      var thouSep = monetary.mon_thousands_sep
      // [3] (every 3 digits in U.S.A. locale)
      var monGrouping = monetary.mon_grouping

      if (monGrouping[0] < integer.length) {
        for (var i = 0, idx = integer.length; i < monGrouping.length; i++) {
          // e.g., 3
          idx -= monGrouping[i]
          if (idx <= 0) {
            break
          }
          if (filler && idx < fillnum) {
            thouSep = fill
          }
          integer = _strSplice(integer, idx, thouSep)
        }
      }
      if (monGrouping[i - 1] > 0) {
        // Repeating last grouping (may only be one) until highest portion of integer reached
        while (idx > monGrouping[i - 1]) {
          idx -= monGrouping[i - 1]
          if (filler && idx < fillnum) {
            thouSep = fill
          }
          integer = _strSplice(integer, idx, thouSep)
        }
      }
    }

    // left, right
    if (right === '0') {
      // No decimal or fractional digits
      value = integer
    } else {
      // '.'
      var decPt = monetary.mon_decimal_point
      if (right === '' || right === undefined) {
        right = conversion === 'i' ? monetary.int_frac_digits : monetary.frac_digits
      }
      right = parseInt(right, 10)

      if (right === 0) {
        // Only remove fractional portion if explicitly set to zero digits
        fraction = ''
        decPt = ''
      } else if (right < fraction.length) {
        fraction = Math.round(parseFloat(
          fraction.slice(0, right) + '.' + fraction.substr(right, 1)
        ))
        if (right > fraction.length) {
          fraction = new Array(right - fraction.length + 1).join('0') + fraction // prepend with 0's
        }
      } else if (right > fraction.length) {
        fraction += new Array(right - fraction.length + 1).join('0') // pad with 0's
      }
      value = integer + decPt + fraction
    }

    var symbol = ''
    if (showCurrSymbol) {
      // 'i' vs. 'n' ('USD' vs. '$')
      symbol = conversion === 'i' ? monetary.int_curr_symbol : monetary.currency_symbol
    }
    var signPosn = neg ? monetary.n_sign_posn : monetary.p_sign_posn

    // 0: no space between curr. symbol and value
    // 1: space sep. them unless symb. and sign are adjacent then space sep. them from value
    // 2: space sep. sign and value unless symb. and sign are adjacent then space separates
    var sepBySpace = neg ? monetary.n_sep_by_space : monetary.p_sep_by_space

    // p_cs_precedes, n_cs_precedes
    // positive currency symbol follows value = 0; precedes value = 1
    var csPrecedes = neg ? monetary.n_cs_precedes : monetary.p_cs_precedes

    // Assemble symbol/value/sign and possible space as appropriate
    if (flags.indexOf('(') !== -1) {
      // flag: parenth. for negative
      // @todo: unclear on whether and how sepBySpace, signPosn, or csPrecedes have
      // an impact here (as they do below), but assuming for now behaves as signPosn 0 as
      // far as localized sepBySpace and signPosn behavior
      repl = (csPrecedes ? symbol + (sepBySpace === 1 ? ' ' : '') : '') + value + (!csPrecedes ? (
        sepBySpace === 1 ? ' ' : '') + symbol : '')
      if (neg) {
        repl = '(' + repl + ')'
      } else {
        repl = ' ' + repl + ' '
      }
    } else {
      // '+' is default
      // ''
      var posSign = monetary.positive_sign
      // '-'
      var negSign = monetary.negative_sign
      var sign = neg ? (negSign) : (posSign)
      var otherSign = neg ? (posSign) : (negSign)
      var signPadding = ''
      if (signPosn) {
        // has a sign
        signPadding = new Array(otherSign.length - sign.length + 1).join(' ')
      }

      var valueAndCS = ''
      switch (signPosn) {
        // 0: parentheses surround value and curr. symbol;
        // 1: sign precedes them;
        // 2: sign follows them;
        // 3: sign immed. precedes curr. symbol; (but may be space between)
        // 4: sign immed. succeeds curr. symbol; (but may be space between)
        case 0:
          valueAndCS = csPrecedes
            ? symbol + (sepBySpace === 1 ? ' ' : '') + value
            : value + (sepBySpace === 1 ? ' ' : '') + symbol
          repl = '(' + valueAndCS + ')'
          break
        case 1:
          valueAndCS = csPrecedes
            ? symbol + (sepBySpace === 1 ? ' ' : '') + value
            : value + (sepBySpace === 1 ? ' ' : '') + symbol
          repl = signPadding + sign + (sepBySpace === 2 ? ' ' : '') + valueAndCS
          break
        case 2:
          valueAndCS = csPrecedes
            ? symbol + (sepBySpace === 1 ? ' ' : '') + value
            : value + (sepBySpace === 1 ? ' ' : '') + symbol
          repl = valueAndCS + (sepBySpace === 2 ? ' ' : '') + sign + signPadding
          break
        case 3:
          repl = csPrecedes
            ? signPadding + sign + (sepBySpace === 2 ? ' ' : '') + symbol +
              (sepBySpace === 1 ? ' ' : '') + value
            : value + (sepBySpace === 1 ? ' ' : '') + sign + signPadding +
              (sepBySpace === 2 ? ' ' : '') + symbol
          break
        case 4:
          repl = csPrecedes
            ? symbol + (sepBySpace === 2 ? ' ' : '') + signPadding + sign +
              (sepBySpace === 1 ? ' ' : '') + value
            : value + (sepBySpace === 1 ? ' ' : '') + symbol +
              (sepBySpace === 2 ? ' ' : '') + sign + signPadding
          break
      }
    }

    var padding = width - repl.length
    if (padding > 0) {
      padding = new Array(padding + 1).join(' ')
      // @todo: How does p_sep_by_space affect the count if there is a space?
      // Included in count presumably?
      if (flags.indexOf('-') !== -1) {
        // left-justified (pad to right)
        repl += padding
      } else {
        // right-justified (pad to left)
        repl = padding + repl
      }
    }
    return repl
  }

  return format.replace(regex, doReplace)
}

function nl2br (str, isXhtml) {
  //  discuss at: http://locutus.io/php/nl2br/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Reynier de la Rosa (http://scriptinside.blogspot.com.es/)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //   example 1: nl2br('Kevin\nvan\nZonneveld')
  //   returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
  //   example 2: nl2br("\nOne\nTwo\n\nThree\n", false)
  //   returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
  //   example 3: nl2br("\nOne\nTwo\n\nThree\n", true)
  //   returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
  //   example 4: nl2br(null)
  //   returns 4: ''

  // Some latest browsers when str is null return and unexpected null value
  if (typeof str === 'undefined' || str === null) {
    return ''
  }

  // Adjust comment to avoid issue on locutus.io display
  var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br ' + '/>' : '<br>'

  return (str + '')
    .replace(/(\r\n|\n\r|\r|\n)/g, breakTag + '$1')
}

function number_format (number, decimals, decPoint, thousandsSep) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/number_format/
  // bugfixed by: Michael White (http://getsprink.com)
  // bugfixed by: Benjamin Lupton
  // bugfixed by: Allan Jensen (http://www.winternet.no)
  // bugfixed by: Howard Yeend
  // bugfixed by: Diogo Resende
  // bugfixed by: Rival
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  //  revised by: Luke Smith (http://lucassmith.name)
  //    input by: Kheang Hok Chin (http://www.distantia.ca/)
  //    input by: Jay Klehr
  //    input by: Amir Habibi (http://www.residence-mixte.com/)
  //    input by: Amirouche
  //   example 1: number_format(1234.56)
  //   returns 1: '1,235'
  //   example 2: number_format(1234.56, 2, ',', ' ')
  //   returns 2: '1 234,56'
  //   example 3: number_format(1234.5678, 2, '.', '')
  //   returns 3: '1234.57'
  //   example 4: number_format(67, 2, ',', '.')
  //   returns 4: '67,00'
  //   example 5: number_format(1000)
  //   returns 5: '1,000'
  //   example 6: number_format(67.311, 2)
  //   returns 6: '67.31'
  //   example 7: number_format(1000.55, 1)
  //   returns 7: '1,000.6'
  //   example 8: number_format(67000, 5, ',', '.')
  //   returns 8: '67.000,00000'
  //   example 9: number_format(0.9, 0)
  //   returns 9: '1'
  //  example 10: number_format('1.20', 2)
  //  returns 10: '1.20'
  //  example 11: number_format('1.20', 4)
  //  returns 11: '1.2000'
  //  example 12: number_format('1.2000', 3)
  //  returns 12: '1.200'
  //  example 13: number_format('1 000,50', 2, '.', ' ')
  //  returns 13: '100 050.00'
  //  example 14: number_format(1e-8, 8, '.', '')
  //  returns 14: '0.00000001'

  number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
  var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
  var s = ''

  var toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec)
    return '' + (Math.round(n * k) / k)
      .toFixed(prec)
  }

  // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }

  return s.join(dec)
}

function quoted_printable_encode (str) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/quoted_printable_encode/
  //   example 1: quoted_printable_encode('a=b=c')
  //   returns 1: 'a=3Db=3Dc'
  //   example 2: quoted_printable_encode('abc   \r\n123   \r\n')
  //   returns 2: 'abc  =20\r\n123  =20\r\n'
  //   example 3: quoted_printable_encode('0123456789012345678901234567890123456789012345678901234567890123456789012345')
  //   returns 3: '012345678901234567890123456789012345678901234567890123456789012345678901234=\r\n5'
  //        test: skip-2

  var hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
  var RFC2045Encode1IN = / \r\n|\r\n|[^!-<>-~ ]/gm
  var RFC2045Encode1OUT = function (sMatch) {
    // Encode space before CRLF sequence to prevent spaces from being stripped
    // Keep hard line breaks intact; CRLF sequences
    if (sMatch.length > 1) {
      return sMatch.replace(' ', '=20')
    }
    // Encode matching character
    var chr = sMatch.charCodeAt(0)
    return '=' + hexChars[((chr >>> 4) & 15)] + hexChars[(chr & 15)]
  }

  // Split lines to 75 characters; the reason it's 75 and not 76 is because softline breaks are
  // preceeded by an equal sign; which would be the 76th character. However, if the last line/string
  // was exactly 76 characters, then a softline would not be needed. PHP currently softbreaks
  // anyway; so this function replicates PHP.

  var RFC2045Encode2IN = /.{1,72}(?!\r\n)[^=]{0,3}/g
  var RFC2045Encode2OUT = function (sMatch) {
    if (sMatch.substr(sMatch.length - 2) === '\r\n') {
      return sMatch
    }
    return sMatch + '=\r\n'
  }

  str = str
    .replace(RFC2045Encode1IN, RFC2045Encode1OUT)
    .replace(RFC2045Encode2IN, RFC2045Encode2OUT)

  // Strip last softline break
  return str.substr(0, str.length - 3)
}

function similar_text (first, second, percent) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/similar_text/
  // bugfixed by: Chris McMacken
  // bugfixed by: Jarkko Rantavuori original by findings in stackoverflow (http://stackoverflow.com/questions/14136349/how-does-similar-text-work)
  //   example 1: similar_text('Hello World!', 'Hello locutus!')
  //   returns 1: 8
  //   example 2: similar_text('Hello World!', null)
  //   returns 2: 0

  if (first === null ||
    second === null ||
    typeof first === 'undefined' ||
    typeof second === 'undefined') {
    return 0
  }

  first += ''
  second += ''

  var pos1 = 0
  var pos2 = 0
  var max = 0
  var firstLength = first.length
  var secondLength = second.length
  var p
  var q
  var l
  var sum

  for (p = 0; p < firstLength; p++) {
    for (q = 0; q < secondLength; q++) {
      for (l = 0; (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++) { // eslint-disable-line max-len
        // @todo: ^-- break up this crazy for loop and put the logic in its body
      }
      if (l > max) {
        max = l
        pos1 = p
        pos2 = q
      }
    }
  }

  sum = max

  if (sum) {
    if (pos1 && pos2) {
      sum += similar_text(first.substr(0, pos1), second.substr(0, pos2))
    }

    if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
      sum += similar_text(
        first.substr(pos1 + max, firstLength - pos1 - max),
        second.substr(pos2 + max,
        secondLength - pos2 - max))
    }
  }

  if (!percent) {
    return sum
  }

  return (sum * 200) / (firstLength + secondLength)
}

function soundex (str) {
  //  discuss at: http://locutus.io/php/soundex/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
  //   example 1: soundex('Kevin')
  //   returns 1: 'K150'
  //   example 2: soundex('Ellery')
  //   returns 2: 'E460'
  //   example 3: soundex('Euler')
  //   returns 3: 'E460'

  str = (str + '').toUpperCase()
  if (!str) {
    return ''
  }

  var sdx = [0, 0, 0, 0]
  var m = {
    B: 1,
    F: 1,
    P: 1,
    V: 1,
    C: 2,
    G: 2,
    J: 2,
    K: 2,
    Q: 2,
    S: 2,
    X: 2,
    Z: 2,
    D: 3,
    T: 3,
    L: 4,
    M: 5,
    N: 5,
    R: 6
  }
  var i = 0
  var j
  var s = 0
  var c
  var p

  while ((c = str.charAt(i++)) && s < 4) {
    if ((j = m[c])) {
      if (j !== p) {
        sdx[s++] = p = j
      }
    } else {
      s += i === 1
      p = 0
    }
  }

  sdx[0] = str.charAt(0)

  return sdx.join('')
}

function sscanf (str, format) {
  //  discuss at: http://locutus.io/php/sscanf/
  //   example 1: sscanf('SN/2350001', 'SN/%d')
  //   returns 1: [2350001]
  //   example 2: var myVar = {}
  //   example 2: sscanf('SN/2350001', 'SN/%d', myVar)
  //   example 2: var $result = myVar.value
  //   returns 2: 2350001
  //   example 3: sscanf("10--20", "%2$d--%1$d") // Must escape '$' in PHP, but not JS
  //   returns 3: [20, 10]

  var retArr = []
  var _NWS = /\S/
  var args = arguments
  var digit

  var _setExtraConversionSpecs = function (offset) {
    // Since a mismatched character sets us off track from future
    // legitimate finds, we just scan
    // to the end for any other conversion specifications (besides a percent literal),
    // setting them to null
    // sscanf seems to disallow all conversion specification components (of sprintf)
    // except for type specifiers
    // Do not allow % in last char. class
    // var matches = format.match(/%[+-]?([ 0]|'.)?-?\d*(\.\d+)?[bcdeufFosxX]/g);
    // Do not allow % in last char. class:
    var matches = format.slice(offset).match(/%[cdeEufgosxX]/g)
    // b, F,G give errors in PHP, but 'g', though also disallowed, doesn't
    if (matches) {
      var lgth = matches.length
      while (lgth--) {
        retArr.push(null)
      }
    }
    return _finish()
  }

  var _finish = function () {
    if (args.length === 2) {
      return retArr
    }
    for (var i = 0; i < retArr.length; ++i) {
      args[i + 2].value = retArr[i]
    }
    return i
  }

  var _addNext = function (j, regex, cb) {
    if (assign) {
      var remaining = str.slice(j)
      var check = width ? remaining.substr(0, width) : remaining
      var match = regex.exec(check)
      // @todo: Make this more readable
      var key = digit !== undefined
        ? digit
        : retArr.length
      var testNull = retArr[key] = match
          ? (cb
            ? cb.apply(null, match)
            : match[0])
          : null
      if (testNull === null) {
        throw new Error('No match in string')
      }
      return j + match[0].length
    }
    return j
  }

  if (arguments.length < 2) {
    throw new Error('Not enough arguments passed to sscanf')
  }

  // PROCESS
  for (var i = 0, j = 0; i < format.length; i++) {
    var width = 0
    var assign = true

    if (format.charAt(i) === '%') {
      if (format.charAt(i + 1) === '%') {
        if (str.charAt(j) === '%') {
          // a matched percent literal
          // skip beyond duplicated percent
          ++i
          ++j
          continue
        }
        // Format indicated a percent literal, but not actually present
        return _setExtraConversionSpecs(i + 2)
      }

      // CHARACTER FOLLOWING PERCENT IS NOT A PERCENT

      // We need 'g' set to get lastIndex
      var prePattern = new RegExp('^(?:(\\d+)\\$)?(\\*)?(\\d*)([hlL]?)', 'g')

      var preConvs = prePattern.exec(format.slice(i + 1))

      var tmpDigit = digit
      if (tmpDigit && preConvs[1] === undefined) {
        var msg = 'All groups in sscanf() must be expressed as numeric if '
        msg += 'any have already been used'
        throw new Error(msg)
      }
      digit = preConvs[1] ? parseInt(preConvs[1], 10) - 1 : undefined

      assign = !preConvs[2]
      width = parseInt(preConvs[3], 10)
      var sizeCode = preConvs[4]
      i += prePattern.lastIndex

      // @todo: Does PHP do anything with these? Seems not to matter
      if (sizeCode) {
        // This would need to be processed later
        switch (sizeCode) {
          case 'h':
          case 'l':
          case 'L':
            // Treats subsequent as short int (for d,i,n) or unsigned short int (for o,u,x)
            // Treats subsequent as long int (for d,i,n), or unsigned long int (for o,u,x);
            //    or as double (for e,f,g) instead of float or wchar_t instead of char
            // Treats subsequent as long double (for e,f,g)
            break
          default:
            throw new Error('Unexpected size specifier in sscanf()!')
        }
      }
      // PROCESS CHARACTER
      try {
        // For detailed explanations, see http://web.archive.org/web/20031128125047/http://www.uwm.edu/cgi-bin/IMT/wwwman?topic=scanf%283%29&msection=
        // Also http://www.mathworks.com/access/helpdesk/help/techdoc/ref/sscanf.html
        // p, S, C arguments in C function not available
        // DOCUMENTED UNDER SSCANF
        switch (format.charAt(i + 1)) {
          case 'F':
            // Not supported in PHP sscanf; the argument is treated as a float, and
            //  presented as a floating-point number (non-locale aware)
            // sscanf doesn't support locales, so no need for two (see %f)
            break
          case 'g':
            // Not supported in PHP sscanf; shorter of %e and %f
            // Irrelevant to input conversion
            break
          case 'G':
            // Not supported in PHP sscanf; shorter of %E and %f
            // Irrelevant to input conversion
            break
          case 'b':
            // Not supported in PHP sscanf; the argument is treated as an integer,
            // and presented as a binary number
            // Not supported - couldn't distinguish from other integers
            break
          case 'i':
            // Integer with base detection (Equivalent of 'd', but base 0 instead of 10)
            var pattern = /([+-])?(?:(?:0x([\da-fA-F]+))|(?:0([0-7]+))|(\d+))/
            j = _addNext(j, pattern, function (num, sign, hex,
            oct, dec) {
              return hex ? parseInt(num, 16) : oct ? parseInt(num, 8) : parseInt(num, 10)
            })
            break
          case 'n':
            // Number of characters processed so far
            retArr[digit !== undefined ? digit : retArr.length - 1] = j
            break
            // DOCUMENTED UNDER SPRINTF
          case 'c':
            // Get character; suppresses skipping over whitespace!
            // (but shouldn't be whitespace in format anyways, so no difference here)
            // Non-greedy match
            j = _addNext(j, new RegExp('.{1,' + (width || 1) + '}'))
            break
          case 'D':
          case 'd':
            // sscanf documented decimal number; equivalent of 'd';
            // Optionally signed decimal integer
            j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
              // Ignores initial zeroes, unlike %i and parseInt()
              var decInt = parseInt((sign || '') + dec, 10)
              if (decInt < 0) {
                // PHP also won't allow less than -2147483648
                // integer overflow with negative
                return decInt < -2147483648 ? -2147483648 : decInt
              } else {
                // PHP also won't allow greater than -2147483647
                return decInt < 2147483647 ? decInt : 2147483647
              }
            })
            break
          case 'f':
          case 'E':
          case 'e':
            // Although sscanf doesn't support locales,
            // this is used instead of '%F'; seems to be same as %e
            // These don't discriminate here as both allow exponential float of either case
            j = _addNext(j, /([+-])?(?:0*)(\d*\.?\d*(?:[eE]?\d+)?)/, function (num, sign, dec) {
              if (dec === '.') {
                return null
              }
              // Ignores initial zeroes, unlike %i and parseFloat()
              return parseFloat((sign || '') + dec)
            })
            break
          case 'u':
            // unsigned decimal integer
            // We won't deal with integer overflows due to signs
            j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
              // Ignores initial zeroes, unlike %i and parseInt()
              var decInt = parseInt(dec, 10)
              if (sign === '-') {
                // PHP also won't allow greater than 4294967295
                // integer overflow with negative
                return 4294967296 - decInt
              } else {
                return decInt < 4294967295 ? decInt : 4294967295
              }
            })
            break
          case 'o':
              // Octal integer // @todo: add overflows as above?
            j = _addNext(j, /([+-])?(?:0([0-7]+))/, function (num, sign, oct) {
              return parseInt(num, 8)
            })
            break
          case 's':
            // Greedy match
            j = _addNext(j, /\S+/)
            break
          case 'X':
          case 'x':
          // Same as 'x'?
            // @todo: add overflows as above?
            // Initial 0x not necessary here
            j = _addNext(j, /([+-])?(?:(?:0x)?([\da-fA-F]+))/, function (num, sign, hex) {
              return parseInt(num, 16)
            })
            break
          case '':
            // If no character left in expression
            throw new Error('Missing character after percent mark in sscanf() format argument')
          default:
            throw new Error('Unrecognized character after percent mark in sscanf() format argument')
        }
      } catch (e) {
        if (e === 'No match in string') {
          // Allow us to exit
          return _setExtraConversionSpecs(i + 2)
        }
        // Calculate skipping beyond initial percent too
      }
      ++i
    } else if (format.charAt(i) !== str.charAt(j)) {
        // @todo: Double-check i whitespace ignored in string and/or formats
      _NWS.lastIndex = 0
      if ((_NWS)
        .test(str.charAt(j)) || str.charAt(j) === '') {
        // Whitespace doesn't need to be an exact match)
        return _setExtraConversionSpecs(i + 1)
      } else {
        // Adjust strings when encounter non-matching whitespace,
        // so they align in future checks above
        // Ok to replace with j++;?
        str = str.slice(0, j) + str.slice(j + 1)
        i--
      }
    } else {
      j++
    }
  }

  // POST-PROCESSING
  return _finish()
}

function str_getcsv (input, delimiter, enclosure, escape) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_getcsv/
  //   example 1: str_getcsv('"abc","def","ghi"')
  //   returns 1: ['abc', 'def', 'ghi']
  //   example 2: str_getcsv('"row2""cell1","row2cell2","row2cell3"', null, null, '"')
  //   returns 2: ['row2"cell1', 'row2cell2', 'row2cell3']

  /*
  // These test cases allowing for missing delimiters are not currently supported
    str_getcsv('"row2""cell1",row2cell2,row2cell3', null, null, '"');
    ['row2"cell1', 'row2cell2', 'row2cell3']

    str_getcsv('row1cell1,"row1,cell2",row1cell3', null, null, '"');
    ['row1cell1', 'row1,cell2', 'row1cell3']

    str_getcsv('"row2""cell1",row2cell2,"row2""""cell3"');
    ['row2"cell1', 'row2cell2', 'row2""cell3']

    str_getcsv('row1cell1,"row1,cell2","row1"",""cell3"', null, null, '"');
    ['row1cell1', 'row1,cell2', 'row1","cell3'];

    Should also test newlines within
  */

  var i
  var inpLen
  var output = []
  var _backwards = function (str) {
    // We need to go backwards to simulate negative look-behind (don't split on
    // an escaped enclosure even if followed by the delimiter and another enclosure mark)
    return str.split('').reverse().join('')
  }
  var _pq = function (str) {
    // preg_quote()
    return String(str).replace(/([\\.+*?[^\]$(){}=!<>|:])/g, '\\$1')
  }

  delimiter = delimiter || ','
  enclosure = enclosure || '"'
  escape = escape || '\\'
  var pqEnc = _pq(enclosure)
  var pqEsc = _pq(escape)

  input = input
    .replace(new RegExp('^\\s*' + pqEnc), '')
    .replace(new RegExp(pqEnc + '\\s*$'), '')

  // PHP behavior may differ by including whitespace even outside of the enclosure
  input = _backwards(input)
    .split(new RegExp(pqEnc + '\\s*' + _pq(delimiter) + '\\s*' + pqEnc + '(?!' + pqEsc + ')', 'g'))
    .reverse()

  for (i = 0, inpLen = input.length; i < inpLen; i++) {
    output.push(_backwards(input[i])
      .replace(new RegExp(pqEsc + pqEnc, 'g'), enclosure))
  }

  return output
}

function str_ireplace (search, replace, subject, countObj) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_ireplace/
  //      note 1: Case-insensitive version of str_replace()
  //      note 1: Compliant with PHP 5.0 str_ireplace() Full details at:
  //      note 1: http://ca3.php.net/manual/en/function.str-ireplace.php
  //      note 2: The countObj parameter (optional) if used must be passed in as a
  //      note 2: object. The count will then be written by reference into it's `value` property
  //   example 1: str_ireplace('M', 'e', 'name')
  //   returns 1: 'naee'
  //   example 2: var $countObj = {}
  //   example 2: str_ireplace('M', 'e', 'name', $countObj)
  //   example 2: var $result = $countObj.value
  //   returns 2: 1

  var i = 0
  var j = 0
  var temp = ''
  var repl = ''
  var sl = 0
  var fl = 0
  var f = ''
  var r = ''
  var s = ''
  var ra = ''
  var otemp = ''
  var oi = ''
  var ofjl = ''
  var os = subject
  var osa = Object.prototype.toString.call(os) === '[object Array]'
  // var sa = ''

  if (typeof (search) === 'object') {
    temp = search
    search = []
    for (i = 0; i < temp.length; i += 1) {
      search[i] = temp[i].toLowerCase()
    }
  } else {
    search = search.toLowerCase()
  }

  if (typeof (subject) === 'object') {
    temp = subject
    subject = []
    for (i = 0; i < temp.length; i += 1) {
      subject[i] = temp[i].toLowerCase()
    }
  } else {
    subject = subject.toLowerCase()
  }

  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
  }

  temp = ''
  f = [].concat(search)
  r = [].concat(replace)
  ra = Object.prototype.toString.call(r) === '[object Array]'
  s = subject
  // sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)
  os = [].concat(os)

  if (countObj) {
    countObj.value = 0
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      otemp = os[i] + ''
      oi = temp.indexOf(f[j])
      ofjl = f[j].length
      if (oi >= 0) {
        os[i] = (otemp).split(otemp.substr(oi, ofjl)).join(repl)
      }

      if (countObj) {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }

  return osa ? os : os[0]
}

function str_split (string, splitLength) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_split/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: Theriault (https://github.com/Theriault)
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
  //    input by: Bjorn Roesbeke (http://www.bjornroesbeke.be/)
  //   example 1: str_split('Hello Friend', 3)
  //   returns 1: ['Hel', 'lo ', 'Fri', 'end']

  if (splitLength === null) {
    splitLength = 1
  }
  if (string === null || splitLength < 1) {
    return false
  }

  string += ''
  var chunks = []
  var pos = 0
  var len = string.length

  while (pos < len) {
    chunks.push(string.slice(pos, pos += splitLength))
  }

  return chunks
}

function strcspn (str, mask, start, length) {
  //  discuss at: http://locutus.io/php/strcspn/
  //  revised by: Theriault
  //   example 1: strcspn('abcdefg123', '1234567890')
  //   returns 1: 7
  //   example 2: strcspn('123abc', '1234567890')
  //   returns 2: 0
  //   example 3: strcspn('abcdefg123', '1234567890', 1)
  //   returns 3: 6
  //   example 4: strcspn('abcdefg123', '1234567890', -6, -5)
  //   returns 4: 1

  start = start || 0
  length = typeof length === 'undefined' ? str.length : (length || 0)
  if (start < 0) start = str.length + start
  if (length < 0) length = str.length - start + length
  if (start < 0 || start >= str.length || length <= 0 || e >= str.length) return 0
  var e = Math.min(str.length, start + length)
  for (var i = start, lgth = 0; i < e; i++) {
    if (mask.indexOf(str.charAt(i)) !== -1) {
      break
    }
    ++lgth
  }
  return lgth
}

function stripos (fHaystack, fNeedle, fOffset) {
  //  discuss at: http://locutus.io/php/stripos/
  //  revised by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: stripos('ABC', 'a')
  //   returns 1: 0

  var haystack = (fHaystack + '').toLowerCase()
  var needle = (fNeedle + '').toLowerCase()
  var index = 0

  if ((index = haystack.indexOf(needle, fOffset)) !== -1) {
    return index
  }

  return false
}

function stripslashes (str) {
  //       discuss at: http://locutus.io/php/stripslashes/
  //      original by: Kevin van Zonneveld (http://kvz.io)
  //      improved by: Ates Goral (http://magnetiq.com)
  //      improved by: marrtins
  //      improved by: rezna
  //         fixed by: Mick@el
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: Rick Waldron
  //         input by: Brant Messenger (http://www.brantmessenger.com/)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: stripslashes('Kevin\'s code')
  //        returns 1: "Kevin's code"
  //        example 2: stripslashes('Kevin\\\'s code')
  //        returns 2: "Kevin\'s code"

  return (str + '')
    .replace(/\\(.?)/g, function (s, n1) {
      switch (n1) {
        case '\\':
          return '\\'
        case '0':
          return '\u0000'
        case '':
          return ''
        default:
          return n1
      }
    })
}

function strlen (string) {
  //  discuss at: http://locutus.io/php/strlen/
  //    input by: Kirk Strobeck
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: Brett Zamir (http://brett-zamir.me)
  //      note 1: May look like overkill, but in order to be truly faithful to handling all Unicode
  //      note 1: characters and to this function in PHP which does not count the number of bytes
  //      note 1: but counts the number of characters, something like this is really necessary.
  //   example 1: strlen('Kevin van Zonneveld')
  //   returns 1: 19
  //   example 2: ini_set('unicode.semantics', 'on')
  //   example 2: strlen('A\ud87e\udc04Z')
  //   returns 2: 3

  var str = string + ''

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('unicode.semantics') : undefined) || 'off'
  if (iniVal === 'off') {
    return str.length
  }

  var i = 0
  var lgth = 0

  var getWholeChar = function (str, i) {
    var code = str.charCodeAt(i)
    var next = ''
    var prev = ''
    if (code >= 0xD800 && code <= 0xDBFF) {
      // High surrogate (could change last hex to 0xDB7F to
      // treat high private surrogates as single characters)
      if (str.length <= (i + 1)) {
        throw new Error('High surrogate without following low surrogate')
      }
      next = str.charCodeAt(i + 1)
      if (next < 0xDC00 || next > 0xDFFF) {
        throw new Error('High surrogate without following low surrogate')
      }
      return str.charAt(i) + str.charAt(i + 1)
    } else if (code >= 0xDC00 && code <= 0xDFFF) {
      // Low surrogate
      if (i === 0) {
        throw new Error('Low surrogate without preceding high surrogate')
      }
      prev = str.charCodeAt(i - 1)
      if (prev < 0xD800 || prev > 0xDBFF) {
        // (could change last hex to 0xDB7F to treat high private surrogates
        // as single characters)
        throw new Error('Low surrogate without preceding high surrogate')
      }
      // We can pass over low surrogates now as the second
      // component in a pair which we have already processed
      return false
    }
    return str.charAt(i)
  }

  for (i = 0, lgth = 0; i < str.length; i++) {
    if ((getWholeChar(str, i)) === false) {
      continue
    }
    // Adapt this line at the top of any loop, passing in the whole string and
    // the current iteration and returning a variable to represent the individual character;
    // purpose is to treat the first part of a surrogate pair as the whole character and then
    // ignore the second part
    lgth++
  }

  return lgth
}

function strnatcmp (a, b) {
  //       discuss at: http://locutus.io/php/strnatcmp/
  //      original by: Martijn Wieringa
  //      improved by: Michael White (http://getsprink.com)
  //      improved by: Jack
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // reimplemented by: Rafał Kukawski
  //        example 1: strnatcmp('abc', 'abc')
  //        returns 1: 0
  //        example 2: strnatcmp('a', 'b')
  //        returns 2: -1
  //        example 3: strnatcmp('10', '1')
  //        returns 3: 1
  //        example 4: strnatcmp('0000abc', '0abc')
  //        returns 4: 0
  //        example 5: strnatcmp('1239', '12345')
  //        returns 5: -1
  //        example 6: strnatcmp('t01239', 't012345')
  //        returns 6: 1
  //        example 7: strnatcmp('0A', '5N')
  //        returns 7: -1

  var _phpCastString = require('../_helpers/_phpCastString')

  var leadingZeros = /^0+(?=\d)/
  var whitespace = /^\s/
  var digit = /^\d/

  if (arguments.length !== 2) {
    return null
  }

  a = _phpCastString(a)
  b = _phpCastString(b)

  if (!a.length || !b.length) {
    return a.length - b.length
  }

  var i = 0
  var j = 0

  a = a.replace(leadingZeros, '')
  b = b.replace(leadingZeros, '')

  while (i < a.length && j < b.length) {
    // skip consecutive whitespace
    while (whitespace.test(a.charAt(i))) i++
    while (whitespace.test(b.charAt(j))) j++

    var ac = a.charAt(i)
    var bc = b.charAt(j)
    var aIsDigit = digit.test(ac)
    var bIsDigit = digit.test(bc)

    if (aIsDigit && bIsDigit) {
      var bias = 0
      var fractional = ac === '0' || bc === '0'

      do {
        if (!aIsDigit) {
          return -1
        } else if (!bIsDigit) {
          return 1
        } else if (ac < bc) {
          if (!bias) {
            bias = -1
          }

          if (fractional) {
            return -1
          }
        } else if (ac > bc) {
          if (!bias) {
            bias = 1
          }

          if (fractional) {
            return 1
          }
        }

        ac = a.charAt(++i)
        bc = b.charAt(++j)

        aIsDigit = digit.test(ac)
        bIsDigit = digit.test(bc)
      } while (aIsDigit || bIsDigit)

      if (!fractional && bias) {
        return bias
      }

      continue
    }

    if (!ac || !bc) {
      continue
    } else if (ac < bc) {
      return -1
    } else if (ac > bc) {
      return 1
    }

    i++
    j++
  }

  var iBeforeStrEnd = i < a.length
  var jBeforeStrEnd = j < b.length

  // Check which string ended first
  // return -1 if a, 1 if b, 0 otherwise
  return (iBeforeStrEnd > jBeforeStrEnd) - (iBeforeStrEnd < jBeforeStrEnd)
}

function strncasecmp (argStr1, argStr2, len) {
  //  discuss at: http://locutus.io/php/strncasecmp/
  //    input by: Nate
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      note 1: Returns < 0 if str1 is less than str2 ; > 0
  //      note 1: if str1 is greater than str2, and 0 if they are equal.
  //   example 1: strncasecmp('Price 12.9', 'Price 12.15', 2)
  //   returns 1: 0
  //   example 2: strncasecmp('Price 12.09', 'Price 12.15', 10)
  //   returns 2: -1
  //   example 3: strncasecmp('Price 12.90', 'Price 12.15', 30)
  //   returns 3: 8
  //   example 4: strncasecmp('Version 12.9', 'Version 12.15', 20)
  //   returns 4: 8
  //   example 5: strncasecmp('Version 12.15', 'Version 12.9', 20)
  //   returns 5: -8

  var diff
  var i = 0
  var str1 = (argStr1 + '').toLowerCase().substr(0, len)
  var str2 = (argStr2 + '').toLowerCase().substr(0, len)

  if (str1.length !== str2.length) {
    if (str1.length < str2.length) {
      len = str1.length
      if (str2.substr(0, str1.length) === str1) {
        // return the difference of chars
        return str1.length - str2.length
      }
    } else {
      len = str2.length
      // str1 is longer than str2
      if (str1.substr(0, str2.length) === str2) {
        // return the difference of chars
        return str1.length - str2.length
      }
    }
  } else {
    // Avoids trying to get a char that does not exist
    len = str1.length
  }

  for (diff = 0, i = 0; i < len; i++) {
    diff = str1.charCodeAt(i) - str2.charCodeAt(i)
    if (diff !== 0) {
      return diff
    }
  }

  return 0
}

function strpos (haystack, needle, offset) {
  //  discuss at: http://locutus.io/php/strpos/
  // bugfixed by: Daniel Esteban
  //   example 1: strpos('Kevin van Zonneveld', 'e', 5)
  //   returns 1: 14

  var i = (haystack + '')
    .indexOf(needle, (offset || 0))
  return i === -1 ? false : i
}

function strripos (haystack, needle, offset) {
  //  discuss at: http://locutus.io/php/strripos/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: saulius
  //   example 1: strripos('Kevin van Zonneveld', 'E')
  //   returns 1: 16

  haystack = (haystack + '')
    .toLowerCase()
  needle = (needle + '')
    .toLowerCase()

  var i = -1
  if (offset) {
    i = (haystack + '')
      .slice(offset)
      .lastIndexOf(needle) // strrpos' offset indicates starting point of range till end,
    // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
    if (i !== -1) {
      i += offset
    }
  } else {
    i = (haystack + '')
      .lastIndexOf(needle)
  }
  return i >= 0 ? i : false
}

function strrpos (haystack, needle, offset) {
  //  discuss at: http://locutus.io/php/strrpos/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: saulius
  //   example 1: strrpos('Kevin van Zonneveld', 'e')
  //   returns 1: 16
  //   example 2: strrpos('somepage.com', '.', false)
  //   returns 2: 8
  //   example 3: strrpos('baa', 'a', 3)
  //   returns 3: false
  //   example 4: strrpos('baa', 'a', 2)
  //   returns 4: 2

  var i = -1
  if (offset) {
    i = (haystack + '')
      .slice(offset)
      .lastIndexOf(needle) // strrpos' offset indicates starting point of range till end,
    // while lastIndexOf's optional 2nd argument indicates ending point of range from the beginning
    if (i !== -1) {
      i += offset
    }
  } else {
    i = (haystack + '')
      .lastIndexOf(needle)
  }
  return i >= 0 ? i : false
}

function strspn (str1, str2, start, lgth) {
  //  discuss at: http://locutus.io/php/strspn/
  //   example 1: strspn('42 is the answer, what is the question ...', '1234567890')
  //   returns 1: 2
  //   example 2: strspn('foo', 'o', 1, 2)
  //   returns 2: 2

  var found
  var stri
  var strj
  var j = 0
  var i = 0

  start = start ? (start < 0 ? (str1.length + start) : start) : 0
  lgth = lgth ? ((lgth < 0) ? (str1.length + lgth - start) : lgth) : str1.length - start
  str1 = str1.substr(start, lgth)

  for (i = 0; i < str1.length; i++) {
    found = 0
    stri = str1.substring(i, i + 1)
    for (j = 0; j <= str2.length; j++) {
      strj = str2.substring(j, j + 1)
      if (stri === strj) {
        found = 1
        break
      }
    }
    if (found !== 1) {
      return i
    }
  }

  return i
}

function strstr (haystack, needle, bool) {
  //  discuss at: http://locutus.io/php/strstr/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: strstr('Kevin van Zonneveld', 'van')
  //   returns 1: 'van Zonneveld'
  //   example 2: strstr('Kevin van Zonneveld', 'van', true)
  //   returns 2: 'Kevin '
  //   example 3: strstr('name@example.com', '@')
  //   returns 3: '@example.com'
  //   example 4: strstr('name@example.com', '@', true)
  //   returns 4: 'name'

  var pos = 0

  haystack += ''
  pos = haystack.indexOf(needle)
  if (pos === -1) {
    return false
  } else {
    if (bool) {
      return haystack.substr(0, pos)
    } else {
      return haystack.slice(pos)
    }
  }
}

function strtolower (str) {
  //  discuss at: http://locutus.io/php/strtolower/
  //   example 1: strtolower('Kevin van Zonneveld')
  //   returns 1: 'kevin van zonneveld'

  return (str + '')
    .toLowerCase()
}

function strtr (str, trFrom, trTo) {
  //  discuss at: http://locutus.io/php/strtr/
  //    input by: uestla
  //    input by: Alan C
  //    input by: Taras Bogach
  //    input by: jpfle
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var $trans = {'hello' : 'hi', 'hi' : 'hello'}
  //   example 1: strtr('hi all, I said hello', $trans)
  //   returns 1: 'hello all, I said hi'
  //   example 2: strtr('äaabaåccasdeöoo', 'äåö','aao')
  //   returns 2: 'aaabaaccasdeooo'
  //   example 3: strtr('ääääääää', 'ä', 'a')
  //   returns 3: 'aaaaaaaa'
  //   example 4: strtr('http', 'pthxyz','xyzpth')
  //   returns 4: 'zyyx'
  //   example 5: strtr('zyyx', 'pthxyz','xyzpth')
  //   returns 5: 'http'
  //   example 6: strtr('aa', {'a':1,'aa':2})
  //   returns 6: '2'

  var krsort = require('../array/krsort')
  var iniSet = require('../info/ini_set')

  var fr = ''
  var i = 0
  var j = 0
  var lenStr = 0
  var lenFrom = 0
  var sortByReference = false
  var fromTypeStr = ''
  var toTypeStr = ''
  var istr = ''
  var tmpFrom = []
  var tmpTo = []
  var ret = ''
  var match = false

  // Received replace_pairs?
  // Convert to normal trFrom->trTo chars
  if (typeof trFrom === 'object') {
    // Not thread-safe; temporarily set to true
    // @todo: Don't rely on ini here, use internal krsort instead
    sortByReference = iniSet('locutus.sortByReference', false)
    trFrom = krsort(trFrom)
    iniSet('locutus.sortByReference', sortByReference)

    for (fr in trFrom) {
      if (trFrom.hasOwnProperty(fr)) {
        tmpFrom.push(fr)
        tmpTo.push(trFrom[fr])
      }
    }

    trFrom = tmpFrom
    trTo = tmpTo
  }

  // Walk through subject and replace chars when needed
  lenStr = str.length
  lenFrom = trFrom.length
  fromTypeStr = typeof trFrom === 'string'
  toTypeStr = typeof trTo === 'string'

  for (i = 0; i < lenStr; i++) {
    match = false
    if (fromTypeStr) {
      istr = str.charAt(i)
      for (j = 0; j < lenFrom; j++) {
        if (istr === trFrom.charAt(j)) {
          match = true
          break
        }
      }
    } else {
      for (j = 0; j < lenFrom; j++) {
        if (str.substr(i, trFrom[j].length) === trFrom[j]) {
          match = true
          // Fast forward
          i = (i + trFrom[j].length) - 1
          break
        }
      }
    }
    if (match) {
      ret += toTypeStr ? trTo.charAt(j) : trTo[j]
    } else {
      ret += str.charAt(i)
    }
  }

  return ret
}

function substr_replace (str, replace, start, length) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/substr_replace/
  //   example 1: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0)
  //   returns 1: 'bob'
  //   example 2: var $var = 'ABCDEFGH:/MNRPQR/'
  //   example 2: substr_replace($var, 'bob', 0, $var.length)
  //   returns 2: 'bob'
  //   example 3: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 0, 0)
  //   returns 3: 'bobABCDEFGH:/MNRPQR/'
  //   example 4: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', 10, -1)
  //   returns 4: 'ABCDEFGH:/bob/'
  //   example 5: substr_replace('ABCDEFGH:/MNRPQR/', 'bob', -7, -1)
  //   returns 5: 'ABCDEFGH:/bob/'
  //   example 6: substr_replace('ABCDEFGH:/MNRPQR/', '', 10, -1)
  //   returns 6: 'ABCDEFGH://'

  if (start < 0) {
    // start position in str
    start = start + str.length
  }
  length = length !== undefined ? length : str.length
  if (length < 0) {
    length = length + str.length - start
  }

  return [
    str.slice(0, start),
    replace.substr(0, length),
    replace.slice(length),
    str.slice(start + length)
  ].join('')
}

function ucwords (str) {
  //  discuss at: http://locutus.io/php/ucwords/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Cetvertacov Alexandr (https://github.com/cetver)
  //    input by: James (http://www.james-bell.co.uk/)
  //   example 1: ucwords('kevin van  zonneveld')
  //   returns 1: 'Kevin Van  Zonneveld'
  //   example 2: ucwords('HELLO WORLD')
  //   returns 2: 'HELLO WORLD'
  //   example 3: ucwords('у мэри был маленький ягненок и она его очень любила')
  //   returns 3: 'У Мэри Был Маленький Ягненок И Она Его Очень Любила'
  //   example 4: ucwords('τάχιστη αλώπηξ βαφής ψημένη γη, δρασκελίζει υπέρ νωθρού κυνός')
  //   returns 4: 'Τάχιστη Αλώπηξ Βαφής Ψημένη Γη, Δρασκελίζει Υπέρ Νωθρού Κυνός'

  return (str + '')
    .replace(/^(.)|\s+(.)/g, function ($1) {
      return $1.toUpperCase()
    })
}

function vprintf (format, args) {
  //       discuss at: http://locutus.io/php/vprintf/
  //      original by: Ash Searle (http://hexmen.com/blog/)
  //      improved by: Michael White (http://getsprink.com)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: vprintf("%01.2f", 123.1)
  //        returns 1: 6

  var sprintf = require('../strings/sprintf')
  var echo = require('../strings/echo')
  var ret = sprintf.apply(this, [format].concat(args))
  echo(ret)

  return ret.length
}

function vsprintf (format, args) {
  //  discuss at: http://locutus.io/php/vsprintf/
  //   example 1: vsprintf('%04d-%02d-%02d', [1988, 8, 1])
  //   returns 1: '1988-08-01'

  var sprintf = require('../strings/sprintf')

  return sprintf.apply(this, [format].concat(args))
}

function wordwrap (str, intWidth, strBreak, cut) {
  //  discuss at: http://locutus.io/php/wordwrap/
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Michael Grier
  // bugfixed by: Feras ALHAEK
  //   example 1: wordwrap('Kevin van Zonneveld', 6, '|', true)
  //   returns 1: 'Kevin|van|Zonnev|eld'
  //   example 2: wordwrap('The quick brown fox jumped over the lazy dog.', 20, '<br />\n')
  //   returns 2: 'The quick brown fox<br />\njumped over the lazy<br />\ndog.'
  //   example 3: wordwrap('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
  //   returns 3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat.'

  intWidth = arguments.length >= 2 ? +intWidth : 75
  strBreak = arguments.length >= 3 ? '' + strBreak : '\n'
  cut = arguments.length >= 4 ? !!cut : false

  var i, j, line

  str += ''

  if (intWidth < 1) {
    return str
  }

  var reLineBreaks = /\r\n|\n|\r/
  var reBeginningUntilFirstWhitespace = /^\S*/
  var reLastCharsWithOptionalTrailingWhitespace = /\S*(\s)?$/

  var lines = str.split(reLineBreaks)
  var l = lines.length
  var match

  // for each line of text
  for (i = 0; i < l; lines[i++] += line) {
    line = lines[i]
    lines[i] = ''

    while (line.length > intWidth) {
      // get slice of length one char above limit
      var slice = line.slice(0, intWidth + 1)

      // remove leading whitespace from rest of line to parse
      var ltrim = 0
      // remove trailing whitespace from new line content
      var rtrim = 0

      match = slice.match(reLastCharsWithOptionalTrailingWhitespace)

      // if the slice ends with whitespace
      if (match[1]) {
        // then perfect moment to cut the line
        j = intWidth
        ltrim = 1
      } else {
        // otherwise cut at previous whitespace
        j = slice.length - match[0].length

        if (j) {
          rtrim = 1
        }

        // but if there is no previous whitespace
        // and cut is forced
        // cut just at the defined limit
        if (!j && cut && intWidth) {
          j = intWidth
        }

        // if cut wasn't forced
        // cut at next possible whitespace after the limit
        if (!j) {
          var charsUntilNextWhitespace = (line.slice(intWidth).match(reBeginningUntilFirstWhitespace) || [''])[0]

          j = slice.length + charsUntilNextWhitespace.length
        }
      }

      lines[i] += line.slice(0, j - rtrim)
      line = line.slice(j + ltrim)
      lines[i] += line.length ? strBreak : ''
    }
  }

  return lines.join('\n')
}

function bin2hex (s) {
  //  discuss at: http://locutus.io/php/bin2hex/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Linuxworld
  //   example 1: bin2hex('Kev')
  //   returns 1: '4b6576'
  //   example 2: bin2hex(String.fromCharCode(0x00))
  //   returns 2: '00'

  var i
  var l
  var o = ''
  var n

  s += ''

  for (i = 0, l = s.length; i < l; i++) {
    n = s.charCodeAt(i)
      .toString(16)
    o += n.length < 2 ? '0' + n : n
  }

  return o
}

function convert_cyr_string (str, from, to) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/convert_cyr_string/
  //      note 1: Assumes and converts to Unicode strings with character
  //      note 1: code equivalents of the same numbers as in the from or
  //      note 1: target character set; Note that neither the input or output
  //      note 1: should be treated as actual Unicode, since the PHP function
  //      note 1: this is original by does not either
  //      note 1: One could easily represent (or convert the results) of a
  //      note 1: string form as arrays of code points instead but since JavaScript
  //      note 1: currently has no clear binary data type, we chose to use strings
  //      note 1: as in PHP
  //   example 1: convert_cyr_string(String.fromCharCode(214), 'k', 'w').charCodeAt(0) === 230; // Char. 214 of KOI8-R gives equivalent number value 230 in win1251
  //   returns 1: true

  var _cyrWin1251 = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    46,
    154,
    174,
    190,
    46,
    159,
    189,
    46,
    46,
    179,
    191,
    180,
    157,
    46,
    46,
    156,
    183,
    46,
    46,
    182,
    166,
    173,
    46,
    46,
    158,
    163,
    152,
    164,
    155,
    46,
    46,
    46,
    167,
    225,
    226,
    247,
    231,
    228,
    229,
    246,
    250,
    233,
    234,
    235,
    236,
    237,
    238,
    239,
    240,
    242,
    243,
    244,
    245,
    230,
    232,
    227,
    254,
    251,
    253,
    255,
    249,
    248,
    252,
    224,
    241,
    193,
    194,
    215,
    199,
    196,
    197,
    214,
    218,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    210,
    211,
    212,
    213,
    198,
    200,
    195,
    222,
    219,
    221,
    223,
    217,
    216,
    220,
    192,
    209,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    184,
    186,
    32,
    179,
    191,
    32,
    32,
    32,
    32,
    32,
    180,
    162,
    32,
    32,
    32,
    32,
    168,
    170,
    32,
    178,
    175,
    32,
    32,
    32,
    32,
    32,
    165,
    161,
    169,
    254,
    224,
    225,
    246,
    228,
    229,
    244,
    227,
    245,
    232,
    233,
    234,
    235,
    236,
    237,
    238,
    239,
    255,
    240,
    241,
    242,
    243,
    230,
    226,
    252,
    251,
    231,
    248,
    253,
    249,
    247,
    250,
    222,
    192,
    193,
    214,
    196,
    197,
    212,
    195,
    213,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    223,
    208,
    209,
    210,
    211,
    198,
    194,
    220,
    219,
    199,
    216,
    221,
    217,
    215,
    218
  ]
  var _cyrCp866 = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    225,
    226,
    247,
    231,
    228,
    229,
    246,
    250,
    233,
    234,
    235,
    236,
    237,
    238,
    239,
    240,
    242,
    243,
    244,
    245,
    230,
    232,
    227,
    254,
    251,
    253,
    255,
    249,
    248,
    252,
    224,
    241,
    193,
    194,
    215,
    199,
    196,
    197,
    214,
    218,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    35,
    35,
    35,
    124,
    124,
    124,
    124,
    43,
    43,
    124,
    124,
    43,
    43,
    43,
    43,
    43,
    43,
    45,
    45,
    124,
    45,
    43,
    124,
    124,
    43,
    43,
    45,
    45,
    124,
    45,
    43,
    45,
    45,
    45,
    45,
    43,
    43,
    43,
    43,
    43,
    43,
    43,
    43,
    35,
    35,
    124,
    124,
    35,
    210,
    211,
    212,
    213,
    198,
    200,
    195,
    222,
    219,
    221,
    223,
    217,
    216,
    220,
    192,
    209,
    179,
    163,
    180,
    164,
    183,
    167,
    190,
    174,
    32,
    149,
    158,
    32,
    152,
    159,
    148,
    154,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    205,
    186,
    213,
    241,
    243,
    201,
    32,
    245,
    187,
    212,
    211,
    200,
    190,
    32,
    247,
    198,
    199,
    204,
    181,
    240,
    242,
    185,
    32,
    244,
    203,
    207,
    208,
    202,
    216,
    32,
    246,
    32,
    238,
    160,
    161,
    230,
    164,
    165,
    228,
    163,
    229,
    168,
    169,
    170,
    171,
    172,
    173,
    174,
    175,
    239,
    224,
    225,
    226,
    227,
    166,
    162,
    236,
    235,
    167,
    232,
    237,
    233,
    231,
    234,
    158,
    128,
    129,
    150,
    132,
    133,
    148,
    131,
    149,
    136,
    137,
    138,
    139,
    140,
    141,
    142,
    143,
    159,
    144,
    145,
    146,
    147,
    134,
    130,
    156,
    155,
    135,
    152,
    157,
    153,
    151,
    154
  ]
  var _cyrIso88595 = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    179,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    225,
    226,
    247,
    231,
    228,
    229,
    246,
    250,
    233,
    234,
    235,
    236,
    237,
    238,
    239,
    240,
    242,
    243,
    244,
    245,
    230,
    232,
    227,
    254,
    251,
    253,
    255,
    249,
    248,
    252,
    224,
    241,
    193,
    194,
    215,
    199,
    196,
    197,
    214,
    218,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    210,
    211,
    212,
    213,
    198,
    200,
    195,
    222,
    219,
    221,
    223,
    217,
    216,
    220,
    192,
    209,
    32,
    163,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    241,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    161,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    32,
    238,
    208,
    209,
    230,
    212,
    213,
    228,
    211,
    229,
    216,
    217,
    218,
    219,
    220,
    221,
    222,
    223,
    239,
    224,
    225,
    226,
    227,
    214,
    210,
    236,
    235,
    215,
    232,
    237,
    233,
    231,
    234,
    206,
    176,
    177,
    198,
    180,
    181,
    196,
    179,
    197,
    184,
    185,
    186,
    187,
    188,
    189,
    190,
    191,
    207,
    192,
    193,
    194,
    195,
    182,
    178,
    204,
    203,
    183,
    200,
    205,
    201,
    199,
    202
  ]
  var _cyrMac = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    225,
    226,
    247,
    231,
    228,
    229,
    246,
    250,
    233,
    234,
    235,
    236,
    237,
    238,
    239,
    240,
    242,
    243,
    244,
    245,
    230,
    232,
    227,
    254,
    251,
    253,
    255,
    249,
    248,
    252,
    224,
    241,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    174,
    175,
    176,
    177,
    178,
    179,
    180,
    181,
    182,
    183,
    184,
    185,
    186,
    187,
    188,
    189,
    190,
    191,
    128,
    129,
    130,
    131,
    132,
    133,
    134,
    135,
    136,
    137,
    138,
    139,
    140,
    141,
    142,
    143,
    144,
    145,
    146,
    147,
    148,
    149,
    150,
    151,
    152,
    153,
    154,
    155,
    156,
    179,
    163,
    209,
    193,
    194,
    215,
    199,
    196,
    197,
    214,
    218,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    210,
    211,
    212,
    213,
    198,
    200,
    195,
    222,
    219,
    221,
    223,
    217,
    216,
    220,
    192,

    255,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,

    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    192,
    193,
    194,
    195,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    209,
    210,
    211,
    212,
    213,
    214,
    215,
    216,
    217,
    218,
    219,
    220,
    221,
    222,
    223,
    160,
    161,
    162,
    222,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    174,
    175,
    176,
    177,
    178,
    221,
    180,
    181,
    182,
    183,
    184,
    185,
    186,
    187,
    188,
    189,
    190,
    191,
    254,
    224,
    225,
    246,
    228,
    229,
    244,
    227,
    245,
    232,
    233,
    234,
    235,
    236,
    237,
    238,
    239,
    223,
    240,
    241,

    242,
    243,
    230,
    226,
    252,
    251,
    231,
    248,
    253,
    249,
    247,
    250,
    158,
    128,
    129,
    150,
    132,
    133,
    148,
    131,
    149,
    136,
    137,
    138,
    139,
    140,
    141,
    142,
    143,
    159,
    144,
    145,
    146,
    147,
    134,
    130,
    156,
    155,
    135,
    152,
    157,
    153,
    151,
    154
  ]

  var fromTable = null
  var toTable = null
  var tmp
  var i = 0
  var retStr = ''

  switch (from.toUpperCase()) {
    case 'W':
      fromTable = _cyrWin1251
      break
    case 'A':
    case 'D':
      fromTable = _cyrCp866
      break
    case 'I':
      fromTable = _cyrIso88595
      break
    case 'M':
      fromTable = _cyrMac
      break
    case 'K':
      break
    default:
      // Can we throw a warning instead? That would be more in line with PHP
      throw new Error('Unknown source charset: ' + fromTable)
  }

  switch (to.toUpperCase()) {
    case 'W':
      toTable = _cyrWin1251
      break
    case 'A':
    case 'D':
      toTable = _cyrCp866
      break
    case 'I':
      toTable = _cyrIso88595
      break
    case 'M':
      toTable = _cyrMac
      break
    case 'K':
      break
    default:
      // Can we throw a warning instead? That would be more in line with PHP
      throw new Error('Unknown destination charset: ' + toTable)
  }

  if (!str) {
    return str
  }

  for (i = 0; i < str.length; i++) {
    tmp = (fromTable === null)
      ? str.charAt(i)
      : String.fromCharCode(fromTable[str.charAt(i).charCodeAt(0)])

    retStr += (toTable === null)
      ? tmp
      : String.fromCharCode(toTable[tmp.charCodeAt(0) + 256])
  }

  return retStr
}

function crc32 (str) {
  //  discuss at: http://locutus.io/php/crc32/
  //   example 1: crc32('Kevin van Zonneveld')
  //   returns 1: 1249991249

  var utf8Encode = require('../xml/utf8_encode')
  str = utf8Encode(str)
  var table = [
    '00000000',
    '77073096',
    'EE0E612C',
    '990951BA',
    '076DC419',
    '706AF48F',
    'E963A535',
    '9E6495A3',
    '0EDB8832',
    '79DCB8A4',
    'E0D5E91E',
    '97D2D988',
    '09B64C2B',
    '7EB17CBD',
    'E7B82D07',
    '90BF1D91',
    '1DB71064',
    '6AB020F2',
    'F3B97148',
    '84BE41DE',
    '1ADAD47D',
    '6DDDE4EB',
    'F4D4B551',
    '83D385C7',
    '136C9856',
    '646BA8C0',
    'FD62F97A',
    '8A65C9EC',
    '14015C4F',
    '63066CD9',
    'FA0F3D63',
    '8D080DF5',
    '3B6E20C8',
    '4C69105E',
    'D56041E4',
    'A2677172',
    '3C03E4D1',
    '4B04D447',
    'D20D85FD',
    'A50AB56B',
    '35B5A8FA',
    '42B2986C',
    'DBBBC9D6',
    'ACBCF940',
    '32D86CE3',
    '45DF5C75',
    'DCD60DCF',
    'ABD13D59',
    '26D930AC',
    '51DE003A',
    'C8D75180',
    'BFD06116',
    '21B4F4B5',
    '56B3C423',
    'CFBA9599',
    'B8BDA50F',
    '2802B89E',
    '5F058808',
    'C60CD9B2',
    'B10BE924',
    '2F6F7C87',
    '58684C11',
    'C1611DAB',
    'B6662D3D',
    '76DC4190',
    '01DB7106',
    '98D220BC',
    'EFD5102A',
    '71B18589',
    '06B6B51F',
    '9FBFE4A5',
    'E8B8D433',
    '7807C9A2',
    '0F00F934',
    '9609A88E',
    'E10E9818',
    '7F6A0DBB',
    '086D3D2D',
    '91646C97',
    'E6635C01',
    '6B6B51F4',
    '1C6C6162',
    '856530D8',
    'F262004E',
    '6C0695ED',
    '1B01A57B',
    '8208F4C1',
    'F50FC457',
    '65B0D9C6',
    '12B7E950',
    '8BBEB8EA',
    'FCB9887C',
    '62DD1DDF',
    '15DA2D49',
    '8CD37CF3',
    'FBD44C65',
    '4DB26158',
    '3AB551CE',
    'A3BC0074',
    'D4BB30E2',
    '4ADFA541',
    '3DD895D7',
    'A4D1C46D',
    'D3D6F4FB',
    '4369E96A',
    '346ED9FC',
    'AD678846',
    'DA60B8D0',
    '44042D73',
    '33031DE5',
    'AA0A4C5F',
    'DD0D7CC9',
    '5005713C',
    '270241AA',
    'BE0B1010',
    'C90C2086',
    '5768B525',
    '206F85B3',
    'B966D409',
    'CE61E49F',
    '5EDEF90E',
    '29D9C998',
    'B0D09822',
    'C7D7A8B4',
    '59B33D17',
    '2EB40D81',
    'B7BD5C3B',
    'C0BA6CAD',
    'EDB88320',
    '9ABFB3B6',
    '03B6E20C',
    '74B1D29A',
    'EAD54739',
    '9DD277AF',
    '04DB2615',
    '73DC1683',
    'E3630B12',
    '94643B84',
    '0D6D6A3E',
    '7A6A5AA8',
    'E40ECF0B',
    '9309FF9D',
    '0A00AE27',
    '7D079EB1',
    'F00F9344',
    '8708A3D2',
    '1E01F268',
    '6906C2FE',
    'F762575D',
    '806567CB',
    '196C3671',
    '6E6B06E7',
    'FED41B76',
    '89D32BE0',
    '10DA7A5A',
    '67DD4ACC',
    'F9B9DF6F',
    '8EBEEFF9',
    '17B7BE43',
    '60B08ED5',
    'D6D6A3E8',
    'A1D1937E',
    '38D8C2C4',
    '4FDFF252',
    'D1BB67F1',
    'A6BC5767',
    '3FB506DD',
    '48B2364B',
    'D80D2BDA',
    'AF0A1B4C',
    '36034AF6',
    '41047A60',
    'DF60EFC3',
    'A867DF55',
    '316E8EEF',
    '4669BE79',
    'CB61B38C',
    'BC66831A',
    '256FD2A0',
    '5268E236',
    'CC0C7795',
    'BB0B4703',
    '220216B9',
    '5505262F',
    'C5BA3BBE',
    'B2BD0B28',
    '2BB45A92',
    '5CB36A04',
    'C2D7FFA7',
    'B5D0CF31',
    '2CD99E8B',
    '5BDEAE1D',
    '9B64C2B0',
    'EC63F226',
    '756AA39C',
    '026D930A',
    '9C0906A9',
    'EB0E363F',
    '72076785',
    '05005713',
    '95BF4A82',
    'E2B87A14',
    '7BB12BAE',
    '0CB61B38',
    '92D28E9B',
    'E5D5BE0D',
    '7CDCEFB7',
    '0BDBDF21',
    '86D3D2D4',
    'F1D4E242',
    '68DDB3F8',
    '1FDA836E',
    '81BE16CD',
    'F6B9265B',
    '6FB077E1',
    '18B74777',
    '88085AE6',
    'FF0F6A70',
    '66063BCA',
    '11010B5C',
    '8F659EFF',
    'F862AE69',
    '616BFFD3',
    '166CCF45',
    'A00AE278',
    'D70DD2EE',
    '4E048354',
    '3903B3C2',
    'A7672661',
    'D06016F7',
    '4969474D',
    '3E6E77DB',
    'AED16A4A',
    'D9D65ADC',
    '40DF0B66',
    '37D83BF0',
    'A9BCAE53',
    'DEBB9EC5',
    '47B2CF7F',
    '30B5FFE9',
    'BDBDF21C',
    'CABAC28A',
    '53B39330',
    '24B4A3A6',
    'BAD03605',
    'CDD70693',
    '54DE5729',
    '23D967BF',
    'B3667A2E',
    'C4614AB8',
    '5D681B02',
    '2A6F2B94',
    'B40BBE37',
    'C30C8EA1',
    '5A05DF1B',
    '2D02EF8D'
  ].join(' ')
  // @todo: ^-- Now that `table` is an array, maybe we can use that directly using slices,
  // instead of converting it to a string and substringing

  var crc = 0
  var x = 0
  var y = 0

  crc = crc ^ (-1)
  for (var i = 0, iTop = str.length; i < iTop; i++) {
    y = (crc ^ str.charCodeAt(i)) & 0xFF
    x = '0x' + table.substr(y * 9, 8)
    crc = (crc >>> 8) ^ x
  }

  return crc ^ (-1)
}

function get_html_translation_table (table, quoteStyle) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/get_html_translation_table/
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: noname
  // bugfixed by: Alex
  // bugfixed by: Marco
  // bugfixed by: madipta
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: T.Wild
  //    input by: Frank Forte
  //    input by: Ratheous
  //      note 1: It has been decided that we're not going to add global
  //      note 1: dependencies to Locutus, meaning the constants are not
  //      note 1: real constants, but strings instead. Integers are also supported if someone
  //      note 1: chooses to create the constants themselves.
  //   example 1: get_html_translation_table('HTML_SPECIALCHARS')
  //   returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

  var entities = {}
  var hashMap = {}
  var decimal
  var constMappingTable = {}
  var constMappingQuoteStyle = {}
  var useTable = {}
  var useQuoteStyle = {}

  // Translate arguments
  constMappingTable[0] = 'HTML_SPECIALCHARS'
  constMappingTable[1] = 'HTML_ENTITIES'
  constMappingQuoteStyle[0] = 'ENT_NOQUOTES'
  constMappingQuoteStyle[2] = 'ENT_COMPAT'
  constMappingQuoteStyle[3] = 'ENT_QUOTES'

  useTable = !isNaN(table)
    ? constMappingTable[table]
    : table
      ? table.toUpperCase()
      : 'HTML_SPECIALCHARS'

  useQuoteStyle = !isNaN(quoteStyle)
    ? constMappingQuoteStyle[quoteStyle]
    : quoteStyle
      ? quoteStyle.toUpperCase()
      : 'ENT_COMPAT'

  if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
    throw new Error('Table: ' + useTable + ' not supported')
  }

  entities['38'] = '&amp;'
  if (useTable === 'HTML_ENTITIES') {
    entities['160'] = '&nbsp;'
    entities['161'] = '&iexcl;'
    entities['162'] = '&cent;'
    entities['163'] = '&pound;'
    entities['164'] = '&curren;'
    entities['165'] = '&yen;'
    entities['166'] = '&brvbar;'
    entities['167'] = '&sect;'
    entities['168'] = '&uml;'
    entities['169'] = '&copy;'
    entities['170'] = '&ordf;'
    entities['171'] = '&laquo;'
    entities['172'] = '&not;'
    entities['173'] = '&shy;'
    entities['174'] = '&reg;'
    entities['175'] = '&macr;'
    entities['176'] = '&deg;'
    entities['177'] = '&plusmn;'
    entities['178'] = '&sup2;'
    entities['179'] = '&sup3;'
    entities['180'] = '&acute;'
    entities['181'] = '&micro;'
    entities['182'] = '&para;'
    entities['183'] = '&middot;'
    entities['184'] = '&cedil;'
    entities['185'] = '&sup1;'
    entities['186'] = '&ordm;'
    entities['187'] = '&raquo;'
    entities['188'] = '&frac14;'
    entities['189'] = '&frac12;'
    entities['190'] = '&frac34;'
    entities['191'] = '&iquest;'
    entities['192'] = '&Agrave;'
    entities['193'] = '&Aacute;'
    entities['194'] = '&Acirc;'
    entities['195'] = '&Atilde;'
    entities['196'] = '&Auml;'
    entities['197'] = '&Aring;'
    entities['198'] = '&AElig;'
    entities['199'] = '&Ccedil;'
    entities['200'] = '&Egrave;'
    entities['201'] = '&Eacute;'
    entities['202'] = '&Ecirc;'
    entities['203'] = '&Euml;'
    entities['204'] = '&Igrave;'
    entities['205'] = '&Iacute;'
    entities['206'] = '&Icirc;'
    entities['207'] = '&Iuml;'
    entities['208'] = '&ETH;'
    entities['209'] = '&Ntilde;'
    entities['210'] = '&Ograve;'
    entities['211'] = '&Oacute;'
    entities['212'] = '&Ocirc;'
    entities['213'] = '&Otilde;'
    entities['214'] = '&Ouml;'
    entities['215'] = '&times;'
    entities['216'] = '&Oslash;'
    entities['217'] = '&Ugrave;'
    entities['218'] = '&Uacute;'
    entities['219'] = '&Ucirc;'
    entities['220'] = '&Uuml;'
    entities['221'] = '&Yacute;'
    entities['222'] = '&THORN;'
    entities['223'] = '&szlig;'
    entities['224'] = '&agrave;'
    entities['225'] = '&aacute;'
    entities['226'] = '&acirc;'
    entities['227'] = '&atilde;'
    entities['228'] = '&auml;'
    entities['229'] = '&aring;'
    entities['230'] = '&aelig;'
    entities['231'] = '&ccedil;'
    entities['232'] = '&egrave;'
    entities['233'] = '&eacute;'
    entities['234'] = '&ecirc;'
    entities['235'] = '&euml;'
    entities['236'] = '&igrave;'
    entities['237'] = '&iacute;'
    entities['238'] = '&icirc;'
    entities['239'] = '&iuml;'
    entities['240'] = '&eth;'
    entities['241'] = '&ntilde;'
    entities['242'] = '&ograve;'
    entities['243'] = '&oacute;'
    entities['244'] = '&ocirc;'
    entities['245'] = '&otilde;'
    entities['246'] = '&ouml;'
    entities['247'] = '&divide;'
    entities['248'] = '&oslash;'
    entities['249'] = '&ugrave;'
    entities['250'] = '&uacute;'
    entities['251'] = '&ucirc;'
    entities['252'] = '&uuml;'
    entities['253'] = '&yacute;'
    entities['254'] = '&thorn;'
    entities['255'] = '&yuml;'
  }

  if (useQuoteStyle !== 'ENT_NOQUOTES') {
    entities['34'] = '&quot;'
  }
  if (useQuoteStyle === 'ENT_QUOTES') {
    entities['39'] = '&#39;'
  }
  entities['60'] = '&lt;'
  entities['62'] = '&gt;'

  // ascii decimals to real symbols
  for (decimal in entities) {
    if (entities.hasOwnProperty(decimal)) {
      hashMap[String.fromCharCode(decimal)] = entities[decimal]
    }
  }

  return hashMap
}

function echo () {
  //  discuss at: http://locutus.io/php/echo/
  //  revised by: Der Simon (http://innerdom.sourceforge.net/)
  // bugfixed by: Eugene Bulkin (http://doubleaw.com/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: EdorFaus
  //      note 1: In 1.3.2 and earlier, this function wrote to the body of the document when it
  //      note 1: was called in webbrowsers, in addition to supporting XUL.
  //      note 1: This involved >100 lines of boilerplate to do this in a safe way.
  //      note 1: Since I can't imageine a complelling use-case for this, and XUL is deprecated
  //      note 1: I have removed this behavior in favor of just calling `console.log`
  //      note 2: You'll see functions depends on `echo` instead of `console.log` as we'll want
  //      note 2: to have 1 contact point to interface with the outside world, so that it's easy
  //      note 2: to support other ways of printing output.
  //  revised by: Kevin van Zonneveld (http://kvz.io)
  //    input by: JB
  //   example 1: echo('Hello world')
  //   returns 1: undefined

  var args = Array.prototype.slice.call(arguments)
  return console.log(args.join(' '))
}

function hex2bin (s) {
  //  discuss at: http://locutus.io/php/hex2bin/
  //   example 1: hex2bin('44696d61')
  //   returns 1: 'Dima'
  //   example 2: hex2bin('00')
  //   returns 2: '\x00'
  //   example 3: hex2bin('2f1q')
  //   returns 3: false

  var ret = []
  var i = 0
  var l

  s += ''

  for (l = s.length; i < l; i += 2) {
    var c = parseInt(s.substr(i, 1), 16)
    var k = parseInt(s.substr(i + 1, 1), 16)
    if (isNaN(c) || isNaN(k)) return false
    ret.push((c << 4) | k)
  }

  return String.fromCharCode.apply(String, ret)
}

function htmlspecialchars_decode (string, quoteStyle) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/htmlspecialchars_decode/
  //      original by: Mirek Slugen
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Mateusz "loonquawl" Zalega
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //         input by: ReverseSyntax
  //         input by: Slawomir Kaniecki
  //         input by: Scott Cariss
  //         input by: Francois
  //         input by: Ratheous
  //         input by: Mailfaker (http://www.weedem.fr/)
  //       revised by: Kevin van Zonneveld (http://kvz.io)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: htmlspecialchars_decode("<p>this -&gt; &quot;</p>", 'ENT_NOQUOTES')
  //        returns 1: '<p>this -> &quot;</p>'
  //        example 2: htmlspecialchars_decode("&amp;quot;")
  //        returns 2: '&quot;'

  var optTemp = 0
  var i = 0
  var noquotes = false

  if (typeof quoteStyle === 'undefined') {
    quoteStyle = 2
  }
  string = string.toString()
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  var OPTS = {
    'ENT_NOQUOTES': 0,
    'ENT_HTML_QUOTE_SINGLE': 1,
    'ENT_HTML_QUOTE_DOUBLE': 2,
    'ENT_COMPAT': 2,
    'ENT_QUOTES': 3,
    'ENT_IGNORE': 4
  }
  if (quoteStyle === 0) {
    noquotes = true
  }
  if (typeof quoteStyle !== 'number') {
    // Allow for a single string or an array of string flags
    quoteStyle = [].concat(quoteStyle)
    for (i = 0; i < quoteStyle.length; i++) {
      // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
      if (OPTS[quoteStyle[i]] === 0) {
        noquotes = true
      } else if (OPTS[quoteStyle[i]]) {
        optTemp = optTemp | OPTS[quoteStyle[i]]
      }
    }
    quoteStyle = optTemp
  }
  if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
    // PHP doesn't currently escape if more than one 0, but it should:
    string = string.replace(/&#0*39;/g, "'")
    // This would also be useful here, but not a part of PHP:
    // string = string.replace(/&apos;|&#x0*27;/g, "'");
  }
  if (!noquotes) {
    string = string.replace(/&quot;/g, '"')
  }
  // Put this in last place to avoid escape being double-decoded
  string = string.replace(/&amp;/g, '&')

  return string
}

function localeconv () {
  //  discuss at: http://locutus.io/php/localeconv/
  //   example 1: setlocale('LC_ALL', 'en_US')
  //   example 1: localeconv()
  //   returns 1: {decimal_point: '.', thousands_sep: '', positive_sign: '', negative_sign: '-', int_frac_digits: 2, frac_digits: 2, p_cs_precedes: 1, p_sep_by_space: 0, n_cs_precedes: 1, n_sep_by_space: 0, p_sign_posn: 1, n_sign_posn: 1, grouping: [], int_curr_symbol: 'USD ', currency_symbol: '$', mon_decimal_point: '.', mon_thousands_sep: ',', mon_grouping: [3, 3]}

  var setlocale = require('../strings/setlocale')

  var arr = {}
  var prop = ''

  // ensure setup of localization variables takes place, if not already
  setlocale('LC_ALL', 0)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  // Make copies
  for (prop in $locutus.php.locales[$locutus.php.localeCategories.LC_NUMERIC].LC_NUMERIC) {
    arr[prop] = $locutus.php.locales[$locutus.php.localeCategories.LC_NUMERIC].LC_NUMERIC[prop]
  }
  for (prop in $locutus.php.locales[$locutus.php.localeCategories.LC_MONETARY].LC_MONETARY) {
    arr[prop] = $locutus.php.locales[$locutus.php.localeCategories.LC_MONETARY].LC_MONETARY[prop]
  }

  return arr
}

function ord (string) {
  //  discuss at: http://locutus.io/php/ord/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: incidence
  //   example 1: ord('K')
  //   returns 1: 75
  //   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
  //   returns 2: 65536

  var str = string + ''
  var code = str.charCodeAt(0)

  if (code >= 0xD800 && code <= 0xDBFF) {
    // High surrogate (could change last hex to 0xDB7F to treat
    // high private surrogates as single characters)
    var hi = code
    if (str.length === 1) {
      // This is just a high surrogate with no following low surrogate,
      // so we return its value;
      return code
      // we could also throw an error as it is not a complete character,
      // but someone may want to know
    }
    var low = str.charCodeAt(1)
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
  }
  if (code >= 0xDC00 && code <= 0xDFFF) {
    // Low surrogate
    // This is just a low surrogate with no preceding high surrogate,
    // so we return its value;
    return code
    // we could also throw an error as it is not a complete character,
    // but someone may want to know
  }

  return code
}

function parse_str (str, array) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/parse_str/
  //      original by: Cagri Ekin
  //      improved by: Michael White (http://getsprink.com)
  //      improved by: Jack
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: stag019
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
  // reimplemented by: stag019
  //         input by: Dreamer
  //         input by: Zaide (http://zaidesthings.com/)
  //         input by: David Pesta (http://davidpesta.com/)
  //         input by: jeicquest
  //           note 1: When no argument is specified, will put variables in global scope.
  //           note 1: When a particular argument has been passed, and the
  //           note 1: returned value is different parse_str of PHP.
  //           note 1: For example, a=b=c&d====c
  //        example 1: var $arr = {}
  //        example 1: parse_str('first=foo&second=bar', $arr)
  //        example 1: var $result = $arr
  //        returns 1: { first: 'foo', second: 'bar' }
  //        example 2: var $arr = {}
  //        example 2: parse_str('str_a=Jack+and+Jill+didn%27t+see+the+well.', $arr)
  //        example 2: var $result = $arr
  //        returns 2: { str_a: "Jack and Jill didn't see the well." }
  //        example 3: var $abc = {3:'a'}
  //        example 3: parse_str('a[b]["c"]=def&a[q]=t+5', $abc)
  //        example 3: var $result = $abc
  //        returns 3: {"3":"a","a":{"b":{"c":"def"},"q":"t 5"}}

  var strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&')
  var sal = strArr.length
  var i
  var j
  var ct
  var p
  var lastObj
  var obj
  var undef
  var chr
  var tmp
  var key
  var value
  var postLeftBracketPos
  var keys
  var keysLen

  var _fixStr = function (str) {
    return decodeURIComponent(str.replace(/\+/g, '%20'))
  }

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  if (!array) {
    array = $global
  }

  for (i = 0; i < sal; i++) {
    tmp = strArr[i].split('=')
    key = _fixStr(tmp[0])
    value = (tmp.length < 2) ? '' : _fixStr(tmp[1])

    while (key.charAt(0) === ' ') {
      key = key.slice(1)
    }
    if (key.indexOf('\x00') > -1) {
      key = key.slice(0, key.indexOf('\x00'))
    }
    if (key && key.charAt(0) !== '[') {
      keys = []
      postLeftBracketPos = 0
      for (j = 0; j < key.length; j++) {
        if (key.charAt(j) === '[' && !postLeftBracketPos) {
          postLeftBracketPos = j + 1
        } else if (key.charAt(j) === ']') {
          if (postLeftBracketPos) {
            if (!keys.length) {
              keys.push(key.slice(0, postLeftBracketPos - 1))
            }
            keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos))
            postLeftBracketPos = 0
            if (key.charAt(j + 1) !== '[') {
              break
            }
          }
        }
      }
      if (!keys.length) {
        keys = [key]
      }
      for (j = 0; j < keys[0].length; j++) {
        chr = keys[0].charAt(j)
        if (chr === ' ' || chr === '.' || chr === '[') {
          keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1)
        }
        if (chr === '[') {
          break
        }
      }

      obj = array
      for (j = 0, keysLen = keys.length; j < keysLen; j++) {
        key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '')
        lastObj = obj
        if ((key !== '' && key !== ' ') || j === 0) {
          if (obj[key] === undef) {
            obj[key] = {}
          }
          obj = obj[key]
        } else {
          // To insert new dimension
          ct = -1
          for (p in obj) {
            if (obj.hasOwnProperty(p)) {
              if (+p > ct && p.match(/^\d+$/g)) {
                ct = +p
              }
            }
          }
          key = ct + 1
        }
      }
      lastObj[key] = value
    }
  }
}

function ltrim (str, charlist) {
  //  discuss at: http://locutus.io/php/ltrim/
  //    input by: Erkekjetter
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: ltrim('    Kevin van Zonneveld    ')
  //   returns 1: 'Kevin van Zonneveld    '

  charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
    .replace(/([[\]().?/*{}+$^:])/g, '$1')

  var re = new RegExp('^[' + charlist + ']+', 'g')

  return (str + '')
    .replace(re, '')
}

function printf () {
  //  discuss at: http://locutus.io/php/printf/
  //   example 1: printf("%01.2f", 123.1)
  //   returns 1: 6

  var sprintf = require('../strings/sprintf')
  var echo = require('../strings/echo')
  var ret = sprintf.apply(this, arguments)
  echo(ret)
  return ret.length
}

function rtrim (str, charlist) {
  //  discuss at: http://locutus.io/php/rtrim/
  //    input by: Erkekjetter
  //    input by: rem
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: rtrim('    Kevin van Zonneveld    ')
  //   returns 1: '    Kevin van Zonneveld'

  charlist = !charlist ? ' \\s\u00A0' : (charlist + '')
    .replace(/([[\]().?/*{}+$^:])/g, '\\$1')

  var re = new RegExp('[' + charlist + ']+$', 'g')

  return (str + '').replace(re, '')
}

function setlocale (category, locale) {
  //  discuss at: http://locutus.io/php/setlocale/
  //      note 1: Is extensible, but currently only implements locales en,
  //      note 1: en_US, en_GB, en_AU, fr, and fr_CA for LC_TIME only; C for LC_CTYPE;
  //      note 1: C and en for LC_MONETARY/LC_NUMERIC; en for LC_COLLATE
  //      note 1: Uses global: locutus to store locale info
  //      note 1: Consider using http://demo.icu-project.org/icu-bin/locexp as basis for localization (as in i18n_loc_set_default())
  //      note 2: This function tries to establish the locale via the `window` global.
  //      note 2: This feature will not work in Node and hence is Browser-only
  //   example 1: setlocale('LC_ALL', 'en_US')
  //   returns 1: 'en_US'

  var getenv = require('../info/getenv')

  var categ = ''
  var cats = []
  var i = 0

  var _copy = function _copy (orig) {
    if (orig instanceof RegExp) {
      return new RegExp(orig)
    } else if (orig instanceof Date) {
      return new Date(orig)
    }
    var newObj = {}
    for (var i in orig) {
      if (typeof orig[i] === 'object') {
        newObj[i] = _copy(orig[i])
      } else {
        newObj[i] = orig[i]
      }
    }
    return newObj
  }

  // Function usable by a ngettext implementation (apparently not an accessible part of setlocale(),
  // but locale-specific) See http://www.gnu.org/software/gettext/manual/gettext.html#Plural-forms
  // though amended with others from https://developer.mozilla.org/En/Localization_and_Plurals (new
  // categories noted with "MDC" below, though not sure of whether there is a convention for the
  // relative order of these newer groups as far as ngettext) The function name indicates the number
  // of plural forms (nplural) Need to look into http://cldr.unicode.org/ (maybe future JavaScript);
  // Dojo has some functions (under new BSD), including JSON conversions of LDML XML from CLDR:
  // http://bugs.dojotoolkit.org/browser/dojo/trunk/cldr and docs at
  // http://api.dojotoolkit.org/jsdoc/HEAD/dojo.cldr

  // var _nplurals1 = function (n) {
  //   // e.g., Japanese
  //   return 0
  // }
  var _nplurals2a = function (n) {
    // e.g., English
    return n !== 1 ? 1 : 0
  }
  var _nplurals2b = function (n) {
    // e.g., French
    return n > 1 ? 1 : 0
  }

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  // Reconcile Windows vs. *nix locale names?
  // Allow different priority orders of languages, esp. if implement gettext as in
  // LANGUAGE env. var.? (e.g., show German if French is not available)
  if (!$locutus.php.locales ||
    !$locutus.php.locales.fr_CA ||
    !$locutus.php.locales.fr_CA.LC_TIME ||
    !$locutus.php.locales.fr_CA.LC_TIME.x) {
    // Can add to the locales
    $locutus.php.locales = {}

    $locutus.php.locales.en = {
      'LC_COLLATE': function (str1, str2) {
        // @todo: This one taken from strcmp, but need for other locales; we don't use localeCompare
        // since its locale is not settable
        return (str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1)
      },
      'LC_CTYPE': {
        // Need to change any of these for English as opposed to C?
        an: /^[A-Za-z\d]+$/g,
        al: /^[A-Za-z]+$/g,
        ct: /^[\u0000-\u001F\u007F]+$/g,
        dg: /^[\d]+$/g,
        gr: /^[\u0021-\u007E]+$/g,
        lw: /^[a-z]+$/g,
        pr: /^[\u0020-\u007E]+$/g,
        pu: /^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g,
        sp: /^[\f\n\r\t\v ]+$/g,
        up: /^[A-Z]+$/g,
        xd: /^[A-Fa-f\d]+$/g,
        CODESET: 'UTF-8',
        // Used by sql_regcase
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      },
      'LC_TIME': {
        // Comments include nl_langinfo() constant equivalents and any
        // changes from Blues' implementation
        a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        // ABDAY_
        A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        // DAY_
        b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        // ABMON_
        B: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October',
          'November', 'December'
        ],
        // MON_
        c: '%a %d %b %Y %r %Z',
        // D_T_FMT // changed %T to %r per results
        p: ['AM', 'PM'],
        // AM_STR/PM_STR
        P: ['am', 'pm'],
        // Not available in nl_langinfo()
        r: '%I:%M:%S %p',
        // T_FMT_AMPM (Fixed for all locales)
        x: '%m/%d/%Y',
        // D_FMT // switched order of %m and %d; changed %y to %Y (C uses %y)
        X: '%r',
        // T_FMT // changed from %T to %r  (%T is default for C, not English US)
        // Following are from nl_langinfo() or http://www.cptec.inpe.br/sx4/sx4man2/g1ab02e/strftime.4.html
        alt_digits: '',
        // e.g., ordinal
        ERA: '',
        ERA_YEAR: '',
        ERA_D_T_FMT: '',
        ERA_D_FMT: '',
        ERA_T_FMT: ''
      },
      // Assuming distinction between numeric and monetary is thus:
      // See below for C locale
      'LC_MONETARY': {
        // based on Windows "english" (English_United States.1252) locale
        int_curr_symbol: 'USD',
        currency_symbol: '$',
        mon_decimal_point: '.',
        mon_thousands_sep: ',',
        mon_grouping: [3],
        // use mon_thousands_sep; "" for no grouping; additional array members
        // indicate successive group lengths after first group
        // (e.g., if to be 1,23,456, could be [3, 2])
        positive_sign: '',
        negative_sign: '-',
        int_frac_digits: 2,
        // Fractional digits only for money defaults?
        frac_digits: 2,
        p_cs_precedes: 1,
        // positive currency symbol follows value = 0; precedes value = 1
        p_sep_by_space: 0,
        // 0: no space between curr. symbol and value; 1: space sep. them unless symb.
        // and sign are adjacent then space sep. them from value; 2: space sep. sign
        // and value unless symb. and sign are adjacent then space separates
        n_cs_precedes: 1,
        // see p_cs_precedes
        n_sep_by_space: 0,
        // see p_sep_by_space
        p_sign_posn: 3,
        // 0: parentheses surround quantity and curr. symbol; 1: sign precedes them;
        // 2: sign follows them; 3: sign immed. precedes curr. symbol; 4: sign immed.
        // succeeds curr. symbol
        n_sign_posn: 0 // see p_sign_posn
      },
      'LC_NUMERIC': {
        // based on Windows "english" (English_United States.1252) locale
        decimal_point: '.',
        thousands_sep: ',',
        grouping: [3] // see mon_grouping, but for non-monetary values (use thousands_sep)
      },
      'LC_MESSAGES': {
        YESEXPR: '^[yY].*',
        NOEXPR: '^[nN].*',
        YESSTR: '',
        NOSTR: ''
      },
      nplurals: _nplurals2a
    }
    $locutus.php.locales.en_US = _copy($locutus.php.locales.en)
    $locutus.php.locales.en_US.LC_TIME.c = '%a %d %b %Y %r %Z'
    $locutus.php.locales.en_US.LC_TIME.x = '%D'
    $locutus.php.locales.en_US.LC_TIME.X = '%r'
    // The following are based on *nix settings
    $locutus.php.locales.en_US.LC_MONETARY.int_curr_symbol = 'USD '
    $locutus.php.locales.en_US.LC_MONETARY.p_sign_posn = 1
    $locutus.php.locales.en_US.LC_MONETARY.n_sign_posn = 1
    $locutus.php.locales.en_US.LC_MONETARY.mon_grouping = [3, 3]
    $locutus.php.locales.en_US.LC_NUMERIC.thousands_sep = ''
    $locutus.php.locales.en_US.LC_NUMERIC.grouping = []

    $locutus.php.locales.en_GB = _copy($locutus.php.locales.en)
    $locutus.php.locales.en_GB.LC_TIME.r = '%l:%M:%S %P %Z'

    $locutus.php.locales.en_AU = _copy($locutus.php.locales.en_GB)
    // Assume C locale is like English (?) (We need C locale for LC_CTYPE)
    $locutus.php.locales.C = _copy($locutus.php.locales.en)
    $locutus.php.locales.C.LC_CTYPE.CODESET = 'ANSI_X3.4-1968'
    $locutus.php.locales.C.LC_MONETARY = {
      int_curr_symbol: '',
      currency_symbol: '',
      mon_decimal_point: '',
      mon_thousands_sep: '',
      mon_grouping: [],
      p_cs_precedes: 127,
      p_sep_by_space: 127,
      n_cs_precedes: 127,
      n_sep_by_space: 127,
      p_sign_posn: 127,
      n_sign_posn: 127,
      positive_sign: '',
      negative_sign: '',
      int_frac_digits: 127,
      frac_digits: 127
    }
    $locutus.php.locales.C.LC_NUMERIC = {
      decimal_point: '.',
      thousands_sep: '',
      grouping: []
    }
    // D_T_FMT
    $locutus.php.locales.C.LC_TIME.c = '%a %b %e %H:%M:%S %Y'
    // D_FMT
    $locutus.php.locales.C.LC_TIME.x = '%m/%d/%y'
    // T_FMT
    $locutus.php.locales.C.LC_TIME.X = '%H:%M:%S'
    $locutus.php.locales.C.LC_MESSAGES.YESEXPR = '^[yY]'
    $locutus.php.locales.C.LC_MESSAGES.NOEXPR = '^[nN]'

    $locutus.php.locales.fr = _copy($locutus.php.locales.en)
    $locutus.php.locales.fr.nplurals = _nplurals2b
    $locutus.php.locales.fr.LC_TIME.a = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
    $locutus.php.locales.fr.LC_TIME.A = ['dimanche', 'lundi', 'mardi', 'mercredi',
      'jeudi', 'vendredi', 'samedi']
    $locutus.php.locales.fr.LC_TIME.b = ['jan', 'f\u00E9v', 'mar', 'avr', 'mai',
      'jun', 'jui', 'ao\u00FB', 'sep', 'oct',
      'nov', 'd\u00E9c'
    ]
    $locutus.php.locales.fr.LC_TIME.B = ['janvier', 'f\u00E9vrier', 'mars',
      'avril', 'mai', 'juin', 'juillet', 'ao\u00FBt',
      'septembre', 'octobre', 'novembre', 'd\u00E9cembre'
    ]
    $locutus.php.locales.fr.LC_TIME.c = '%a %d %b %Y %T %Z'
    $locutus.php.locales.fr.LC_TIME.p = ['', '']
    $locutus.php.locales.fr.LC_TIME.P = ['', '']
    $locutus.php.locales.fr.LC_TIME.x = '%d.%m.%Y'
    $locutus.php.locales.fr.LC_TIME.X = '%T'

    $locutus.php.locales.fr_CA = _copy($locutus.php.locales.fr)
    $locutus.php.locales.fr_CA.LC_TIME.x = '%Y-%m-%d'
  }
  if (!$locutus.php.locale) {
    $locutus.php.locale = 'en_US'
    // Try to establish the locale via the `window` global
    if (typeof window !== 'undefined' && window.document) {
      var d = window.document
      var NS_XHTML = 'http://www.w3.org/1999/xhtml'
      var NS_XML = 'http://www.w3.org/XML/1998/namespace'
      if (d.getElementsByTagNameNS &&
        d.getElementsByTagNameNS(NS_XHTML, 'html')[0]) {
        if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS &&
          d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang')) {
          $locutus.php.locale = d.getElementsByTagName(NS_XHTML, 'html')[0]
            .getAttributeNS(NS_XML, 'lang')
        } else if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang) {
          // XHTML 1.0 only
          $locutus.php.locale = d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang
        }
      } else if (d.getElementsByTagName('html')[0] &&
        d.getElementsByTagName('html')[0].lang) {
        $locutus.php.locale = d.getElementsByTagName('html')[0].lang
      }
    }
  }
  // PHP-style
  $locutus.php.locale = $locutus.php.locale.replace('-', '_')
  // @todo: locale if declared locale hasn't been defined
  if (!($locutus.php.locale in $locutus.php.locales)) {
    if ($locutus.php.locale.replace(/_[a-zA-Z]+$/, '') in $locutus.php.locales) {
      $locutus.php.locale = $locutus.php.locale.replace(/_[a-zA-Z]+$/, '')
    }
  }

  if (!$locutus.php.localeCategories) {
    $locutus.php.localeCategories = {
      'LC_COLLATE': $locutus.php.locale,
      // for string comparison, see strcoll()
      'LC_CTYPE': $locutus.php.locale,
      // for character classification and conversion, for example strtoupper()
      'LC_MONETARY': $locutus.php.locale,
      // for localeconv()
      'LC_NUMERIC': $locutus.php.locale,
      // for decimal separator (See also localeconv())
      'LC_TIME': $locutus.php.locale,
      // for date and time formatting with strftime()
      // for system responses (available if PHP was compiled with libintl):
      'LC_MESSAGES': $locutus.php.locale
    }
  }

  if (locale === null || locale === '') {
    locale = getenv(category) || getenv('LANG')
  } else if (Object.prototype.toString.call(locale) === '[object Array]') {
    for (i = 0; i < locale.length; i++) {
      if (!(locale[i] in $locutus.php.locales)) {
        if (i === locale.length - 1) {
          // none found
          return false
        }
        continue
      }
      locale = locale[i]
      break
    }
  }

  // Just get the locale
  if (locale === '0' || locale === 0) {
    if (category === 'LC_ALL') {
      for (categ in $locutus.php.localeCategories) {
        // Add ".UTF-8" or allow ".@latint", etc. to the end?
        cats.push(categ + '=' + $locutus.php.localeCategories[categ])
      }
      return cats.join(';')
    }
    return $locutus.php.localeCategories[category]
  }

  if (!(locale in $locutus.php.locales)) {
    // Locale not found
    return false
  }

  // Set and get locale
  if (category === 'LC_ALL') {
    for (categ in $locutus.php.localeCategories) {
      $locutus.php.localeCategories[categ] = locale
    }
  } else {
    $locutus.php.localeCategories[category] = locale
  }

  return locale
}

function sha1_file (str_filename) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/sha1_file/
  //      note 1: Relies on file_get_contents which does not work in the browser, so Node only.
  //      note 2: Keep in mind that in accordance with PHP, the whole file is buffered and then
  //      note 2: hashed. We'd recommend Node's native crypto modules for faster and more
  //      note 2: efficient hashing
  //   example 1: sha1_file('test/never-change.txt')
  //   returns 1: '0ea65a1f4b4d69712affc58240932f3eb8a2af66'

  var fileGetContents = require('../filesystem/file_get_contents')
  var sha1 = require('../strings/sha1')
  var buf = fileGetContents(str_filename)

  if (buf === false) {
    return false
  }

  return sha1(buf)
}

function sha1 (str) {
  //  discuss at: http://locutus.io/php/sha1/
  //    input by: Brett Zamir (http://brett-zamir.me)
  //      note 1: Keep in mind that in accordance with PHP, the whole string is buffered and then
  //      note 1: hashed. If available, we'd recommend using Node's native crypto modules directly
  //      note 1: in a steaming fashion for faster and more efficient hashing
  //   example 1: sha1('Kevin van Zonneveld')
  //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

  var hash
  try {
    var crypto = require('crypto')
    var sha1sum = crypto.createHash('sha1')
    sha1sum.update(str)
    hash = sha1sum.digest('hex')
  } catch (e) {
    hash = undefined
  }

  if (hash !== undefined) {
    return hash
  }

  var _rotLeft = function (n, s) {
    var t4 = (n << s) | (n >>> (32 - s))
    return t4
  }

  var _cvtHex = function (val) {
    var str = ''
    var i
    var v

    for (i = 7; i >= 0; i--) {
      v = (val >>> (i * 4)) & 0x0f
      str += v.toString(16)
    }
    return str
  }

  var blockstart
  var i, j
  var W = new Array(80)
  var H0 = 0x67452301
  var H1 = 0xEFCDAB89
  var H2 = 0x98BADCFE
  var H3 = 0x10325476
  var H4 = 0xC3D2E1F0
  var A, B, C, D, E
  var temp

  // utf8_encode
  str = unescape(encodeURIComponent(str))
  var strLen = str.length

  var wordArray = []
  for (i = 0; i < strLen - 3; i += 4) {
    j = str.charCodeAt(i) << 24 |
      str.charCodeAt(i + 1) << 16 |
      str.charCodeAt(i + 2) << 8 |
      str.charCodeAt(i + 3)
    wordArray.push(j)
  }

  switch (strLen % 4) {
    case 0:
      i = 0x080000000
      break
    case 1:
      i = str.charCodeAt(strLen - 1) << 24 | 0x0800000
      break
    case 2:
      i = str.charCodeAt(strLen - 2) << 24 | str.charCodeAt(strLen - 1) << 16 | 0x08000
      break
    case 3:
      i = str.charCodeAt(strLen - 3) << 24 |
        str.charCodeAt(strLen - 2) << 16 |
        str.charCodeAt(strLen - 1) <<
      8 | 0x80
      break
  }

  wordArray.push(i)

  while ((wordArray.length % 16) !== 14) {
    wordArray.push(0)
  }

  wordArray.push(strLen >>> 29)
  wordArray.push((strLen << 3) & 0x0ffffffff)

  for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
    for (i = 0; i < 16; i++) {
      W[i] = wordArray[blockstart + i]
    }
    for (i = 16; i <= 79; i++) {
      W[i] = _rotLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
    }

    A = H0
    B = H1
    C = H2
    D = H3
    E = H4

    for (i = 0; i <= 19; i++) {
      temp = (_rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    for (i = 20; i <= 39; i++) {
      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    for (i = 40; i <= 59; i++) {
      temp = (_rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    for (i = 60; i <= 79; i++) {
      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
      E = D
      D = C
      C = _rotLeft(B, 30)
      B = A
      A = temp
    }

    H0 = (H0 + A) & 0x0ffffffff
    H1 = (H1 + B) & 0x0ffffffff
    H2 = (H2 + C) & 0x0ffffffff
    H3 = (H3 + D) & 0x0ffffffff
    H4 = (H4 + E) & 0x0ffffffff
  }

  temp = _cvtHex(H0) + _cvtHex(H1) + _cvtHex(H2) + _cvtHex(H3) + _cvtHex(H4)
  return temp.toLowerCase()
}

function sprintf () {
  //  discuss at: http://locutus.io/php/sprintf/
  //    input by: Paulo Freitas
  //    input by: Brett Zamir (http://brett-zamir.me)
  //   example 1: sprintf("%01.2f", 123.1)
  //   returns 1: '123.10'
  //   example 2: sprintf("[%10s]", 'monkey')
  //   returns 2: '[    monkey]'
  //   example 3: sprintf("[%'#10s]", 'monkey')
  //   returns 3: '[####monkey]'
  //   example 4: sprintf("%d", 123456789012345)
  //   returns 4: '123456789012345'
  //   example 5: sprintf('%-03s', 'E')
  //   returns 5: 'E00'

  var regex = /%%|%(\d+\$)?([-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g
  var a = arguments
  var i = 0
  var format = a[i++]

  var _pad = function (str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' '
    }
    var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr)
    return leftJustify ? str + padding : padding + str
  }

  var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
    var diff = minWidth - value.length
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = _pad(value, minWidth, customPadChar, leftJustify)
      } else {
        value = [
          value.slice(0, prefix.length),
          _pad('', diff, '0', true),
          value.slice(prefix.length)
        ].join('')
      }
    }
    return value
  }

  var _formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0
    prefix = (prefix && number && {
      '2': '0b',
      '8': '0',
      '16': '0x'
    }[base]) || ''
    value = prefix + _pad(number.toString(base), precision || 0, '0', false)
    return justify(value, prefix, leftJustify, minWidth, zeroPad)
  }

  // _formatString()
  var _formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
    if (precision !== null && precision !== undefined) {
      value = value.slice(0, precision)
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar)
  }

  // doFormat()
  var doFormat = function (substring, valueIndex, flags, minWidth, precision, type) {
    var number, prefix, method, textTransform, value

    if (substring === '%%') {
      return '%'
    }

    // parse flags
    var leftJustify = false
    var positivePrefix = ''
    var zeroPad = false
    var prefixBaseX = false
    var customPadChar = ' '
    var flagsl = flags.length
    var j
    for (j = 0; j < flagsl; j++) {
      switch (flags.charAt(j)) {
        case ' ':
          positivePrefix = ' '
          break
        case '+':
          positivePrefix = '+'
          break
        case '-':
          leftJustify = true
          break
        case "'":
          customPadChar = flags.charAt(j + 1)
          break
        case '0':
          zeroPad = true
          customPadChar = '0'
          break
        case '#':
          prefixBaseX = true
          break
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0
    } else if (minWidth === '*') {
      minWidth = +a[i++]
    } else if (minWidth.charAt(0) === '*') {
      minWidth = +a[minWidth.slice(1, -1)]
    } else {
      minWidth = +minWidth
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth
      leftJustify = true
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite')
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined
    } else if (precision === '*') {
      precision = +a[i++]
    } else if (precision.charAt(0) === '*') {
      precision = +a[precision.slice(1, -1)]
    } else {
      precision = +precision
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++]

    switch (type) {
      case 's':
        return _formatString(value + '', leftJustify, minWidth, precision, zeroPad, customPadChar)
      case 'c':
        return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad)
      case 'b':
        return _formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
      case 'o':
        return _formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
      case 'x':
        return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
      case 'X':
        return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
        .toUpperCase()
      case 'u':
        return _formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
      case 'i':
      case 'd':
        number = +value || 0
        // Plain Math.round doesn't just truncate
        number = Math.round(number - number % 1)
        prefix = number < 0 ? '-' : positivePrefix
        value = prefix + _pad(String(Math.abs(number)), precision, '0', false)
        return justify(value, prefix, leftJustify, minWidth, zeroPad)
      case 'e':
      case 'E':
      case 'f': // @todo: Should handle locales (as per setlocale)
      case 'F':
      case 'g':
      case 'G':
        number = +value
        prefix = number < 0 ? '-' : positivePrefix
        method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())]
        textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2]
        value = prefix + Math.abs(number)[method](precision)
        return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]()
      default:
        return substring
    }
  }

  return format.replace(regex, doFormat)
}

function str_pad (input, padLength, padString, padType) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_pad/
  //    input by: Marco van Oort
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT')
  //   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
  //   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH')
  //   returns 2: '------Kevin van Zonneveld-----'

  var half = ''
  var padToGo

  var _strPadRepeater = function (s, len) {
    var collect = ''

    while (collect.length < len) {
      collect += s
    }
    collect = collect.substr(0, len)

    return collect
  }

  input += ''
  padString = padString !== undefined ? padString : ' '

  if (padType !== 'STR_PAD_LEFT' && padType !== 'STR_PAD_RIGHT' && padType !== 'STR_PAD_BOTH') {
    padType = 'STR_PAD_RIGHT'
  }
  if ((padToGo = padLength - input.length) > 0) {
    if (padType === 'STR_PAD_LEFT') {
      input = _strPadRepeater(padString, padToGo) + input
    } else if (padType === 'STR_PAD_RIGHT') {
      input = input + _strPadRepeater(padString, padToGo)
    } else if (padType === 'STR_PAD_BOTH') {
      half = _strPadRepeater(padString, Math.ceil(padToGo / 2))
      input = half + input + half
      input = input.substr(0, padLength)
    }
  }

  return input
}

function quoted_printable_decode (str) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/quoted_printable_decode/
  //      original by: Ole Vrijenhoek
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Theriault (https://github.com/Theriault)
  // reimplemented by: Theriault (https://github.com/Theriault)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //        example 1: quoted_printable_decode('a=3Db=3Dc')
  //        returns 1: 'a=b=c'
  //        example 2: quoted_printable_decode('abc  =20\r\n123  =20\r\n')
  //        returns 2: 'abc   \r\n123   \r\n'
  //        example 3: quoted_printable_decode('012345678901234567890123456789012345678901234567890123456789012345678901234=\r\n56789')
  //        returns 3: '01234567890123456789012345678901234567890123456789012345678901234567890123456789'
  //        example 4: quoted_printable_decode("Lorem ipsum dolor sit amet=23, consectetur adipisicing elit")
  //        returns 4: 'Lorem ipsum dolor sit amet#, consectetur adipisicing elit'

  // Decodes all equal signs followed by two hex digits
  var RFC2045Decode1 = /=\r\n/gm

  // the RFC states against decoding lower case encodings, but following apparent PHP behavior
  var RFC2045Decode2IN = /=([0-9A-F]{2})/gim
  // RFC2045Decode2IN = /=([0-9A-F]{2})/gm,

  var RFC2045Decode2OUT = function (sMatch, sHex) {
    return String.fromCharCode(parseInt(sHex, 16))
  }

  return str.replace(RFC2045Decode1, '')
    .replace(RFC2045Decode2IN, RFC2045Decode2OUT)
}

function str_replace (search, replace, subject, countObj) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_replace/
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Anton Ongson
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Oleg Eremeev
  // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
  // bugfixed by: Glen Arason (http://CanadianDomainRegistry.ca)
  //    input by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Oleg Eremeev
  //      note 1: The countObj parameter (optional) if used must be passed in as a
  //      note 1: object. The count will then be written by reference into it's `value` property
  //   example 1: str_replace(' ', '.', 'Kevin van Zonneveld')
  //   returns 1: 'Kevin.van.Zonneveld'
  //   example 2: str_replace(['{name}', 'l'], ['hello', 'm'], '{name}, lars')
  //   returns 2: 'hemmo, mars'
  //   example 3: str_replace(Array('S','F'),'x','ASDFASDF')
  //   returns 3: 'AxDxAxDx'
  //   example 4: var countObj = {}
  //   example 4: str_replace(['A','D'], ['x','y'] , 'ASDFASDF' , countObj)
  //   example 4: var $result = countObj.value
  //   returns 4: 4

  var i = 0
  var j = 0
  var temp = ''
  var repl = ''
  var sl = 0
  var fl = 0
  var f = [].concat(search)
  var r = [].concat(replace)
  var s = subject
  var ra = Object.prototype.toString.call(r) === '[object Array]'
  var sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
    temp = ''
    r = [].concat(replace)
    ra = Object.prototype.toString.call(r) === '[object Array]'
  }

  if (typeof countObj !== 'undefined') {
    countObj.value = 0
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      if (typeof countObj !== 'undefined') {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }
  return sa ? s : s[0]
}

function str_rot13 (str) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_rot13/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: str_rot13('Kevin van Zonneveld')
  //   returns 1: 'Xriva ina Mbaariryq'
  //   example 2: str_rot13('Xriva ina Mbaariryq')
  //   returns 2: 'Kevin van Zonneveld'
  //   example 3: str_rot13(33)
  //   returns 3: '33'

  return (str + '')
    .replace(/[a-z]/gi, function (s) {
      return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13))
    })
}

function str_shuffle (str) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_shuffle/
  //   example 1: var $shuffled = str_shuffle("abcdef")
  //   example 1: var $result = $shuffled.length
  //   returns 1: 6

  if (arguments.length === 0) {
    throw new Error('Wrong parameter count for str_shuffle()')
  }

  if (str === null) {
    return ''
  }

  str += ''

  var newStr = ''
  var rand
  var i = str.length

  while (i) {
    rand = Math.floor(Math.random() * i)
    newStr += str.charAt(rand)
    str = str.substring(0, rand) + str.substr(rand + 1)
    i--
  }

  return newStr
}

function str_word_count (str, format, charlist) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_word_count/
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: Bug?
  //   example 1: str_word_count("Hello fri3nd, you're\r\n       looking          good today!", 1)
  //   returns 1: ['Hello', 'fri', 'nd', "you're", 'looking', 'good', 'today']
  //   example 2: str_word_count("Hello fri3nd, you're\r\n       looking          good today!", 2)
  //   returns 2: {0: 'Hello', 6: 'fri', 10: 'nd', 14: "you're", 29: 'looking', 46: 'good', 51: 'today'}
  //   example 3: str_word_count("Hello fri3nd, you're\r\n       looking          good today!", 1, '\u00e0\u00e1\u00e3\u00e73')
  //   returns 3: ['Hello', 'fri3nd', "you're", 'looking', 'good', 'today']
  //   example 4: str_word_count('hey', 2)
  //   returns 4: {0: 'hey'}

  var ctypeAlpha = require('../ctype/ctype_alpha')
  var len = str.length
  var cl = charlist && charlist.length
  var chr = ''
  var tmpStr = ''
  var i = 0
  var c = ''
  var wArr = []
  var wC = 0
  var assoc = {}
  var aC = 0
  var reg = ''
  var match = false

  var _pregQuote = function (str) {
    return (str + '').replace(/([\\.+*?[^\]$(){}=!<>|:])/g, '\\$1')
  }
  var _getWholeChar = function (str, i) {
    // Use for rare cases of non-BMP characters
    var code = str.charCodeAt(i)
    if (code < 0xD800 || code > 0xDFFF) {
      return str.charAt(i)
    }
    if (code >= 0xD800 && code <= 0xDBFF) {
      // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single
      // characters)
      if (str.length <= (i + 1)) {
        throw new Error('High surrogate without following low surrogate')
      }
      var next = str.charCodeAt(i + 1)
      if (next < 0xDC00 || next > 0xDFFF) {
        throw new Error('High surrogate without following low surrogate')
      }
      return str.charAt(i) + str.charAt(i + 1)
    }
    // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
    if (i === 0) {
      throw new Error('Low surrogate without preceding high surrogate')
    }
    var prev = str.charCodeAt(i - 1)
    if (prev < 0xD800 || prev > 0xDBFF) {
      // (could change last hex to 0xDB7F to treat high private surrogates as single characters)
      throw new Error('Low surrogate without preceding high surrogate')
    }
    // We can pass over low surrogates now as the second component in a pair which we have already
    // processed
    return false
  }

  if (cl) {
    reg = '^(' + _pregQuote(_getWholeChar(charlist, 0))
    for (i = 1; i < cl; i++) {
      if ((chr = _getWholeChar(charlist, i)) === false) {
        continue
      }
      reg += '|' + _pregQuote(chr)
    }
    reg += ')$'
    reg = new RegExp(reg)
  }

  for (i = 0; i < len; i++) {
    if ((c = _getWholeChar(str, i)) === false) {
      continue
    }
    // No hyphen at beginning or end unless allowed in charlist (or locale)
    // No apostrophe at beginning unless allowed in charlist (or locale)
    // @todo: Make this more readable
    match = ctypeAlpha(c) ||
      (reg && c.search(reg) !== -1) ||
      ((i !== 0 && i !== len - 1) && c === '-') ||
      (i !== 0 && c === "'")
    if (match) {
      if (tmpStr === '' && format === 2) {
        aC = i
      }
      tmpStr = tmpStr + c
    }
    if (i === len - 1 || !match && tmpStr !== '') {
      if (format !== 2) {
        wArr[wArr.length] = tmpStr
      } else {
        assoc[aC] = tmpStr
      }
      tmpStr = ''
      wC++
    }
  }

  if (!format) {
    return wC
  } else if (format === 1) {
    return wArr
  } else if (format === 2) {
    return assoc
  }

  throw new Error('You have supplied an incorrect format')
}

function strcasecmp (fString1, fString2) {
  //  discuss at: http://locutus.io/php/strcasecmp/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: strcasecmp('Hello', 'hello')
  //   returns 1: 0

  var string1 = (fString1 + '').toLowerCase()
  var string2 = (fString2 + '').toLowerCase()

  if (string1 > string2) {
    return 1
  } else if (string1 === string2) {
    return 0
  }

  return -1
}

function strcmp (str1, str2) {
  //  discuss at: http://locutus.io/php/strcmp/
  //    input by: Steve Hilder
  //  revised by: gorthaur
  //   example 1: strcmp( 'waldo', 'owald' )
  //   returns 1: 1
  //   example 2: strcmp( 'owald', 'waldo' )
  //   returns 2: -1

  return ((str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1))
}

function strnatcasecmp (a, b) {
  //       discuss at: http://locutus.io/php/strnatcasecmp/
  //      original by: Martin Pool
  // reimplemented by: Pierre-Luc Paour
  // reimplemented by: Kristof Coomans (SCK-CEN (Belgian Nucleair Research Centre))
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //         input by: Devan Penner-Woelk
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  // reimplemented by: Rafał Kukawski
  //        example 1: strnatcasecmp(10, 1)
  //        returns 1: 1
  //        example 2: strnatcasecmp('1', '10')
  //        returns 2: -1

  var strnatcmp = require('../strings/strnatcmp')
  var _phpCastString = require('../_helpers/_phpCastString')

  if (arguments.length !== 2) {
    return null
  }

  return strnatcmp(_phpCastString(a).toLowerCase(), _phpCastString(b).toLowerCase())
}

function strncmp (str1, str2, lgth) {
  //       discuss at: http://locutus.io/php/strncmp/
  //      original by: Waldo Malqui Silva (http://waldo.malqui.info)
  //         input by: Steve Hilder
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //       revised by: gorthaur
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: strncmp('aaa', 'aab', 2)
  //        returns 1: 0
  //        example 2: strncmp('aaa', 'aab', 3 )
  //        returns 2: -1

  var s1 = (str1 + '')
    .substr(0, lgth)
  var s2 = (str2 + '')
    .substr(0, lgth)

  return ((s1 === s2) ? 0 : ((s1 > s2) ? 1 : -1))
}

function strpbrk (haystack, charList) {
  //  discuss at: http://locutus.io/php/strpbrk/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //  revised by: Christoph
  //   example 1: strpbrk('This is a Simple text.', 'is')
  //   returns 1: 'is is a Simple text.'

  for (var i = 0, len = haystack.length; i < len; ++i) {
    if (charList.indexOf(haystack.charAt(i)) >= 0) {
      return haystack.slice(i)
    }
  }
  return false
}

function strrchr (haystack, needle) {
  //  discuss at: http://locutus.io/php/strrchr/
  //    input by: Jason Wong (http://carrot.org/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: strrchr("Line 1\nLine 2\nLine 3", 10).substr(1)
  //   returns 1: 'Line 3'

  var pos = 0

  if (typeof needle !== 'string') {
    needle = String.fromCharCode(parseInt(needle, 10))
  }
  needle = needle.charAt(0)
  pos = haystack.lastIndexOf(needle)
  if (pos === -1) {
    return false
  }

  return haystack.substr(pos)
}

function strrev (string) {
  //       discuss at: http://locutus.io/php/strrev/
  //      original by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //        example 1: strrev('Kevin van Zonneveld')
  //        returns 1: 'dlevennoZ nav niveK'
  //        example 2: strrev('a\u0301haB')
  //        returns 2: 'Baha\u0301' // combining
  //        example 3: strrev('A\uD87E\uDC04Z')
  //        returns 3: 'Z\uD87E\uDC04A' // surrogates
  //             test: 'skip-3'

  string = string + ''

  // Performance will be enhanced with the next two lines of code commented
  // out if you don't care about combining characters
  // Keep Unicode combining characters together with the character preceding
  // them and which they are modifying (as in PHP 6)
  // See http://unicode.org/reports/tr44/#Property_Table (Me+Mn)
  // We also add the low surrogate range at the beginning here so it will be
  // maintained with its preceding high surrogate

  var chars = [
    '\uDC00-\uDFFF',
    '\u0300-\u036F',
    '\u0483-\u0489',
    '\u0591-\u05BD',
    '\u05BF',
    '\u05C1',
    '\u05C2',
    '\u05C4',
    '\u05C5',
    '\u05C7',
    '\u0610-\u061A',
    '\u064B-\u065E',
    '\u0670',
    '\u06D6-\u06DC',
    '\u06DE-\u06E4',
    '\u06E7\u06E8',
    '\u06EA-\u06ED',
    '\u0711',
    '\u0730-\u074A',
    '\u07A6-\u07B0',
    '\u07EB-\u07F3',
    '\u0901-\u0903',
    '\u093C',
    '\u093E-\u094D',
    '\u0951-\u0954',
    '\u0962',
    '\u0963',
    '\u0981-\u0983',
    '\u09BC',
    '\u09BE-\u09C4',
    '\u09C7',
    '\u09C8',
    '\u09CB-\u09CD',
    '\u09D7',
    '\u09E2',
    '\u09E3',
    '\u0A01-\u0A03',
    '\u0A3C',
    '\u0A3E-\u0A42',
    '\u0A47',
    '\u0A48',
    '\u0A4B-\u0A4D',
    '\u0A51',
    '\u0A70',
    '\u0A71',
    '\u0A75',
    '\u0A81-\u0A83',
    '\u0ABC',
    '\u0ABE-\u0AC5',
    '\u0AC7-\u0AC9',
    '\u0ACB-\u0ACD',
    '\u0AE2',
    '\u0AE3',
    '\u0B01-\u0B03',
    '\u0B3C',
    '\u0B3E-\u0B44',
    '\u0B47',
    '\u0B48',
    '\u0B4B-\u0B4D',
    '\u0B56',
    '\u0B57',
    '\u0B62',
    '\u0B63',
    '\u0B82',
    '\u0BBE-\u0BC2',
    '\u0BC6-\u0BC8',
    '\u0BCA-\u0BCD',
    '\u0BD7',
    '\u0C01-\u0C03',
    '\u0C3E-\u0C44',
    '\u0C46-\u0C48',
    '\u0C4A-\u0C4D',
    '\u0C55',
    '\u0C56',
    '\u0C62',
    '\u0C63',
    '\u0C82',
    '\u0C83',
    '\u0CBC',
    '\u0CBE-\u0CC4',
    '\u0CC6-\u0CC8',
    '\u0CCA-\u0CCD',
    '\u0CD5',
    '\u0CD6',
    '\u0CE2',
    '\u0CE3',
    '\u0D02',
    '\u0D03',
    '\u0D3E-\u0D44',
    '\u0D46-\u0D48',
    '\u0D4A-\u0D4D',
    '\u0D57',
    '\u0D62',
    '\u0D63',
    '\u0D82',
    '\u0D83',
    '\u0DCA',
    '\u0DCF-\u0DD4',
    '\u0DD6',
    '\u0DD8-\u0DDF',
    '\u0DF2',
    '\u0DF3',
    '\u0E31',
    '\u0E34-\u0E3A',
    '\u0E47-\u0E4E',
    '\u0EB1',
    '\u0EB4-\u0EB9',
    '\u0EBB',
    '\u0EBC',
    '\u0EC8-\u0ECD',
    '\u0F18',
    '\u0F19',
    '\u0F35',
    '\u0F37',
    '\u0F39',
    '\u0F3E',
    '\u0F3F',
    '\u0F71-\u0F84',
    '\u0F86',
    '\u0F87',
    '\u0F90-\u0F97',
    '\u0F99-\u0FBC',
    '\u0FC6',
    '\u102B-\u103E',
    '\u1056-\u1059',
    '\u105E-\u1060',
    '\u1062-\u1064',
    '\u1067-\u106D',
    '\u1071-\u1074',
    '\u1082-\u108D',
    '\u108F',
    '\u135F',
    '\u1712-\u1714',
    '\u1732-\u1734',
    '\u1752',
    '\u1753',
    '\u1772',
    '\u1773',
    '\u17B6-\u17D3',
    '\u17DD',
    '\u180B-\u180D',
    '\u18A9',
    '\u1920-\u192B',
    '\u1930-\u193B',
    '\u19B0-\u19C0',
    '\u19C8',
    '\u19C9',
    '\u1A17-\u1A1B',
    '\u1B00-\u1B04',
    '\u1B34-\u1B44',
    '\u1B6B-\u1B73',
    '\u1B80-\u1B82',
    '\u1BA1-\u1BAA',
    '\u1C24-\u1C37',
    '\u1DC0-\u1DE6',
    '\u1DFE',
    '\u1DFF',
    '\u20D0-\u20F0',
    '\u2DE0-\u2DFF',
    '\u302A-\u302F',
    '\u3099',
    '\u309A',
    '\uA66F-\uA672',
    '\uA67C',
    '\uA67D',
    '\uA802',
    '\uA806',
    '\uA80B',
    '\uA823-\uA827',
    '\uA880',
    '\uA881',
    '\uA8B4-\uA8C4',
    '\uA926-\uA92D',
    '\uA947-\uA953',
    '\uAA29-\uAA36',
    '\uAA43',
    '\uAA4C',
    '\uAA4D',
    '\uFB1E',
    '\uFE00-\uFE0F',
    '\uFE20-\uFE26'
  ]

  var graphemeExtend = new RegExp('(.)([' + chars.join('') + ']+)', 'g')

  // Temporarily reverse
  string = string.replace(graphemeExtend, '$2$1')
  return string.split('').reverse().join('')
}

function strtoupper (str) {
  //  discuss at: http://locutus.io/php/strtoupper/
  //   example 1: strtoupper('Kevin van Zonneveld')
  //   returns 1: 'KEVIN VAN ZONNEVELD'

  return (str + '')
    .toUpperCase()
}

function substr_count (haystack, needle, offset, length) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/substr_count/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: substr_count('Kevin van Zonneveld', 'e')
  //   returns 1: 3
  //   example 2: substr_count('Kevin van Zonneveld', 'K', 1)
  //   returns 2: 0
  //   example 3: substr_count('Kevin van Zonneveld', 'Z', 0, 10)
  //   returns 3: false

  var cnt = 0

  haystack += ''
  needle += ''
  if (isNaN(offset)) {
    offset = 0
  }
  if (isNaN(length)) {
    length = 0
  }
  if (needle.length === 0) {
    return false
  }
  offset--

  while ((offset = haystack.indexOf(needle, offset + 1)) !== -1) {
    if (length > 0 && (offset + needle.length) > length) {
      return false
    }
    cnt++
  }

  return cnt
}

function strtok (str, tokens) {
  //  discuss at: http://locutus.io/php/strtok/
  //      note 1: Use tab and newline as tokenizing characters as well
  //   example 1: var $string = "\t\t\t\nThis is\tan example\nstring\n"
  //   example 1: var $tok = strtok($string, " \n\t")
  //   example 1: var $b = ''
  //   example 1: while ($tok !== false) {$b += "Word="+$tok+"\n"; $tok = strtok(" \n\t");}
  //   example 1: var $result = $b
  //   returns 1: "Word=This\nWord=is\nWord=an\nWord=example\nWord=string\n"

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  if (tokens === undefined) {
    tokens = str
    str = $locutus.php.strtokleftOver
  }
  if (str.length === 0) {
    return false
  }
  if (tokens.indexOf(str.charAt(0)) !== -1) {
    return strtok(str.substr(1), tokens)
  }
  for (var i = 0; i < str.length; i++) {
    if (tokens.indexOf(str.charAt(i)) !== -1) {
      break
    }
  }
  $locutus.php.strtokleftOver = str.substr(i + 1)

  return str.substring(0, i)
}

function substr (str, start, len) {
  //  discuss at: http://locutus.io/php/substr/
  // bugfixed by: T.Wild
  //  revised by: Theriault (https://github.com/Theriault)
  //      note 1: Handles rare Unicode characters if 'unicode.semantics' ini (PHP6) is set to 'on'
  //   example 1: substr('abcdef', 0, -1)
  //   returns 1: 'abcde'
  //   example 2: substr(2, 0, -6)
  //   returns 2: false
  //   example 3: ini_set('unicode.semantics', 'on')
  //   example 3: substr('a\uD801\uDC00', 0, -1)
  //   returns 3: 'a'
  //   example 4: ini_set('unicode.semantics', 'on')
  //   example 4: substr('a\uD801\uDC00', 0, 2)
  //   returns 4: 'a\uD801\uDC00'
  //   example 5: ini_set('unicode.semantics', 'on')
  //   example 5: substr('a\uD801\uDC00', -1, 1)
  //   returns 5: '\uD801\uDC00'
  //   example 6: ini_set('unicode.semantics', 'on')
  //   example 6: substr('a\uD801\uDC00z\uD801\uDC00', -3, 2)
  //   returns 6: '\uD801\uDC00z'
  //   example 7: ini_set('unicode.semantics', 'on')
  //   example 7: substr('a\uD801\uDC00z\uD801\uDC00', -3, -1)
  //   returns 7: '\uD801\uDC00z'
  //        test: skip-3 skip-4 skip-5 skip-6 skip-7

  str += ''
  var end = str.length

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('unicode.emantics') : undefined) || 'off'

  if (iniVal === 'off') {
    // assumes there are no non-BMP characters;
    // if there may be such characters, then it is best to turn it on (critical in true XHTML/XML)
    if (start < 0) {
      start += end
    }
    if (typeof len !== 'undefined') {
      if (len < 0) {
        end = len + end
      } else {
        end = len + start
      }
    }

    // PHP returns false if start does not fall within the string.
    // PHP returns false if the calculated end comes before the calculated start.
    // PHP returns an empty string if start and end are the same.
    // Otherwise, PHP returns the portion of the string from start to end.
    if (start >= str.length || start < 0 || start > end) {
      return false
    }

    return str.slice(start, end)
  }

  // Full-blown Unicode including non-Basic-Multilingual-Plane characters
  var i = 0
  var allBMP = true
  var es = 0
  var el = 0
  var se = 0
  var ret = ''

  for (i = 0; i < str.length; i++) {
    if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
      allBMP = false
      break
    }
  }

  if (!allBMP) {
    if (start < 0) {
      for (i = end - 1, es = (start += end); i >= es; i--) {
        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
          start--
          es--
        }
      }
    } else {
      var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
      while ((surrogatePairs.exec(str)) !== null) {
        var li = surrogatePairs.lastIndex
        if (li - 2 < start) {
          start++
        } else {
          break
        }
      }
    }

    if (start >= end || start < 0) {
      return false
    }
    if (len < 0) {
      for (i = end - 1, el = (end += len); i >= el; i--) {
        if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
          end--
          el--
        }
      }
      if (start > end) {
        return false
      }
      return str.slice(start, end)
    } else {
      se = start + len
      for (i = start; i < se; i++) {
        ret += str.charAt(i)
        if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
          // Go one further, since one of the "characters" is part of a surrogate pair
          se++
        }
      }
      return ret
    }
  }
}

function trim (str, charlist) {
  //  discuss at: http://locutus.io/php/trim/
  //    input by: Erkekjetter
  //    input by: DxGx
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: trim('    Kevin van Zonneveld    ')
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: trim('Hello World', 'Hdle')
  //   returns 2: 'o Wor'
  //   example 3: trim(16, 1)
  //   returns 3: '6'

  var whitespace = [
    ' ',
    '\n',
    '\r',
    '\t',
    '\f',
    '\x0b',
    '\xa0',
    '\u2000',
    '\u2001',
    '\u2002',
    '\u2003',
    '\u2004',
    '\u2005',
    '\u2006',
    '\u2007',
    '\u2008',
    '\u2009',
    '\u200a',
    '\u200b',
    '\u2028',
    '\u2029',
    '\u3000'
  ].join('')
  var l = 0
  var i = 0
  str += ''

  if (charlist) {
    whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1')
  }

  l = str.length
  for (i = 0; i < l; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i)
      break
    }
  }

  l = str.length
  for (i = l - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1)
      break
    }
  }

  return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''
}

function ucfirst (str) {
  //  discuss at: http://locutus.io/php/ucfirst/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: ucfirst('kevin van zonneveld')
  //   returns 1: 'Kevin van zonneveld'

  str += ''
  var f = str.charAt(0)
    .toUpperCase()
  return f + str.substr(1)
}

function addcslashes (str, charlist) {
  //  discuss at: http://locutus.io/php/addcslashes/
  //      note 1: We show double backslashes in the return value example
  //      note 1: code below because a JavaScript string will not
  //      note 1: render them as backslashes otherwise
  //   example 1: addcslashes('foo[ ]', 'A..z'); // Escape all ASCII within capital A to lower z range, including square brackets
  //   returns 1: "\\f\\o\\o\\[ \\]"
  //   example 2: addcslashes("zoo['.']", 'z..A'); // Only escape z, period, and A here since not a lower-to-higher range
  //   returns 2: "\\zoo['\\.']"
  //   _example 3: addcslashes("@a\u0000\u0010\u00A9", "\0..\37!@\177..\377"); // Escape as octals those specified and less than 32 (0x20) or greater than 126 (0x7E), but not otherwise
  //   _returns 3: '\\@a\\000\\020\\302\\251'
  //   _example 4: addcslashes("\u0020\u007E", "\40..\175"); // Those between 32 (0x20 or 040) and 126 (0x7E or 0176) decimal value will be backslashed if specified (not octalized)
  //   _returns 4: '\\ ~'
  //   _example 5: addcslashes("\r\u0007\n", '\0..\37'); // Recognize C escape sequences if specified
  //   _returns 5: "\\r\\a\\n"
  //   _example 6: addcslashes("\r\u0007\n", '\0'); // Do not recognize C escape sequences if not specified
  //   _returns 6: "\r\u0007\n"

  var target = ''
  var chrs = []
  var i = 0
  var j = 0
  var c = ''
  var next = ''
  var rangeBegin = ''
  var rangeEnd = ''
  var chr = ''
  var begin = 0
  var end = 0
  var octalLength = 0
  var postOctalPos = 0
  var cca = 0
  var escHexGrp = []
  var encoded = ''
  var percentHex = /%([\dA-Fa-f]+)/g

  var _pad = function (n, c) {
    if ((n = n + '').length < c) {
      return new Array(++c - n.length).join('0') + n
    }
    return n
  }

  for (i = 0; i < charlist.length; i++) {
    c = charlist.charAt(i)
    next = charlist.charAt(i + 1)
    if (c === '\\' && next && (/\d/).test(next)) {
      // Octal
      rangeBegin = charlist.slice(i + 1).match(/^\d+/)[0]
      octalLength = rangeBegin.length
      postOctalPos = i + octalLength + 1
      if (charlist.charAt(postOctalPos) + charlist.charAt(postOctalPos + 1) === '..') {
        // Octal begins range
        begin = rangeBegin.charCodeAt(0)
        if ((/\\\d/).test(charlist.charAt(postOctalPos + 2) + charlist.charAt(postOctalPos + 3))) {
          // Range ends with octal
          rangeEnd = charlist.slice(postOctalPos + 3).match(/^\d+/)[0]
          // Skip range end backslash
          i += 1
        } else if (charlist.charAt(postOctalPos + 2)) {
          // Range ends with character
          rangeEnd = charlist.charAt(postOctalPos + 2)
        } else {
          throw new Error('Range with no end point')
        }
        end = rangeEnd.charCodeAt(0)
        if (end > begin) {
          // Treat as a range
          for (j = begin; j <= end; j++) {
            chrs.push(String.fromCharCode(j))
          }
        } else {
          // Supposed to treat period, begin and end as individual characters only, not a range
          chrs.push('.', rangeBegin, rangeEnd)
        }
        // Skip dots and range end (already skipped range end backslash if present)
        i += rangeEnd.length + 2
      } else {
        // Octal is by itself
        chr = String.fromCharCode(parseInt(rangeBegin, 8))
        chrs.push(chr)
      }
      // Skip range begin
      i += octalLength
    } else if (next + charlist.charAt(i + 2) === '..') {
      // Character begins range
      rangeBegin = c
      begin = rangeBegin.charCodeAt(0)
      if ((/\\\d/).test(charlist.charAt(i + 3) + charlist.charAt(i + 4))) {
        // Range ends with octal
        rangeEnd = charlist.slice(i + 4).match(/^\d+/)[0]
        // Skip range end backslash
        i += 1
      } else if (charlist.charAt(i + 3)) {
        // Range ends with character
        rangeEnd = charlist.charAt(i + 3)
      } else {
        throw new Error('Range with no end point')
      }
      end = rangeEnd.charCodeAt(0)
      if (end > begin) {
        // Treat as a range
        for (j = begin; j <= end; j++) {
          chrs.push(String.fromCharCode(j))
        }
      } else {
        // Supposed to treat period, begin and end as individual characters only, not a range
        chrs.push('.', rangeBegin, rangeEnd)
      }
      // Skip dots and range end (already skipped range end backslash if present)
      i += rangeEnd.length + 2
    } else {
      // Character is by itself
      chrs.push(c)
    }
  }

  for (i = 0; i < str.length; i++) {
    c = str.charAt(i)
    if (chrs.indexOf(c) !== -1) {
      target += '\\'
      cca = c.charCodeAt(0)
      if (cca < 32 || cca > 126) {
        // Needs special escaping
        switch (c) {
          case '\n':
            target += 'n'
            break
          case '\t':
            target += 't'
            break
          case '\u000D':
            target += 'r'
            break
          case '\u0007':
            target += 'a'
            break
          case '\v':
            target += 'v'
            break
          case '\b':
            target += 'b'
            break
          case '\f':
            target += 'f'
            break
          default:
            // target += _pad(cca.toString(8), 3);break; // Sufficient for UTF-16
            encoded = encodeURIComponent(c)

            // 3-length-padded UTF-8 octets
            if ((escHexGrp = percentHex.exec(encoded)) !== null) {
              // already added a slash above:
              target += _pad(parseInt(escHexGrp[1], 16).toString(8), 3)
            }
            while ((escHexGrp = percentHex.exec(encoded)) !== null) {
              target += '\\' + _pad(parseInt(escHexGrp[1], 16).toString(8), 3)
            }
            break
        }
      } else {
        // Perform regular backslashed escaping
        target += c
      }
    } else {
      // Just add the character unescaped
      target += c
    }
  }

  return target
}

function nl_langinfo (item) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/nl_langinfo/
  //   example 1: nl_langinfo('DAY_1')
  //   returns 1: 'Sunday'

  var setlocale = require('../strings/setlocale')

  setlocale('LC_ALL', 0) // Ensure locale data is available

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  var loc = $locutus.php.locales[$locutus.php.localeCategories.LC_TIME]
  if (item.indexOf('ABDAY_') === 0) {
    return loc.LC_TIME.a[parseInt(item.replace(/^ABDAY_/, ''), 10) - 1]
  } else if (item.indexOf('DAY_') === 0) {
    return loc.LC_TIME.A[parseInt(item.replace(/^DAY_/, ''), 10) - 1]
  } else if (item.indexOf('ABMON_') === 0) {
    return loc.LC_TIME.b[parseInt(item.replace(/^ABMON_/, ''), 10) - 1]
  } else if (item.indexOf('MON_') === 0) {
    return loc.LC_TIME.B[parseInt(item.replace(/^MON_/, ''), 10) - 1]
  } else {
    switch (item) {
      // More LC_TIME
      case 'AM_STR':
        return loc.LC_TIME.p[0]
      case 'PM_STR':
        return loc.LC_TIME.p[1]
      case 'D_T_FMT':
        return loc.LC_TIME.c
      case 'D_FMT':
        return loc.LC_TIME.x
      case 'T_FMT':
        return loc.LC_TIME.X
      case 'T_FMT_AMPM':
        return loc.LC_TIME.r
      case 'ERA':
      case 'ERA_YEAR':
      case 'ERA_D_T_FMT':
      case 'ERA_D_FMT':
      case 'ERA_T_FMT':
        // all fall-throughs
        return loc.LC_TIME[item]
    }
    loc = $locutus.php.locales[$locutus.php.localeCategories.LC_MONETARY]
    if (item === 'CRNCYSTR') {
      // alias
      item = 'CURRENCY_SYMBOL'
    }
    switch (item) {
      case 'INT_CURR_SYMBOL':
      case 'CURRENCY_SYMBOL':
      case 'MON_DECIMAL_POINT':
      case 'MON_THOUSANDS_SEP':
      case 'POSITIVE_SIGN':
      case 'NEGATIVE_SIGN':
      case 'INT_FRAC_DIGITS':
      case 'FRAC_DIGITS':
      case 'P_CS_PRECEDES':
      case 'P_SEP_BY_SPACE':
      case 'N_CS_PRECEDES':
      case 'N_SEP_BY_SPACE':
      case 'P_SIGN_POSN':
      case 'N_SIGN_POSN':
        // all fall-throughs
        return loc.LC_MONETARY[item.toLowerCase()]
      case 'MON_GROUPING':
        // Same as above, or return something different since this returns an array?
        return loc.LC_MONETARY[item.toLowerCase()]
    }
    loc = $locutus.php.locales[$locutus.php.localeCategories.LC_NUMERIC]
    switch (item) {
      case 'RADIXCHAR':
      case 'DECIMAL_POINT':
        // Fall-through
        return loc.LC_NUMERIC[item.toLowerCase()]
      case 'THOUSEP':
      case 'THOUSANDS_SEP':
        // Fall-through
        return loc.LC_NUMERIC[item.toLowerCase()]
      case 'GROUPING':
        // Same as above, or return something different since this returns an array?
        return loc.LC_NUMERIC[item.toLowerCase()]
    }
    loc = $locutus.php.locales[$locutus.php.localeCategories.LC_MESSAGES]
    switch (item) {
      case 'YESEXPR':
      case 'NOEXPR':
      case 'YESSTR':
      case 'NOSTR':
        // all fall-throughs
        return loc.LC_MESSAGES[item]
    }
    loc = $locutus.php.locales[$locutus.php.localeCategories.LC_CTYPE]
    if (item === 'CODESET') {
      return loc.LC_CTYPE[item]
    }

    return false
  }
}

function lcfirst (str) {
  //  discuss at: http://locutus.io/php/lcfirst/
  //   example 1: lcfirst('Kevin Van Zonneveld')
  //   returns 1: 'kevin Van Zonneveld'

  str += ''
  var f = str.charAt(0)
    .toLowerCase()
  return f + str.substr(1)
}

function split (delimiter, string) {
  //  discuss at: http://locutus.io/php/split/
  //   example 1: split(' ', 'Kevin van Zonneveld')
  //   returns 1: ['Kevin', 'van', 'Zonneveld']

  var explode = require('../strings/explode')
  return explode(delimiter, string)
}

function str_repeat (input, multiplier) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/str_repeat/
  //   example 1: str_repeat('-=', 10)
  //   returns 1: '-=-=-=-=-=-=-=-=-=-='

  var y = ''
  while (true) {
    if (multiplier & 1) {
      y += input
    }
    multiplier >>= 1
    if (multiplier) {
      input += input
    } else {
      break
    }
  }
  return y
}

function strchr (haystack, needle, bool) {
  //  discuss at: http://locutus.io/php/strchr/
  //   example 1: strchr('Kevin van Zonneveld', 'van')
  //   returns 1: 'van Zonneveld'
  //   example 2: strchr('Kevin van Zonneveld', 'van', true)
  //   returns 2: 'Kevin '

  var strstr = require('../strings/strstr')
  return strstr(haystack, needle, bool)
}

function chr (codePt) {
  //  discuss at: http://locutus.io/php/chr/
  //   example 1: chr(75) === 'K'
  //   example 1: chr(65536) === '\uD800\uDC00'
  //   returns 1: true
  //   returns 1: true

  if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
    //   enough for the UTF-16 encoding (JavaScript internal use), to
    //   require representation with two surrogates (reserved non-characters
    //   used for building other characters; the first is "high" and the next "low")
    codePt -= 0x10000
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF))
  }
  return String.fromCharCode(codePt)
}

function quotemeta (str) {
  //  discuss at: http://locutus.io/php/quotemeta/
  //   example 1: quotemeta(". + * ? ^ ( $ )")
  //   returns 1: '\\. \\+ \\* \\? \\^ \\( \\$ \\)'

  return (str + '')
    .replace(/([.\\+*?[^\]$()])/g, '\\$1')
}

function strcoll (str1, str2) {
  //  discuss at: http://locutus.io/php/strcoll/
  //   example 1: strcoll('a', 'b')
  //   returns 1: -1

  var setlocale = require('../strings/setlocale')

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  setlocale('LC_ALL', 0) // ensure setup of localization variables takes place

  var cmp = $locutus.php.locales[$locutus.php.localeCategories.LC_COLLATE].LC_COLLATE

  return cmp(str1, str2)
}

function strip_tags (input, allowed) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/strip_tags/
  //    input by: Pul
  //    input by: Alex
  //    input by: Marc Palau
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Bobby Drake
  //    input by: Evertjan Garretsen
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Eric Nagel
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Tomasz Wesolowski
  //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
  //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
  //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
  //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
  //   returns 2: '<p>Kevin van Zonneveld</p>'
  //   example 3: strip_tags("<a href='http://kvz.io'>Kevin van Zonneveld</a>", "<a>")
  //   returns 3: "<a href='http://kvz.io'>Kevin van Zonneveld</a>"
  //   example 4: strip_tags('1 < 5 5 > 1')
  //   returns 4: '1 < 5 5 > 1'
  //   example 5: strip_tags('1 <br/> 1')
  //   returns 5: '1  1'
  //   example 6: strip_tags('1 <br/> 1', '<br>')
  //   returns 6: '1 <br/> 1'
  //   example 7: strip_tags('1 <br/> 1', '<br><br/>')
  //   returns 7: '1 <br/> 1'

  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')

  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi

  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
  })
}

function stristr (haystack, needle, bool) {
  //  discuss at: http://locutus.io/php/stristr/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  //   example 1: stristr('Kevin van Zonneveld', 'Van')
  //   returns 1: 'van Zonneveld'
  //   example 2: stristr('Kevin van Zonneveld', 'VAN', true)
  //   returns 2: 'Kevin '

  var pos = 0

  haystack += ''
  pos = haystack.toLowerCase()
    .indexOf((needle + '')
      .toLowerCase())
  if (pos === -1) {
    return false
  } else {
    if (bool) {
      return haystack.substr(0, pos)
    } else {
      return haystack.slice(pos)
    }
  }
}

function substr_compare (mainStr, str, offset, length, caseInsensitivity) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/substr_compare/
  //   example 1: substr_compare("abcde", "bc", 1, 2)
  //   returns 1: 0

  if (!offset && offset !== 0) {
    throw new Error('Missing offset for substr_compare()')
  }

  if (offset < 0) {
    offset = mainStr.length + offset
  }

  if (length && length > (mainStr.length - offset)) {
    return false
  }
  length = length || mainStr.length - offset

  mainStr = mainStr.substr(offset, length)
  // Should only compare up to the desired length
  str = str.substr(0, length)
  if (caseInsensitivity) {
    // Works as strcasecmp
    mainStr = (mainStr + '').toLowerCase()
    str = (str + '').toLowerCase()
    if (mainStr === str) {
      return 0
    }
    return (mainStr > str) ? 1 : -1
  }
  // Works as strcmp
  return ((mainStr === str) ? 0 : ((mainStr > str) ? 1 : -1))
}

/**
 * URL
 */

function rawurldecode (str) {
  //       discuss at: http://locutus.io/php/rawurldecode/
  //      original by: Brett Zamir (http://brett-zamir.me)
  //         input by: travc
  //         input by: Brett Zamir (http://brett-zamir.me)
  //         input by: Ratheous
  //         input by: lovio
  //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //           note 1: Please be aware that this function expects to decode
  //           note 1: from UTF-8 encoded strings, as found on
  //           note 1: pages served as UTF-8
  //        example 1: rawurldecode('Kevin+van+Zonneveld%21')
  //        returns 1: 'Kevin+van+Zonneveld!'
  //        example 2: rawurldecode('http%3A%2F%2Fkvz.io%2F')
  //        returns 2: 'http://kvz.io/'
  //        example 3: rawurldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3D')
  //        returns 3: 'http://www.google.nl/search?q=Locutus&ie='

  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function () {
      // PHP tolerates poorly formed escape sequences
      return '%25'
    }))
}

function urldecode (str) {
  //       discuss at: http://locutus.io/php/urldecode/
  //      original by: Philip Peterson
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //      improved by: Lars Fischer
  //      improved by: Orlando
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //         input by: AJ
  //         input by: travc
  //         input by: Brett Zamir (http://brett-zamir.me)
  //         input by: Ratheous
  //         input by: e-mike
  //         input by: lovio
  //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Rob
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //           note 1: info on what encoding functions to use from:
  //           note 1: http://xkr.us/articles/javascript/encode-compare/
  //           note 1: Please be aware that this function expects to decode
  //           note 1: from UTF-8 encoded strings, as found on
  //           note 1: pages served as UTF-8
  //        example 1: urldecode('Kevin+van+Zonneveld%21')
  //        returns 1: 'Kevin van Zonneveld!'
  //        example 2: urldecode('http%3A%2F%2Fkvz.io%2F')
  //        returns 2: 'http://kvz.io/'
  //        example 3: urldecode('http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a')
  //        returns 3: 'http://www.google.nl/search?q=Locutus&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a'
  //        example 4: urldecode('%E5%A5%BD%3_4')
  //        returns 4: '\u597d%3_4'

  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function () {
      // PHP tolerates poorly formed escape sequences
      return '%25'
    })
    .replace(/\+/g, '%20'))
}

function base64_decode (encodedData) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/base64_decode/
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Pellentesque Malesuada
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==')
  //   returns 1: 'Kevin van Zonneveld'
  //   example 2: base64_decode('YQ==')
  //   returns 2: 'a'
  //   example 3: base64_decode('4pyTIMOgIGxhIG1vZGU=')
  //   returns 3: '✓ à la mode'

  // decodeUTF8string()
  // Internal function to decode properly UTF8 string
  // Adapted from Solution #1 at https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
  var decodeUTF8string = function (str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(str.split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }

  if (typeof window !== 'undefined') {
    if (typeof window.atob !== 'undefined') {
      return decodeUTF8string(window.atob(encodedData))
    }
  } else {
    return new Buffer(encodedData, 'base64').toString('utf-8')
  }

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var o1
  var o2
  var o3
  var h1
  var h2
  var h3
  var h4
  var bits
  var i = 0
  var ac = 0
  var dec = ''
  var tmpArr = []

  if (!encodedData) {
    return encodedData
  }

  encodedData += ''

  do {
    // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(encodedData.charAt(i++))
    h2 = b64.indexOf(encodedData.charAt(i++))
    h3 = b64.indexOf(encodedData.charAt(i++))
    h4 = b64.indexOf(encodedData.charAt(i++))

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4

    o1 = bits >> 16 & 0xff
    o2 = bits >> 8 & 0xff
    o3 = bits & 0xff

    if (h3 === 64) {
      tmpArr[ac++] = String.fromCharCode(o1)
    } else if (h4 === 64) {
      tmpArr[ac++] = String.fromCharCode(o1, o2)
    } else {
      tmpArr[ac++] = String.fromCharCode(o1, o2, o3)
    }
  } while (i < encodedData.length)

  dec = tmpArr.join('')

  return decodeUTF8string(dec.replace(/\0+$/, ''))
}

function urlencode (str) {
  //       discuss at: http://locutus.io/php/urlencode/
  //      original by: Philip Peterson
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      improved by: Kevin van Zonneveld (http://kvz.io)
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //      improved by: Lars Fischer
  //         input by: AJ
  //         input by: travc
  //         input by: Brett Zamir (http://brett-zamir.me)
  //         input by: Ratheous
  //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Joris
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //           note 1: This reflects PHP 5.3/6.0+ behavior
  //           note 1: Please be aware that this function
  //           note 1: expects to encode into UTF-8 encoded strings, as found on
  //           note 1: pages served as UTF-8
  //        example 1: urlencode('Kevin van Zonneveld!')
  //        returns 1: 'Kevin+van+Zonneveld%21'
  //        example 2: urlencode('http://kvz.io/')
  //        returns 2: 'http%3A%2F%2Fkvz.io%2F'
  //        example 3: urlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
  //        returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'

  str = (str + '')

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
  // but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+')
}

function http_build_query (formdata, numericPrefix, argSeparator) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/http_build_query/
  //  revised by: stag019
  //    input by: Dreamer
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
  //      note 1: If the value is null, key and value are skipped in the
  //      note 1: http_build_query of PHP while in locutus they are not.
  //   example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;')
  //   returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
  //   example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_')
  //   returns 2: 'myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&php=hypertext+processor&cow=milk'

  var urlencode = require('../url/urlencode')

  var value
  var key
  var tmp = []

  var _httpBuildQueryHelper = function (key, val, argSeparator) {
    var k
    var tmp = []
    if (val === true) {
      val = '1'
    } else if (val === false) {
      val = '0'
    }
    if (val !== null) {
      if (typeof val === 'object') {
        for (k in val) {
          if (val[k] !== null) {
            tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k], argSeparator))
          }
        }
        return tmp.join(argSeparator)
      } else if (typeof val !== 'function') {
        return urlencode(key) + '=' + urlencode(val)
      } else {
        throw new Error('There was an error processing for http_build_query().')
      }
    } else {
      return ''
    }
  }

  if (!argSeparator) {
    argSeparator = '&'
  }
  for (key in formdata) {
    value = formdata[key]
    if (numericPrefix && !isNaN(key)) {
      key = String(numericPrefix) + key
    }
    var query = _httpBuildQueryHelper(key, value, argSeparator)
    if (query !== '') {
      tmp.push(query)
    }
  }

  return tmp.join(argSeparator)
}

function base64_encode (stringToEncode) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/base64_encode/
  // bugfixed by: Pellentesque Malesuada
  //   example 1: base64_encode('Kevin van Zonneveld')
  //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  //   example 2: base64_encode('a')
  //   returns 2: 'YQ=='
  //   example 3: base64_encode('✓ à la mode')
  //   returns 3: '4pyTIMOgIGxhIG1vZGU='

  // encodeUTF8string()
  // Internal function to encode properly UTF8 string
  // Adapted from Solution #1 at https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
  var encodeUTF8string = function (str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into the base64 encoding algorithm.
    return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes (match, p1) {
        return String.fromCharCode('0x' + p1)
      })
  }

  if (typeof window !== 'undefined') {
    if (typeof window.btoa !== 'undefined') {
      return window.btoa(encodeUTF8string(stringToEncode))
    }
  } else {
    return new Buffer(stringToEncode).toString('base64')
  }

  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var o1
  var o2
  var o3
  var h1
  var h2
  var h3
  var h4
  var bits
  var i = 0
  var ac = 0
  var enc = ''
  var tmpArr = []

  if (!stringToEncode) {
    return stringToEncode
  }

  stringToEncode = encodeUTF8string(stringToEncode)

  do {
    // pack three octets into four hexets
    o1 = stringToEncode.charCodeAt(i++)
    o2 = stringToEncode.charCodeAt(i++)
    o3 = stringToEncode.charCodeAt(i++)

    bits = o1 << 16 | o2 << 8 | o3

    h1 = bits >> 18 & 0x3f
    h2 = bits >> 12 & 0x3f
    h3 = bits >> 6 & 0x3f
    h4 = bits & 0x3f

    // use hexets to index into b64, and append result to encoded string
    tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
  } while (i < stringToEncode.length)

  enc = tmpArr.join('')

  var r = stringToEncode.length % 3

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
}

function parse_url (str, component) { // eslint-disable-line camelcase
  //       discuss at: http://locutus.io/php/parse_url/
  //      original by: Steven Levithan (http://blog.stevenlevithan.com)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //         input by: Lorenzo Pisani
  //         input by: Tony
  //      improved by: Brett Zamir (http://brett-zamir.me)
  //           note 1: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
  //           note 1: blog post at http://blog.stevenlevithan.com/archives/parseuri
  //           note 1: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
  //           note 1: Does not replace invalid characters with '_' as in PHP,
  //           note 1: nor does it return false with
  //           note 1: a seriously malformed URL.
  //           note 1: Besides function name, is essentially the same as parseUri as
  //           note 1: well as our allowing
  //           note 1: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
  //        example 1: parse_url('http://user:pass@host/path?a=v#a')
  //        returns 1: {scheme: 'http', host: 'host', user: 'user', pass: 'pass', path: '/path', query: 'a=v', fragment: 'a'}
  //        example 2: parse_url('http://en.wikipedia.org/wiki/%22@%22_%28album%29')
  //        returns 2: {scheme: 'http', host: 'en.wikipedia.org', path: '/wiki/%22@%22_%28album%29'}
  //        example 3: parse_url('https://host.domain.tld/a@b.c/folder')
  //        returns 3: {scheme: 'https', host: 'host.domain.tld', path: '/a@b.c/folder'}
  //        example 4: parse_url('https://gooduser:secretpassword@www.example.com/a@b.c/folder?foo=bar')
  //        returns 4: { scheme: 'https', host: 'www.example.com', path: '/a@b.c/folder', query: 'foo=bar', user: 'gooduser', pass: 'secretpassword' }

  var query

  var mode = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.parse_url.mode') : undefined) || 'php'

  var key = [
    'source',
    'scheme',
    'authority',
    'userInfo',
    'user',
    'pass',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'fragment'
  ]

  // For loose we added one optional slash to post-scheme to catch file:/// (should restrict this)
  var parser = {
    php: new RegExp([
      '(?:([^:\\/?#]+):)?',
      '(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
      '()',
      '(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
    ].join('')),
    strict: new RegExp([
      '(?:([^:\\/?#]+):)?',
      '(?:\\/\\/((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
      '((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
    ].join('')),
    loose: new RegExp([
      '(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?',
      '(?:\\/\\/\\/?)?',
      '((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?)',
      '(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))',
      '(?:\\?([^#]*))?(?:#(.*))?)'
    ].join(''))
  }

  var m = parser[mode].exec(str)
  var uri = {}
  var i = 14

  while (i--) {
    if (m[i]) {
      uri[key[i]] = m[i]
    }
  }

  if (component) {
    return uri[component.replace('PHP_URL_', '').toLowerCase()]
  }

  if (mode !== 'php') {
    var name = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.parse_url.queryKey') : undefined) || 'queryKey'
    parser = /(?:^|&)([^&=]*)=?([^&]*)/g
    uri[name] = {}
    query = uri[key[12]] || ''
    query.replace(parser, function ($0, $1, $2) {
      if ($1) {
        uri[name][$1] = $2
      }
    })
  }

  delete uri.source
  return uri
}

function rawurlencode (str) {
  //       discuss at: http://locutus.io/php/rawurlencode/
  //      original by: Brett Zamir (http://brett-zamir.me)
  //         input by: travc
  //         input by: Brett Zamir (http://brett-zamir.me)
  //         input by: Michael Grier
  //         input by: Ratheous
  //      bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      bugfixed by: Joris
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  // reimplemented by: Brett Zamir (http://brett-zamir.me)
  //           note 1: This reflects PHP 5.3/6.0+ behavior
  //           note 1: Please be aware that this function expects \
  //           note 1: to encode into UTF-8 encoded strings, as found on
  //           note 1: pages served as UTF-8
  //        example 1: rawurlencode('Kevin van Zonneveld!')
  //        returns 1: 'Kevin%20van%20Zonneveld%21'
  //        example 2: rawurlencode('http://kvz.io/')
  //        returns 2: 'http%3A%2F%2Fkvz.io%2F'
  //        example 3: rawurlencode('http://www.google.nl/search?q=Locutus&ie=utf-8')
  //        returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3DLocutus%26ie%3Dutf-8'

  str = (str + '')

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below),
  // but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

/**
 * VAR
 */

function doubleval (mixedVar) {
  //  discuss at: http://locutus.io/php/doubleval/
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: doubleval(186)
  //   returns 1: 186.00

  var floatval = require('../var/floatval')

  return floatval(mixedVar)
}

function is_null (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_null/
  //   example 1: is_null('23')
  //   returns 1: false
  //   example 2: is_null(null)
  //   returns 2: true

  return (mixedVar === null)
}

function gettype (mixedVar) {
  //  discuss at: http://locutus.io/php/gettype/
  //    input by: KELAN
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: gettype(1)
  //   returns 1: 'integer'
  //   example 2: gettype(undefined)
  //   returns 2: 'undefined'
  //   example 3: gettype({0: 'Kevin van Zonneveld'})
  //   returns 3: 'object'
  //   example 4: gettype('foo')
  //   returns 4: 'string'
  //   example 5: gettype({0: function () {return false;}})
  //   returns 5: 'object'
  //   example 6: gettype({0: 'test', length: 1, splice: function () {}})
  //   returns 6: 'object'
  //   example 7: gettype(['test'])
  //   returns 7: 'array'

  var isFloat = require('../var/is_float')

  var s = typeof mixedVar
  var name
  var _getFuncName = function (fn) {
    var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }

  if (s === 'object') {
    if (mixedVar !== null) {
      // From: http://javascript.crockford.com/remedial.html
      // @todo: Break up this lengthy if statement
      if (typeof mixedVar.length === 'number' &&
        !(mixedVar.propertyIsEnumerable('length')) &&
        typeof mixedVar.splice === 'function') {
        s = 'array'
      } else if (mixedVar.constructor && _getFuncName(mixedVar.constructor)) {
        name = _getFuncName(mixedVar.constructor)
        if (name === 'Date') {
          // not in PHP
          s = 'date'
        } else if (name === 'RegExp') {
          // not in PHP
          s = 'regexp'
        } else if (name === 'LOCUTUS_Resource') {
          // Check against our own resource constructor
          s = 'resource'
        }
      }
    } else {
      s = 'null'
    }
  } else if (s === 'number') {
    s = isFloat(mixedVar) ? 'double' : 'integer'
  }

  return s
}

function is_string (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_string/
  //   example 1: is_string('23')
  //   returns 1: true
  //   example 2: is_string(23.5)
  //   returns 2: false

  return (typeof mixedVar === 'string')
}

function isset () {
  //  discuss at: http://locutus.io/php/isset/
  //   example 1: isset( undefined, true)
  //   returns 1: false
  //   example 2: isset( 'Kevin van Zonneveld' )
  //   returns 2: true

  var a = arguments
  var l = a.length
  var i = 0
  var undef

  if (l === 0) {
    throw new Error('Empty isset')
  }

  while (i !== l) {
    if (a[i] === undef || a[i] === null) {
      return false
    }
    i++
  }

  return true
}

function print_r (array, returnVal) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/print_r/
  //    input by: Brett Zamir (http://brett-zamir.me)
  //   example 1: print_r(1, true)
  //   returns 1: '1'

  var echo = require('../strings/echo')

  var output = ''
  var padChar = ' '
  var padVal = 4

  var _repeatChar = function (len, padChar) {
    var str = ''
    for (var i = 0; i < len; i++) {
      str += padChar
    }
    return str
  }
  var _formatArray = function (obj, curDepth, padVal, padChar) {
    if (curDepth > 0) {
      curDepth++
    }

    var basePad = _repeatChar(padVal * curDepth, padChar)
    var thickPad = _repeatChar(padVal * (curDepth + 1), padChar)
    var str = ''

    if (typeof obj === 'object' &&
      obj !== null &&
      obj.constructor) {
      str += 'Array\n' + basePad + '(\n'
      for (var key in obj) {
        if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
          str += thickPad
          str += '['
          str += key
          str += '] => '
          str += _formatArray(obj[key], curDepth + 1, padVal, padChar)
        } else {
          str += thickPad
          str += '['
          str += key
          str += '] => '
          str += obj[key]
          str += '\n'
        }
      }
      str += basePad + ')\n'
    } else if (obj === null || obj === undefined) {
      str = ''
    } else {
      // for our "resource" class
      str = obj.toString()
    }

    return str
  }

  output = _formatArray(array, 0, padVal, padChar)

  if (returnVal !== true) {
    echo(output)
    return true
  }
  return output
}

function strval (str) {
  //  discuss at: http://locutus.io/php/strval/
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: strval({red: 1, green: 2, blue: 3, white: 4})
  //   returns 1: 'Object'

  var gettype = require('../var/gettype')
  var type = ''

  if (str === null) {
    return ''
  }

  type = gettype(str)

  // Comment out the entire switch if you want JS-like
  // behavior instead of PHP behavior
  switch (type) {
    case 'boolean':
      if (str === true) {
        return '1'
      }
      return ''
    case 'array':
      return 'Array'
    case 'object':
      return 'Object'
  }

  return str
}

function var_export (mixedExpression, boolReturn) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/var_export/
  //    input by: Brian Tafoya (http://www.premasolutions.com/)
  //    input by: Hans Henrik (http://hanshenrik.tk/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: var_export(null)
  //   returns 1: null
  //   example 2: var_export({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, true)
  //   returns 2: "array (\n  0 => 'Kevin',\n  1 => 'van',\n  2 => 'Zonneveld'\n)"
  //   example 3: var data = 'Kevin'
  //   example 3: var_export(data, true)
  //   returns 3: "'Kevin'"

  var echo = require('../strings/echo')
  var retstr = ''
  var iret = ''
  var value
  var cnt = 0
  var x = []
  var i = 0
  var funcParts = []
  // We use the last argument (not part of PHP) to pass in
  // our indentation level
  var idtLevel = arguments[2] || 2
  var innerIndent = ''
  var outerIndent = ''
  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }

  var _makeIndent = function (idtLevel) {
    return (new Array(idtLevel + 1))
      .join(' ')
  }
  var __getType = function (inp) {
    var i = 0
    var match
    var types
    var cons
    var type = typeof inp
    if (type === 'object' && (inp && inp.constructor) &&
      getFuncName(inp.constructor) === 'LOCUTUS_Resource') {
      return 'resource'
    }
    if (type === 'function') {
      return 'function'
    }
    if (type === 'object' && !inp) {
      // Should this be just null?
      return 'null'
    }
    if (type === 'object') {
      if (!inp.constructor) {
        return 'object'
      }
      cons = inp.constructor.toString()
      match = cons.match(/(\w+)\(/)
      if (match) {
        cons = match[1].toLowerCase()
      }
      types = ['boolean', 'number', 'string', 'array']
      for (i = 0; i < types.length; i++) {
        if (cons === types[i]) {
          type = types[i]
          break
        }
      }
    }
    return type
  }
  var type = __getType(mixedExpression)

  if (type === null) {
    retstr = 'NULL'
  } else if (type === 'array' || type === 'object') {
    outerIndent = _makeIndent(idtLevel - 2)
    innerIndent = _makeIndent(idtLevel)
    for (i in mixedExpression) {
      value = var_export(mixedExpression[i], 1, idtLevel + 2)
      value = typeof value === 'string' ? value.replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') : value
      x[cnt++] = innerIndent + i + ' => ' +
        (__getType(mixedExpression[i]) === 'array' ? '\n' : '') + value
    }
    iret = x.join(',\n')
    retstr = outerIndent + 'array (\n' + iret + '\n' + outerIndent + ')'
  } else if (type === 'function') {
    funcParts = mixedExpression.toString().match(/function .*?\((.*?)\) \{([\s\S]*)\}/)

    // For lambda functions, var_export() outputs such as the following:
    // '\000lambda_1'. Since it will probably not be a common use to
    // expect this (unhelpful) form, we'll use another PHP-exportable
    // construct, create_function() (though dollar signs must be on the
    // variables in JavaScript); if using instead in JavaScript and you
    // are using the namespaced version, note that create_function() will
    // not be available as a global
    retstr = "create_function ('" + funcParts[1] + "', '" +
      funcParts[2].replace(new RegExp("'", 'g'), "\\'") + "')"
  } else if (type === 'resource') {
    // Resources treated as null for var_export
    retstr = 'NULL'
  } else {
    retstr = typeof mixedExpression !== 'string' ? mixedExpression
      : "'" + mixedExpression.replace(/(["'])/g, '\\$1').replace(/\0/g, '\\0') + "'"
  }

  if (!boolReturn) {
    echo(retstr)
    return null
  }

  return retstr
}

function is_buffer (vr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_buffer/
  //   example 1: is_buffer('This could be binary or a regular string...')
  //   returns 1: true

  return typeof vr === 'string'
}

function intval (mixedVar, base) {
  //  discuss at: http://locutus.io/php/intval/
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Rafał Kukawski (http://blog.kukawski.pl)
  //    input by: Matteo
  //   example 1: intval('Kevin van Zonneveld')
  //   returns 1: 0
  //   example 2: intval(4.2)
  //   returns 2: 4
  //   example 3: intval(42, 8)
  //   returns 3: 42
  //   example 4: intval('09')
  //   returns 4: 9
  //   example 5: intval('1e', 16)
  //   returns 5: 30

  var tmp

  var type = typeof mixedVar

  if (type === 'boolean') {
    return +mixedVar
  } else if (type === 'string') {
    tmp = parseInt(mixedVar, base || 10)
    return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp
  } else if (type === 'number' && isFinite(mixedVar)) {
    return mixedVar | 0
  } else {
    return 0
  }
}

function is_array (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_array/
  // bugfixed by: Cord
  // bugfixed by: Manish
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: In Locutus, javascript objects are like php associative arrays,
  //      note 1: thus JavaScript objects will also
  //      note 1: return true in this function (except for objects which inherit properties,
  //      note 1: being thus used as objects),
  //      note 1: unless you do ini_set('locutus.objectsAsArrays', 0),
  //      note 1: in which case only genuine JavaScript arrays
  //      note 1: will return true
  //   example 1: is_array(['Kevin', 'van', 'Zonneveld'])
  //   returns 1: true
  //   example 2: is_array('Kevin van Zonneveld')
  //   returns 2: false
  //   example 3: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 3: true
  //   example 4: ini_set('locutus.objectsAsArrays', 0)
  //   example 4: is_array({0: 'Kevin', 1: 'van', 2: 'Zonneveld'})
  //   returns 4: false
  //   example 5: is_array(function tmp_a (){ this.name = 'Kevin' })
  //   returns 5: false

  var _getFuncName = function (fn) {
    var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }
  var _isArray = function (mixedVar) {
    // return Object.prototype.toString.call(mixedVar) === '[object Array]';
    // The above works, but let's do the even more stringent approach:
    // (since Object.prototype.toString could be overridden)
    // Null, Not an object, no length property so couldn't be an Array (or String)
    if (!mixedVar || typeof mixedVar !== 'object' || typeof mixedVar.length !== 'number') {
      return false
    }
    var len = mixedVar.length
    mixedVar[mixedVar.length] = 'bogus'
    // The only way I can think of to get around this (or where there would be trouble)
    // would be to have an object defined
    // with a custom "length" getter which changed behavior on each call
    // (or a setter to mess up the following below) or a custom
    // setter for numeric properties, but even that would need to listen for
    // specific indexes; but there should be no false negatives
    // and such a false positive would need to rely on later JavaScript
    // innovations like __defineSetter__
    if (len !== mixedVar.length) {
      // We know it's an array since length auto-changed with the addition of a
      // numeric property at its length end, so safely get rid of our bogus element
      mixedVar.length -= 1
      return true
    }
    // Get rid of the property we added onto a non-array object; only possible
    // side-effect is if the user adds back the property later, it will iterate
    // this property in the older order placement in IE (an order which should not
    // be depended on anyways)
    delete mixedVar[mixedVar.length]
    return false
  }

  if (!mixedVar || typeof mixedVar !== 'object') {
    return false
  }

  var isArray = _isArray(mixedVar)

  if (isArray) {
    return true
  }

  var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('locutus.objectsAsArrays') : undefined) || 'on'
  if (iniVal === 'on') {
    var asString = Object.prototype.toString.call(mixedVar)
    var asFunc = _getFuncName(mixedVar.constructor)

    if (asString === '[object Object]' && asFunc === 'Object') {
      // Most likely a literal and intended as assoc. array
      return true
    }
  }

  return false
}

function is_callable (mixedVar, syntaxOnly, callableName) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_callable/
  //    input by: François
  //      note 1: The variable callableName cannot work as a string variable passed by
  //      note 1: reference as in PHP (since JavaScript does not support passing
  //      note 1: strings by reference), but instead will take the name of
  //      note 1: a global variable and set that instead.
  //      note 1: When used on an object, depends on a constructor property
  //      note 1: being kept on the object prototype
  //      note 2: Depending on the `callableName` that is passed, this function can use eval.
  //      note 2: The eval input is however checked to only allow valid function names,
  //      note 2: So it should not be unsafer than uses without eval (seeing as you can)
  //      note 2: already pass any function to be executed here.
  //   example 1: is_callable('is_callable')
  //   returns 1: true
  //   example 2: is_callable('bogusFunction', true)
  //   returns 2: true // gives true because does not do strict checking
  //   example 3: function SomeClass () {}
  //   example 3: SomeClass.prototype.someMethod = function (){}
  //   example 3: var testObj = new SomeClass()
  //   example 3: is_callable([testObj, 'someMethod'], true, 'myVar')
  //   example 3: var $result = myVar
  //   returns 3: 'SomeClass::someMethod'
  //   example 4: is_callable(function () {})
  //   returns 4: true

  var $global = (typeof window !== 'undefined' ? window : global)

  var validJSFunctionNamePattern = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/

  var name = ''
  var obj = {}
  var method = ''
  var validFunctionName = false

  var getFuncName = function (fn) {
    var name = (/\W*function\s+([\w$]+)\s*\(/).exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }

  if (typeof mixedVar === 'string') {
    obj = $global
    method = mixedVar
    name = mixedVar
    validFunctionName = !!name.match(validJSFunctionNamePattern)
  } else if (typeof mixedVar === 'function') {
    return true
  } else if (Object.prototype.toString.call(mixedVar) === '[object Array]' &&
    mixedVar.length === 2 &&
    typeof mixedVar[0] === 'object' &&
    typeof mixedVar[1] === 'string') {
    obj = mixedVar[0]
    method = mixedVar[1]
    name = (obj.constructor && getFuncName(obj.constructor)) + '::' + method
  } else {
    return false
  }

  if (syntaxOnly || typeof obj[method] === 'function') {
    if (callableName) {
      $global[callableName] = name
    }
    return true
  }

  // validFunctionName avoids exploits
  if (validFunctionName && typeof eval(method) === 'function') { // eslint-disable-line no-eval
    if (callableName) {
      $global[callableName] = name
    }
    return true
  }

  return false
}

function is_double (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_double/
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: is_double(186.31)
  //   returns 1: true

  var _isFloat = require('../var/is_float')
  return _isFloat(mixedVar)
}

function is_integer (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_integer/
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: is_integer(186.31)
  //   returns 1: false
  //   example 2: is_integer(12)
  //   returns 2: true

  var _isInt = require('../var/is_int')
  return _isInt(mixedVar)
}

function is_float (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_float/
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: is_float(186.31)
  //   returns 1: true

  return +mixedVar === mixedVar && (!isFinite(mixedVar) || !!(mixedVar % 1))
}

function boolval (mixedVar) {
  //   example 1: boolval(true)
  //   returns 1: true
  //   example 2: boolval(false)
  //   returns 2: false
  //   example 3: boolval(0)
  //   returns 3: false
  //   example 4: boolval(0.0)
  //   returns 4: false
  //   example 5: boolval('')
  //   returns 5: false
  //   example 6: boolval('0')
  //   returns 6: false
  //   example 7: boolval([])
  //   returns 7: false
  //   example 8: boolval('')
  //   returns 8: false
  //   example 9: boolval(null)
  //   returns 9: false
  //   example 10: boolval(undefined)
  //   returns 10: false
  //   example 11: boolval('true')
  //   returns 11: true

  if (mixedVar === false) {
    return false
  }

  if (mixedVar === 0 || mixedVar === 0.0) {
    return false
  }

  if (mixedVar === '' || mixedVar === '0') {
    return false
  }

  if (Array.isArray(mixedVar) && mixedVar.length === 0) {
    return false
  }

  if (mixedVar === null || mixedVar === undefined) {
    return false
  }

  return true
}

function empty (mixedVar) {
  //  discuss at: http://locutus.io/php/empty/
  //    input by: Onno Marsman (https://twitter.com/onnomarsman)
  //    input by: LH
  //    input by: Stoyan Kyosev (http://www.svest.org/)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Igor Moraes (https://www.linkedin.com/in/igorsgm/)
  //   example 1: empty(null)
  //   returns 1: true
  //   example 2: empty(undefined)
  //   returns 2: true
  //   example 3: empty([])
  //   returns 3: true
  //   example 4: empty({})
  //   returns 4: true
  //   example 5: empty({'aFunc' : function () { alert('humpty'); } })
  //   returns 5: false

	var key;
	if (mixedVar === "" || mixedVar === 0 || mixedVar === "0" || mixedVar === null || mixedVar === false || mixedVar === undefined || mixedVar.length === 0) {
		return true;
	}
	if (typeof mixedVar === 'object') {
		for (key in mixedVar) {
			return false;
		}
		return true;
	}
	return false;
}

function floatval (mixedVar) {
  //  discuss at: http://locutus.io/php/floatval/
  //      note 1: The native parseFloat() method of JavaScript returns NaN
  //      note 1: when it encounters a string before an int or float value.
  //   example 1: floatval('150.03_page-section')
  //   returns 1: 150.03
  //   example 2: floatval('page: 3')
  //   example 2: floatval('-50 + 8')
  //   returns 2: 0
  //   returns 2: -50

  return (parseFloat(mixedVar) || 0)
}

function is_binary (vr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_binary/
  //   example 1: is_binary('This could be binary as far as JavaScript knows...')
  //   returns 1: true

  return typeof vr === 'string' // If it is a string of any kind, it could be binary
}

function is_bool (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_bool/
  //   example 1: is_bool(false)
  //   returns 1: true
  //   example 2: is_bool(0)
  //   returns 2: false

  return (mixedVar === true || mixedVar === false) // Faster (in FF) than type checking
}

function is_int (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_int/
  //  revised by: Matt Bradley
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: is_int(23)
  //   returns 1: true
  //   example 2: is_int('23')
  //   returns 2: false
  //   example 3: is_int(23.5)
  //   returns 3: false
  //   example 4: is_int(true)
  //   returns 4: false

  return mixedVar === +mixedVar && isFinite(mixedVar) && !(mixedVar % 1)
}

function is_long (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_long/
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: is_long(186.31)
  //   returns 1: true

  var _isFloat = require('../var/is_float')
  return _isFloat(mixedVar)
}

function is_numeric (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_numeric/
  // bugfixed by: Tim de Koning
  // bugfixed by: WebDevHobo (http://webdevhobo.blogspot.com/)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Denis Chenu (http://shnoulle.net)
  //   example 1: is_numeric(186.31)
  //   returns 1: true
  //   example 2: is_numeric('Kevin van Zonneveld')
  //   returns 2: false
  //   example 3: is_numeric(' +186.31e2')
  //   returns 3: true
  //   example 4: is_numeric('')
  //   returns 4: false
  //   example 5: is_numeric([])
  //   returns 5: false
  //   example 6: is_numeric('1 ')
  //   returns 6: false

  var whitespace = [
    ' ',
    '\n',
    '\r',
    '\t',
    '\f',
    '\x0b',
    '\xa0',
    '\u2000',
    '\u2001',
    '\u2002',
    '\u2003',
    '\u2004',
    '\u2005',
    '\u2006',
    '\u2007',
    '\u2008',
    '\u2009',
    '\u200a',
    '\u200b',
    '\u2028',
    '\u2029',
    '\u3000'
  ].join('')

  // @todo: Break this up using many single conditions with early returns
  return (typeof mixedVar === 'number' ||
    (typeof mixedVar === 'string' &&
    whitespace.indexOf(mixedVar.slice(-1)) === -1)) &&
    mixedVar !== '' &&
    !isNaN(mixedVar)
}

function is_object (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_object/
  //   example 1: is_object('23')
  //   returns 1: false
  //   example 2: is_object({foo: 'bar'})
  //   returns 2: true
  //   example 3: is_object(null)
  //   returns 3: false

  if (Object.prototype.toString.call(mixedVar) === '[object Array]') {
    return false
  }
  return mixedVar !== null && typeof mixedVar === 'object'
}

function is_real (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_real/
  //      note 1: 1.0 is simplified to 1 before it can be accessed by the function, this makes
  //      note 1: it different from the PHP implementation. We can't fix this unfortunately.
  //   example 1: is_real(186.31)
  //   returns 1: true

  var _isFloat = require('../var/is_float')
  return _isFloat(mixedVar)
}

function is_scalar (mixedVar) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_scalar/
  //   example 1: is_scalar(186.31)
  //   returns 1: true
  //   example 2: is_scalar({0: 'Kevin van Zonneveld'})
  //   returns 2: false

  return (/boolean|number|string/).test(typeof mixedVar)
}

function is_unicode (vr) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/is_unicode/
  //      note 1: Almost all strings in JavaScript should be Unicode
  //   example 1: is_unicode('We the peoples of the United Nations...!')
  //   returns 1: true

  if (typeof vr !== 'string') {
    return false
  }

  // If surrogates occur outside of high-low pairs, then this is not Unicode
  var arr = []
  var highSurrogate = '[\uD800-\uDBFF]'
  var lowSurrogate = '[\uDC00-\uDFFF]'
  var highSurrogateBeforeAny = new RegExp(highSurrogate + '([\\s\\S])', 'g')
  var lowSurrogateAfterAny = new RegExp('([\\s\\S])' + lowSurrogate, 'g')
  var singleLowSurrogate = new RegExp('^' + lowSurrogate + '$')
  var singleHighSurrogate = new RegExp('^' + highSurrogate + '$')

  while ((arr = highSurrogateBeforeAny.exec(vr)) !== null) {
    if (!arr[1] || !arr[1].match(singleLowSurrogate)) {
      // If high not followed by low surrogate
      return false
    }
  }
  while ((arr = lowSurrogateAfterAny.exec(vr)) !== null) {
    if (!arr[1] || !arr[1].match(singleHighSurrogate)) {
      // If low not preceded by high surrogate
      return false
    }
  }

  return true
}

function serialize (mixedValue) {
  //  discuss at: http://locutus.io/php/serialize/
  // bugfixed by: Andrej Pavlovic
  // bugfixed by: Garagoth
  // bugfixed by: Russell Walker (http://www.nbill.co.uk/)
  // bugfixed by: Jamie Beck (http://www.terabit.ca/)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io/)
  // bugfixed by: Ben (http://benblume.co.uk/)
  // bugfixed by: Codestar (http://codestarlive.com/)
  //    input by: DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html)
  //    input by: Martin (http://www.erlenwiese.de/)
  //      note 1: We feel the main purpose of this function should be to ease
  //      note 1: the transport of data between php & js
  //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
  //   example 1: serialize(['Kevin', 'van', 'Zonneveld'])
  //   returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
  //   example 2: serialize({firstName: 'Kevin', midName: 'van'})
  //   returns 2: 'a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}'

  var val, key, okey
  var ktype = ''
  var vals = ''
  var count = 0

  var _utf8Size = function (str) {
    var size = 0
    var i = 0
    var l = str.length
    var code = ''
    for (i = 0; i < l; i++) {
      code = str.charCodeAt(i)
      if (code < 0x0080) {
        size += 1
      } else if (code < 0x0800) {
        size += 2
      } else {
        size += 3
      }
    }
    return size
  }

  var _getType = function (inp) {
    var match
    var key
    var cons
    var types
    var type = typeof inp

    if (type === 'object' && !inp) {
      return 'null'
    }

    if (type === 'object') {
      if (!inp.constructor) {
        return 'object'
      }
      cons = inp.constructor.toString()
      match = cons.match(/(\w+)\(/)
      if (match) {
        cons = match[1].toLowerCase()
      }
      types = ['boolean', 'number', 'string', 'array']
      for (key in types) {
        if (cons === types[key]) {
          type = types[key]
          break
        }
      }
    }
    return type
  }

  var type = _getType(mixedValue)

  switch (type) {
    case 'function':
      val = ''
      break
    case 'boolean':
      val = 'b:' + (mixedValue ? '1' : '0')
      break
    case 'number':
      val = (Math.round(mixedValue) === mixedValue ? 'i' : 'd') + ':' + mixedValue
      break
    case 'string':
      val = 's:' + _utf8Size(mixedValue) + ':"' + mixedValue + '"'
      break
    case 'array':
    case 'object':
      val = 'a'
      /*
      if (type === 'object') {
        var objname = mixedValue.constructor.toString().match(/(\w+)\(\)/);
        if (objname === undefined) {
          return;
        }
        objname[1] = serialize(objname[1]);
        val = 'O' + objname[1].substring(1, objname[1].length - 1);
      }
      */

      for (key in mixedValue) {
        if (mixedValue.hasOwnProperty(key)) {
          ktype = _getType(mixedValue[key])
          if (ktype === 'function') {
            continue
          }

          okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key)
          vals += serialize(okey) + serialize(mixedValue[key])
          count++
        }
      }
      val += ':' + count + ':{' + vals + '}'
      break
    case 'undefined':
    default:
      // Fall-through
      // if the JS object has a property which contains a null value,
      // the string cannot be unserialized by PHP
      val = 'N'
      break
  }
  if (type !== 'object' && type !== 'array') {
    val += ';'
  }

  return val
}

function unserialize (data) {
  //  discuss at: http://locutus.io/php/unserialize/
  // bugfixed by: dptr1988
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: philippsimon (https://github.com/philippsimon/)
  //  revised by: d3x
  //    input by: Brett Zamir (http://brett-zamir.me)
  //    input by: Martin (http://www.erlenwiese.de/)
  //    input by: kilops
  //    input by: Jaroslaw Czarniak
  //    input by: lovasoa (https://github.com/lovasoa/)
  //      note 1: We feel the main purpose of this function should be
  //      note 1: to ease the transport of data between php & js
  //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
  //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
  //   returns 1: ['Kevin', 'van', 'Zonneveld']
  //   example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
  //   returns 2: {firstName: 'Kevin', midName: 'van'}
  //   example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
  //   returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}

  var $global = (typeof window !== 'undefined' ? window : global)

  var utf8Overhead = function (str) {
    var s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
      var code = str.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) {
        s++
      } else if (code > 0x7ff && code <= 0xffff) {
        s += 2
      }
      // trail surrogate
      if (code >= 0xDC00 && code <= 0xDFFF) {
        i--
      }
    }
    return s - 1
  }
  var error = function (type,
    msg, filename, line) {
    throw new $global[type](msg, filename, line)
  }
  var readUntil = function (data, offset, stopchr) {
    var i = 2
    var buf = []
    var chr = data.slice(offset, offset + 1)

    while (chr !== stopchr) {
      if ((i + offset) > data.length) {
        error('Error', 'Invalid')
      }
      buf.push(chr)
      chr = data.slice(offset + (i - 1), offset + i)
      i += 1
    }
    return [buf.length, buf.join('')]
  }
  var readChrs = function (data, offset, length) {
    var i, chr, buf

    buf = []
    for (i = 0; i < length; i++) {
      chr = data.slice(offset + (i - 1), offset + i)
      buf.push(chr)
      length -= utf8Overhead(chr)
    }
    return [buf.length, buf.join('')]
  }
  function _unserialize (data, offset) {
    var dtype
    var dataoffset
    var keyandchrs
    var keys
    var contig
    var length
    var array
    var readdata
    var readData
    var ccount
    var stringlength
    var i
    var key
    var kprops
    var kchrs
    var vprops
    var vchrs
    var value
    var chrs = 0
    var typeconvert = function (x) {
      return x
    }

    if (!offset) {
      offset = 0
    }
    dtype = (data.slice(offset, offset + 1)).toLowerCase()

    dataoffset = offset + 2

    switch (dtype) {
      case 'i':
        typeconvert = function (x) {
          return parseInt(x, 10)
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'b':
        typeconvert = function (x) {
          return parseInt(x, 10) !== 0
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'd':
        typeconvert = function (x) {
          return parseFloat(x)
        }
        readData = readUntil(data, dataoffset, ';')
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 1
        break
      case 'n':
        readdata = null
        break
      case 's':
        ccount = readUntil(data, dataoffset, ':')
        chrs = ccount[0]
        stringlength = ccount[1]
        dataoffset += chrs + 2

        readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10))
        chrs = readData[0]
        readdata = readData[1]
        dataoffset += chrs + 2
        if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
          error('SyntaxError', 'String length mismatch')
        }
        break
      case 'a':
        readdata = {}

        keyandchrs = readUntil(data, dataoffset, ':')
        chrs = keyandchrs[0]
        keys = keyandchrs[1]
        dataoffset += chrs + 2

        length = parseInt(keys, 10)
        contig = true

        for (i = 0; i < length; i++) {
          kprops = _unserialize(data, dataoffset)
          kchrs = kprops[1]
          key = kprops[2]
          dataoffset += kchrs

          vprops = _unserialize(data, dataoffset)
          vchrs = vprops[1]
          value = vprops[2]
          dataoffset += vchrs

          if (key !== i) {
            contig = false
          }

          readdata[key] = value
        }

        if (contig) {
          array = new Array(length)
          for (i = 0; i < length; i++) {
            array[i] = readdata[i]
          }
          readdata = array
        }

        dataoffset += 1
        break
      default:
        error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype)
        break
    }
    return [dtype, dataoffset - offset, typeconvert(readdata)]
  }

  return _unserialize((data + ''), 0)[2]
}

function var_dump () { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/var_dump/
  //      note 1: For returning a string, use var_export() with the second argument set to true
  //        test: skip-all
  //   example 1: var_dump(1)
  //   returns 1: 'int(1)'

  var echo = require('../strings/echo')
  var output = ''
  var padChar = ' '
  var padVal = 4
  var lgth = 0
  var i = 0

  var _getFuncName = function (fn) {
    var name = (/\W*function\s+([\w$]+)\s*\(/)
      .exec(fn)
    if (!name) {
      return '(Anonymous)'
    }
    return name[1]
  }

  var _repeatChar = function (len, padChar) {
    var str = ''
    for (var i = 0; i < len; i++) {
      str += padChar
    }
    return str
  }
  var _getInnerVal = function (val, thickPad) {
    var ret = ''
    if (val === null) {
      ret = 'NULL'
    } else if (typeof val === 'boolean') {
      ret = 'bool(' + val + ')'
    } else if (typeof val === 'string') {
      ret = 'string(' + val.length + ') "' + val + '"'
    } else if (typeof val === 'number') {
      if (parseFloat(val) === parseInt(val, 10)) {
        ret = 'int(' + val + ')'
      } else {
        ret = 'float(' + val + ')'
      }
    } else if (typeof val === 'undefined') {
      // The remaining are not PHP behavior because these values
      // only exist in this exact form in JavaScript
      ret = 'undefined'
    } else if (typeof val === 'function') {
      var funcLines = val.toString()
        .split('\n')
      ret = ''
      for (var i = 0, fll = funcLines.length; i < fll; i++) {
        ret += (i !== 0 ? '\n' + thickPad : '') + funcLines[i]
      }
    } else if (val instanceof Date) {
      ret = 'Date(' + val + ')'
    } else if (val instanceof RegExp) {
      ret = 'RegExp(' + val + ')'
    } else if (val.nodeName) {
      // Different than PHP's DOMElement
      switch (val.nodeType) {
        case 1:
          if (typeof val.namespaceURI === 'undefined' ||
            val.namespaceURI === 'http://www.w3.org/1999/xhtml') {
          // Undefined namespace could be plain XML, but namespaceURI not widely supported
            ret = 'HTMLElement("' + val.nodeName + '")'
          } else {
            ret = 'XML Element("' + val.nodeName + '")'
          }
          break
        case 2:
          ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')'
          break
        case 3:
          ret = 'TEXT_NODE(' + val.nodeValue + ')'
          break
        case 4:
          ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')'
          break
        case 5:
          ret = 'ENTITY_REFERENCE_NODE'
          break
        case 6:
          ret = 'ENTITY_NODE'
          break
        case 7:
          ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')'
          break
        case 8:
          ret = 'COMMENT_NODE(' + val.nodeValue + ')'
          break
        case 9:
          ret = 'DOCUMENT_NODE'
          break
        case 10:
          ret = 'DOCUMENT_TYPE_NODE'
          break
        case 11:
          ret = 'DOCUMENT_FRAGMENT_NODE'
          break
        case 12:
          ret = 'NOTATION_NODE'
          break
      }
    }
    return ret
  }

  var _formatArray = function (obj, curDepth, padVal, padChar) {
    if (curDepth > 0) {
      curDepth++
    }

    var basePad = _repeatChar(padVal * (curDepth - 1), padChar)
    var thickPad = _repeatChar(padVal * (curDepth + 1), padChar)
    var str = ''
    var val = ''

    if (typeof obj === 'object' && obj !== null) {
      if (obj.constructor && _getFuncName(obj.constructor) === 'LOCUTUS_Resource') {
        return obj.var_dump()
      }
      lgth = 0
      for (var someProp in obj) {
        if (obj.hasOwnProperty(someProp)) {
          lgth++
        }
      }
      str += 'array(' + lgth + ') {\n'
      for (var key in obj) {
        var objVal = obj[key]
        if (typeof objVal === 'object' &&
          objVal !== null &&
          !(objVal instanceof Date) &&
          !(objVal instanceof RegExp) &&
          !objVal.nodeName) {
          str += thickPad
          str += '['
          str += key
          str += '] =>\n'
          str += thickPad
          str += _formatArray(objVal, curDepth + 1, padVal, padChar)
        } else {
          val = _getInnerVal(objVal, thickPad)
          str += thickPad
          str += '['
          str += key
          str += '] =>\n'
          str += thickPad
          str += val
          str += '\n'
        }
      }
      str += basePad + '}\n'
    } else {
      str = _getInnerVal(obj, thickPad)
    }
    return str
  }

  output = _formatArray(arguments[0], 0, padVal, padChar)
  for (i = 1; i < arguments.length; i++) {
    output += '\n' + _formatArray(arguments[i], 0, padVal, padChar)
  }

  echo(output)

  // Not how PHP does it, but helps us test:
  return output
}

/**
 * XDIFF
 */

function xdiff_string_diff (oldData, newData, contextLines, minimal) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/xdiff_string_diff
  //    based on: Imgen Tata (http://www.myipdf.com/)
  // bugfixed by: Imgen Tata (http://www.myipdf.com/)
  //      note 1: The minimal argument is not currently supported
  //   example 1: xdiff_string_diff('', 'Hello world!')
  //   returns 1: '@@ -0,0 +1,1 @@\n+Hello world!'

  // (This code was done by Imgen Tata; I have only reformatted for use in Locutus)

  // See http://en.wikipedia.org/wiki/Diff#Unified_format
  var i = 0
  var j = 0
  var k = 0
  var oriHunkStart
  var newHunkStart
  var oriHunkEnd
  var newHunkEnd
  var oriHunkLineNo
  var newHunkLineNo
  var oriHunkSize
  var newHunkSize
  var MAX_CONTEXT_LINES = Number.POSITIVE_INFINITY // Potential configuration
  var MIN_CONTEXT_LINES = 0
  var DEFAULT_CONTEXT_LINES = 3
  var HEADER_PREFIX = '@@ ' //
  var HEADER_SUFFIX = ' @@'
  var ORIGINAL_INDICATOR = '-'
  var NEW_INDICATOR = '+'
  var RANGE_SEPARATOR = ','
  var CONTEXT_INDICATOR = ' '
  var DELETION_INDICATOR = '-'
  var ADDITION_INDICATOR = '+'
  var oriLines
  var newLines
  var NEW_LINE = '\n'

  var _trim = function (text) {
    if (typeof text !== 'string') {
      throw new Error('String parameter required')
    }

    return text.replace(/(^\s*)|(\s*$)/g, '')
  }

  var _verifyType = function (type) {
    var args = arguments
    var argsLen = arguments.length
    var basicTypes = ['number', 'boolean', 'string', 'function', 'object', 'undefined']
    var basicType
    var i
    var j
    var typeOfType = typeof type
    if (typeOfType !== 'string' && typeOfType !== 'function') {
      throw new Error('Bad type parameter')
    }

    if (argsLen < 2) {
      throw new Error('Too few arguments')
    }

    if (typeOfType === 'string') {
      type = _trim(type)

      if (type === '') {
        throw new Error('Bad type parameter')
      }

      for (j = 0; j < basicTypes.length; j++) {
        basicType = basicTypes[j]

        if (basicType === type) {
          for (i = 1; i < argsLen; i++) {
            if (typeof args[i] !== type) {
              throw new Error('Bad type')
            }
          }

          return
        }
      }

      throw new Error('Bad type parameter')
    }

    // Not basic type. we need to use instanceof operator
    for (i = 1; i < argsLen; i++) {
      if (!(args[i] instanceof type)) {
        throw new Error('Bad type')
      }
    }
  }

  var _hasValue = function (array, value) {
    var i
    _verifyType(Array, array)

    for (i = 0; i < array.length; i++) {
      if (array[i] === value) {
        return true
      }
    }

    return false
  }

  var _areTypeOf = function (type) {
    var args = arguments
    var argsLen = arguments.length
    var basicTypes = ['number', 'boolean', 'string', 'function', 'object', 'undefined']
    var basicType
    var i
    var j
    var typeOfType = typeof type

    if (typeOfType !== 'string' && typeOfType !== 'function') {
      throw new Error('Bad type parameter')
    }

    if (argsLen < 2) {
      throw new Error('Too few arguments')
    }

    if (typeOfType === 'string') {
      type = _trim(type)

      if (type === '') {
        return false
      }

      for (j = 0; j < basicTypes.length; j++) {
        basicType = basicTypes[j]

        if (basicType === type) {
          for (i = 1; i < argsLen; i++) {
            if (typeof args[i] !== type) {
              return false
            }
          }

          return true
        }
      }

      throw new Error('Bad type parameter')
    }

    // Not basic type. we need to use instanceof operator
    for (i = 1; i < argsLen; i++) {
      if (!(args[i] instanceof type)) {
        return false
      }
    }

    return true
  }

  var _getInitializedArray = function (arraySize, initValue) {
    var array = []
    var i
    _verifyType('number', arraySize)

    for (i = 0; i < arraySize; i++) {
      array.push(initValue)
    }

    return array
  }

  var _splitIntoLines = function (text) {
    _verifyType('string', text)

    if (text === '') {
      return []
    }
    return text.split('\n')
  }

  var _isEmptyArray = function (obj) {
    return _areTypeOf(Array, obj) && obj.length === 0
  }

  /**
   * Finds longest common sequence between two sequences
   * @see {@link http://wordaligned.org/articles/longest-common-subsequence}
   */
  var _findLongestCommonSequence = function (seq1, seq2, seq1IsInLcs, seq2IsInLcs) {
    if (!_areTypeOf(Array, seq1, seq2)) {
      throw new Error('Array parameters are required')
    }

    // Deal with edge case
    if (_isEmptyArray(seq1) || _isEmptyArray(seq2)) {
      return []
    }

    // Function to calculate lcs lengths
    var lcsLens = function (xs, ys) {
      var i
      var j
      var prev
      var curr = _getInitializedArray(ys.length + 1, 0)

      for (i = 0; i < xs.length; i++) {
        prev = curr.slice(0)
        for (j = 0; j < ys.length; j++) {
          if (xs[i] === ys[j]) {
            curr[j + 1] = prev[j] + 1
          } else {
            curr[j + 1] = Math.max(curr[j], prev[j + 1])
          }
        }
      }

      return curr
    }

    // Function to find lcs and fill in the array to indicate the optimal longest common sequence
    var _findLcs = function (xs, xidx, xIsIn, ys) {
      var i
      var xb
      var xe
      var llB
      var llE
      var pivot
      var max
      var yb
      var ye
      var nx = xs.length
      var ny = ys.length

      if (nx === 0) {
        return []
      }
      if (nx === 1) {
        if (_hasValue(ys, xs[0])) {
          xIsIn[xidx] = true
          return [xs[0]]
        }
        return []
      }
      i = Math.floor(nx / 2)
      xb = xs.slice(0, i)
      xe = xs.slice(i)
      llB = lcsLens(xb, ys)
      llE = lcsLens(xe.slice(0)
        .reverse(), ys.slice(0)
        .reverse())

      pivot = 0
      max = 0
      for (j = 0; j <= ny; j++) {
        if (llB[j] + llE[ny - j] > max) {
          pivot = j
          max = llB[j] + llE[ny - j]
        }
      }
      yb = ys.slice(0, pivot)
      ye = ys.slice(pivot)
      return _findLcs(xb, xidx, xIsIn, yb).concat(_findLcs(xe, xidx + i, xIsIn, ye))
    }

    // Fill in seq1IsInLcs to find the optimal longest common subsequence of first sequence
    _findLcs(seq1, 0, seq1IsInLcs, seq2)
    // Fill in seq2IsInLcs to find the optimal longest common subsequence
    // of second sequence and return the result
    return _findLcs(seq2, 0, seq2IsInLcs, seq1)
  }

  // First, check the parameters
  if (_areTypeOf('string', oldData, newData) === false) {
    return false
  }

  if (oldData === newData) {
    return ''
  }

  if (typeof contextLines !== 'number' ||
    contextLines > MAX_CONTEXT_LINES ||
    contextLines < MIN_CONTEXT_LINES) {
    contextLines = DEFAULT_CONTEXT_LINES
  }

  oriLines = _splitIntoLines(oldData)
  newLines = _splitIntoLines(newData)
  var oriLen = oriLines.length
  var newLen = newLines.length
  var oriIsInLcs = _getInitializedArray(oriLen, false)
  var newIsInLcs = _getInitializedArray(newLen, false)
  var lcsLen = _findLongestCommonSequence(oriLines, newLines, oriIsInLcs, newIsInLcs).length
  var unidiff = ''

  if (lcsLen === 0) {
    // No common sequence
    unidiff = [
      HEADER_PREFIX,
      ORIGINAL_INDICATOR,
      (oriLen > 0 ? '1' : '0'),
      RANGE_SEPARATOR,
      oriLen,
      ' ',
      NEW_INDICATOR,
      (newLen > 0 ? '1' : '0'),
      RANGE_SEPARATOR,
      newLen,
      HEADER_SUFFIX
    ].join('')

    for (i = 0; i < oriLen; i++) {
      unidiff += NEW_LINE + DELETION_INDICATOR + oriLines[i]
    }

    for (j = 0; j < newLen; j++) {
      unidiff += NEW_LINE + ADDITION_INDICATOR + newLines[j]
    }

    return unidiff
  }

  var leadingContext = []
  var trailingContext = []
  var actualLeadingContext = []
  var actualTrailingContext = []

  // Regularize leading context by the contextLines parameter
  var regularizeLeadingContext = function (context) {
    if (context.length === 0 || contextLines === 0) {
      return []
    }

    var contextStartPos = Math.max(context.length - contextLines, 0)

    return context.slice(contextStartPos)
  }

  // Regularize trailing context by the contextLines parameter
  var regularizeTrailingContext = function (context) {
    if (context.length === 0 || contextLines === 0) {
      return []
    }

    return context.slice(0, Math.min(contextLines, context.length))
  }

  // Skip common lines in the beginning
  while (i < oriLen && oriIsInLcs[i] === true && newIsInLcs[i] === true) {
    leadingContext.push(oriLines[i])
    i++
  }

  j = i
  // The index in the longest common sequence
  k = i
  oriHunkStart = i
  newHunkStart = j
  oriHunkEnd = i
  newHunkEnd = j

  while (i < oriLen || j < newLen) {
    while (i < oriLen && oriIsInLcs[i] === false) {
      i++
    }
    oriHunkEnd = i

    while (j < newLen && newIsInLcs[j] === false) {
      j++
    }
    newHunkEnd = j

    // Find the trailing context
    trailingContext = []
    while (i < oriLen && oriIsInLcs[i] === true && j < newLen && newIsInLcs[j] === true) {
      trailingContext.push(oriLines[i])
      k++
      i++
      j++
    }

    if (k >= lcsLen || // No more in longest common lines
      trailingContext.length >= 2 * contextLines) {
      // Context break found
      if (trailingContext.length < 2 * contextLines) {
        // It must be last block of common lines but not a context break
        trailingContext = []

        // Force break out
        i = oriLen
        j = newLen

        // Update hunk ends to force output to the end
        oriHunkEnd = oriLen
        newHunkEnd = newLen
      }

      // Output the diff hunk

      // Trim the leading and trailing context block
      actualLeadingContext = regularizeLeadingContext(leadingContext)
      actualTrailingContext = regularizeTrailingContext(trailingContext)

      oriHunkStart -= actualLeadingContext.length
      newHunkStart -= actualLeadingContext.length
      oriHunkEnd += actualTrailingContext.length
      newHunkEnd += actualTrailingContext.length

      oriHunkLineNo = oriHunkStart + 1
      newHunkLineNo = newHunkStart + 1
      oriHunkSize = oriHunkEnd - oriHunkStart
      newHunkSize = newHunkEnd - newHunkStart

      // Build header
      unidiff += [
        HEADER_PREFIX,
        ORIGINAL_INDICATOR,
        oriHunkLineNo,
        RANGE_SEPARATOR,
        oriHunkSize,
        ' ',
        NEW_INDICATOR,
        newHunkLineNo,
        RANGE_SEPARATOR,
        newHunkSize,
        HEADER_SUFFIX,
        NEW_LINE
      ].join('')

      // Build the diff hunk content
      while (oriHunkStart < oriHunkEnd || newHunkStart < newHunkEnd) {
        if (oriHunkStart < oriHunkEnd &&
          oriIsInLcs[oriHunkStart] === true &&
          newIsInLcs[newHunkStart] === true) {
          // The context line
          unidiff += CONTEXT_INDICATOR + oriLines[oriHunkStart] + NEW_LINE
          oriHunkStart++
          newHunkStart++
        } else if (oriHunkStart < oriHunkEnd && oriIsInLcs[oriHunkStart] === false) {
          // The deletion line
          unidiff += DELETION_INDICATOR + oriLines[oriHunkStart] + NEW_LINE
          oriHunkStart++
        } else if (newHunkStart < newHunkEnd && newIsInLcs[newHunkStart] === false) {
          // The additional line
          unidiff += ADDITION_INDICATOR + newLines[newHunkStart] + NEW_LINE
          newHunkStart++
        }
      }

      // Update hunk position and leading context
      oriHunkStart = i
      newHunkStart = j
      leadingContext = trailingContext
    }
  }

  // Trim the trailing new line if it exists
  if (unidiff.length > 0 && unidiff.charAt(unidiff.length) === NEW_LINE) {
    unidiff = unidiff.slice(0, -1)
  }

  return unidiff
}

function xdiff_string_patch (originalStr, patch, flags, errorObj) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/xdiff_string_patch/
  //      note 1: The XDIFF_PATCH_IGNORESPACE flag and the error argument are not
  //      note 1: currently supported.
  //      note 2: This has not been tested exhaustively yet.
  //      note 3: The errorObj parameter (optional) if used must be passed in as a
  //      note 3: object. The errors will then be written by reference into it's `value` property
  //   example 1: xdiff_string_patch('', '@@ -0,0 +1,1 @@\n+Hello world!')
  //   returns 1: 'Hello world!'

  // First two functions were adapted from Steven Levithan, also under an MIT license
  // Adapted from XRegExp 1.5.0
  // (c) 2007-2010 Steven Levithan
  // MIT License
  // <http://xregexp.com>

  var _getNativeFlags = function (regex) {
    // Proposed for ES4; included in AS3
    return [
      (regex.global ? 'g' : ''),
      (regex.ignoreCase ? 'i' : ''),
      (regex.multiline ? 'm' : ''),
      (regex.extended ? 'x' : ''),
      (regex.sticky ? 'y' : '')
    ].join('')
  }

  var _cbSplit = function (string, sep) {
    // If separator `s` is not a regex, use the native `split`
    if (!(sep instanceof RegExp)) {
      // Had problems to get it to work here using prototype test
      return String.prototype.split.apply(string, arguments)
    }
    var str = String(string)
    var output = []
    var lastLastIndex = 0
    var match
    var lastLength
    var limit = Infinity
    var x = sep._xregexp
    // This is required if not `s.global`, and it avoids needing to set `s.lastIndex` to zero
    // and restore it to its original value when we're done using the regex
    // Brett paring down
    var s = new RegExp(sep.source, _getNativeFlags(sep) + 'g')
    if (x) {
      s._xregexp = {
        source: x.source,
        captureNames: x.captureNames ? x.captureNames.slice(0) : null
      }
    }

    while ((match = s.exec(str))) {
      // Run the altered `exec` (required for `lastIndex` fix, etc.)
      if (s.lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index))

        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1))
        }

        lastLength = match[0].length
        lastLastIndex = s.lastIndex

        if (output.length >= limit) {
          break
        }
      }

      if (s.lastIndex === match.index) {
        s.lastIndex++
      }
    }

    if (lastLastIndex === str.length) {
      if (!s.test('') || lastLength) {
        output.push('')
      }
    } else {
      output.push(str.slice(lastLastIndex))
    }

    return output.length > limit ? output.slice(0, limit) : output
  }

  var i = 0
  var ll = 0
  var ranges = []
  var lastLinePos = 0
  var firstChar = ''
  var rangeExp = /^@@\s+-(\d+),(\d+)\s+\+(\d+),(\d+)\s+@@$/
  var lineBreaks = /\r?\n/
  var lines = _cbSplit(patch.replace(/(\r?\n)+$/, ''), lineBreaks)
  var origLines = _cbSplit(originalStr, lineBreaks)
  var newStrArr = []
  var linePos = 0
  var errors = ''
  var optTemp = 0 // Both string & integer (constant) input is allowed
  var OPTS = {
    // Unsure of actual PHP values, so better to rely on string
    'XDIFF_PATCH_NORMAL': 1,
    'XDIFF_PATCH_REVERSE': 2,
    'XDIFF_PATCH_IGNORESPACE': 4
  }

  // Input defaulting & sanitation
  if (typeof originalStr !== 'string' || !patch) {
    return false
  }
  if (!flags) {
    flags = 'XDIFF_PATCH_NORMAL'
  }

  if (typeof flags !== 'number') {
    // Allow for a single string or an array of string flags
    flags = [].concat(flags)
    for (i = 0; i < flags.length; i++) {
      // Resolve string input to bitwise e.g. 'XDIFF_PATCH_NORMAL' becomes 1
      if (OPTS[flags[i]]) {
        optTemp = optTemp | OPTS[flags[i]]
      }
    }
    flags = optTemp
  }

  if (flags & OPTS.XDIFF_PATCH_NORMAL) {
    for (i = 0, ll = lines.length; i < ll; i++) {
      ranges = lines[i].match(rangeExp)
      if (ranges) {
        lastLinePos = linePos
        linePos = ranges[1] - 1
        while (lastLinePos < linePos) {
          newStrArr[newStrArr.length] = origLines[lastLinePos++]
        }
        while (lines[++i] && (rangeExp.exec(lines[i])) === null) {
          firstChar = lines[i].charAt(0)
          switch (firstChar) {
            case '-':
            // Skip including that line
              ++linePos
              break
            case '+':
              newStrArr[newStrArr.length] = lines[i].slice(1)
              break
            case ' ':
              newStrArr[newStrArr.length] = origLines[linePos++]
              break
            default:
            // Reconcile with returning errrors arg?
              throw new Error('Unrecognized initial character in unidiff line')
          }
        }
        if (lines[i]) {
          i--
        }
      }
    }
    while (linePos > 0 && linePos < origLines.length) {
      newStrArr[newStrArr.length] = origLines[linePos++]
    }
  } else if (flags & OPTS.XDIFF_PATCH_REVERSE) {
    // Only differs from above by a few lines
    for (i = 0, ll = lines.length; i < ll; i++) {
      ranges = lines[i].match(rangeExp)
      if (ranges) {
        lastLinePos = linePos
        linePos = ranges[3] - 1
        while (lastLinePos < linePos) {
          newStrArr[newStrArr.length] = origLines[lastLinePos++]
        }
        while (lines[++i] && (rangeExp.exec(lines[i])) === null) {
          firstChar = lines[i].charAt(0)
          switch (firstChar) {
            case '-':
              newStrArr[newStrArr.length] = lines[i].slice(1)
              break
            case '+':
            // Skip including that line
              ++linePos
              break
            case ' ':
              newStrArr[newStrArr.length] = origLines[linePos++]
              break
            default:
            // Reconcile with returning errrors arg?
              throw new Error('Unrecognized initial character in unidiff line')
          }
        }
        if (lines[i]) {
          i--
        }
      }
    }
    while (linePos > 0 && linePos < origLines.length) {
      newStrArr[newStrArr.length] = origLines[linePos++]
    }
  }

  if (errorObj) {
    errorObj.value = errors
  }

  return newStrArr.join('\n')
}


/**
 * XML
 */

function utf8_decode (strData) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/utf8_decode/
  //    input by: Aman Gupta
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: hitwork
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Kevin van Zonneveld (http://kvz.io)
  // bugfixed by: kirilloid
  // bugfixed by: w35l3y (http://www.wesley.eti.br)
  //   example 1: utf8_decode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'

  var tmpArr = []
  var i = 0
  var c1 = 0
  var seqlen = 0

  strData += ''

  while (i < strData.length) {
    c1 = strData.charCodeAt(i) & 0xFF
    seqlen = 0

    // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    if (c1 <= 0xBF) {
      c1 = (c1 & 0x7F)
      seqlen = 1
    } else if (c1 <= 0xDF) {
      c1 = (c1 & 0x1F)
      seqlen = 2
    } else if (c1 <= 0xEF) {
      c1 = (c1 & 0x0F)
      seqlen = 3
    } else {
      c1 = (c1 & 0x07)
      seqlen = 4
    }

    for (var ai = 1; ai < seqlen; ++ai) {
      c1 = ((c1 << 0x06) | (strData.charCodeAt(ai + i) & 0x3F))
    }

    if (seqlen === 4) {
      c1 -= 0x10000
      tmpArr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)))
      tmpArr.push(String.fromCharCode(0xDC00 | (c1 & 0x3FF)))
    } else {
      tmpArr.push(String.fromCharCode(c1))
    }

    i += seqlen
  }

  return tmpArr.join('')
}

function utf8_encode (argString) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/utf8_encode/
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Ulrich
  // bugfixed by: Rafał Kukawski (http://blog.kukawski.pl)
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'

  if (argString === null || typeof argString === 'undefined') {
    return ''
  }

  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '')
  var utftext = ''
  var start
  var end
  var stringl = 0

  start = end = 0
  stringl = string.length
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n)
    var enc = null

    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      )
    } else if ((c1 & 0xF800) !== 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) !== 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n)
      }
      var c2 = string.charCodeAt(++n)
      if ((c2 & 0xFC00) !== 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1))
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl)
  }

  return utftext
}
