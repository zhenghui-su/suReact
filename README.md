从零实现 React

已实现

- JSX 函数
- Rollup 打包命令
- 调试: 该方式不是热更新，有点繁琐
  在 dist 的 react 目录下使用 pnpm link --global 将我们的 react 放入到全局的 node_modules 中
  然后通过`npx create-react-app react-demo`创建一个项目
  在 react-demo 目录下使用 pnpm link react --global 将 react 的指向改为我们写的 react
  在 index.js 中打印, 然后通过`npm start`运行,打开控制台,就可以看到不同了
  ```jsx
  import React from 'react';
  const jsx = (
  	<div>
  		hello <span>SuReact</span>
  	</div>
  );
  console.log(React);
  console.log(jsx);
  ```
  如下图: 可以看到我们打的标记 mark,同时发现 jsx 实现有点问题，span 没有显现，因为环境的原因

![image-20240402162003631](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240402162003631.png)

只需更改 jsxDEV 即可，我们之前是一致的，同时将前面的 index.ts 导出的 createElement 换为 jsxDEV

```typescript
// jsxDEV 与 jsx 函数相比少了后面的...maybeChildren 参数
export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	// 遍历配置对象，处理特殊属性（key 和 ref），将其余属性添加到 props 对象中
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val; // 将 key 转换为字符串
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val; // 设置 ref
			}
			continue;
		}
		// 调用空对象的hasOwnProperty方法, 确保只添加 config 对象自身的属性, 不添加原型链上的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val; // 将其余属性添加到 props 对象中
		}
	}
	// 调用 ReactElement 函数创建并返回 JSX 元素
	return ReactElement(type, key, ref, props);
};
```

再次查看，发现没问题了

![image-20240402163524432](https://chen-1320883525.cos.ap-chengdu.myqcloud.com/img/image-20240402163524432.png)
