# Among Us Helper Bot

Discord Helper bot while playing among us.

- Track last sent lobby code and the lobby server.
- Mute and Unmute whole lobby with click of a button.
- Watch memes from reddit.com/r/amongus .

## Commands

- `!ctrl`: Bring up the control message. Mute and Unmute by reacting to this message.
- `!meme`: Bring up a random picture from r/amongus posts.

## Deploy

### Easiest way:

- Create a heroku account and install the heroku cli.
- Clone this repo.
- Create a Application and bot account in discord. [More details here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
- Add your token in config.js file.
- Login in with heroku cli.
- In the repo folder:

  - `$heroku create`
  - `$git push heroku master`

  [More details here](https://devcenter.heroku.com/articles/git)

## Discord Permissions

- Manage Messages
- Mute users
