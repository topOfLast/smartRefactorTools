# Refactoring Tools

This is an extension for Visual Studio Code that allows you to convert color to key.
[My git](http://git.patsnap.com/lidi/refactoring-tools)
## Usage


## develop
### debug
- `npm i`
- press `F5` to debug it

### package
- `npm run package`

## Known Issues

- If you select a value with multiple cursors it will get converted, but following cursors may change place after the conversion.
- '_Edits from command extension.colorToKey were not applied_' message appears in debug console.

## Release Notes

## [1.0.0]
- Initial release

## [1.0.1]
- :gift: add auto chose best match

- :bug: fix no match clean color bug

## [1.0.2]
- :gift: add read token file logic
---

## [1.1.0]
- :gift: add config options
    - token-collect-reg: 提取tokenFile中需要生成替换map的关键行, 使用的正则表达式, 默认: `/\$.+:.+;/g`
    - token-split-character: 从上述提取的关键行中, 拆分 key - value 的分隔符, 默认`:`
    - token-file-path: 自定义tokenFile的路径, 可以是相对路径
    - match-key-rules: 优化匹配逻辑的规则列表, 例如: 
        `{'background-color': 'bg'}` ---碰到包含`background-color`的值, 替换key时会优先使用包含`bg`的key  
        `{'fill': ['first', 'second']}` ---碰到包含`fill`的值, 替换key时会优先使用包含`first`的key, 其次使用包含`second`的key
---

## Contributing

Feel free to fork this repository and use it the way you like. If you want to propose a nice new feature, just create a pull request from you forked branch.
[My git](http://git.patsnap.com/lidi/refactoring-tools)

**Enjoy!**
