require('../server.babel')

import { definePropertyValue, definePropertyGSet } from './utils/defineProperty'
import { decorator } from './utils/decorator'

const fun = () => new Promise(async (resolve, reject) => {
  await setTimeout(() => {
    console.info('123')
    resolve()
  }, 2000)
})

fun()

definePropertyValue()
definePropertyGSet()

decorator()
