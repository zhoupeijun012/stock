# 使用官方的Node.js基础镜像
FROM node:18-alpine3.18

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 暴露应用运行的端口
EXPOSE 12345

# 指定容器启动时执行的命令
CMD ["node", "index.js"]
