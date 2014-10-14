// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {

    Template.leaderboard.helpers({
      selected_name : function () {
          var player = Players.findOne(Session.get("selected_player"));
          return player && player.name;
      },

      showAutosuggest : function () {
          return Session.get('showAutosuggest');
      },

      suggestionTpl : function () {
          return Template.suggestion;
      }
    });

    Template.leaderboard.events({
        'click .inc' : function () {
            var player = Session.get('selected_player');

            if (!player) {
                return;
            }

            Players.update(Session.get('selected_player'), { $inc: { score : 5 } });
        },
        'click .show-autosuggest' : function (e) {
            Session.set('showAutosuggest', !Session.get('showAutosuggest'));

            e.preventDefault();
        }
    });

    Template.player.helpers({
      selected : function () {
          return Session.equals("selected_player", this._id) ? "selected" : '';
      }
    });

    Template.player.events({
        'click': function () {
            Session.set("selected_player", this._id);
        }
    });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
    Meteor.startup(function () {
        var first_names = ["Ada",
        "Grace",
        "Marie",
        "Carl",
        "Nikola",
        "Claude",
        "Peter",
        "Stefan",
        "Stephen",
        "Lisa"],
        last_names = ["Lovelace",
        "Hopper",
        "Curie",
        "Tesla",
        "Shannon",
        "Müller",
        "Meier",
        "Miller",
        "Gaga",
        "Franklin"];

        Players.remove({ });

        for (var i = 0; i < 30; i++) {
            Players.insert({
                name: (first_names[Math.floor(Math.random() * 10)] + ' ' + last_names[Math.floor(Math.random() * 10)]),
                score: Math.floor(Random.fraction()*10)*5
            });
        }
    });
}

// on Client and Server
EasySearch.createSearchIndex('players', {
  'collection'    : Players,              // instanceof Meteor.Collection
  'field'         : ['name', 'score'],    // can also be an array of fields
  'limit'         : 20,                   // default: 10
  'convertNumbers': true,
  'sort'          : function () {
    return { 'score' : -1 };
  }
});
