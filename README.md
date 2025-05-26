# Frontend - SIGEPLoja

Este documento descreve como preparar o ambiente de desenvolvimento para o frontend React do projeto SIGEPLoja.

## Pré-requisitos

Antes de começar, instale as seguintes ferramentas em suas versões especificadas:

* **Node.js**: v22.14.0
  Verifique com:

  ```bash
  node -v
  ```
* **npm**: v10.9.2
  Verifique com:

  ```bash
  npm -v
  ```

> Caso tenha versões diferentes, faça downgrade ou use nvm para gerenciar versões do Node.

## Clonando o repositório

```bash
# clone o repositório principal
git clone <URL_DO_REPOSITORIO>



## Instalando as dependências

No diretório `front-end`, execute:

```bash
npm install
```

Isso vai instalar todas as bibliotecas listadas em `package.json`.




## Scripts úteis

* **`npm start`**: inicia o servidor de desenvolvimento em `http://localhost:3000`.
* **`npm run build`**: gera a build de produção na pasta `build/`.
* **`npm test`**: executa testes (se configurados).

## Primeiros passos

1. Garanta que o backend esteja rodando em `http://localhost:8080/api ....`.
2. No frontend, rode `npm start`.
3. Abra `http://localhost:3000` no navegador.

Pronto! O ambiente do frontend está configurado e pronto para desenvolvimento.
Aproveite e bom código!
