/* globals process */

import buble from '@rollup/plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const environment = process.env.ENV || 'development';
const isDevelopmentEnv = (environment === 'development');

export default [
	{
		input: 'lib/udf-compatible-datafeed.js',
		output: {
			name: 'Datafeeds',
			format: 'umd',
			file: 'dist/bundle.js',
		},
		plugins: [
			nodeResolve(),
			buble(),
			!isDevelopmentEnv && uglify({ output: { inline_script: true } }),
		],
	},
	{
		input: 'src/polyfills.es6',
		context: 'window',
		output: {
			format: 'iife',
			file: 'dist/polyfills.js',
		},
		plugins: [
			nodeResolve(),
			buble(),
			uglify({ output: { inline_script: true } }),
		],
	},
];
