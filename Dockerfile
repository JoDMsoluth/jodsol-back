FROM node:12.16.2 as builder

# 작업 폴더를 만들고 npm 설치
RUN mkdir -p /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
CMD ["npm", "build"]