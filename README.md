## vite-build-git-info

vite插件。用于在浏览器中查看git提交信息。

参数说明

| 参数名称       | 参数说明                                                     | 类型     | 可选值                                                       | 默认值                                                 |
| -------------- | ------------------------------------------------------------ | -------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| gitOriginName  | 远程仓库名称                                                 | string   | -                                                            | origin                                                 |
| defaultShowLog | 默认是否显示日志                                             | boolean  | -                                                            | true                                                   |
| showLogFunName | 默认显示日志的函数名，当**defaultShowLog**为false，可通过在浏览器控制台中调用**showLogFunName**方法显示git信息。如调用默认showGitLog()方法 | string   | -                                                            | showGitLog                                             |
| showFieldList  | 控制台显示的字段列表                                         | string[] | ['commit', 'branch', 'author', 'date', 'message', 'isNewVersion'] | ['commit', 'branch', 'author', 'date', 'isNewVersion'] |
| labelStyle     | label样式                                                    | string   |                                                              |                                                        |
| valueStyle     | value样式                                                    | string   |                                                              |                                                        |
|                |                                                              |          |                                                              |                                                        |

