// import { PineconeClient } from "@pinecone-database/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "@/lib/config";
import { delay } from "@/lib/utils";
import {initKnowledgeBase} from "@/lib/knowledgeBase";
import { pineconeEmbedAndStore } from "@/lib/vector-store";

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(client: Pinecone, indexName: string) {
  try {
    await client.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1"
        }
      },
    });
    console.log(
      `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(env.INDEX_INIT_TIMEOUT);
    console.log("Index created !!");
  } catch (error) {
    console.error("error ", error);
    throw new Error("Index creation failed");
  }
}

async function initPineconeClient() {
  console.log("(lib > pinecone-client.ts) Initializing Pinecone Client...")
  try {
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });

    const indexName = env.PINECONE_INDEX_NAME;
    
    const existingIndexes = await pineconeClient.listIndexes();
    const indices = existingIndexes.indexes;

    if (!indices || indices.length === 0) {
      console.log("(lib/pinecone-client.ts) No existing indices. Creating index:", indexName);
      await createIndex(pineconeClient, indexName);
    } else {
      let indexExists = false;
    
      indices.forEach((index) => {
        if (index.name.toLowerCase() === indexName.toLowerCase()) {
          indexExists = true;
          console.log("Index already exists:", indexName);
        }
      });
    
      if (!indexExists) {
        console.log("Creating index:", indexName);
        await createIndex(pineconeClient, indexName);
      }
    }

    return pineconeClient

  } catch (error) {
    console.error("error in initPineconeClient", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";



export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();

    console.log("(lib/pinecone-client.ts) Initializing knowledgeBase...");

    const files_dir = "src/docs"
    const loader = new DirectoryLoader(
    files_dir, {
        ".json": (path) => new JSONLoader(path, "/texts"),
        ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        ".csv": (path) => new CSVLoader(path, "text"),
        ".pdf": (path) => new PDFLoader(path, {
            splitPages: true,
            parsedItemSeparator: ""
        }),
    });
    const docs = await loader.load();

    console.log("(lib/pdf-loader.ts) Loaded PDF: ", docs.length);

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    console.log("Preparing chunks from PDF file");
    const chunkedDocs = await textSplitter.splitDocuments(docs);
    console.log(`(lib/vector-store.ts) chunked documents: ${chunkedDocs.length}`);

    const pineconeClient = await getPineconeClient();
    
    console.log(`Loading ${docs.length} chunks into pinecone...`);
    await pineconeEmbedAndStore(pineconeClient, docs);
    console.log("Data embedded and stored in pine-cone index");





  } else {
    console.log("Pinecone Client already initialized. Reusing...");
  }

  console.log("(lib > pinecone-client.ts) Returning Pinecone Client from getPineconeClient() ", pineconeClientInstance);

  return pineconeClientInstance;
}



