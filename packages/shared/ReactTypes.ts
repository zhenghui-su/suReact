// 定义类型别名
export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

// 定义 ReactElement 接口
export interface ReactElement {
	$$typeof: symbol | number; // React 元素类型标识
	type: ElementType; // 元素的类型
	key: Key; // 元素的键
	ref: Ref; // 元素的引用
	props: Props; // 元素的属性
	__mark: string; // 自定义标记
}
