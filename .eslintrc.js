module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "commonjs": true
    },
    "globals": {
        "c3ImgBrowser": "writable",
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "arrowFunctions": true,
            "classes": true,
            "modules": true,
            "defaultParams": true
        },
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react"
    ],
    "rules": {
        "linebreak-style": 0, // 启用CRLF换行符
        "no-empty": 0,
        "comma-dangle": 0, // 启用对象字面量项尾不能有逗号
        "no-unused-vars": 0, // 禁止无用的表达式
        "no-console": 0, // 可以使用console
        "no-const-assign": 2, // 禁止修改const声明的变量
        "no-dupe-class-members": 2,
        "no-duplicate-case": 2, // switch中的case标签不能重复
        "no-extra-parens": [2, "functions"], // 函数中禁止非必要的括号
        "no-self-compare": 2, // 不能比较自身
        "accessor-pairs": 2, // 禁止在对象中使用getter/setter
        "comma-spacing": 0, // 逗号前后的空格
        "constructor-super": 2, // 非派生类不能调用super，派生类必须调用super
        "new-cap": 2, // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
        "new-parens": 2, // new时必须加小括号
        "no-array-constructor": 0, // 可以使用数组构造器 2 禁用
        "no-class-assign": 2, // 禁止给类赋值
        "no-cond-assign": 2, // 禁止条件表达式中出现赋值操作符
        "no-mixed-spaces-and-tabs": 0, // 可以混用tab和空格
        "no-alert": 0, // 禁止使用alert confirm prompt
        "no-eq-null": 2, // 禁止对null使用==或!=运算符
        "no-eval": 0, // 禁止使用eval
        "eqeqeq": 2, // 必须使用全等
        "no-multiple-empty-lines": [2, {"max": 2}], // 空行最多不能超过2行
        // "camelcase": 2, // 强制驼峰法命名
        "default-case": 2, // switch语句最后必须有default
        "key-spacing": [2, { "beforeColon": false, "afterColon": true }] // 对象字面量中冒号的前后空格
    }
}
