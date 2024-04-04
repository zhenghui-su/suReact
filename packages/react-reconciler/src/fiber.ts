import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

/** FiberNode 类表示 React 中的一个 Fiber 节点 */
export class FiberNode {
	/** 节点类型，如函数组件、类组件、原生组件等 */
	type: any;
	/** 节点标签，用于表示节点的类型，如函数组件、类组件、原生组件等 */
	tag: WorkTag;
	/** 节点的属性 */
	pendingProps: Props;
	/** 节点的唯一标识 */
	key: Key;
	/** 节点的实际 DOM 节点或其他对象 */
	stateNode: any;
	/** 节点的引用 */
	ref: Ref;

	/** 指向父节点的指针 */
	return: FiberNode | null;
	/** 指向右侧兄弟节点的指针 */
	sibling: FiberNode | null;
	/** 指向第一个子节点的指针 */
	child: FiberNode | null;
	/** 当前节点在兄弟节点列表中的索引 */
	index: number;

	/** 节点在工作中的属性，用于在 current 和 workInProgress 之间切换 */
	memoizedProps: Props | null;
	/** 另一个 FiberNode 对象，用于在 current 和 workInProgress 之间切换 */
	alternate: FiberNode | null;
	/** 标记位，用于表示节点的状态和操作 */
	flags: Flags;

	/**
	 * 创建一个 FiberNode 实例
	 * @param tag 节点标签，用于表示节点的类型
	 * @param pendingProps 节点的属性
	 * @param key 节点的唯一标识
	 */
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例属性
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		this.type = null;

		// 构成树状结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;

		this.alternate = null;

		// 副作用 即标记位
		this.flags = NoFlags;
	}
}
