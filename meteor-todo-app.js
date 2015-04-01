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
        'click': function () {
            Session.set('selectedTab', this.title);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    });
}
