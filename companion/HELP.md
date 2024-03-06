## DeCaffeiNDIScan

Module usef for DeCaffeine Player for Raspberry Pi, using the Simple API.

The Hostname is the is the IP of your PI! The rest of the API is hardcoded into the Actions. 

This module includes a NDI scanner, which updates a dropdown list in the actions. This allows updating a HTTP URL request to send the NDI to the player. 

There is a variable that gets updated as True/False when NDI's are available.

Simple API:

GET <dicaffeine_ip>/api/simple/player_start

GET <dicaffeine_ip>/api/simple/player_stop

GET <dicaffeine_ip>/api/simple/player_stream?name=<stream_name>

The stream name has to be URL encoded, (e.g. space as %20), more on online page.
