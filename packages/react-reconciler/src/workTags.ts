/** 表示 Fiber 节点的工作标签类型 */
export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

/** 表示函数组件的标签类型 */
export const FunctionComponent = 0;

/** 表示挂载的根节点，对应 ReactDOM.render() 的 Fiber 节点类型 */
export const HostRoot = 3;

/** 表示普通 DOM 节点，如 <div> 对应的类型 */
export const HostComponent = 5;

/** 表示文本节点，如 <div>123</div> 中的文本类型 */
export const HostText = 6;
