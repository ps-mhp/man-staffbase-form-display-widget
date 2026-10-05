# Exibição de Formulários

O visualizador de formulários traz um formulário existente da Staffbase para um
qualquer página. Os leitores podem preenchê-la e enviá-la diretamente para lá, 
sem mudar para a área de formulário — por exemplo, na página inicial, um
página de equipe ou página de ação. É exibido no CI MAN: angular
Campos, foco em azul, vermelho apenas para o botão de enviar, marcador de campo obrigatório
e mensagens de erro. 

## O que o widget faz — e o que não faz

Ele **exibe** um formulário que já está disponível no aplicativo Staffbase
é criado. Ele **não** cria um formulário e **não** edita perguntas. 
Perguntas, destinatários e avaliação permanecem completamente no formulário app; o
Widget é apenas uma segunda localização de saída. 

Isso significa: Primeiro crie o formulário no aplicativo de formulários e
, então insira o widget. 

## O que os leitores veem

- As questões da forma na ordem em que foram criadas, 
  com marcação obrigatória de campo e textos informativos. 
- A verificação só é realizada ao enviar; então o foco salta para o primeiro
  Falta de campo obrigatório. O rodapé conta campos obrigatórios abertos. 
- Uma vez enviada, a mensagem de agradecimento do aplicativo Forms substitui toda a mensagem
  forma. 
- Se você já respondeu e não pode responder novamente, verá o
  forma. 
- É "Permitir que usuários visualizem suas submissões anteriores" no aplicativo de formulários 
  ativado, há um botão "Suas submissões anteriores"; se você não estiver mais
  vê diretamente suas respostas anteriores. 

## Importante saber

- Se alguém pode enviar (novamente) é decidido pelo aplicativo de formulários — o widget
  Ela pergunta e segue. 
- As respostas são executadas normalmente para a avaliação do formulário app. Ele é criado
  Não há avaliação separada por página. 
- As perguntas aparecem no idioma que o aplicativo de formulário usa para o leitor
  pessoa; a interface do usuário do widget é em inglês.