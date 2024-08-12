import { env } from "./config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone, Index as PineconeIndex } from "@pinecone-database/pinecone";
import Index from "@pinecone-database/pinecone";

export async function pineconeEmbedAndStore(
  client: Pinecone,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[]
) {
  /*create and store the embeddings in the vectorStore*/
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });
  } catch (error) {
    console.log("error ", error);
    throw new Error("Failed to load your docs !");
  }
}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new OpenAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    return vectorStore;

  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
