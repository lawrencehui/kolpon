Template.tableView.helpers({
  allCampaigns(){
    return Campaigns.find().fetch()
  },
  itemNo(index){
    return index+1
  },
  // discountInPercent(discount){
  //   return discount
  // },
  discountGiven(campaign){
    // console.log(this);
    let merchantId = this.merchantId
    return Coupons.find({merchantId, hasRedeemed: true}).count()
  },
  totalPosts(campaign){
    let merchantId = this.merchantId
    let locId = MerchantProfiles.findOne({merchantId: merchantId}).IgLocationId
    return Posts.find({'location.id': locId}).count()
  },
  getTotalLikes(campaign){
    // console.log(this);
    let merchantId = this.merchantId
    let locId = MerchantProfiles.findOne({merchantId: merchantId}).IgLocationId
    let allMerchantPosts = Posts.find({'location.id': locId}).fetch()
    console.log('allMerchantPosts', allMerchantPosts);
    let total = 0

    if(allMerchantPosts){
      for(let i=0; i<allMerchantPosts.length; i++){
        total = total + allMerchantPosts[i].likes
      }
      return total
    }
  },

});

Template.tableView.events({
  'click #add-campaign'(){
    Router.go('/add_campaign')
  },
  'click .fa-refresh'(){
    //active refresh from IG
    Meteor.call('fetchKolponTag')
  }
});
