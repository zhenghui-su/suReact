// 检查是否支持 Symbol，并获取 Symbol.for 方法
const supportSymbol = typeof Symbol === 'function' && Symbol.for;

// 定义 REACT_ELEMENT_TYPE 常量
export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element') // 如果支持 Symbol，则使用 Symbol.for 创建唯一标识符
	: 0xeac7; // 如果不支持 Symbol，则使用数值作为标识符
