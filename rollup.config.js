import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';
// const result = ['combination', 'common', 'filtering', 'mathematical', 'producer', 'transformation', 'vue3', 'extention', 'fusion'].map(x => {
//     return {
//         input: x + '.js',
//         output: {
//             format: 'cjs',
//             file: 'dist/' + x + '.js', // 打包后输出文件
//             name: x, // 打包后的内容会挂载到window，name就是挂载到window的名称
//             sourcemap: true // 代码调试 开发环境填true
//         },
//         plugins: [babel({
//             exclude: "node_modules/**"
//         }),
//         commonjs()]
//     }
// })
const result = []
result.push({
    input: 'index.js', // 入口文件
    output: {
        format: 'cjs',
        file: 'dist/cjs.js', // 打包后输出文件
        name: 'rx', // 打包后的内容会挂载到window，name就是挂载到window的名称
        sourcemap: true // 代码调试 开发环境填true
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        commonjs()
    ]
})
export default result