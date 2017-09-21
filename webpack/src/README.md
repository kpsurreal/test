#README.md

为了提高代码质量，兼容新的js语法，通过babel来将js代码进行转换。
源：src
目标：public/dist

注意事项：
1.绝对不允许直接对目标文件夹的js（css）代码进行直接修改。原因等同于不能直接改less生成的css文件。
2.强烈推荐使用这样的形式进行js（css）编码，不推荐将js（css）代码直接写入php生成的html文件中，不推荐将js（css）文件直接写入/public/js文件夹
3.要使用这样的方式，需要在代码编写的环境安装node（npm），并且通过“sudo npm install”安装所需要的差距，随后使用“gulp watch”。
  安装操作只需要一次，但是js代码转换的命令“gulp watch”在编码时必须要时刻保持开启。
4.不允许使用文件夹嵌套，如果一定要用，请修改gulpfile.js并且自行测试。//文件夹嵌套已经支持