export const environment = {
  /**
   * ID do GitHub Gist que armazena o data.json compartilhado.
   * Crie um Gist em https://gist.github.com com um arquivo chamado "data.json"
   * e cole o ID aqui (ex: 'abc123def456...').
   */
  gistId: 'COLE_O_GIST_ID_AQUI',

  /**
   * Personal Access Token do GitHub com scope "gist".
   * Gere em https://github.com/settings/tokens → Fine-grained ou Classic → scope: gist
   *
   * ⚠️ ATENÇÃO: este token ficará exposto no bundle do frontend.
   * Use um token com escopo mínimo (somente gist) e de uma conta com acesso limitado.
   */
  githubToken: 'COLE_O_TOKEN_AQUI',

  /**
   * Nome do arquivo dentro do Gist (deve ser "data.json").
   */
  gistFileName: 'data.json',
};
