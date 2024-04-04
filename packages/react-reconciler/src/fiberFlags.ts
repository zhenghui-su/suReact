/** 标记位用于跟踪组件树中每个节点的状态 */
export type Flags = number;

/** 没有标记，表示节点没有任何特殊状态 */
export const NoFlags = 0b0000001;

/** 表示需要将组件添加到 DOM 中 */
export const Placement = 0b0000010;

/** 表示需要更新组件的状态 */
export const Update = 0b0000100;

/** 表示需要删除组件的子节点 */
export const ChildDeletion = 0b0001000;
