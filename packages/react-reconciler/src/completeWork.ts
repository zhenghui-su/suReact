import {
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';

import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

/**
 * 在递归中的归阶段完成工作
 * @param wip 当前正在处理的 FiberNode
 * @returns 完成工作后返回的内容，通常为 null
 */
export const completeWork = (wip: FiberNode) => {
	/** 在这个阶段，完成对当前 FiberNode 的处理，可能包括更新状态、执行副作用等操作 */
	const newProps = wip.pendingProps; // 获取待处理的 props
	const current = wip.alternate; // 获取当前 FiberNode 的备份（用于比较更新）

	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
				// 如果存在备份且 stateNode 存在，则执行更新操作
			} else {
				// 否则为首屏渲染
				// 1. 构建 DOM 实例
				const instance = createInstance(wip.type, newProps);
				// 2. 将 DOM 实例插入到 DOM 树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance; // 更新 FiberNode 的 stateNode
			}
			bubbleProperties(wip); // 将属性冒泡至父节点
			return null; // 完成当前节点的处理，返回 null
		case HostText:
			if (current !== null && wip.stateNode) {
				// 如果存在备份且 stateNode 存在，则执行更新操作
			} else {
				// 否则为文本节点
				const instance = createTextInstance(newProps.content); // 创建文本节点实例
				wip.stateNode = instance; // 更新 FiberNode 的 stateNode
			}
			bubbleProperties(wip); // 将属性冒泡至父节点
			return null; // 完成当前节点的处理，返回 null
		case HostRoot:
			bubbleProperties(wip); // 将属性冒泡至父节点
			return null; // 完成当前节点的处理，返回 null
		default:
			if (__DEV__) {
				console.warn('未处理的 completeWork 类型', wip); // 在开发环境下输出警告信息
			}
			break;
	}

	/** 辅助函数，向上遍历(归)的过程中将子节点添加到父节点中 */
	function appendAllChildren(parent: FiberNode, wip: FiberNode) {
		let node = wip.child;

		while (node !== null) {
			if (node?.tag === HostComponent || node?.tag === HostText) {
				appendInitialChild(parent, node.stateNode); // 将子节点添加到父节点中
			} else if (node.child !== null) {
				node.child.return = node; // 设置子节点的 return 指向当前节点
				node = node.child; // 继续处理子节点
				continue;
			}

			if (node === wip) {
				return; // 遍历到当前节点，结束循环
			}

			while (node?.sibling === null) {
				if (node.return === null || node === wip) {
					return; // 遍历到根节点或当前节点，结束循环
				}
				node = node?.return; // 向上遍历
			}

			node.sibling.return = node.return; // 设置兄弟节点的 return 指向父节点
			node = node.sibling; // 处理兄弟节点
		}
	}

	/** 辅助函数，将子节点的属性标志冒泡至父节点 */
	function bubbleProperties(wip: FiberNode) {
		let subtreeFlags = NoFlags;
		let child = wip.child;

		while (child !== null) {
			subtreeFlags |= child.subtreeFlags; // 将子节点的子树标志合并至父节点
			subtreeFlags |= child.flags; // 将子节点的标志合并至父节点

			child.return = wip; // 设置子节点的 return 指向当前节点
			child = child.sibling; // 处理下一个兄弟节点
		}
		wip.subtreeFlags |= subtreeFlags; // 将合并后的子树标志更新至当前节点
	}
};
