Template.addCampaignView.events({
  'click #add-campaign'(event, instance) {
    event.preventDefault();
    console.log('adding new campaign');

    let percentage = $('#percentageInput').val();
    let threshold = $('#rewardThreshold').val()

    if(percentage && threshold) {
      let campaign = {
        discount: parseInt(percentage),
        threshold: parseInt(threshold),
        createAt: moment().valueOf(),
        merchantId: Meteor.userId(),
        IgLocationId: MerchantProfiles.findOne({merchantId: Meteor.userId()}).IgLocationId,
        status: "active"
      }

      Campaigns.insert(campaign)
      console.log('new campaign created');
      Router.go('/campaign')
    } else {
      alert('You must enter a value for both!')
    }

  },
  'click #cancel-btn'(){
    Router.go('/campaign')
  }
});
