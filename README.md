# dropthe-q

Video player with real-time collaborative playlist.

Make a playlist on the fly just giving a name and start adding videos from youtube. Share the name or the url of your playlist with offices partnes and enjoy a music in a collaborative way.

Technologies:

Angular for the main orchestation of the app. There ara a couple of small modules separated in services for the bussines logic and directives for visual representations. Each compoment of the UI tend to be a directive for an easy refactor of the layout. I would like to add a better template, but I couldn't find one.

Because it is a pet proyect I used some technologies for learning porupuse, like rxjs and firebase. I've already used them in production enviroment but in this case I wanted to take some time to explore alternatives.

For decoupling modules from views and services I used rxjs https://github.com/Reactive-Extensions/RxJS with the angular extension, and for real-time collaborative data structures used firebase http://firebase.com/.

deployed at https://blistering-inferno-2503.firebaseapp.com/#/

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.
