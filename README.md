# Groove Jumper

A music trivia game by John Heneghan

[Play Here!](https://jwh709.github.io/Groove-Jumper/)

## How to Play

The user is given an album and 30 seconds to find a connection between that album and another.  
The connection can be a contributing artist, a label, a style of music, a collaborator, or the year a record was released.  
Once a connection is found, the clock is reset, and the user can repeat this process until they run out of known connections.
A connection can be used a maximum of three times. After that, the user will have to find a different way to navigate to a new album. IE: you can use Nirvana to navigate to three Nirvana albums, but on the third time you could use the style of grunge to move onto an album by The Melvins  
After the given 30 seconds runs out on a connection, the game ends, and a score is given based on how many connections a user made.

## Features

- Two search bars to specify an album if the returned results are inaccurate. This is most useful when searching for something very general. Searching “Pink” in the album search bar will return a plethora of albums named pink, and maybe not the one you’re looking for.
- Keyboard functionality. As of right now, the game is completely playable on just a keyboard. Search results can be navigated using the arrow keys, and selected using the enter key. After a match is made, the search bars are refocused, removing the need to focus them again with the mouse.
- Mobile Responsiveness. Groove Jumper should display itself as well as function fine on mobile devices/devices using smaller resolutions.
- DB error system. In the event of a DB side error, an alert will appear, pausing the game and giving the user time to think of what to try next. This prevents a user from being penalised based on an error that’s out of their control.
- Strike system. After using a connection, a strike will appear to notify the user how many times said connection has been used by them.
- History display. After making a connection, said connection will be displayed in a tab on the right side of the website(bottom of the website on mobile). This allows a user to see what connections they have already used, as well as the journey they’ve taken to arrive at whatever album they’re on, potentially aiding in making new connections if they’re stuck.
- Auto-reset on new game start: All past connections, streaks, and strikes are automatically reset on the start of the game.
- Rotating album pool: At the start of the game, a user is given one of two albums as their starting point. These albums change based on the day of the week, and the day of the month.

## Known Limitations in Regards to API

To preface, if you’ve encountered an issue or bug that’s not listed below, feel free to message me about it! I plan to continue work on this project until noted otherwise.

- Missing database entries: Occasionally, there are dead links listed in the discogs database. I’ve found that this isn’t a huge problem, as it would seem that when there's a dead link, there is - coincidentally - a duplicate entry of said link in the returned results. The band-aid solution is to try the second link (if one exists) but ultimately, the fix for this is out of my hands, as I do not have permission to modify the discogs database. When this occurs, an alert should display. A user can use this alert to take as much time as they want to think of another album they could try before dismissing said alert..
- Rate limiting: During testing, I’ve occasionally encountered an issue where I’ve performed too many searches within a minute. Discogs is somewhat unclear in how many searches I’m allowed per minute given my level of access to their database. Similar to the missing DB entries, I do not have much control over this issue at the current moment. Going forward, I’d like to work towards a solution, but as of right now, the most likely solutions are either beyond the scope of the project, or behind paywalls.
- Missing information: Sometimes, when you know you are right, the site will tell you that you are wrong. This is due to missing information, and it most often happens when trying to compare collaborators/contributing artists. IE: I know that a member of Jank plays in Soul Glo. According to the logic of the site & the discogs database, he does not. This issue is bittersweet. Most other music API’s I’ve looked at for this project do not provide a lot of the information I’ve had access to using discogs, at least not for free. However, discogs mostly rely on user contributions for their database. This means that a lot of smaller albums will - naturally - have less contributors, and therefore less information. This means that you probably will be able to get to a Pusher T album from a Kanye West album, but you’re nowhere near as likely to make it from a I am a lake of Burning Orchids album to a Laurel Noose album. The solution to this most likely lies with paying to use a different API, which is a possibility in the future.
- Missing results: This issue is a mix of the last two. Currently one search on my website calls for two searches in this discogs database (one for albums and one for EP’s). This will usually return whatever album is being looked for by a user, but sometimes it does not. An album’s listed formats are also based on user information, which can often lead to an album’s format consisting of more niche terms while excluding album or EP. For each term I want to include in my search, an additional fetch request needs to be sent, and for each fetch request sent, the quicker the site will reach the rate limit set by discogs. Furthermore, there are no consistencies across the terms required to search for a specific album. IE: “EP” will solve all search issues in regards to finding many of Lord Snow’s albums (a band that put out more EP’s than LP’s), but will get you none of Snowing’s EP’s (also a band that put out many more EP’s than LP’s). However, using the format “vinyl” will get you the snowing EP’s, but not the Lord Snow ones. Once again, the solution to this problem lies behind paywalls or out of reach with user authentication, and will most likely not be looked into until a later date.
