var querystring = Npm.require('querystring');

Bitbucket = {};

var urls = {
  requestToken: "https://bitbucket.org/api/1.0/oauth/request_token",
  accessToken: "https://bitbucket.org/api/1.0/oauth/access_token",
  authenticate: function(oauthBinding){
    var params = {}

    params['oauth_token'] = oauthBinding.requestToken;

    return "https://bitbucket.org/api/1.0/oauth/authenticate?" + querystring.stringify(params);
  }
};

Oauth.registerService('bitbucket', 1, urls, function(oauthBinding) {

  /* 
   * Couple of notes
   * =================
   * 1) Bitbucket does not provide an 'id'
   * 2) There is no API 2 endpoint that gets us data on the current user
   *
   */

  var initialRequest = oauthBinding.get('https://bitbucket.org/api/1.0/user').data;

  var username = initialRequest.user.username;

  var identity = oauthBinding.get('https://bitbucket.org/api/2.0/users/' + username).data;

  var serviceData = {
    id: identity.username,
    username: identity.username,
    kind: identity.kind,
    website: identity.website,
    first_name: initialRequest.user.first_name,
    last_name: initialRequest.user.last_name,
    display_name: identity.display_name,
    created_on: identity.created_on,
    avatar: identity.links.avatar.href,
    location: identity.location,
    accessToken: oauthBinding.accessToken,
    accessTokenSecret: oauthBinding.accessTokenSecret
  };

  return {
    serviceData: serviceData,
    options: {
      profile: {
        name: identity.display_name,
        avatar: serviceData.avatar
      }
    }
  };
});


Bitbucket.retrieveCredential = function(credentialToken) {
  return Oauth.retrieveCredential(credentialToken);
};
