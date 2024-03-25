import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const { name, module } = getPackageJson('react');
const pkgPath = resolvePkgPath(name); // react包的路径
const pkgDistPath = resolvePkgPath(name, true); // react产物路径

export default [
	// react
	{
		input: `${pkgPath}/${module}`, // 输入文件路径
		output: {
			file: `${pkgDistPath}/index.js`, // 输出文件路径
			name: 'React', // 输出的全局变量名
			format: 'umd' // 输出的模块格式 兼容es和cjs
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				// 生成package.json
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: 'index.js'
				})
			})
		]
	},
	// jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`, // 输入文件路径
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`, // 输出文件路径
				name: 'jsx-runtime.js', // 输出的全局变量名
				format: 'umd' // 输出的模块格式
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`, // 输出文件路径
				name: 'jsx-dev-runtime.js', // 输出的全局变量名
				format: 'umd' // 输出的模块格式
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
