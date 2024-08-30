# Taxbuddy ✨🤖💻🗃️

An AI-powered PDF chat built with Next.js 13, Langchain, and PineconeDB

## ✨Update✨
Added sources to the stream and displaying it in an accordian


## Architecture

<img width="1402" alt="Embed LLM" src="https://github.com/rajeshdavidbabu/pdf-chat-ai/assets/15684795/98f54183-b1e0-4dd4-8e8f-b6994e36f814">


## 👩‍🚀 Description

Built with:
- ✅ Next.js 13
- ✅ Shadcn-ui
- ✅ Langchain TypeScript integration
- ✅ PineconeDB as the knowledge store
- ✅ Dark Mode with persistent theme-switching

## 🗃️ Pre-requisites
- Create a free account and get an OPEN_AI key from platform.openai.com
- Create a free account and get access to PineconeDB
- And populate your `.env` file with the required information.

## 💬 Good to know
- The PineconeDB index creation happens when we run `npm run prepare:data`, but its better to create it manually if you dont want the command to fail.
- If the command fails, then give sometime for pinecone index to get initialized and try to run the command again, it should work eventually.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command               | Action                                          |
| :-------------------- | :-----------------------------------------------|
| `npm install`         | Installs dependencies                           |
| `npm run prepare:data`| Splits your PDF file under the /docs folder into chunks, embeds them, uploads them to Pinecone|
| `npm run dev`         | Starts the local dev server at `localhost:3000` |

## 🚸 Roadmap
- ✅ Add sources to the streamed chat bubble
- 🚧 Clean up and show proper error messages
- 🚧 Sanitize input and output source documents
