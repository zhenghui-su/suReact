import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { HostRoot } from './workTags';

/** 全局变量，表示当前正在处理的 Fiber 节点 */
let workInProgress: FiberNode | null = null;

/**
 * 准备一个新的工作栈，开始处理给定的 Fiber 节点
 * @param root 要处理的根 Fiber 节点
 */
function prepareFreshStack(root: FiberRootNode) {
	// 将给定的 Fiber 节点设置为工作栈的起点
	workInProgress = createWorkInProgress(root.current, {});
}

/**
 * 在给定的 Fiber 节点上调度更新
 * @param fiber 要调度更新的 Fiber 节点
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 实现调度功能
	/** 获取根 Fiber 节点 */
	const root = markUpdateFromFiberToRoot(fiber);
	/** 渲染根节点 */
	renderRoot(root);
}

/**
 * 从给定的 Fiber 节点追溯到根节点，标记更新
 * @param fiber 给定的 Fiber 节点
 * @returns 标记更新的根 Fiber 节点
 */
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	// 从给定的 Fiber 节点开始向上遍历，直到找到根节点为止
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	// 如果找到的根节点是 HostRoot 类型，则返回其对应的 FiberRootNode
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	// 如果未找到根节点或根节点不是 HostRoot 类型，则返回 null
	return null;
}

/**
 * 渲染根节点，启动 React 协调器的工作循环
 * @param root 根节点的 Fiber 节点
 */
function renderRoot(root: FiberRootNode) {
	// 初始化工作栈
	prepareFreshStack(root);

	// 开始循环处理工作单元，直到工作栈为空
	do {
		try {
			workLoop();
			// 如果出现异常，捕获并输出警告信息
			break;
		} catch (e) {
			console.warn('workLoop发生错误', e);
			workInProgress = null;
		}
	} while (true);
}

/**
 * 循环执行工作单元，直到工作栈为空
 */
function workLoop() {
	while (workInProgress !== null) {
		// 执行当前工作单元
		performUnitOfWork(workInProgress);
	}
}

/**
 * 执行单个工作单元
 * @param fiber 当前工作单元的 Fiber 节点
 */
function performUnitOfWork(fiber: FiberNode) {
	// 开始处理当前工作单元，获取下一个要处理的工作单元
	const next = beginWork(fiber);
	// 将当前待处理的 Props 复制给 memoizedProps
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 如果没有下一个工作单元，则完成当前工作单元
		completeUnitOfWork(fiber);
	} else {
		// 如果有下一个工作单元，则更新全局变量为下一个工作单元
		workInProgress = next;
	}
}

/**
 * 完成当前工作单元，并移动到下一个工作单元
 * @param fiber 当前工作单元的 Fiber 节点
 */
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		// 完成当前工作单元的处理
		completeWork(node);
		// 移动到下一个兄弟节点
		const sibling = node.sibling;
		if (sibling !== null) {
			// 如果存在兄弟节点，则设置下一个工作单元为兄弟节点
			workInProgress = sibling;
			return;
		}
		// 如果不存在兄弟节点，则向上遍历，直到找到有兄弟节点的节点为止
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
