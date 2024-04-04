import { Action } from 'shared/ReactTypes';

/**
 * 表示一个状态update的对象，包含一个动作
 */
export interface Update<State> {
	/** update的动作 */
	action: Action<State>;
}

/**
 * 表示一个状态update队列的对象，包含一个待处理的update
 */
export interface UpdateQueue<State> {
	shared: {
		/** 待处理的update */
		pending: Update<State> | null;
	};
}

/**
 * 创建一个状态update对象
 * @param action update的动作
 * @returns 新创建的update对象
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

/**
 * 创建一个状态update队列对象,用于消费update
 * @returns 新创建的状态update队列对象
 */
export const createUpdateQueue = <Action>() => {
	return {
		shared: {
			pending: null // 初始时，没有待处理的update
		}
	} as UpdateQueue<Action>;
};

/**
 * 将一个update加入到update队列中
 * @param updateQueue 要加入的update队列
 * @param update 要加入的update对象
 */
export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update; // 将update放入update队列中
};

/**
 * 处理update队列，返回处理后的状态
 * @param baseState 初始状态
 * @param pendingUpdate 待处理的update
 * @returns 处理后的状态对象
 */
export const processUpdateQueue = <State>(
	baseState: State, // 初始状态
	pendingUpdate: Update<State> | null // 待处理的update
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState // 初始时，状态等于基本状态
	};
	if (pendingUpdate !== null) {
		// 如果存在待处理的update
		const action = pendingUpdate.action; // 获取update中的动作
		if (action instanceof Function) {
			// 如果动作是函数，则执行函数并update状态
			result.memoizedState = action(baseState);
		} else {
			// 如果动作不是函数，则直接使用动作作为新的状态
			result.memoizedState = action;
		}
	}
	return result; // 返回处理后的状态
};
