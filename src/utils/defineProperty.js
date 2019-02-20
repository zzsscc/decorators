export const definePropertyValue = () => {
  let o = {}
  Object.defineProperty(o, 'a', {
    value: 1
  })
  console.info('o.a: ', o.a) // 1
  // o.a = 2 // 会报错，o.a是只读的
  // 因为这种通过Object.defineProperty定义属性的方式等同于
  // Object.defineProperty(o, 'a', {
  //   value: 1,
  //   writable: false,
  //   configurable: false,
  //   enumerable: false
  // })
  // 这种方式定义的对象属性，其属性描述符默认都是false，除非显式地设胃true

  let p = { a: 1 }
  console.info('p.a: ', p.a) // 1
  p.a = 2
  console.info('p.a: ', p.a) // 2
  // p.a可被操作，因为这种对象字面量的定义方式等同于
  // Object.defineProperty(p, 'a', {
  //   value: 1,
  //   writable: true,
  //   configurable: true,
  //   enumerable: true
  // })
}

export const definePropertyGSet = () => {
  let obj = {}
  let num = 30
  Object.defineProperty(obj, 'id', {
    configurable: true,
    enumerable: true,
    get: () => num,
    set: (newValue) => {
      num = newValue
    }
  })

  console.info('obj.id, num: ', obj.id, num) // 30 30
  obj.id = 20
  console.info('obj.id, num: ', obj.id, num) // 20 20
  num = 40
  console.info('obj.id, num: ', obj.id, num) // 40 40
}
