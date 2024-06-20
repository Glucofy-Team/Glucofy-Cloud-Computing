/* eslint-disable quote-props */
/* eslint-disable object-shorthand */
/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-syntax */
const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: 'glucofy',
  location: 'asia-southeast1',
});
const model = 'gemini-1.5-flash-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});

const giveRecommend = async (foodName) => {
  const text1 = {
    text: `Kamu adalah seorang ahli gizi yang berfokus pada diet rendah indeks glikemik. Berikan saran makanan yang diinginkan oleh pengguna, 
    dan rekomendasikan kombinasi makanan lain yang memiliki indeks glikemik rendah. 

    Nama makanan yang diinginkan pengguna: ${foodName}

    Berikan rekomendasi yang spesifik dan detail, sertakan alasan mengapa makanan tersebut baik untuk menjaga kadar gula darah tetap stabil. 
    Misalnya, tambahkan informasi mengenai serat, protein, dan nutrisi penting lainnya yang mendukung diet rendah glikemik. 
    Pastikan rekomendasi mudah dimengerti dan dapat diaplikasikan dalam kehidupan sehari-hari, hindari penggunaan angka atau poin, dan tuliskan dalam format paragraf yang terstruktur.`,
  };

  const req = {
    contents: [{ role: 'user', parts: [text1] }],
  };

  const streamingResp = await generativeModel.generateContentStream(req);
  let aggregatedResponse = '';

  for await (const item of streamingResp.stream) {
    if (item.candidates && item.candidates.length > 0) {
      aggregatedResponse += item.candidates[0].content.parts[0].text;
    }
  }

  // Clean the response
  const cleanResponse = aggregatedResponse
    .replace(/\\n/g, ' ') // Replace \n with space
    .replace(/\*\*/g, '') // Remove **
    .replace(/\*/g, '') // Remove *
    .replace(/\\\"/g, '\"') // Replace escaped quotes
    .replace(/\n/g, ' ') // Replace actual newlines with space
    .replace(/\s\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/^#+\s*/, '') // Remove leading #
    .trim();

  return cleanResponse;
};

module.exports = {
  giveRecommend,
};
