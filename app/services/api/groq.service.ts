import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const promptIa = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get('image') as File | null

  if (!file) {
    return
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64Image = buffer.toString('base64')

  const llmCompletion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: [{
          type: 'text',
          text: 'Descreva o que você está vendo nesta imagem em português de forma detalhada.'
        }]
      },
      {
        role: 'user',
        content: [{
          type: 'image_url',
          image_url: {
            url: `data:${file.type};base64,${base64Image}`
          }
        }]
      }
    ]
  })

  return llmCompletion.choices[0].message.content;
}

