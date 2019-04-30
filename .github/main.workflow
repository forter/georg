workflow "Test, Publish" {
  on = "push"
  resolves = ["GitHub Action for npm"]
}

action "Install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "i"
}

action "Test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run test"
  needs = ["Install"]
}

action "Filters for GitHub Actions" {
  uses = "actions/bin/filter@master"
  needs = ["Test"]
  args = "branch master"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Filters for GitHub Actions"]
  args = "publish"
  secrets = ["NPM_TOKEN"]
}
