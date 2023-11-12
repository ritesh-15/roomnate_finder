FROM node:18-alpine as builder

WORKDIR /app

COPY ./package.json .

RUN yarn

COPY . .

RUN yarn build

FROM node:18-alpine as runner

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tailwind.config.js ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views

EXPOSE 9000

CMD [ "yarn","start" ]