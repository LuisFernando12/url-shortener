# Encurtador de URL com Node.js, TypeScript e Express

Este projeto é um encurtador de URL desenvolvido utilizando Node.js com TypeScript e Express. O projeto permite encurtar URLs tanto estando logado quanto não logado.

## Requisitos

- Node.js
- PostgreSQL

## Configuração

Para rodar o projeto, siga os passos abaixo:

1. **Clone o repositório:**

    ```bash
    git clone <URL_DO_REPOSITÓRIO>
    cd <NOME_DO_REPOSITÓRIO>
    ```

2. **Renomeie o arquivo `.env.template` para `.env`:**

    - Em sistemas Unix (Linux/macOS):

        ```bash
        mv .env.template .env
        ```

    - Em Windows (PowerShell):

        ```powershell
        Rename-Item -Path ".env.template" -NewName ".env"
        ```


3. **Configure as variáveis de ambiente no arquivo `.env`:**

    ```dotenv
    PORT=                # Porta na qual o projeto será executado
    USER_DB=''               # Usuário do banco de dados (PostgreSQL)
    PASSWORD=''              # Senha do banco de dados
    DB_NAME=''               # Nome do banco de dados
    HOST=''                  # Endereço do banco de dados (ex: localhost)
    SECRET=''                # Secret para geração do JWT
    ```

4. **Instale as dependências:**

    No terminal, na pasta raiz do projeto, execute:

    ```bash
    npm install
    ```

5. **Inicie o projeto:**

    Após a instalação das dependências, execute:

    ```bash
    npm run start
    ```

6. **Acesse o projeto:**

    O projeto estará disponível no endereço:

    ```
    http://localhost:(A porta que você definiu no arquivo .env)
    ```

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

