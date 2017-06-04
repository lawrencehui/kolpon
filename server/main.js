import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  SyncedCron.add({
    name: 'Testing Cron Meteor Call',
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.text('every 10 seconds');
    },
    job: function() {
      // var numbersCrunched = CrushSomeNumbers();
      // return numbersCrunched;
      Meteor.call('fetchKolponTag');
    }

  });
  SyncedCron.start();
});
