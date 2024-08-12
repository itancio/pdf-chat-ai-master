
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

import { pineconeEmbedAndStore } from "@/lib/vector-store";
import { getPineconeClient } from "@/lib/pinecone-client";





export async function getChunkedDocsFromPDF() {
  try {
    const files_dir = "docs/"
    const loader = new DirectoryLoader(
    files_dir,
    {
        ".json": (path) => new JSONLoader(path, "/texts"),
        ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        ".csv": (path) => new CSVLoader(path, "text"),
        ".pdf": (path) => new PDFLoader(path, {
            splitPages: false,
            parsedItemSeparator: ""
        }),
    }
    );
    const docs = await loader.load();

    console.log("(lib/pdf-loader.ts) Loaded PDF: ", docs.length);

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);
    return chunkedDocs;

  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}

export async function initKnowledgeBase() {
  (async () => {
    try {
      const pineconeClient = await getPineconeClient();
      console.log("Preparing chunks from PDF file");
      const docs = await getChunkedDocsFromPDF();
      console.log(`Loading ${docs.length} chunks into pinecone...`);
      await pineconeEmbedAndStore(pineconeClient, docs);
      console.log("Data embedded and stored in pine-cone index");
    } catch (error) {
      console.error("Init client script failed ", error);
    }
  })
}