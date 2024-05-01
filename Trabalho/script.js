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
    const tree = [];

    movies.forEach(movie => {
      const root = { title: movie.title, actor: movie.cast[0], left: null, right: null };

      movie.cast.slice(1).forEach(actor => {
        insertActor(root, actor);
      });

      tree.push(root);
    });
    console.log(tree);

    return tree;
  } catch (error) {
    console.error('Erro ao construir as árvores:', error);
    return [];
  }
}

function insertActor(node, actor) {
  if (!node.left) {
    node.left = { actor, left: null, right: null };
  } else if (!node.right) {
    node.right = { actor, left: null, right: null };
  } else {
    if (Math.random() < 0.5) {
      insertActor(node.left, actor);
    } else {
      insertActor(node.right, actor);
    }
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
    const tree = await buildGraph();
    let modalBodyContent = '';
    
    let sameTree = false;
    let treeIndex = -1;
    tree.forEach((root, index) => {
      if (findActor(root, actor1) && findActor(root, actor2)) {
        sameTree = true;
        treeIndex = index;
      }
    });

    if (!sameTree) {
      modalBodyContent = '<p>Os atores não estão no mesmo filme.</p>';
    } else {
      const paths = bfs(tree[treeIndex], actor1, actor2);
      
      if (paths.length > 0) {
        modalBodyContent = '<p>Caminhos encontrados:</p>';
        paths.forEach(path => {
          modalBodyContent += `<p>${path.join(' -> ')}</p>`;
        });
      } else {
        modalBodyContent = '<p>Não foi encontrado um caminho entre os atores selecionados.</p>';
      }
    }

    document.getElementById('result').innerHTML = modalBodyContent;
    document.getElementById('myModal').style.display = 'block';
  } catch (error) {
    console.error('Erro ao encontrar o caminho mínimo:', error);
  }
}

function findActor(node, actor) {
  if (!node) return false;
  if (node.actor === actor) return true;
  return findActor(node.left, actor) || findActor(node.right, actor);
}


function fecharModal() {
  document.getElementById('myModal').style.display = 'none';
}

function bfs(root, startActor, endActor) {
  const queue = [[root, [startActor]]];
  const paths = [];

  while (queue.length > 0) {
    const [node, path] = queue.shift();

    console.log(path);

    if (node.actor === endActor) {
      paths.push(path);
      return paths;
    }

    if (node.left) {
      queue.push([node.left, [...path, node.left.actor]]);
    }

    if (node.right) {
      queue.push([node.right, [...path, node.right.actor]]);
    }
  }
}

async function findSixDegreesOfSeparation() {
  const actor1 = document.getElementById('actor1').value.trim();
  const actor2 = document.getElementById('actor2').value.trim();

  if (actor1 === '' || actor2 === '') {
    alert('Por favor, insira o nome do ator de origem e do ator de destino.');
    return;
  }

  try {
    const tree = await buildGraph();
    let modalBodyContent = '';

    let sameTree = false;
    let treeIndex = -1;
    tree.forEach((root, index) => {
      if (findActor(root, actor1) && findActor(root, actor2)) {
        sameTree = true;
        treeIndex = index;
      }
    });

    if (!sameTree) {
      modalBodyContent = '<p>Os atores não estão no mesmo filme.</p>';
    } else {
      const paths = bfs(tree[treeIndex], actor1, actor2);
      
      if (paths.length > 0) {
        modalBodyContent = '<p>Caminhos encontrados:</p>';
        paths.forEach(path => {
          modalBodyContent += `<p>${path.join(' -> ')}</p>`;
        });
      } else {
        modalBodyContent = '<p>Não foi encontrado um caminho entre os atores selecionados.</p>';
      }
    }

    document.getElementById('result').innerHTML = modalBodyContent;
    document.getElementById('myModal').style.display = 'block';
  } catch (error) {
    console.error('Erro ao encontrar o caminho mínimo:', error);
  }
}
