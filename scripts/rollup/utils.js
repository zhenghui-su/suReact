import path from 'path'; // 导入 Node.js 的 path 模块，用于处理文件路径
import fs from 'fs'; // 导入 Node.js 的 fs 模块，用于读取文件
import ts from 'rollup-plugin-typescript2'; // 导入 rollup-plugin-typescript2 插件，用于处理 TypeScript 文件
import cjs from '@rollup/plugin-commonjs'; // 导入 @rollup/plugin-commonjs 插件，用于将 CommonJS 格式的模块转换为 ES 模块

const pkgPath = path.resolve(__dirname, '../../packages'); // 包的路径，通过 path.resolve 方法将相对路径转换为绝对路径
const distPath = path.resolve(__dirname, '../../dist/node_modules'); // dist 目录下的 node_modules 路径，用于存放打包后的模块

/**
 * 解析包的路径函数
 * @param {string} pkgName - 包的名称
 * @param {boolean} isDist - 是否为 dist 模式
 * @returns {string} - 解析后的包路径
 */
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}
/**
 * 解析 package.json 文件
 * @param {string} pkgName - 包的名称
 * @returns {Object} - 解析后的 package.json 对象
 */
export function getPackageJson(pkgName) {
	// 获取 package.json 内容的函数
	const path = `${resolvePkgPath(pkgName)}/package.json`; // 获取包的路径
	const str = fs.readFileSync(path, { encoding: 'utf-8' }); // 读取文件内容
	return JSON.parse(str); // 将文件内容解析为 JSON 对象并返回
}

/**
 * 获取基本的 Rollup 插件数组
 * @param {Object} options - 配置选项
 * @param {Object} options.typescript - typescript2 插件的配置项
 * @returns {Array} - 包含 commonjs 和 typescript2 插件的数组
 */
export function getBaseRollupPlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)]; // 返回包含 commonjs 和 typescript2 插件的数组
}
