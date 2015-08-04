##Check Your Followers - Web UI


#### Overview

Check Your Followers is a project inspired by a [Hunter Walk tweet](https://twitter.com/hunterwalk/status/627858565890338816). Upon searching for a library that actually answered this question, I was only able to find either more complicated, paid solutions, or sites that were no longer online.

Looking up the follower information for Twitter users is fairly simple, though there are several steps and nuances that make the process a bit more complex.

Most importantly, Twitter heavily rate-limits its APIs on a per-app and per-user context, which necessitates this service involving a login and not being a Twitter bot only. Without the login, the app would have to use its own credentials, which would quickly be exhausted on expensive lookups, like [@POTUS](https://twitter.com/potus). With login, queries can be checked against a user's own credentials, and the checking algorithms can back off and try other queries until the rate-limited user is cleared for additional requests.

The bot is organized in three pieces:

1. [A Web UI](https://github.com/joshdickson40/checkyourfollowers-web/blob/master/README.md)
2. A Twitter Listener and Task Producer
3. A Task Consumer and a 'Tweeter'

This repository covers the Web UI, which has two parts:

1. Public, No Auth
2. Private, 'Logged In'

If there is no session for the current request, the web ui serves a call to action to login. After the signup/login process, a user object and tokens are generated into a central database shared by each piece of the application. The user is then directed to request their own follower info.

As long as the bot is allowed to remain active for the user's Twitter apps, it can now be interacted with via at-requesting the bot.


### Requests

A single service serves as a listener and task producer. This service utilizes Twitter's streaming APIs to listen for messages that it's sent. If the message appears to be properly formatted, the task is produced and submitted. If the request looks off (as a sanity check - this is not a guarantee that the task will succeed), the bot will at-reply right away and tell you something is up.

Tweeting at the bot from an account that has not signed up will generate an at-reply directing the user to sign up.

For an example of correctly using the bot, see [here](https://twitter.com/followcheckbot/status/628443992577961984).


### Answers

Another single service serves as the task consumer. At regular intervals, the database is checked for tasks that have been submitted and are not complete. This service then manages a pool of functions that utilize a user's credentials and the requested username, limiting the process to lookup at most one username per user at a time. This process begins by searching for the user ids for all of the users that are following the requested user. Then, each of these user ids is saturated with the actual user objects.

Using these saturated objects, it's then possible to check if a user has a 'status' (essentially a recent tweet), and if so, how long ago it was. This information, as well as a number of other heuristics concerning user behavior are logged for each user in the process. The results are then combined and returned.

The returned solution results in the task leaving the managed pool. Results (either success or failure) are then tweeted back to the requesting user by at-replying to their initial request tweet.



### Read More

A more expansive write up of the results and a bit of background information is located here.



#### License

This software is released under the MIT license http://opensource.org/licenses/MIT.
