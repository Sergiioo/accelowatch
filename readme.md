accelowatch
===========

**A CSS automatic wristwatch that's (sort of) powered by your accelerometer**

#### Demo

[Live demo](https://sergiioo.github.io/accelowatch "GitHub pages accelowatch live demo")  hosted on github pages.

Works best on devices with an accelerometer, as that's how you "wind" the spring.

![screenshot](https://cloud.githubusercontent.com/assets/4174927/15620009/9e1b3574-244f-11e6-86d6-95458fc4a656.png "Screenshot from issue comment")

#### How does this work then?

* Everything is drawn with CSS. There are no images, svg, canvas - it's all styled blocks.
* When you load the page, some JavaScript sets the current date and time.
* The hands move around the dial through CSS animation. One full circle of the second hand each minute, once per hour for the minute hand, and twice per day for the hour hand.
* There's a MainSpring and a Rotor in watch.js. As with a regular automatic watch, movement of the watch will turn the rotor and that will wind the spring.
* After a while, the power meter will start to power down. You need to 'wind' the watch at the point - shake your accelerometer-equipped device to put a bit more juice into the main spring.

#### Development

###### Prerequisites
Recent node, decent browser

* Clone the repo and install the npm dependencies with:

`npm install`

* Install gulp globally with:

`npm install gulp --global`

* Build the application into the dist directory and run a local (browser-sync) server using:

`gulp`

Now you can gawp at your newly opened default browser window and marvel at the intriguing juxtaposition of the old (mechanical watch movement) with the new (shiny CSS) contained within.
