FROM node:20

WORKDIR /usr/src/app  


COPY package*.json ./

# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --include=dev
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]