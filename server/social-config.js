ServiceConfiguration.configurations.remove({
  service: 'instagram'
});
ServiceConfiguration.configurations.insert({
  service: 'instagram',
  scope: ['basic', 'public_content', 'likes'],
  clientId: '069d9871c44845eb97457863c34071c1',
  secret: 'c9353431c4214734bc4a9dae6aecc716'
});
