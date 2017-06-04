let access_token = '13416120.069d987.6b7bd766bda74639ac5ce20178d8a376';
var fs = require('fs');
import {V1 as Client} from 'instagram-private-api'

let kolponUsername = 'kolponhk';
let kolponPw = 'Jarvis123!';

let device = new Client.Device(kolponUsername);
let storage = new Client.CookieFileStorage(Assets.absoluteFilePath('cookies/someuser.json'));

Meteor.methods({
  // fetchKolponTag_publicApi(){
  //   let tag = 'kolpon'
  //
  //   try {
  //     let result = HTTP.call('GET', `https://api.instagram.com/v1/tags/${tag}/media/recent?access_token=${access_token}`,
  //     {})
  //     console.log(result.data.data);
  //     return result.data.data
  //   } catch(e) {
  //     console.log(e);
  //     return false
  //   }
  // },

  // testing(){
  //   // https://api.instagram.com/v1/tags/{tag-name}?access_token=ACCESS-TOKEN
  //   let tag = 'ily'
  //   let media_id = '17845028185165874'
  //   try {
  //     // let result = HTTP.call('GET', `https://api.instagram.com/v1/tags/${tag}/media/recent?access_token=${access_token}`,
  //     let result = HTTP.call('GET', `https://api.instagram.com/v1/media/${media_id}?access_token=${access_token}`,
  //
  //     {
  //       // data: {
  //       //   messages,
  //       //   recipientId,
  //       //   senderId,
  //       //   pageAccessToken
  //       // }
  //     })
  //     console.log(result.data.data);
  //     return result.data.data
  //   } catch(e) {
  //     console.log(e);
  //     return false
  //   }
  // },
  'fetchKolponTag'(){
    let global_session;
    Client.Session.create(device, storage, kolponUsername, kolponPw)
      //seach for tags Ids
      // .then(function(session){
      //   global_session = session;
      //   return Client.Hashtag.search(session, 'startupcouple');
      // })
      .then(Meteor.bindEnvironment((session)=>{

        var feed = new Client.Feed.TaggedMedia(session, 'kolpon');

        feed.get().then(Meteor.bindEnvironment(function (res) {
          console.log(res) //should return [Media, ...];
          //  console.log(res[0].params) // should return media params...
          let posts = _.map(res, (item, key, list)=>{
            return item.params
          })

          console.log('all posts params', posts);
          let merchantProfiles = MerchantProfiles.find().fetch()
          console.log(merchantProfiles);

          //pluck
          let locIds = _.pluck(merchantProfiles, 'IgLocationId');
          console.log('locIds', locIds);

          for (let i=0; i<posts.length; i++){
            if(posts[i].location){
              console.log('media has location');
              if(_.contains(locIds, posts[i].location.id)){
                console.log('location tagged to one of our merchants');
                // relevant.push(posts[i])
                let $set = posts[i]
                $set["likes"] = posts[i].likeCount

                let campaign = Campaigns.findOne({IgLocationId: posts[i].location.id})
                $set["campaignOwnerId"] = campaign.merchantId;
                $set["threshold"] = campaign.threshold;
                if($set["likes"] >= $set["threshold"]){
                  $set["eligible"] = true
                } else {
                  $set["eligible"] = false
                }
                console.log('$set', $set);

                Posts.update({id: posts[i].id}, { $set }, {upsert: true});
              } else {
                console.log('location tag NOT related to our merchant');
              }
            } else {
              console.log('media has no location');
            }
          }
          //  let run = Meteor.call('processKolponTags', res)

           Meteor.call('checkForInfluencers')
        }));
      }))
  },
  checkForInfluencers(){
    let eligiblePosts = Posts.find({eligible: true, hasIssued: {$ne: true} }).fetch()
    console.log('checking for eligiblePosts...');
    console.log('eligiblePosts:', eligiblePosts);

    _.each(eligiblePosts, (item, key, list)=>{
      addNewCoupon(item)

    })
  },
  testCron(){
    console.log('running cron every 2 sec in methods');
  }
})


function addNewCoupon(post){
  let merchantProfiles = MerchantProfiles.findOne({merchantId: post.campaignOwnerId})
  let merchantName = merchantProfiles.name
  let merchantId = merchantProfiles.merchantId
  let discount = Campaigns.findOne({merchantId: post.campaignOwnerId}).discount
  let couponCode = makeid();
  let targetUser = post.account
  let targetIgId = targetUser.id

  console.log('adding coupon');
  let newCoupon = Coupons.insert({
    createdAt: moment().valueOf(),
    targetUser: targetUser,
    targetIgId: targetIgId,
    couponCode: couponCode,
    merchantName: merchantName,
    merchantId: merchantId,
    discount: discount,
    hasRedeemed: false
  });
  let result = Posts.update({_id: post._id}, {$set: {hasIssued: true} });
  console.log('Post hasIssued updated to false:', result);
  console.log('new coupon:', newCoupon);
  console.log('about to send coupon via IG');
  sendCouponToIgUser(couponCode, targetIgId, merchantName, discount)
}

function sendCouponToIgUser(couponCode, targetIgId, merchantName, discount){
  let message = `Hey, thanks for spreading out the word #KOLPON for ${merchantName}, they would like to reward you with a ${discount}% off discount for your next visit / purchase.\n\nPromo code: ${couponCode} \n\nKOLPON \n"Inspire & be inspired" \nhttp://kolpon.tech`

  Client.Session.create(device, storage, kolponUsername, kolponPw)
  //send message to Ig User
  .then((session)=>{
    //"13416120" Macy's userId
    Client.Thread.configureText(session, targetIgId, message);
  })
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
