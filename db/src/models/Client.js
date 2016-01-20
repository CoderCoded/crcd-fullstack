// TODO: This is dummy model for oAuth
// If needed, replace this with DBModel extension

var clients = [
  { id: '1',
    name: 'Samplr',
    clientId: 'abc123',
    clientSecret: '$2a$10$gkICsGhsLSmKuIE8EumYN.sXpw2NKkQwcyE0A5nBXyR5MniN4WM6a',
    redirectURI: 'http://localhost:3000/' }
// pw: ssh-secret
]

exports.find = function (id, done) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i]
    if (client.id === id) {
      return done(null, client)
    }
  }
  return done(null, null)
}

exports.findById = function (clientId, done) {
  for (var i = 0, len = clients.length; i < len; i++) {
    var client = clients[i]
    if (client.clientId === clientId) {
      return done(null, client)
    }
  }
  return done(null, null)
}

exports.all = function () {
  return clients
}
