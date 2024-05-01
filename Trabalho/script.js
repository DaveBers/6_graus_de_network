async function fetchMoviesData() {
  try {
    const response = await fetch('latest_movies.json');
    const movies = await response.json();
    return movies;
  } catch (error) {
    console.error('Erro ao carregar dados dos filmes:', error);
    return [];
  }
}

async function buildGraph() {
  try {
    const movies = await fetchMoviesData();
    const graph = {};

    movies.forEach(movie => {
      const cast = movie.cast;

      cast.forEach(actor => {
        if (!graph[actor]) {
          graph[actor] = [];
        }
        graph[actor].push(movie);
      });
    });

    return graph;
  } catch (error) {
    console.error('Erro ao construir o grafo:', error);
    return {}; 
  }
}

async function findShortestPath() {
  const actor1 = document.getElementById('actor1').value.trim();
  const actor2 = document.getElementById('actor2').value.trim();

  if (actor1 === '' || actor2 === '') {
    alert('Por favor, insira o nome do ator de origem e do ator de destino.');
    return;
  }

  try {
    const graph = await buildGraph();

    if (!graph) {
      console.error('O objeto graph é indefinido ou inválido.');
      return;
    }

    const paths = bfs(graph, actor1, actor2);

    if (paths.length > 0) {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<p>Caminhos encontrados:</p>';
      paths.forEach(path => {
        resultDiv.innerHTML += `<p>${path.join(' -> ')}</p>`;
      });
    } else {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<p>Não foi encontrado um caminho entre os atores selecionados.</p>';
    }
  } catch (error) {
    console.error('Erro ao encontrar o caminho mínimo:', error);
  }
}

function bfs(graph, startActor, endActor) {
  const queue = [[startActor, [startActor]]];
  const paths = []; 
  const visited = new Set();

  while (queue.length > 0) {
    const [currentActor, path] = queue.shift();

    if (currentActor === endActor) {
      paths.push(path.map(item => item.title));
      continue;
    }

    const movies = graph[currentActor];

    if (movies && Array.isArray(movies)) {
      movies.forEach(movie => {
        movie.cast.forEach(actor => {
          if (!visited.has(actor)) {
            visited.add(actor);
            queue.push([actor, [...path, movie]]);
          }
        });
      });
    }
  }

  return paths;
}

async function findSixDegreesOfSeparation() {
  const actor1 = document.getElementById('actor1').value.trim();
  const actor2 = document.getElementById('actor2').value.trim();

  if (actor1 === '' || actor2 === '') {
    alert('Por favor, insira o nome do ator de origem e do ator de destino.');
    return;
  }

  try {
    const graph = await buildGraph();
    const paths = bfs(graph, actor1, actor2);

    if (paths.length > 0) {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<p>Relacionamentos com até 6 graus de separação:</p>';
      paths.forEach(path => {
        resultDiv.innerHTML += `<p>${path.join(' -> ')}</p>`;
      });
    } else {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<p>Não foram encontrados relacionamentos com até 6 graus de separação.</p>';
    }
  } catch (error) {
    console.error('Erro ao encontrar relacionamentos com até 6 graus de separação:', error);
  }
}
