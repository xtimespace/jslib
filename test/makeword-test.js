const Makeword = require('../src/makeword')

const m = new Makeword((resolve, reject) => {
  setTimeout(() => {
    resolve('you have my word')
  })
})

m.then(
  value => console.log(value),
  err => console.log(err)
)

Makeword.reject('I break my word')
  .then(
    value => console.log(value),
    err => console.log(err)
  )

Makeword.reject('broken')
  .then(value => console.log(value))
  .catch(err => console.log(err))
