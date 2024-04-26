
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
    const movies = await fetchMoviesData();
    const graph = {};
  
    movies.forEach(movie => {
      const cast = movie.cast;
  
      cast.forEach(actor => {
        if (!graph[actor]) {
          graph[actor] = [];
        }
        graph[actor].push(movie.title);
      });
    });
  
    return graph;
  }
  
 
  function bfs(graph, startActor, endActor) {
    const queue = [[startActor, [startActor]]];
    const visited = new Set([startActor]);
  
    while (queue.length > 0) {
      const [currentActor, path] = queue.shift();
  
      if (currentActor === endActor) {
        return path;
      }
  
      graph[currentActor].forEach(movie => {
        if (!visited.has(movie)) {
          visited.add(movie);
          queue.push([movie, [...path, movie]]);
        }
      });
    }
  
    return null; 
  }
  