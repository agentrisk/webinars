# webinars

To generate a new webinar, go to content/webinars and create a new JSON file (take a look at the existing ones).

Then, after you put all the information that is needed there, run

> make all

and the event/thanks/add-to-calendar pages will be automatically created and placed to site.

You can then commit and push to master and your webinar page will be online.

To preview your changes on Netlify, run

> netlify deploy

and you'll get a staging URL with the changes (w/o needing to push to the repo).

If you make any changes, it is better to do them on the JSON file as the .html page will be overriden.

If you want a different theme, you can explore the templates/ and add/remove/change whatever you want.
