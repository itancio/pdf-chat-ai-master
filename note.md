

@langchain
    openai
        ChatOpenAI
        OpenAIEmbeddings
    pinecone
        PineconeStore

@pinecone-database
    pinecone
        Pinecone

/langchain
    /document_loaders/fs/pdf
        PDF Loader
    /text_splitter 
        RecursiveCharacterTextSplitter


vector-store.ts
    pineconeEmbedAndStore(client, docs)
    getVectorStore(client)

langchain.ts
    makeChain(vectorstore, writer)
    callChain({question, chatHistory, tranformStream})

pdf-loader.ts
    getChunkedDocsFromPDF()