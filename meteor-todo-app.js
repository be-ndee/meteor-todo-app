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

    // Handler to check if tab is active
    Handlebars.registerHelper('isActive', function (title) {
        return Session.equals('selectedTab', title);
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
