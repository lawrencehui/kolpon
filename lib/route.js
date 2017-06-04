Router.configure({
  layoutTemplate: 'layout',
  // loadingTemplate: 'Loading',
  // notFoundTemplate: 'NotFound',
  // fastRender: true
});

Router.route("/campaign", {
  name: "tableView",
  template: "tableView",
  onBeforeAction: function(){
    console.log('in onBeforeAction');
    if(!Meteor.userId()){
      this.redirect("/");
    } else {
      this.next();
    }
  }
})

Router.route("/add_campaign", {
  name: "addCampaignView",
  template: "addCampaignView"
})

Router.route("/", {
  name: "home",
  template: "login",
  onBeforeAction: function(){
    console.log('in onBeforeAction');
    if(Meteor.userId()){
      this.redirect("/campaign");
    }else{
      this.redirect("/");
    }
  }
})

Router.route("/login", {
  name: "login",
  template: "login"
})
