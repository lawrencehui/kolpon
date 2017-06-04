Template.nav.events({
  'click .signout-btn'(){
    Meteor.logout((err)=>{
      console.log(err);
      Router.go('/')
    })
  },
});
