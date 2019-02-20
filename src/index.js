require('../server.babel')

import { definePropertyValue, definePropertyGSet } from './utils/defineProperty'
import {
  classDecorator,
  classDecoratorWithParams,
  classDecoratorAddPrototype,
  funDecorator
} from './utils/decorator'

export const fun = () => new Promise(async (resolve, reject) => {
  await setTimeout(() => {
    console.info('123')
    resolve()
  }, 2000)
})

fun()

definePropertyValue()
definePropertyGSet()

@classDecorator
export class ClassA {
  constructor() {
    this.a = 1
  }

  a = 2
}
console.info('ClassA.a: ', ClassA.a) // true

@classDecoratorWithParams(false)
export class ClassB {
  constructor() {
    this.a = 1
  }

  fun = () => {
    console.info('fun中ClassB.a: ', this.a, ClassB.a) // 1, false
  }
}
console.info('ClassB.a: ', ClassB.a) // false
const classB = new ClassB()
console.info('new ClassB().a: ', classB.a) // 1
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

// 报错，无法改变classD.fun，因为他的描述对象descriptor.writable已经被装饰器修改为false
// classD.fun = (tag) => {
//   console.info(`this.a changed ${tag}`)
// }
// classD.fun('sec')
