import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { env } from "./config";

export async function getChunkedDocsFromPDF() {
  try {
    console.log("(lib/pdf-loader.ts) Loading PDF from: ", env.PDF_PATH);
    const loader = new PDFLoader(env.PDF_PATH);
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
