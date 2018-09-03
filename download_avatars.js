const request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // define a url with repoOwner and repoName passed in
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
    'User-Agent': 'curl/7.54.0'
    }
  }

  // send http request through request module
  request.get(options, (err, response, body) => {
    if (err) throw err;
    cb(err, body);
  })

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});