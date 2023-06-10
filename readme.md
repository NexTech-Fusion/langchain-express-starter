# 🦜 Langchain Express Starter 🚀

A super simple nodejs express API in TypeScript with Langchain history management and file training possibility.

Train and save your model based on provided file sources and save your history in a JSON file.


## Install

```
git clone
```

```
npm i
// or
yarn
```
 ### Add your OpenAPI key at .env

## Run it 🚀

```
npm run dev-local
```

Run Swagger

```
localhost:3400/docs
```
---
## Feed your LLM

- 📁 Add files to the public/train folder (md, txt, json).

- 🏃 Start your app, and the vector store should be automatically initialized.

---

## LLM Features

- **History Context** On each LLM call a historyId can be provided with this to stick to conversations and take them into account on LLM calls.
- **Vector Store** LLM can be trained by adding files (.txt, .json, .md) into the `public/train` folder and the result will be saved into the `public/vectorStore`

## General Features

- **File upload** A FileUploadController to save files for training.

## Project Features

- **Beautiful Code** [pleerock](https://github.com/pleerock).
- **Dependency Injection** [TypeDI](https://github.com/pleerock/typedi).
- **Clear Structure** layers such as controllers, services, repositories, models, middlewares...
- **Easy Exception Handling** thanks to [routing-controllers](https://github.com/pleerock/routing-controllers).
- **Docker** thanks to [docker](https://github.com/docker).
- **Class-based to handle websocket events** thanks to [socket-controllers](https://github.com/typestack/socket-controllers).
- **Class-based to handle Cron Jobs** thanks to [cron-decorators](https://github.com/mrbandler/cron-decorators).
- **API Documentation** thanks to [swagger](http://swagger.io/) a

---

MIT - [LICENSE](LICENSE) NexTech-Fusion.com
