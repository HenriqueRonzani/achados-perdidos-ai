# Achados e Perdidos

Este é um sistema web para o gerenciamento e controle de itens achados e perdidos. O projeto permite o cadastro e autenticação de usuários, além do registro completo de objetos perdidos com suporte a upload de imagens. Um dos grandes diferenciais é a integração com inteligência artificial para a geração automática de tags identificadoras dos itens, facilitando a catalogação e a busca.

## 🚀 Tecnologias e Bibliotecas Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

* **Next.js**: Framework React escolhido para a construção das interfaces e da API.


* **Neon Database**: Banco de dados serverless escalável para o armazenamento das entidades (Usuários e Itens).


* **Jose**: Biblioteca utilizada para a geração e verificação de tokens JWT (JSON Web Tokens), garantindo rotas seguras e autenticação eficiente.


* **Bcryptjs**: Responsável pela criptografia (hash) das senhas dos usuários no banco de dados, assegurando a proteção das credenciais.


* **Groq SDK**: Utilizado para conectar o sistema ao modelo LLM que analisa imagens e descrições para gerar tags automáticas (como cor, tipo, marca, etc.) para os itens cadastrados.


* **HeroUI / Tailwind CSS**: Componentes visuais e estilização de interface.

---

## ⚙️ Variáveis de Ambiente

Para o correto funcionamento da aplicação, é necessário configurar as variáveis de ambiente.

Crie um arquivo chamado `.env.local` na raiz do projeto e preencha as seguintes chaves:

```env
# Chave secreta para assinatura dos tokens JWT na autenticação
JWT_SECRET=sua_chave_secreta_aqui

# URL de conexão fornecida pelo seu banco de dados Neon
DATABASE_URL=sua_url_do_banco_aqui

# Chave da API do Groq para geração de tags inteligentes usando IA
GROQ_API_KEY=sua_api_key_do_groq_aqui

```

---

## 🛠️ Como rodar o projeto

1. **Instale as dependências:**
Após clonar o repositório, abra o terminal na pasta do projeto e instale as dependências via npm (ou seu gerenciador de pacotes favorito):
```bash
npm install

```


2. **Configure o `.env.local`:**
Certifique-se de ter criado o arquivo `.env.local` na raiz do projeto contendo as variáveis citadas acima.
3. **Inicie o servidor de desenvolvimento:**
Execute o comando abaixo para rodar a aplicação:
```bash
npm run dev

```


4. **Acesse:**
O projeto estará disponível no seu navegador, no endereço `http://localhost:3000`.



## 🤖 Como testar a feature de Inteligência Artificial
A geração automática de tags via IA é o grande destaque do sistema. Para testá-la na prática, siga o passo a passo abaixo:

1. Acesse o Sistema:
Após iniciar o servidor (npm run dev), abra a aplicação e faça login utilizando e-mail e senha.

2. Acesse o Gerenciamento de Itens:
Ao fazer o login, você será redirecionado para a Dashboard principal. Lá, clique na opção para gerenciar os Itens.

3. Cadastre um Novo Objeto com Imagem:
Clique no botão para registrar um novo item. Preencha o nome, descrição, local onde foi encontrado e faça o upload de uma imagem do objeto.

4. A Mágica Acontece:
Quando você salvar o registro, o sistema enviará a descrição e a imagem para o modelo de visão do Groq nos bastidores. A IA vai analisar tudo e gerar tags invisíveis (como cor predominante, tipo de material, marca, estilo, etc.) que ficarão atreladas ao seu item no banco de dados.

5. Teste a Pesquisa:
Agora, na barra de pesquisa da tela de itens, tente buscar por uma característica do objeto que você não digitou no nome ou na descrição, mas que estava visível na imagem (por exemplo, digite "couro", "vermelho", "eletrônico"). O item deve aparecer nos resultados, comprovando que a IA catalogou as características visuais corretamente!
