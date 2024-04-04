import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

/**
 * FiberNode 类表示 React 中的一个 Fiber 节点
 */
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
	/** 当前节点的状态，用于在 current 和 workInProgress 之间切换 */
	memoizedState: any;
	/** 另一个 FiberNode 对象，用于在 current 和 workInProgress 之间切换 */
	alternate: FiberNode | null;
	/** 标记位，用于表示节点的状态和操作 */
	flags: Flags;
	/** 更新队列，用于存储状态更新 */
	updateQueue: unknown;

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
		this.updateQueue = null;
		this.memoizedState = null;

		this.alternate = null;

		// 副作用 即标记位
		this.flags = NoFlags;
	}
}

/**
 * 表示 React 中的一个 FiberRoot 即根节点
 */
export class FiberRootNode {
	/** 对应的容器节点 */
	container: Container;
	/** 当前的 Fiber 根节点 */
	current: FiberNode;
	/** 完成的 Fiber 根节点 */
	finishedWork: FiberNode | null;

	/**
	 * 创建一个 FiberRootNode 实例
	 * @param container 对应的容器节点
	 * @param hostRootFiber 根节点的 FiberNode 实例
	 */
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}
/**
 * 创建一个工作中的 Fiber 节点
 * @param current 当前的 Fiber 节点
 * @param pendingProps 待处理的属性
 * @returns 新创建的工作中的 Fiber 节点
 */
export const createWorkInProgress = (
	current: FiberNode, // 当前的 Fiber 节点
	pendingProps: Props // 待处理的属性
): FiberNode => {
	let workInProgress = current.alternate; // 获取当前节点的备份节点（工作中的节点）
	if (workInProgress === null) {
		// 如果备份节点为空，则表示当前处于 mount 阶段
		// 创建一个新的 Fiber 节点作为工作中的节点，并将其与当前节点关联
		workInProgress = new FiberNode(current.tag, pendingProps, current.key);
		workInProgress.stateNode = current.stateNode;

		workInProgress.alternate = current;
		current.alternate = workInProgress;
	} else {
		// 如果备份节点不为空，则表示当前处于 update 阶段
		// 更新工作中的节点的属性为待处理的属性，并清除标记位
		workInProgress.pendingProps = pendingProps;
		workInProgress.flags = NoFlags;
	}
	// 将工作中的节点的其他属性设置为当前节点的值
	workInProgress.type = current.type;
	workInProgress.updateQueue = current.updateQueue;
	workInProgress.child = current.child;
	workInProgress.memoizedProps = current.memoizedProps;
	workInProgress.memoizedState = current.memoizedState;

	return workInProgress; // 返回工作中的节点
};
