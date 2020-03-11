# webinars

To generate a new webinar, go to content/webinars and create a new JSON file (take a look at the existing ones).

Then, after you put all the information that is needed there, run

> simpleasthat.py

and the event/thanks/add-to-calendar pages will be automatically created and placed to site.

You can then commit and push to master and your webinar page will be online.


If you make any changes, it is better to do them on the JSON file as the .html page will be overriden.

If you want a different theme, you can explore the templates/ and add/remove/change whatever you want.
As long as the {{tags}} are there, the content we