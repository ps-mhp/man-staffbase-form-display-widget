# Perguntas frequentes

**No widget do plugin, aparece um aviso vermelho em «Formulários» — porquê?**
É intencional. O widget do plugin Staffbase incorpora formulários como iframes com
altura fixa. Enquanto este widget estiver instalado, exibe esse aviso e remete
para «FormDisplay» — o formulário deve ser colocado diretamente na página, no MAN CI.

**O widget apresenta a mensagem «The form could not be loaded» — porquê?**
Na maioria das vezes, o formulário já não está publicado ou o ID remete para uma
instalação eliminada. Abra o formulário na aplicação de formulários e compare o ID com a
configuração do widget.

**Os leitores veem «You have already submitted this form».**
Esta é a regra de resposta única do formulário, não do widget. Se
são permitidas respostas múltiplas, isso é definido nas definições da aplicação de formulários
.

**Porque é que o meu formulário não aparece na lista de seleção?**
A lista mostra apenas formulários com direitos de administração e os últimos
100 alterados. Em ambos os casos, basta inserir o endereço do formulário no
campo.

**Todos os tipos de perguntas são suportados?**
Entrada de texto, texto em parágrafo, data, lista de seleção, seleção única e múltipla
são apresentados de forma nativa no MAN CI. Um tipo de pergunta desconhecido pelo widget
aparece como um campo de texto, para que a pergunta continue a poder ser respondida; o widget
não suporta, de momento, o envio de ficheiros.

**Em que idioma aparece o formulário?**
A aplicação de formulários já apresenta as perguntas no idioma da pessoa
que as lê. Os elementos de controlo do widget (enviar, mensagens de erro) estão
em inglês, tal como no widget de eventos.

**A resposta conta para a avaliação normal?**
Sim. O widget envia os dados para a mesma aplicação de formulários; os e-mails dos destinatários, os webhooks e
a lista de respostas funcionam da mesma forma que quando o formulário é preenchido na área de formulários.
