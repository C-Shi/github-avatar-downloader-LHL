# GitHub Avatar Downloader

## Problem Statement

Given a GitHub repository name and owner, download all the contributors' profile images and save them to a subdirectory, `avatars/`.

## Setup

1. clone this repository to your local machine, make sure you have node and npm installed

2. run npm install to intall all the dependencies required for this application

3. open download_avatars.js file, on line 36 and 37 provide your github info
```javascript
    'User-Agent': process.env.GITHUB_USER,
    'Authorization': 'token ' + process.env.GITHUB_TOKEN
```

## Expected Usage

This program should be executed from the command line, in the following manner:

`node download_avatars.js <repo owner> <repo name>`

Make sure you pass two argument when you run your program

## Author
Cheng Shi