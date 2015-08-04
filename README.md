##Check Your Followers - Web UI

#### Overview

Check Your Followers is a project inspired by a [Hunter Walk tweet](https://twitter.com/hunterwalk/status/627858565890338816). Upon searching for a library that actually answered this question, I was only able to find either more complicated, paid solutions, or sites that were no longer online.

Looking up the follower information for Twitter users is fairly simple, though there are several steps and nuances that make the process a bit more complex.

Most importantly, Twitter heavily rate-limits its APIs on a per-app and per-user context, which necessitates this service involving a login and not being a Twitter bot only. Without the login, the app would have to use its own credentials, which would quickly be exhausted on expensive lookups, like [@POTUS](https://twitter.com/potus). With login, queries can be checked against a user's own credentials, and the checking algorithms can back off and try other queries until the rate-limited user is cleared for additional requests.

The bot is organized in three pieces:

1. A Web UI
2. A Twitter Listener and Task Producer
3. A Task Consumer and a 'Tweeter'

This repository covers the Web UI.

There are two parts to the web ui:

1. Public, No Auth
2. Private, 'Logged In'

If there is no session for the current request, the web ui serves a call to action to login. After the signup/login process, a user object and tokens are generated into a central database shared by each piece of the application. The user is then directed to request their own follower info.

As long as the bot is allowed to remain active for the user's Twitter apps, it can now be interacted with via at-requesting the bot.

For an example, see [here](https://twitter.com/followcheckbot/status/628443992577961984).

You can also read more about the bot here.


#### License

This software is released under the MIT license http://opensource.org/licenses/MIT.
