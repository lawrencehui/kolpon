
Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {

    Meteor.loginWithInstagram(function (err) {
      if (err) {
        console.log('login failed', err);
      } else {
        console.log('login success', Meteor.user());
      }
    });
  },
  'click #test'(){
    console.log('test btn clicked');

  }
});
