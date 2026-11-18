# Visualização do formulário

A visualização do formulário permite inserir um formulário existente do Staffbase em
qualquer página. Os leitores podem preenchê-lo e enviá-lo diretamente a partir daí,
sem terem de aceder à secção de formulários — por exemplo, na página inicial, numa
página de equipa ou numa página de ação. É apresentado no MAN CI: campos quadrados,
foco a azul, vermelho apenas para o botão de envio, marcadores de campos obrigatórios
e mensagens de erro.

## O que o widget faz — e o que não faz

Ele **exibe** um formulário que já está criado na aplicação de formulários da Staffbase.
Ele **não cria** formulários nem **edita** perguntas.
As perguntas, os destinatários e a análise permanecem inteiramente na aplicação de formulários; o
widget é apenas um segundo local de apresentação.

Daí decorre: primeiro, crie e publique o formulário na aplicação de formulários e,
depois, insira o widget.

## O que os leitores veem

- As perguntas do formulário na ordem em que foram criadas,
  com indicação dos campos obrigatórios e textos informativos.
- A verificação só é efetuada no momento do envio; depois disso, o foco passa para o primeiro
  campo obrigatório em falta. O rodapé indica o número de campos obrigatórios em falta.
- Após o envio, a mensagem de agradecimento da aplicação de formulários substitui todo o
  formulário.
- Quem já respondeu e não pode responder novamente vê, em vez do
  formulário, uma mensagem informativa correspondente.
- Se na aplicação de formulários estiver ativada a opção «Allow users to view their previous submissions»
  estiver ativada, existe um botão «Your previous submissions»; quem já não
  puder responder, vê diretamente as suas respostas anteriores.

## Importante saber

- É a aplicação de formulários que decide se alguém pode (novamente) enviar — o widget
  consulta-a e segue as suas indicações.
- As respostas são incluídas, como habitualmente, na análise do aplicativo de formulários. Não é criada
  uma análise separada por página.
- As perguntas aparecem no idioma que o aplicativo de formulários determina para a pessoa
  que as lê; a interface do widget está em inglês.
