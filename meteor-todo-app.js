Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
    Session.set('tabs', [
        { title: 'Done' },
        { title: 'Open' },
        { title: 'Closed' }
    ]);
    Session.set('selectedTab', 'Open');

    // Body helpers
    Template.body.helpers({
        // available tabs
        tabs: function () {
            return Session.get('tabs');
        }
    });

    // Check if the tab is active
    Handlebars.registerHelper('isActive', function (title) {
        return Session.equals('selectedTab', title);
    });

    // Get todos by their status
    Handlebars.registerHelper('getTodos', function (status) {
        return Todos.find({ status: status });
    });

    // Events on tabRider
    Template.tabRider.events({
        // select a tab
        'click': function () {
            Session.set('selectedTab', this.title);
        }
    });

    // Todo helpers
    Template.todo.helpers({
        // Return true if the todo is open
        isOpen: function () {
            return this.status == 'Open';
        }
    });

    // Todo events
    Template.todo.events({
        // Close a todo
        'click .todo-item-control.close-todo': function () {
            Todos.update(this._id, { $set: { status: 'Closed' } });
        },
        // Do a todo
        'click .todo-item-control.do-todo': function () {
            Todos.update(this._id, { $set: { status: 'Done' } });
        }
    });

    // Events in createTodo
    Template.createTodo.events({
        // create new todo
        'submit form': function (event) {
            var todoText = event.target.text.value;
            Todos.insert({ text: todoText, status: 'Open'});
            event.target.text.value = '';
            return false;
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    });

    HTTP.methods({
        '/api/todos/:todoId': function() {
            // define return data
            var returnData = {
                success: true
            };
            var falseId = 'Todo-Object with given ID does not exist.';
            // fetch method
            var method = this.method;
            // fetch todo by id
            var id = this.params.todoId;
            var todo = Todos.findOne(id);

            switch (method) {
                case 'GET':
                    // fetch and return one todo
                    if (todo) {
                        returnData['todo'] = todo;
                    } else {
                        returnData['success'] = false;
                        returnData['message'] = falseId;
                    }
                    break;
                case 'POST':
                    // update todo
                    if (todo) {
                        var data = {};
                        if (this.query.text) {
                            data['text'] = this.query.text;
                        }
                        if (this.query.status) {
                            data['status'] = this.query.status
                        }
                        if (Object.keys(data).length > 0) {
                            Todos.update(todo._id, { $set: data });
                        }
                    } else {
                        returnData['success'] = false;
                        returnData['message'] = falseId;
                    }
                    break;
                case 'PUT':
                    // insert todo
                    Todos.insert({
                        text: this.query.text,
                        status: this.query.status
                    });
                    break;
                case 'DELETE':
                    // delete todo
                    if (todo) {
                        Todos.remove(todo._id);
                    } else {
                        returnData['success'] = false;
                        returnData['message'] = falseId;
                    }
                    break;
            }
            return JSON.stringify(returnData);
        }
    });
}
