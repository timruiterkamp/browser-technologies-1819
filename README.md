# Road to device lab

## Summary

For this subject we had to create a project that would work without styling, css or javascript and was compatible for older browsers.
Take a look at my product and try to break things!

## Table of contents

1. [Live version](#Live-version)
2. [Install](#Install)
3. [Research](#Research)
4. [First things first](#First-things-first)
5. [Wireframes](#Wireframes)
6. [Features](#Features)
7. [Codebase](#Codebase)
8. [Features](#Features)
9. [Testing](#Testing)
10. [Browser testing](#Browser-testing)
11. [Device lab testing](#Device-lab)
12. [Conclusion](#Conclusion)

## Live version

The live version can be found here:
[https://browser-tech.herokuapp.com/](https://browser-tech.herokuapp.com/)

## Install

Fork this repository and execute the following commands in your terminal:

```bash
git clone https://github.com/timruiterkamp/browser-technologies-1819.git

# Move into repo
cd browser-technologies-1819

# Install dependencies
yarn or npm install

# Start server
yarn start or npm start
# You could change node to nodemon in the package.json if you would like to make changes
```

## Research

### First things first

In the first week I did research on the many lackings current websites have when it comes down to progressive enhancement. It ranges from bad color differences to totaly unable to use without cookies. The complete research can be found [here](https://github.com/timruiterkamp/browser-technologies-1819/blob/master/week1/Opdracht1.1.md) and [here](https://github.com/timruiterkamp/browser-technologies-1819/blob/master/week1/Opdracht1.2.md)

### Wireframes

The first steps I took were trying to figure out basic functionalities and to find the main purpose of the app. Which was finding a direction to the device lab based on search input.

#### Version 1: base functionality/reliable

The base functionality of the app is to search for a location and get the steps to get to the device lab. That is what my base structure is focused at. The code is server side rendered and should not have any problem with any browser.

![Pure HTML](/gh-images/html.jpg)

#### Version 2: CSS / Images work (usable)

With css the app is more readable and makes it better to use due to the fact that sections are seperated. The visual difference makes it more easy to follow the steps you would have to take to get to your destination.

![Added CSS](/gh-images/css.jpg)

#### Version 3: Javascript works (pleasurable)

With javascript on, there will be a map loaded with the ability to focus on your current geolocation and a route from your current location to the device lab. There is way more interaction in the site, more feedback to the user and more options available like geolocation.

![Wireframe 1](/gh-images/js.jpg)

## Features

- Css is used to create a visual hierarchy
- Javascript enables a live map, the posibility to search for more locations and gives you the opportunity to view your current location and the route from there on.
- The app works with just minimal html.
- Client side scripting is used for more interactions and server side is used for the bare minimum.

## Codebase

The clientside code is writted in Ecmascript 5, which means it is supported from older to new browsers and gives a more solid foundation if you want to be sure almost every browsers will support it. The server side code takes over the client side code when javascript is disabled.

### 1. Feature detections

- CSS supports for tranisitons, animations, box-shadows,
- I'm currently checking if event listeners exist and if the navigator exists in the client to give the user the ability to look up their geolocation.
  The navigator is checked this way:
  ```javascript
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      geolocation = position.coords;
      input.value = "Loading route...";
      input.value = `${geolocation.latitude}, ${geolocation.longitude}`;
    });
  }
  ```

### 2. Fallbacks

- I'm currently checking on transitions, animations and box-shadows. The fallback is actually to not use them as it is just a visual enhancement instead of a functional one.
- Turning off javascript results in the server side picking up the call and returning server side data.

## Testing

The things I tested:

**Turn off mouse/trackpad**  
 The application has no problem with being used by just tabbing. You can search, submit and select a option. Which are the key interactions of the app.

**Turn off javascript**  
By turning off javascript, the application fallsback to the server side scripts to display the content the user asked for. Interactions are a lot less common but the main interaction works.

**Turn off images**  
The website has no images, so it passes this one with ease.

**Turn off custom fonts**  
I did not have any custom fonts loaded so this wasn't really testable.

**Turn off color & set color blindness**  
I tested all the possible colorblindness variants with colorblindly. I found no problems what so ever, I chose my colors from [https://color.review/](https://color.review/) and always made sure I could get the highest contrasts.
At the first grading between the students I did had my navigation line at a contract of 3.4 which is bad, but I changed that to a 14.5.

**Turn off broadband internet**  
I tested the website on slow 3G and the initals load was 4.30 seconds and finished at 6.33 seconds including loading the background map from a external site. When javascript is turned off the website loads at 4 seconds.
Calls without javascript also take approximatly 2-4 seconds before displaying the route.
A complete walk through with slow 3g takes 13 seconds, this includes loading the map, searching a location, choosing the correct location and drawing the correct navigation on the map.

I can say this has past the test.

**Turn off cookies**  
Cookies are not used in the website and the website functions correctly when cookies are disabled.

## Codereview

I had my code review with Dennis, the overall experience was already okay but there where some improvements that would make it way better:

- Make the site responsive
- Make text more readable
- Show a loader when fetching locations
- Use color review for better contrasts
- Check for color blindness

Based on the current grading form I scored good overall, there were some points like a readme I did not have back then. But for the rest of the form everything was atleast included and working correctly.

## Browser testing

### safari

The first test I ran was in safari, the problem here was that it loaded geolocation over a unsafe connection and safari blocks this. After setting a try and catch block around it, it worked again

### Safari mobile

The appearance of a input type didn't work correctly, so I solved this by using `-webkit-appearance`.
Another point I reconized is that when the site is loaded over http, requests can't be resolved. The url is https but I should create a redirect for every http request.

### Firefox

I did'nt really found any problem here.

### Opera mini mobile

No problems at all, very fast responses and everything works correctly.

### Edge

Somehow I got xmlHTTPrequest error: network error. But when I searched for a location there was no problem. It picked up the server side and the essention of the application is fullfilled.

### IE11

While testing on IE11 I noticed some es6 things inside es5 code which I didn't code correctly. Tho the clien side scripting didn't work, the website did not break and server side worked perfectly.
I also forgot to make a backup for the loading field so the fields would overlap. That is also fixed now.

## Device lab

I tested my product in the device lab, everything loads correctly the only problem was that there was a keyboard bug that kept triggering and did not reconize my input. So the page loads but I couldn't test the keyboard correctly.

![Device lab test](/gh-images/device-lab.jpg)

## Screen reader

I had to made some little changes in the screenreader functionality as the map could not be read. To solve this I create a list toggle which would hide te map and show naivagtion cards. Overall the screen reader worked out right, I think it would be good to use by someone with less eye sight.

## Conclusion

I think I can say my application does atleast work in all major browsers, as with es5 support as with es6 support. The server side takes over at the right times when the client side can't be implemented. In the short amount of time I'm happy with what I have delivered. Ofcourse there are improvements I could make like supporting multiple transports, finetuning the user interface with a toggle between list and map view for example. But overall I'm happy with the product.
