import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

const result = []
result.push({
    input: 'index.js', // 入口文件
    output: {
        format: 'cjs',
        file: 'output.js', // 打包后输出文件
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        commonjs(),
        //uglify()
    ]
})
export default result