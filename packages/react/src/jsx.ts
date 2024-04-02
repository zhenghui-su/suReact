import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes';

// ReactElement

// 创建 React 元素的函数
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE, // React 元素类型标识
		type, // 元素的类型
		key, // 元素的键
		ref, // 元素的引用
		props, // 元素的属性
		__mark: '苏征辉' // 自定义标记
	};
	return element;
};

/**
 * 创建 JSX 元素的函数
 * @param type JSX 元素的类型，如 "div"
 * @param config JSX 元素的配置对象
 * @param maybeChildren JSX 元素的子元素（可选）
 * @returns 创建的 JSX 元素
 */
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	// 遍历配置对象，处理特殊属性（key 和 ref），将其余属性添加到 props 对象中
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val; // 将 key 转换为字符串
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val; // 设置 ref
			}
			continue;
		}
		// 调用空对象的hasOwnProperty方法, 确保只添加 config 对象自身的属性, 不添加原型链上的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val; // 将其余属性添加到 props 对象中
		}
	}

	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		// 处理子元素
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0]; // 单个子元素
		} else {
			props.children = maybeChildren; // 多个子元素
		}
	}

	// 调用 ReactElement 函数创建并返回 JSX 元素
	return ReactElement(type, key, ref, props);
};

// jsxDEV 与 jsx 函数相比少了后面的...maybeChildren 参数
export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	// 遍历配置对象，处理特殊属性（key 和 ref），将其余属性添加到 props 对象中
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val; // 将 key 转换为字符串
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val; // 设置 ref
			}
			continue;
		}
		// 调用空对象的hasOwnProperty方法, 确保只添加 config 对象自身的属性, 不添加原型链上的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val; // 将其余属性添加到 props 对象中
		}
	}
	// 调用 ReactElement 函数创建并返回 JSX 元素
	return ReactElement(type, key, ref, props);
};
