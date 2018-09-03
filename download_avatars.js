const request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  // define a url with repoOwner and repoName passed in
  const url = `https://github.com/repos/${repoOwner}/${repoName}/stats/contributors`;


}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});