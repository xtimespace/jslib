
function Makeword (fn) {
  this.status = 'pending'
  this.value
  this.onFulfilled = []
  this.onRejected = []
  const me = this

  function resolve (newValue) {
    if (me.status === 'pending') {
      me.status = 'resolved'
      me.value = newValue
      me.onFulfilled.forEach(fn => {
        fn(newValue)
      })
    }
  }

  function reject (reason) {
    if (me.status === 'pending') {
      me.status = 'rejected'
      me.value = reason
      me.onRejected.forEach(fn => fn(reason))
    }
  }

  try {
    fn(resolve, reject)
  } catch(e) {
    reject(e)
  }
}

Makeword.resolve = function (value) {
  return new Makeword((resolve, reject) => {
    resolve(value)
  })
}

Makeword.reject = function (reason) {
  return new Makeword((resolve, reject) => {
    reject(reason)
  })
}

Makeword.prototype.then = function (done, fail) {
  const me = this
  done = typeof done === 'function' ? done : () => {}

  let retP
  let tmp

  switch (me.status) {
    case 'pending':
      me.onFulfilled.push(done)
      me.onRejected.push(fail || null)
      retP = me
      break
    case 'resolved':
      tmp = done(me.value)
      if (tmp instanceof Makeword) {
        retP = tmp
      } else {
        retP = Makeword.resolve()
      }
      break
    default:
      if (typeof fail === 'function') {
        tmp = fail(me.value)
        if (tmp instanceof Makeword) {
          retP = tmp
        } else {
          retP = Makeword.resolve()
        }
      } else {
        retP = Makeword.reject(me.value) // 將 rejected 冒泡出去
      }
      break
  }

  return retP
}

Makeword.prototype.catch = function (cb) {
  return this.then(undefined, cb)
}

module.exports = Makeword
