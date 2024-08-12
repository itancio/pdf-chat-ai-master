// import { PineconeClient } from "@pinecone-database/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";
import { configureIndex } from "@pinecone-database/pinecone/dist/control";

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

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  } else {
    console.log("Pinecone Client already initialized. Reusing...");
  }

  console.log("(lib > pinecone-client.ts) Returning Pinecone Client...: ", pineconeClientInstance);

  return pineconeClientInstance;
}
