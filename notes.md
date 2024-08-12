

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
        PDFLoader
    /text_splitter 
        RecursiveCharacterTextSplitter
            splitDocuments(docs)

Web Primitive
    TransformStream


vector-store.ts
    pineconeEmbedAndStore(client, docs)
    getVectorStore(client)

langchain.ts
    makeChain(vectorstore, writer)
    callChain({question, chatHistory, tranformStream})

pdf-loader.ts
    getChunkedDocsFromPDF()