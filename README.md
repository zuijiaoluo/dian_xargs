# 0.0.1

## dian_xargs是什么
	dian_xargs 是模仿xargs的一个命令行工具，目前仅实现了-n 和 -P 俩个参数
## 环境要求
	node >= 7.8.0
	npm >= 4.2.0
	无第三方依赖
## 如何安装
 	git clone https://github.com/zuijiaoluo/dian_xargs.git
	npm i . -g
## 使用案例
  	echo {0..100} | dian_xargs -n 5 -P 5 echo
  	结果
  	15 16 17 18 19
	10 11 12 13 14
	5 6 7 8 9
	0 1 2 3 4
	20 21 22 23 24
	40 41 42 43 44
	35 36 37 38 39
	30 31 32 33 34
	25 26 27 28 29
	45 46 47 48 49
	60 61 62 63 64
	55 56 57 58 59
	50 51 52 53 54
	70 71 72 73 74
	65 66 67 68 69
	90 91 92 93 94
	85 86 87 88 89
	80 81 82 83 84
	75 76 77 78 79
	95 96 97 98 99
	100
## 开发
 	git clone https://github.com/zuijiaoluo/dian_xargs.git
	npm i . -g
	npm link
