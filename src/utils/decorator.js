// 类的装饰器
export const classDecorator = (target) => {
  // 此处的target为类本身
  target.a = true // 给类添加一个静态属性
}

// 传参的类的装饰器
export const classDecoratorWithParams = (params = true) => (target) => {
  target.a = params
}

// 类的装饰器（给类添加实例属性）
export const classDecoratorAddPrototype = prototypeList => (target) => {
  target.prototype = { ...target.prototype, ...prototypeList }
}

// 方法的装饰器
export const funDecorator = (params = {}) => (target, prototypeKey, ) => {
  /*
    此处target为类的原型对象，即方法Class.prototype
    ps：装饰器的本意是要装饰类的实例，但此时实例还未生成，所以只能装饰类的原型
  */
  // prototypeKey为要装饰的属性名
}
