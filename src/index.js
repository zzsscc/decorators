require('../server.babel')

const fun = () => new Promise(async (resolve, reject) => {
  await setTimeout(() => {
    console.info('123')
  }, 2000)
})

fun()
