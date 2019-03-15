# Browser Technologies - Week 1

## How does my own web app hold up against the off switch?

I already tested multiple websites on their ability to handle people who turn off different browser functions.

The things I tested:

- **Turn off mouse/trackpad**  
  You can search through my application and type the search term you want to search for. The only problems is that when you then want to select an item, this is not possible. As the links are hidden within a div.  
  The solution for this would be changing the div into a button to make it accesible.

- **Turn off javascript**  
  The application will not work as all the content is loaded through javascript. A solution to this problem is to create the requests and build the files server side and then serve them. This way you won't be in need of any javascript.

- **Turn off images**

- The website functions totally fine without images, the only thing missing are alt-texts and placeholders. The design doesn't break but it just shows a white block.

**Turn off custom fonts**  
When I turn off fonts everything still looks good, the text just falls back on the sans-serif fonts. I could load the fonts through local imports which would solve the fonts being called from a third party.

**Turn off color & set color blindness**  
Since I only use basic colors for the background, turning off colors or changing it into different versions of color blindness don't really have a big impact on my application. All the text is still on a white canvas which results in being very easy to read.

**Turn off broadband internet**  
I tested the application on a slow 3g functionality and I was actually amazed by how fast it still loaded.
The loading was finished in 6.18 seconds and the total path through the app with search results was around
35- 40 seconds.

**Turn off cookies**  
The websites breaks at the search funtionality because of the error:

```javascript
Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
```

Apparantly blocking cookies results in the window not being accessible. To fix this I need to check if the localstorage is accessible in the window.

## Device Lab & Screenreader Test

Here I describe the results from the device lab and screenreader tests.

### Device Lab

- I tested it on the devices of the Device Lab, the only problem was that I got an SSL certificate error. Which I don't have in chrome.

### Screenreader

The screenreader can read everything fine, the only problem I see is that the text on the first view keeps being read. This shouldn't be happening. For the other parts. I should be making a better distinction between sections because the screen reader keeps reading every book content after eachother and this results in confusion.
Fixes I could implement are completely removing the intro text from the DOM and take a better look at my semantic html scheme.

## Fixes

- [ ] Fix alt tags on images / fallback if images don't load
- [ ] Fix the anchor tag in the search div into a button so it works on screen.
- [ ] Remove the introduction text from the DOM after the user searches
- [ ] Rebuild the HTML in a schemantic way for better screenreader accessibility.
- [ ] Download fonts to the project enviroment and include them instead of sending a request to a third party.
- [ ] Fix the SSL error to test in the device lab.
- [ ] Make sure the LocalStorage is accesible in the window.
