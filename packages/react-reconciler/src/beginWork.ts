import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { reconcileChildFibers, mountChildFibers } from './childFibers';

/**
 * 在递归中的递阶段开始工作
 * @param {FiberNode} wip 当前正在进行工作的Fiber节点
 * @returns {FiberNode | null} 返回下一个要处理的Fiber节点或null
 */
export const beginWork = (wip: FiberNode) => {
	/**
	 * 在这个阶段，我们需要比较当前 FiberNode 和之前的状态，并返回子 FiberNode
	 */
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
};

/**
 * 更新HostRoot节点
 * @param {FiberNode} wip 当前正在进行工作的Fiber节点
 * @returns {FiberNode | null} 返回下一个要处理的Fiber节点或null
 */
function updateHostRoot(wip: FiberNode) {
	// 获取基础状态和更新队列
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	// 清空挂起队列
	updateQueue.shared.pending = null;
	// 处理更新队列，获取memoizedState
	const { memoizedState } = processUpdateQueue(baseState, pending);
	// 更新memoizedState
	wip.memoizedState = memoizedState;

	// 获取下一个子节点
	const nextChildren = wip.memoizedState;
	// 协调子节点
	reconcilerChildren(wip, nextChildren);
	// 返回下一个要处理的Fiber节点
	return wip.child;
}

/**
 * 更新HostComponent节点
 * @param {FiberNode} wip 当前正在进行工作的Fiber节点
 * @returns {FiberNode | null} 返回下一个要处理的Fiber节点或null
 */
function updateHostComponent(wip: FiberNode) {
	// 获取下一个props
	const nextProps = wip.pendingProps;
	// 获取下一个子节点
	const nextChildren = nextProps.children;
	// 协调子节点
	reconcilerChildren(wip, nextChildren);
	// 返回下一个要处理的Fiber节点
	return wip.child;
}

/**
 * 协调子节点
 * @param {FiberNode} wip 当前正在进行工作的Fiber节点
 * @param {ReactElementType | null | undefined} children 下一个子节点
 */
function reconcilerChildren(
	wip: FiberNode,
	children?: ReactElementType | null | undefined
) {
	const current = wip.alternate;

	if (current !== null) {
		// update流程
		wip.child = reconcileChildFibers(wip, current.child, children);
	} else {
		// mount流程
		wip.child = mountChildFibers(wip, null, children);
	}
}
