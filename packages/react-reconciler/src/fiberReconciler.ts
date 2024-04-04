import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

/**
 * 创建一个 React 渲染容器
 * @param container DOM 元素容器
 * @returns 新创建的 Fiber 根节点
 */
export function createContainer(container: Container): FiberRootNode {
	// 创建一个表示挂载根节点的 Fiber 节点
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	// 创建一个 Fiber 根节点
	const root = new FiberRootNode(container, hostRootFiber);
	// 初始化根节点的更新队列
	hostRootFiber.updateQueue = createUpdateQueue();
	return root; // 返回新创建的 Fiber 根节点
}

/**
 * 更新 React 渲染容器中的内容
 * @param element 要渲染的 React 元素
 * @param root React 渲染容器的根节点
 * @returns 渲染的 React 元素
 */
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
): ReactElementType | null {
	// 获取根节点的 Fiber 节点
	const hostRootFiber = root.current;
	// 创建一个更新对象，包含要渲染的 React 元素
	const update = createUpdate<ReactElementType | null>(element);
	// 将更新加入到根节点的更新队列中
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);
	// 调度更新
	scheduleUpdateOnFiber(hostRootFiber);
	return element; // 返回要渲染的 React 元素
}
