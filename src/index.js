require('../server.babel')

import { definePropertyValue, definePropertyGSet } from './utils/defineProperty'
import {
  classDecorator,
  classDecoratorWithParams,
  classDecoratorAddPrototype,
  funDecorator,
  funEnhanceDecorator,
  time,
  deprecate,
  testSequence1,
  testSequence2
} from './utils/decorator'

export const fun = () => new Promise(async (resolve, reject) => {
  await setTimeout(() => {
    console.info('123')
    resolve()
  }, 1000)
})

fun()

definePropertyValue()
definePropertyGSet()

@classDecorator
export class ClassA {
  constructor() {
    this.a = 1
  }
}
const classA = new ClassA()
console.info(`
  ClassA.a: ${ClassA.a},
  classA.a:' ${classA.a}
`) // true, 1

@classDecoratorWithParams(false)
export class ClassB extends ClassA {
  constructor() {
    super()
    this.b = 1
  }

  fun = () => {
    console.info('fun中ClassB.b: ', this.b, ClassB.b) // 1, false
  }
}
console.info('ClassB.a: ', ClassB.a) // true
console.info('ClassB.b: ', ClassB.b) // false
const classB = new ClassB()
console.info('classB.b: ', classB.b) // 1
classB.fun()

@classDecoratorAddPrototype({ fn() { console.info('fnfnfn') } }) // 此处不能使用箭头函数？
export class ClassC {
  constructor() {
    this.a = 1
  }
}
// console.info('ClassC.fn: ', ClassC.fn()) // 报错，fn不在ClassC的静态属性上
const classC = new ClassC()
classC.fn()
classC.logger()


export class ClassD {
  constructor() {
    this.a = 1
  }

  @funDecorator()
  fun = (tag) => {
    this.a = 2
    console.info(`this.a ${tag}`, this.a)
  }
}
const classD = new ClassD()
classD.fun('first')

// 报错，无法改变classD.fun，因为他的描述符descriptor.writable已经被装饰器修改为false
try {
  classD.fun = (tag) => {
    console.info(`this.a changed ${tag}`)
  }
  classD.fun('sec')
} catch (err) {
  console.error(new Error(err))
  // throw
}


export class ClassE {
  constructor() {
    this.result = {}
  }

  afun = (params) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(params.id)
      }, 2000)
    })
  }

  @funEnhanceDecorator()
  async fun(params = {}) { // 不能使用箭头函数？
    const result = await this.afun(params)
    console.info(result)
  }
}
const classE = new ClassE()
classE.fun({ id: 100 })


export class ClassF {
  constructor() {
    this.result = {}
  }

  @time()
  @deprecate({ options: { url: 'https://github.com/zzsscc' } })
  @testSequence1()
  @testSequence2()
  fun() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.result)
      }, 3000)
    })
  }
}
const classf = new ClassF()
classf.fun()
classf.fun()
