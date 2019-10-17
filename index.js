const express = require('express');

const server = express();

server.use(express.json());

let projetos    = [];
let requisicoes = 0;

//middlewares
function checkProjetoIdExists(req, res, next) {
  const { id } = req.params;
  const index  = projetos.findIndex((projeto => projeto.id === id));

  if(index !== -1){
    return next();
  }

  res.status(400).json({ error: 'Projeto não cadastrado' });
};

function countProjetoReq(req, res, next) {
  requisicoes += 1;
  console.log(`Numero de requisições feitas no projeot: ${ requisicoes}`);

  return next();
}


//rotas 

// listagem de todos os projetos
server.get('/projects', countProjetoReq, (req, res) => {

  res.json(projetos);
});

// novo projeto
server.post('/projects', countProjetoReq, (req, res) => {

  projetos.push(req.body);

  res.json(projetos);
});

// editar projeto 
server.put('/projects/:id', countProjetoReq, checkProjetoIdExists, (req, res) => { 
  const { id }    = req.params;
  const { title } = req.body;

  projetos.map(projeto => {
    if(projeto.id === id){
      projeto.title = title;
    }
  });

  res.json(projetos);
});

// adicionar tasks
server.post('/projects/:id/tasks', countProjetoReq, checkProjetoIdExists, (req, res) =>{
  const { id }    = req.params;
  const { title } = req.body;

  projetos.find((projeto) => {
    if(projeto.id === id){
      projeto.tasks.push(title);
    }
  });

  res.json(projetos);

});

// deletar 
server.delete('/projects/:id', countProjetoReq, checkProjetoIdExists, (req, res) =>{
  const { id } = req.params;

  projetos = projetos.filter((projeto) =>{
    if(projeto.id !== id){
      return projeto;
    }
  })

  res.send();

});



server.listen(3000);