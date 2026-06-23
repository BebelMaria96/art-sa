# Art Sã

> Um espaço diário e silencioso para a sua prática criativa.

**Art Sã** é um aplicativo web (PWA) gratuito para pessoas criativas (escritoras, desenhistas, pintoras, designers) cultivarem uma prática diária. Funciona offline, instala no celular e no computador, e guarda tudo apenas no seu aparelho.

## O que tem dentro

- **Hoje** · um painel sereno com a sua sequência de dias, a reflexão do dia e a semana atual.
- **Páginas Matinais** · um espaço de escrita livre para começar o dia, com salvamento automático.
- **Jornada** · uma trilha de 12 semanas de recuperação criativa, uma de cada vez, com tarefas e temas.
- **Sintonizar** · um baralho de reflexões contemplativas para uma pausa antes de criar.
- **Ferramentas** · Encontro com o Artista, Jardim de Ideias, Cronômetro de Foco e registro de Conquistas.

## Privacidade

Tudo é salvo apenas no seu navegador (`localStorage`). Não há login, não há servidor, nada sai do seu aparelho.

## Inspiração

A experiência é inspirada nos métodos de duas obras que amo, *O Ato Criativo*, de Rick Rubin, e *O Caminho do Artista*, de Julia Cameron. **Todo o conteúdo de texto é original**, escrito no espírito dessas ideias, sem reproduzir trechos dos livros. Se você gostou da prática, leia os dois livros: eles são a fonte.

## Tecnologia

HTML, CSS e JavaScript puro. Sem dependências, sem build. Um PWA com `manifest` e service worker para funcionar offline.

### Rodar localmente

```bash
python -m http.server 5378
```

Depois abra `http://localhost:5378`.

## Licença

Projeto gratuito, feito com carinho para a comunidade criativa.
