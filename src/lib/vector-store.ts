import { env } from "./config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";


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

    console.log("Successfully loaded vector store from pinecone");
    return vectorStore;

  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}

// // =============DOCUMENT LOADER==================
// import { Document } from "langchain/document";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// export async function updatePinecone(client: Pinecone, docs: Document<Record<string, any>>[]) {
//   try {
//     // Retrieve the Pinecone index
//     const index = client.index(env.PINECONE_INDEX_NAME);

//     for (const doc of docs) {
//       console.log(`(lib/vector-store.ts) Processing document: {doc.metadata.source}`);
//       const txtPath = doc.metadata.source;
//       const text = doc.pageContent;

//       // Instantiate RecursiveCharacterTextSplitter
//       const textSplitter = new RecursiveCharacterTextSplitter({
//         chunkSize: 1000,  // Rcommended size
//         chunkOverlap: 200,
//       });
//       console.log('(lib/vector-store.ts) Splitting text into chunks...');
      
//       // Split text into chunks
//       const chunks = await textSplitter.createDocuments([text]);
//       console.log(`Text split into ${chunks.length} chunks`)

//       console.log(`calling openAI embedding documents with ${chunks.length} chunks`)

//       // Create OpenAI embeddings for documents
//       const embeddings: any = new OpenAIEmbeddings()

//       //embed the PDF documents
//       const vectorstore = await PineconeStore.fromDocuments(docs, embeddings, {
//         pineconeIndex: index,
//         textKey: "text",
//       })

//       // All of this can be replaced by the above code
//       // const embeddingsArrays: any = embeddings.embedDocuments(
//       //   chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
//       // );

//       // console.log(`Creating ${chunks.length} vectors array with id, values and metadata...`)
    
//       // // Create and upsert vectors in batches of 100
//       // const batchSize = 100;
//       // let batch:any = [];
//       // for (let idx = 0; idx < chunks.length; idx++) {
//       //   const chunk = chunks[idx]
//       //   const vector = {
//       //     id: `${txtPath}_${idx}`,
//       //     values: embeddingsArrays[idx],
//       //     metadata: {
//       //       ...chunk.metadata,
//       //       loc: JSON.stringify(chunk.metadata.loc),
//       //       pageContent: chunk.pageContent,
//       //       txtPath: txtPath,
//       //     },
//       //   }
//       //   batch = [...batch, vector]

//         // When batch is full or it's the last item, upsert the vectors in Pinecone
//         // if (batch.length === batchSize || idx === chunks.length - 1) {
//         //   await index.upsert({
//         //     upsertRequest: {
//         //       vectors: batch,
//         //     }
//         //   })
//         // }
//     }
//   } catch (e) {
//     console.error(e);
//     throw new Error("PDF docs chunking failed !");
//   }
// }

// // =================END DOCUMENT LOADER==============

