const request = require('request');
const token = require('./secret');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // define a url with repoOwner and repoName passed in
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
    'User-Agent': 'C-Shi',
    'Authorization': 'token ' + token.GITHUB_TOKEN
    }
  }

  // send http request through request module
  request.get(options, (err, response, body) => {
    if (err) throw err;
    let info = JSON.parse(body)
    cb(err, info);
  })

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach((person) => {
    console.log(person.avatar_url)
  })
});