# Definições

Tudo é definido na janela **«Selecionar formulário»**, que se abre com a
caixa de diálogo de configuração do bloco. À esquerda encontra-se a lista de formulários,
no centro o formulário selecionado e o design. Na parte superior, no cabeçalho:
Aplicar, Cancelar, Voltar atrás, Ajuda e o botão de alternância
Editor · Computador · Tablet · Telemóvel.

| Configuração | Descrição |
| --- | --- |
| Formulário | O formulário a apresentar. Campo obrigatório – sem formulário, não é possível aplicar. É selecionado à esquerda na lista; a pesquisa acima permite encontrar formulários por título ou ID. |
| Cor de destaque | Cor para o botão «Enviar», o marcador de campo obrigatório e a marca de seleção. Predefinição: MAN Vermelho; alternativamente, antracite ou preto. |
| Densidade | Padrão (40 px de altura do campo) ou Compacto (36 px) — para páginas com pouco espaço. |
| Símbolo de campo obrigatório | Asterisco (`*`) ou a palavra `(required)` por trás de cada campo obrigatório. |

## Para a lista de formulários

A lista mostra apenas os formulários que criou ou que tem permissão para editar
(**direitos de administração**), e, desses, os 100 mais recentes. Um
formulário de terceiros, que tenha permissão para incorporar, não aparece nessa lista. Para isso,
existe na parte inferior da janela a secção **«Introduzir ID manualmente»**: insira aí o
endereço completo do formulário ou a sequência de 24 caracteres no
seu final. Se a lista não carregar, a secção abre-se automaticamente.

## Pré-visualização

No ambiente de trabalho, tablet e telemóvel, a janela mostra o formulário real na
largura correspondente, com a configuração que estiver a definir nesse momento. O design
aparece então à direita, ao lado. Os botões «Enviar», «Repor» e «Your previous
submissions» estão desativados na pré-visualização; nada é enviado.

## Blocos de versões anteriores

Até à versão 0.1.0-rc.3, o formulário, a cor de destaque, a densidade e a marca de obrigatoriedade apareciam como
campos individuais na caixa de diálogo. Desde então, a janela guarda tudo num único campo
(`form-display-config`); os campos antigos estão ocultos, mas os seus valores
continuam a ser válidos.

- Um bloco antigo mantém o mesmo aspeto até que altere algo na janela e
  aplique as alterações. Abrir e aplicar sem alterações não grava nada.
- Ao abrir, a janela aplica o que consegue ler dos campos antigos.
  Os campos de seleção nem sempre podem ser lidos no Content Designer; nesse caso,
  nenhuma opção está selecionada e, por baixo, aparece **«Ainda não selecionado – até
  lá, aplica-se a configuração anterior do bloco.»** O bloco mantém esta
  configuração até que selecione uma opção.
