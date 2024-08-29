FROM node:20 AS build

WORKDIR /build

COPY package.json  yarn.lock ./
RUN yarn install --immutable

COPY . .

RUN yarn esbuild src/express.ts --bundle --platform=node --outfile=express.js

FROM node:20

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=7000

WORKDIR /var/task
COPY --from=build /build/express.js .

CMD ["node", "express.js"]