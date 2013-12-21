/**
 * Use this file to mock out your production api server during development
 *
 * TODO: when your server stablizes use these routes in a production api server
 * and enable the api passthrough via --- todo ---
 */

 var todo1 = {
   "id": 1,
   "title": "Make a mock server",
   "completed": true
 };

 var todo2 = {
   "id": 2,
   "title": "Dont use mock-server cause its not newb friendly",
   "completed": true
 };

var todos = [todo1, todo2];

module.exports = function (server) {
  server.namespace('/api', function () {

    server.get('/todos', function (req, res) {
      res.send(todos);
    });

    server.get('/todos/:id', function (req, res) {
      res.send(todos[req.params.id-1]);
    });

    server.put('/todos/:id', function (req, res) {
      var todo = todos[req.params.id-1];
      todo.completed = req.body.completed;
      console.log("the todo is now ", todo);
      res.send(todo);
    });

  });
};