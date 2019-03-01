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
  target.prototype.logger = () => console.info(`${target.name} 被调用`) // target.name即获得类的名
}

// 方法的装饰器
export const funDecorator = (params = { readonly: true }) => (target, prototypeKey, descriptor) => {
  /*
    此处target为类的原型对象，即方法Class.prototype
    ps：装饰器的本意是要装饰类的实例，但此时实例还未生成，所以只能装饰类的原型
   */
  /*
    prototypeKey为要装饰的方法(属性名)
   */
  /*
    descriptor为要修饰的方法(属性名)的描述符，即(默认值为)：
    {
      value: specifiedFunction,
      enumerable: false,
      configurable: true,
      writable: true
    }
   */

  // 实现一个传参的readonly，修改描述符的writable
  descriptor.writable = !params.readonly
  // 返回这个新的描述符
  return descriptor
}
/*
  调用funDecorator(Class.prototype, prototypeKey, descriptor)
  相当于
  Object.defineProperty(Class.prototype, prototypeKey, descriptor)
  */

// 方法的装饰器(在方法执行的前后添加操作：如show/hide loading)
export const funEnhanceDecorator = (params = {}) => (target, prototypeKey, descriptor) => {
  // 默认需要showLoading
  const { showLoading = true } = params
  const oldValue = descriptor.value
  descriptor.value = async function A(...args) {
    try {
      showLoading && console.info('加载中')
      const result = await oldValue.apply(this, args)
      console.info('hide')
      return result
    } catch (err) {
      console.info('hide')
      console.error(err)
      return null
    }
  };
  return descriptor
}
