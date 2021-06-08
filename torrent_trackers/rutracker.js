const RutrackerApi = require("rutracker-api");
class Rutracker {
  constructor() {
    (this.rutracker = new RutrackerApi()),
      (this.username = process.env.RUTRACKER_NAME),
      (this.password = process.env.RUTRACKER_PASSWORD),
      this.APPROVED = 'проверено'
  }
  checkAuth() {
    const promise = new Promise((resolve, reject) => {
      let username = this.username;
      let password = this.password;
      this.rutracker
        .login({ username, password })
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    });
    return promise;
  }
  getTorrents(query, resolution) {
    resolution = resolution.slice(1)
    const promise = new Promise((resolve, reject) => {
      let username = this.username;
      let password = this.password;
      this.rutracker
        .login({ username, password })
        .then(() => this.rutracker.search({ query, sort: "size" }))
        .then((torrents) => {
          const urls = []
              const approvedTorrents = torrents.filter(
                (torrent) => torrent.state === this.APPROVED && torrent.title.includes(resolution)
              );
              approvedTorrents.forEach(torrent => urls.push(torrent.url))
              resolve(urls);
        });
    });
    return promise;
  }
}

module.exports = Rutracker;
