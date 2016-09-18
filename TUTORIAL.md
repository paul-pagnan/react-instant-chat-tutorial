#Building an instant chat app using ReactJs and Socket.io
##Introduction
ReactJs is one of the most popular technologies on the web today due to it's simplicity and speed. It is important to note that ReactJS is not a framework, it is a library, thus it is unfair to compare it to other technologies such as AngularJs or Ember. Web frameworks, such as AngularJs, provide the developer with most tools they need to develop a comprehensive front-end app such as pre-built functions for routing, form validation, http service requests and many more. However, the ReactJs library purely focuses on the view layer and leaves the other complexities for developer to manage. This gives the developer much more control over how the various features are implemented.

This tutorial will guide the reader through the development of a simple instant chat application, similar to Facebook Messenger, built using ReactJs and Socket.io. This tutorial assumes that you already have a basic understanding of the ReactJs framework and ES6 syntax. If you know nothing about these two, I suggest you stop reading here and check out the following articles:
  - [Learning React.js: Getting Started and Concepts](https://scotch.io/tutorials/learning-react-getting-started-and-concepts)
  - [Learn ES2015 (ES6)](https://babeljs.io/docs/learn-es2015/)

###TL;DR
If you are just after the finished, commented, source code then checkout the github repo here:
[react-instant-chat](https://github.com/kentandlime/react-instant-chat)

The finished product looks like this:
![Finished react chat app](https://s17.postimg.org/40klqu39r/20160918_123011_capture.gif)


##Getting started
To get started, I recommend downloading the starter kit for this tutorial. It contains a skeleton version of the app so that you don't have to do any of the boring dev-ops stuff to get started. The starter kit also contains all of the stylesheets that we will be using for this tutorial. You can download the starter kit here: [react-instant-chat-starter-kit](https://github.com/kentandlime/react-instant-chat-starter-kit/).

Once you have downloaded it, make sure to install the npm dependencies correctly by running: ``` npm install ```.
Once that completes successfully, you can run ``` npm start ``` to start the server

I have also created a simple chat API that we will be connecting to from our ReactJs app. I will not cover how this was built, but feel free to have a look at the source code to try and figure it out. Here is how to get it running:
```
  1. Download the code from https://github.com/kentandlime/simple-chat-api
  2. cd into the directory
  3. run 'npm install'
  4. run 'npm run compile'
  5. run 'npm start'
```

## The File Structure
The starter-kit skeleton has the following file structure:
```
  - src
    - components
      - App.js
        (we will show a simple login screen here)
      - ChatApp.js
        (this is where the main app is shown)
      - ChatInput.js
        (the input box where the user enters their message)
      - Messages.js
        (shows a list of the messages which have been sent and received)
      - Message.js
        (shows an individual message)
```

##1. Login Screen
Firstly we will create a very simple login screen where the user can enter their name and press a submit button to enter the chat room.

First, let's start with the render method inside App.js. We will first start by rendering a simple login form
```
  render() {
    return (
      <form onSubmit={this.usernameSubmitHandler} className="username-container">
        <h1>React Instant Chat</h1>
        <div>
          <input
            type="text"
            onChange={this.usernameChangeHandler}
            placeholder="Enter a username..."
            required />
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
```

Notice that we reference two event handlers here. One for the onChange event on the input box and one on the onSubmit event of the form.
When the user enters some data, we want to store this in the component state so that we can retrieve it later when they submit. When the user submits the form, we simply want to set a boolean flag in the state so that we can re-render the page accordingly.

These two event handlers are as follows:

``` 
  usernameChangeHandler(event) {
    this.setState({ username: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();
    this.setState({ submitted: true, username: this.state.username });
  }
```

> **NOTE:** ReactJs does not automatically bind the 'this' keyword to event handlers. Thus, if we want to call any method on 'this' (in this example we call this.setState) we need to first bind the 'this' keyword to the method in the class constructor. We do that in the constructor as follows:
```
 constructor(props) {
    super(props);
    // set the initial state of the application
    this.state = { username: '' };
>
    // bind the 'this' keyword to the event handlers
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
  }
```



