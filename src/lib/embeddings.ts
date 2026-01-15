// Nomic Embed API integration for code embeddings

const NOMIC_API_URL = "https://api.nomic.ai/v1/embeddings";

export interface EmbeddingResult {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(NOMIC_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOMIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nomic-embed-code-v1",
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Nomic API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await fetch(NOMIC_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOMIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "nomic-embed-code-v1",
      input: texts,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Nomic API error: ${error}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Find most similar chunks
export function findMostSimilar(
  queryEmbedding: number[],
  embeddings: Array<{ id: string; embedding: number[]; metadata: any }>,
  topK: number = 5
): Array<{ id: string; similarity: number; metadata: any }> {
  const similarities = embeddings.map((item) => ({
    id: item.id,
    similarity: cosineSimilarity(queryEmbedding, item.embedding),
    metadata: item.metadata,
  }));

  return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
}
