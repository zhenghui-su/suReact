import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

/**
 * 子节点协调器
 * @param {boolean} shouldTrackSideEffects 是否跟踪副作用
 * @returns {function} 返回子节点协调函数
 */
function ChildReconciler(shouldTrackSideEffects: boolean) {
	/**
	 * 协调单个元素节点
	 * @param {FiberNode} returnFiber 父Fiber节点
	 * @param {FiberNode | null} currentFiber 当前Fiber节点
	 * @param {ReactElementType} element React元素
	 * @returns {FiberNode} 返回协调后的Fiber节点
	 */
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		// 根据element创建FiberNode
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}

	/**
	 * 协调单个文本节点
	 * @param {FiberNode} returnFiber 父Fiber节点
	 * @param {FiberNode | null} currentFiber 当前Fiber节点
	 * @param {string | number} content 文本内容
	 * @returns {FiberNode} 返回协调后的Fiber节点
	 */
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}

	/**
	 * 放置单个子节点
	 * @param {FiberNode} fiber Fiber节点
	 * @returns {FiberNode} 返回Fiber节点
	 */
	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrackSideEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	/**
	 * 协调子节点Fibers
	 * @param {FiberNode} returnFiber 父Fiber节点
	 * @param {FiberNode | null} currentFiber 当前Fiber节点
	 * @param {ReactElementType | null} newChild 下一个子节点
	 * @returns {FiberNode | null} 返回协调后的Fiber节点或null
	 */
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType | null
	) {
		// 判断当前fiber的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);

				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;
			}
		}
		// 多节点的情况 TODO

		// 文本节点 HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.warn('未实现的reconcile类型', newChild);
		}
		return null;
	};
}

// 导出子节点协调函数
export const reconcileChildFibers = ChildReconciler(true);
// 导出子节点挂载函数
export const mountChildFibers = ChildReconciler(false);
