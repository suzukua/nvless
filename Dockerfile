FROM node:20.11.1-alpine3.19

WORKDIR /app

COPY src ./
COPY app.js ./

EXPOSE 3000

RUN apk add --no-cache curl bash && \
    npm install && \
    chmod +x app.js

CMD ["npm", "start"]
