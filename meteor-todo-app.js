if (Meteor.isClient) {
    Template.body.helpers({
        tabs: [
            { title: 'Done', opened: false },
            { title: 'Open', opened: true },
            { title: 'Closed', opened: false }
        ]
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    });
}
