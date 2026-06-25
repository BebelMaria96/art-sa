/* ============================================================
   Art Sã - conteúdo
   Texto 100% original, escrito no espírito dos métodos.
   Nada aqui é citação literal dos livros.
   ============================================================ */

const DATA = {

  /* ---------- JORNADA: 12 semanas, 7 dias cada ----------
     Cada semana tem 7 tarefas, uma por dia. As Páginas
     Matinais são a prática diária, feita todos os dias,
     à parte das 7 tarefas.                                   */
  weeks: [
    {
      n: 1, theme: "Segurança",
      essence: "Criar um lugar seguro dentro de você para a criatividade voltar.",
      intro: "Toda prática começa com permissão. Antes de qualquer obra, é preciso um chão firme, um espaço onde a pessoa criativa em você se sinta livre para errar, brincar e recomeçar. Esta semana é sobre baixar a guarda e reabrir a porta.",
      days: [
        "Liste três coisas que disseram sobre o seu talento e que ainda doem. Responda a cada uma com carinho.",
        "Descreva um lugar, real ou imaginado, onde você se sente segura para criar.",
        "Termine, sem pensar: 'Se não fosse arriscado, eu criaria…'.",
        "Identifique a voz crítica da sua cabeça e descreva de quem ela é a cópia.",
        "Crie algo pequeno e propositalmente imperfeito, só seu.",
        "Escreva uma autorização sua: 'Eu me permito criar mesmo sem…'.",
        "Encontro com o Artista: faça um passeio pequeno e só seu."
      ]
    },
    {
      n: 2, theme: "Identidade",
      essence: "Lembrar quem você é quando ninguém está olhando.",
      intro: "Aos poucos a gente troca o que ama pelo que é aceitável. Esta semana é um exercício de memória: recuperar os gostos, as manias e as curiosidades que são genuinamente suas, antes das opiniões alheias entrarem na sala.",
      days: [
        "Liste cinco interesses 'inúteis' que te dão prazer e que você largou.",
        "Descreva você aos dez anos: o que ela criava sem medo?",
        "Escolha uma cor, uma música e um cheiro que são a sua cara hoje.",
        "Note uma pessoa que drena sua energia criativa, sem julgar o padrão.",
        "Retome por 15 minutos um gosto antigo que você abandonou.",
        "Escreva sobre uma obra que te deu vontade de criar.",
        "Encontro com o Artista: vá a um lugar que te lembra quem você é."
      ]
    },
    {
      n: 3, theme: "Poder",
      essence: "Reconhecer a raiva e a inveja como bússolas, não como inimigas.",
      intro: "Raiva mostra fronteiras. Inveja aponta desejos. Esta semana convida você a parar de empurrar essas emoções para baixo do tapete e começar a lê-las como mapas do que você realmente quer fazer.",
      days: [
        "Complete: 'Tenho inveja de quem…' e veja que desejo seu mora ali.",
        "Escreva uma carta, que não vai enviar, a alguém que duvidou de você.",
        "Recupere um sonho criativo antigo e dê um primeiro passo de 10 minutos.",
        "Anote uma vez em que a raiva te mostrou um limite importante.",
        "Liste o que você faria se tivesse certeza de que ninguém criticaria.",
        "Faça algo com a sua assinatura, do seu jeito, sem pedir licença.",
        "Encontro com o Artista: escolha um programa que te dá energia."
      ]
    },
    {
      n: 4, theme: "Integridade",
      essence: "Alinhar o que você faz com o que você sente ser verdadeiro.",
      intro: "Esta é a semana do silêncio escolhido. Ao reduzir o ruído de fora, fica mais fácil ouvir o que é seu. Pode incomodar, e é justamente o desconforto que mostra onde você andava se traindo.",
      days: [
        "Comece um 'jejum de leitura': menos feed, menos rolagem, por um dia.",
        "Note onde, hoje, você diz 'sim' querendo dizer 'não'.",
        "Descreva como seria um dia vivido inteiramente do seu jeito.",
        "Escolha um objeto que represente a sua verdade criativa e deixe à vista.",
        "Escreva o que muda em você depois de muito tempo de tela.",
        "Tire 20 minutos de silêncio total e anote o que surgiu.",
        "Encontro com o Artista: faça algo em silêncio, sem registrar nas redes."
      ]
    },
    {
      n: 5, theme: "Possibilidade",
      essence: "Abrir espaço para que o inesperado possa acontecer.",
      intro: "Muita gente trava não por falta de talento, mas por excesso de controle. Esta semana é sobre afrouxar as mãos: deixar a obra te surpreender em vez de obrigá-la a obedecer.",
      days: [
        "Descreva seu projeto dos sonhos como se dinheiro e medo não existissem.",
        "Monte um pequeno canto ou altar dedicado só à sua criação.",
        "Faça algo do seu ofício de um jeito propositalmente 'errado'.",
        "Liste limites que você trata como definitivos e questione um deles.",
        "Escreva dez ideias ruins de propósito, rápido, sem filtrar.",
        "Experimente um material ou ferramenta que você nunca usou.",
        "Encontro com o Artista: explore um lugar novo sem destino fixo."
      ]
    },
    {
      n: 6, theme: "Abundância",
      essence: "Trocar a mentalidade de escassez por generosidade.",
      intro: "A criatividade não acaba quando você usa: ela cresce. Esta semana é sobre a relação entre dinheiro, prazer e merecimento, e sobre se permitir receber sem culpa o que nutre a sua arte.",
      days: [
        "Anote sua reação emocional ao gastar com a sua criatividade.",
        "Dê a si mesma algo pequeno e prazeroso que você costuma negar.",
        "Liste cinco coisas gratuitas que enchem o seu tanque criativo.",
        "Note onde você diz 'não tenho tempo' querendo dizer 'não me priorizo'.",
        "Agradeça, por escrito, a três recursos criativos que você já tem.",
        "Gaste 30 minutos só brincando, sem nenhuma meta de resultado.",
        "Encontro com o Artista: visite um lugar farto de cor, som ou sabor."
      ]
    },
    {
      n: 7, theme: "Conexão",
      essence: "Voltar a ouvir antes de tentar controlar o resultado.",
      intro: "Criar é mais escutar do que forçar. Esta semana convida você a sair do modo 'fabricar' e entrar no modo 'receber', confiando que ideias chegam quando há espaço e atenção.",
      days: [
        "Pratique 10 minutos de ócio atento, sem tela, só observando.",
        "Faça um esboço rápido sem nenhuma intenção de que fique bom.",
        "Dê um nome bobo à sua crítica interna mais recorrente.",
        "Capte três sementes de ideia no Jardim de Ideias, sem julgar.",
        "Escute uma pessoa ou um som com atenção total por alguns minutos.",
        "Crie a partir de algo que você recebeu hoje, não inventou.",
        "Encontro com o Artista: vá a um lugar onde possa só observar."
      ]
    },
    {
      n: 8, theme: "Força",
      essence: "Atravessar perdas e recomeços sem abandonar a prática.",
      intro: "Todo caminho criativo tem reveses. Esta semana é sobre resiliência: sustentar a prática mesmo quando ela não está 'rendendo', e entender que persistir é, em si, talento.",
      days: [
        "Escreva sobre um projeto que você abandonou e o que aprendeu.",
        "Retome 15 minutos de algo largado, sem pressão de terminar.",
        "Liste três vezes em que você continuou apesar do medo.",
        "Defina o menor passo possível para amanhã. Pequeno de propósito.",
        "Escreva uma carta de incentivo da sua versão mais forte para hoje.",
        "Faça uma coisa difícil por só cinco minutos e pare por aí.",
        "Encontro com o Artista: faça algo que te faz sentir capaz."
      ]
    },
    {
      n: 9, theme: "Compaixão",
      essence: "Tratar o seu bloqueio com gentileza em vez de chicote.",
      intro: "Bloqueio quase nunca é preguiça. Costuma ser medo. Esta semana troca a cobrança pela compaixão, porque ninguém floresce sob ameaça. Inclusive você.",
      days: [
        "Escreva para você como escreveria para um amigo travado.",
        "Identifique o medo por trás de um adiamento recente.",
        "Faça algo 'mal feito' de propósito, só pra quebrar o gelo.",
        "Perdoe-se, por escrito, por uma obra que você nunca terminou.",
        "Liste três gentilezas que você faria por um artista iniciante.",
        "Crie algo lento hoje, no ritmo do cuidado, sem pressa.",
        "Encontro com o Artista: faça um programa que te acalma."
      ]
    },
    {
      n: 10, theme: "Autoproteção",
      essence: "Cuidar da chama para que ela não seja apagada por dentro ou por fora.",
      intro: "Existem formas de sabotar a própria criatividade: excesso de trabalho, comparação, pressa. Esta semana é sobre reconhecer seus venenos preferidos e construir defesas gentis contra eles.",
      days: [
        "Liste seus 'venenos' criativos (comparação, pressa, perfeccionismo…).",
        "Escolha uma fronteira para proteger seu tempo de criar e teste-a.",
        "Note como você se sente depois de muito tempo de tela.",
        "Crie um pequeno ritual de início para entrar no estado de criar.",
        "Diga 'não' a uma demanda que rouba seu tempo de criar.",
        "Identifique o que apaga a sua chama e planeje uma defesa gentil.",
        "Encontro com o Artista: vá a um lugar que te recarrega de verdade."
      ]
    },
    {
      n: 11, theme: "Autonomia",
      essence: "Sustentar a prática como parte de quem você é, sem depender de aplauso.",
      intro: "Esta semana é sobre maturidade criativa: criar pelo prazer e pela necessidade, e não pela aprovação. Quando a prática vira identidade, ela para de pedir permissão.",
      days: [
        "Defina como seria a sua prática se ninguém nunca a visse.",
        "Comemore, por escrito, um progresso que você costuma minimizar.",
        "Estabeleça um ritmo realista de criação para as próximas semanas.",
        "Crie algo só pelo prazer, sem mostrar a ninguém.",
        "Escreva o que a sua criação te dá, mesmo sem aplauso.",
        "Escolha um próximo projeto que seja seu, não dos outros.",
        "Encontro com o Artista: faça um programa que é a sua cara."
      ]
    },
    {
      n: 12, theme: "Confiança",
      essence: "Dar o salto: confiar no processo mais do que na garantia.",
      intro: "Você chegou ao fim do começo. Esta semana não fecha um ciclo: abre uma vida criativa. É sobre confiar que, ao aparecer todo dia, o caminho aparece junto. A arte fica inevitável.",
      days: [
        "Escreva uma carta da sua versão futura, já vivendo de forma criativa.",
        "Defina o primeiro projeto que você vai começar 'de verdade'.",
        "Releia as Páginas Matinais que se sentir à vontade para reler.",
        "Liste o que mudou em você nestas doze semanas.",
        "Escreva a frase que você quer levar daqui pra frente.",
        "Dê o primeiro passo concreto do seu próximo projeto, hoje.",
        "Encontro com o Artista: comprometa-se com o próximo. O caminho continua."
      ]
    }
  ],

  /* ---------- SINTONIZAR: reflexões no espírito contemplativo ---------- */
  tune: [
    { k: "Sintonizar", t: "Você já é uma antena",
      b: "Antes de produzir qualquer coisa, você está recebendo o tempo inteiro. Cores, conversas, o jeito da luz às cinco da tarde. Criar é, antes de tudo, prestar atenção, e quase ninguém presta.",
      p: "<b>Prática:</b> hoje, capte uma coisa que normalmente passaria batido. Anote em uma linha." },
    { k: "Sintonizar", t: "O vaso e o filtro",
      b: "Nada é totalmente inventado por nós. Tudo o que entrou em você vira matéria-prima: o que leu, o que ouviu, o que amou e o que perdeu. A sua voz não é o que você cria do nada; é o seu filtro particular do mundo.",
      p: "<b>Prática:</b> liste três obras que te formaram. O que elas têm em comum diz algo sobre você." },
    { k: "Sintonizar", t: "Mente de principiante",
      b: "O especialista vê o que espera ver. O principiante vê o que está ali. Quando você esquece o que 'deveria' funcionar, volta a enxergar possibilidades que a experiência tinha escondido.",
      p: "<b>Prática:</b> hoje, faça uma coisa do seu ofício como se fosse a primeira vez." },
    { k: "Sintonizar", t: "Sementes",
      b: "No início, uma ideia não precisa ser boa. Precisa só existir. Junte sementes sem julgar. A maioria não vai vingar, e tudo bem. Você só precisa de algumas para um jardim.",
      p: "<b>Prática:</b> jogue cinco sementes no Jardim de Ideias. Não avalie nenhuma." },
    { k: "Sintonizar", t: "Faça pelo processo",
      b: "Se a obra só vale pelo resultado, cada gesto vira ansiedade. Mas se o ponto é o estado em que você entra ao criar, então você já ganhou no momento em que começou.",
      p: "<b>Prática:</b> hoje, crie dez minutos sem nenhum objetivo de resultado." },
    { k: "Sintonizar", t: "A autodúvida não manda",
      b: "A dúvida vai aparecer em todo artista, em toda obra. Ela não é sinal de que você é fraco; é sinal de que aquilo importa. Você pode duvidar e mesmo assim continuar. As duas coisas cabem.",
      p: "<b>Prática:</b> dê um passo hoje carregando a dúvida junto, sem esperar ela passar." },
    { k: "Sintonizar", t: "Deixar ir",
      b: "Em algum momento, agarrar a obra passa a sufocá-la. Saber soltar costuma ser o que liberta: uma ideia querida, uma versão antiga, a vontade de controlar tudo. É soltando que a coisa vira o que ela queria ser.",
      p: "<b>Prática:</b> abra mão de uma 'ideia preciosa' hoje e veja o que aparece no lugar." },
    { k: "Sintonizar", t: "O silêncio é parte do trabalho",
      b: "O espaço vazio não é tempo perdido. É onde a próxima coisa se forma. Encha cada minuto e você não deixa lugar para nada novo chegar.",
      p: "<b>Prática:</b> reserve quinze minutos de tédio de propósito. Sem tela." },
    { k: "Sintonizar", t: "Experimentar é o método",
      b: "Você não descobre o que funciona pensando. Descobre tentando. Trate cada obra como um experimento, não como um veredito sobre o seu valor. Aí dá pra arriscar de verdade.",
      p: "<b>Prática:</b> hoje, teste uma versão 'errada' do que você ia fazer." },
    { k: "Sintonizar", t: "A obra termina, você não",
      b: "Nenhuma obra carrega tudo o que você é. Ela é um instante seu, não a sua sentença. Por isso pode terminar imperfeita: virá outra, e outra. A prática é maior que qualquer peça.",
      p: "<b>Prática:</b> termine (ou abandone) algo hoje, mesmo imperfeito. Solte." }
  ],

  /* ---------- ENCONTRO COM O ARTISTA: sugestões ---------- */
  artistDates: [
    "Vá sozinho a um lugar que você sempre quis conhecer e não foi.",
    "Compre lápis de cor e rabisque sem objetivo nenhum.",
    "Passe uma hora numa livraria ou sebo só folheando o que te chamar.",
    "Caminhe por um bairro diferente prestando atenção nas texturas.",
    "Visite um museu, galeria ou feira de arte sozinho, no seu ritmo.",
    "Cozinhe algo novo tratando a receita como um experimento.",
    "Vá a uma loja de materiais de arte e toque em tudo.",
    "Ouça um álbum inteiro, deitado, sem fazer mais nada.",
    "Fotografe dez detalhes que ninguém repara no seu caminho de sempre.",
    "Sente num parque e desenhe (mal) as pessoas que passam."
  ],

  /* ---------- DEIXA: âncoras sugeridas (habit stacking) ---------- */
  cueSuggestions: [
    "tomar o café da manhã",
    "acordar e me espreguiçar",
    "escovar os dentes",
    "preparar meu chá ou café",
    "sentar na minha mesa",
    "chegar do trabalho",
    "colocar os fones de ouvido"
  ],

  /* ---------- REGRA DE OURO: trocar um hábito (4 passos do livro) ---------- */
  golden: [
    { t: "1. Identifique a rotina",
      h: "Qual é o hábito que rouba o seu tempo de criar? Descreva o que você faz no automático.",
      ph: "ex: abro o celular e rolo o feed em vez de desenhar" },
    { t: "2. Experimente com recompensas",
      h: "O que você realmente busca ali? Distração? Descanso? Alívio da ansiedade? Anote a sua suspeita.",
      ph: "ex: na verdade quero uma pausa da cobrança" },
    { t: "3. Isole a deixa",
      h: "O que dispara a rotina? Geralmente é um destes: horário, lugar, emoção, outras pessoas ou a ação anterior.",
      ph: "ex: acontece sempre quando sento pra começar e bate o medo" },
    { t: "4. Tenha um plano",
      h: "Monte um 'quando isto, então aquilo': mantenha a mesma deixa e recompensa, troque só a rotina.",
      ph: "ex: quando bater o medo de começar, escrevo uma linha ruim de propósito" }
  ]
};
