# comportamento homepage:

- [ ] navegar para ultimo espisódio presente na localstorage com o parametro "search" no url caso existam dados do mesmo no localstorage

# comportamento pagina series:

adicionar botão para avançar para o próximo episódio

- [ ] mapear episodios vistos/nao vistos
- [ ] verificar se a série está marcada como "seguir"
- [ ] atualizar localstorage
- [ ] verificar se existe o parametro "search" no url
  - [ ] navegar para epsodio correto se necessário
  - [ ] navegar para a temporada correta se necessário
  - [ ] fazer "scrollIntoView" do player
  - [ ] limpar param do url
- [ ] identificar qual episodio o utilizador está a marcar como visto
- [ ] interceptar quando utilizador marca ou desmarca um episodio como visto
- [ ] ao marcar episódio como visto, marcar série como "seguir" caso não esteja
- [ ] ao marcar o último espisódio da ultima temporada como visto desmarcar "seguir" e "ver depois" e marcar "favorito" caso não esteja.
- [ ] tentar marcar episodio como visto programaticamente
