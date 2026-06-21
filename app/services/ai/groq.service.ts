import Groq from "groq-sdk";
import path from 'path';
import fs from 'fs/promises';

export const getAiTags = async (userDescription: string, imageUrl: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const cleanRelativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  const absoluteFilePath = path.resolve(process.cwd(), 'public', cleanRelativePath);

  try {
    await fs.access(absoluteFilePath);
  } catch (error: unknown) {
    console.error("O fs.access falhou para o caminho. Erro:", error);
    return null
  }

  const imageBuffer = await fs.readFile(absoluteFilePath);
  const base64Image = imageBuffer.toString('base64');

  const ext = path.extname(absoluteFilePath).toLowerCase();
  let mimeType = 'image/jpeg';
  if (ext === '.png') mimeType = 'image/png';
  else if (ext === '.webp') mimeType = 'image/webp';

  const llmCompletion = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: [{
          type: 'text',
          text: `
Você é um assistente especialista em catalogação de objetos para um sistema de Achados e Perdidos. 
Sua tarefa é analisar a imagem fornecida e a descrição de texto do usuário para gerar tags de identificação.

REGRAS CRUTIAIS DE SAÍDA:
1. Retorne APENAS uma string contendo entre 20 e 30 tags.
2. Cada tag deve ser uma única palavra (ou palavras juntas por hífen, ex: "fone-de-ouvido").
3. As tags devem ser separadas UNICAMENTE por um espaço em branco " ".
4. NÃO inclua pontuação, vírgulas, quebras de linha ou explicações.
5. NÃO responda com "Aqui estão suas tags:" ou qualquer introdução. Retorne apenas as tags brutas.

Foque em extrair: cor, marca, tipo de objeto, estado de conservação, material e características visuais marcantes.
`
        }]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Descrição fornecida pelo usuário: ${userDescription}`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            }
          }
        ]
      }
    ]
  })

  return llmCompletion.choices[0].message.content;
}

