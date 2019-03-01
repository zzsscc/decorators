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

// 方法的增强装饰器(在方法执行的前后添加操作：如show/hide loading)
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

// time => 计数and计时
const labels = {};
// Exported for mocking in tests
export const defaultConsole = {
  time: console.time ? console.time.bind(console) : (label) => {
    labels[label] = new Date();
  },
  timeEnd: console.timeEnd ? console.timeEnd.bind(console) : (label) => {
    const timeNow = new Date();
    const timeTaken = timeNow - labels[label];
    delete labels[label];
    console.info(`${label}: ${timeTaken}ms`);
  }
};
let count = 0;

export const time = (params = { prefix: null, console: defaultConsole }) => (target, prototypeKey, descriptor) => {
  const fn = descriptor.value
  let { prefix } = params
  const { console } = params
  if (prefix === null) {
    prefix = `${target.constructor.name}.${prototypeKey}`
  }

  if (typeof fn !== 'function') {
    throw new SyntaxError(`@time can only be used on functions, not: ${fn}`)
  }

  return {
    ...descriptor,
    async value(...args) {
      const label = `${prefix}-${count}`
      count += 1
      console.time(label)

      try {
        return await fn.apply(this, args)
      } finally {
        console.timeEnd(label)
      }
    }
  }
}

// deprecate => 标记废弃
const DEFAULT_MSG = 'This function will be removed in future versions.'
export const deprecate = (params = { options: {} }) => (target, prototypeKey, descriptor) => {
  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError('Only functions can be marked as deprecated')
  }

  const methodSignature = `${target.constructor.name}#${prototypeKey}`
  let { msg = DEFAULT_MSG } = params
  const { options } = params

  if (options.url) {
    msg += `\n\n    See ${options.url} for more details.\n\n`;
  }

  return {
    ...descriptor,
    value(...args) {
      console.warn(`DEPRECATION ${methodSignature}: ${msg}`)
      return descriptor.value.apply(this, args)
    }
  }
}

// test sequence 测试顺序
export const testSequence1 = (params = {}) => (target, prototypeKey, descriptor) => {
  const oldValue = descriptor.value
  return {
    ...descriptor,
    value(...args) {
      console.info('test1')
      oldValue.apply(this, args)
    }
  }
}

export const testSequence2 = (params = {}) => (target, prototypeKey, descriptor) => {
  const oldValue = descriptor.value
  return {
    ...descriptor,
    value(...args) {
      console.info('test2')
      oldValue.apply(this, args)
    }
  }
}
