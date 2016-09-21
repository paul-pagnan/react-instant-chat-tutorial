#Building an instant chat app using ReactJs and Socket.io
##Introduction
ReactJs is one of the most popular technologies on the web today due to its simplicity and speed. It is important to note that ReactJS is not a framework, it is a library. Thus, it is unfair to compare it to other technologies such as AngularJs or Ember. Web *frameworks*, such as AngularJs, provide the developer with most tools they need to develop a comprehensive front-end app such as pre-built functions for routing, form validation, http service requests and much more. However, the ReactJs library purely focuses on the view layer and leaves the other complexities for the developer to manage. This gives the developer much more control over how the various features are implemented.

This tutorial will guide the reader through the development of a simple instant chat application, similar to Facebook Messenger, built using ReactJs and Socket.io. This tutorial assumes that you already have a basic understanding of the ReactJs framework and ES6 syntax. If you know nothing about these two, I suggest you stop reading here and check out the following articles:
  - [Learning React.js: Getting Started and Concepts](https://scotch.io/tutorials/learning-react-getting-started-and-concepts)
  - [Learn ES2015 (ES6)](https://babeljs.io/docs/learn-es2015/)

###TL;DR
If you are just after the finished, commented, source code then checkout the Github repo here:
[react-instant-chat](https://github.com/kentandlime/react-instant-chat)

The finished product looks like this:
![Finished react chat app](https://s17.postimg.org/40klqu39r/20160918_123011_capture.gif)


##A bit about me
My name is Paul Pagnan, and I am a Software Engineer at Kent and Lime. Kent and Lime is a Sydney-based, technology first startup looking to disrupt the way men shop online. We send you a box of professionally styled clothes to suit your specific size, style, and budget. You can check us out at [https://kentandlime.com.au](https://kentandlime.com.au).

Our engineering team is always using cutting edge technologies to solve complex business problems. Our technology stack is predominantly ES6 Javascript. Javascript allows for extremely rapid development, which aligns with the cutting edge and fast paced nature of the business. This is likely the reason why javascript libraries, such as ReactJs, are gaining immense popularity not just in startups, but in larger organisations as well.

P.s. We are hiring, feel free to get in touch with me on LinkedIn if you are interested. My profile is [here](https://au.linkedin.com/in/paulpagnan)


##Getting started
To get started, I recommend downloading the starter kit for this tutorial. It contains a skeleton version of the app so that you don't have to do any of the boring dev-ops stuff to get started. The starter kit also includes all of the stylesheets that we will be using for this tutorial. You can download the starter kit here: [react-instant-chat-tutorial](https://github.com/kentandlime/react-instant-chat-tutorial/).

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

> **NOTE:** ReactJs does not automatically bind the 'this' keyword to event handlers. Thus, if we want to call any method on 'this' (in this example we call this.setState) we need to first bind the 'this' keyword to the method in the component constructor.
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


Now that we have created our event handlers and have set our state correctly, we can re-render the view to show the main chat room. In our render method, we should check the 'submitted' property inside the state and render the chat room if this is 'true'. Thus, we should add the following to the start of our render method:

```
render() {
  if (this.state.submitted) {
      // Form was submitted, now show the main App
      return (
        <ChatApp username={this.state.username} />
      );
    }
  ...
```

Your final App.js file should look like the one located [here](https://github.com/kentandlime/react-instant-chat/blob/master/src/components/App.js)


## 2. Main App Screen
Now that we have allowed the user to enter the chat room, we want to display the main application. The main application consists of two main components, the user input section and the messages section.

Again, let's start with the render method. 

```
 render() {
    return (
      <div className="container">
        <h3>React Chat App</h3>
        <Messages messages={this.state.messages} />
        <ChatInput onSend={this.sendHandler} />
      </div>
    );
  }
```

By looking at this we can deduce two things. 
- 1) The Message component should take an array of messages. Thus, we must build a way to put these messages into the state (we will do this later)
- 2) The ChatInput emits an onSend event. As a result, we should create an event handler that takes this event, adds the message to the state and sends it to the server

We will deal with these things later. First, let's create the Messages and ChatInput components.

## 3. Messages View
The message view will accept an array of message objects through the properties of the component. We pass the array in through the properties (as seen in the ChatApp render method) and access them inside the Messages component through ```this.props.messages```.

Essentially, the purpose of the Messages component is to loop through each Message and create a single Message component. The Message component will display the actual message.

So, the render method should be as follows:

```
render() {
    // Loop through all the messages in the state and create a Message component
    const messages = this.props.messages.map((message, i) => {
        return (
          <Message
            key={i}
            username={message.username}
            message={message.message}
            fromMe={message.fromMe} />
        );
      });

    return (
      <div className='messages' id='messageList'>
        { messages }
      </div>
    );
  }
}

```

Let's analyse what this method is doing. First start by getting the array of messages from the properties, then we loop through it using the map function. Map is a new ES6 array function that you can read more about [here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Map). For each message in the array, we create a Message component. The message component accepts three properties.
- 1) key - the key is a React prop which tells the renderer the index of the current component in the loop. Remember that React's render engine only renders the changes by uses a diff system. Thus, the key property is a way for React to determine which component it needs to re-render based on which element in the array has changed.
- 2) username - the name of the user who sent the message
- 3) message - the actual body of the message
- 4) fromMe - a boolean that defines if the message was sent from the current user (we show different styles based on this i.e. right or left side of the screen)

We store the result of this loop inside a local variable to keep our code clean. 

Next, we wrap this variable in a div container and return it.


Finally, the messages component should automatically scroll to the bottom when a new message is received. We can achieve this behaviour by using a React component lifecycle method called ```componentDidUpdate()```. As you probably guessed, this method is called when the props of the component changed. There are many different lifecycle methods available to us; you can find out more about these [here](https://facebook.github.io/react/docs/component-specs.html).

To scroll the messages view we can use some simple javascript, as follows:
```
  componentDidUpdate() {
    // get the messagelist container and set the scrollTop to the height of the container
    const objDiv = document.getElementById('messageList');
    objDiv.scrollTop = objDiv.scrollHeight;
  }
```

Your final Messages component should look like the one [here](https://github.com/kentandlime/react-instant-chat/blob/master/src/components/Messages.js)

## 4. The Message
Now that we have created the Messages view to loop through all the messages, we need a way to display a single message. We create a very simple component called Message that displays the contents of the properties that we passed in through the Messages component. The render method should be as follows:
```
 render() {
    // Was the message sent by the current user. If so, add a css class
    const fromMe = this.props.fromMe ? 'from-me' : '';

    return (
      <div className={`message ${fromMe}`}>
        <div className='username'>
          { this.props.username }
        </div>
        <div className='message-body'>
          { this.props.message }
        </div>
      </div>
    );
  }
```

Notice that we are using the ```fromMe``` property to conditionally add a CSS class to the container of the message.

## 5. The Chat Input
The chat input component is displayed underneath the message list and allows the user to enter a message to be sent to the server. The component is a simple form with a single text input field. When the user presses enter, the input box should be cleared and it should emit an event to the parent component. 

As always, let's start with the render method

```
 render() {
    return (
      <form className="chat-input" onSubmit={this.submitHandler}>
        <input type="text"
          onChange={this.textChangeHandler}
          value={this.state.chatInput}
          placeholder="Write a message..."
          required />
      </form>
    );
  }
```

The render method here is simple. We create a form and an input field. When the form is submitted (by the user pressing enter inside the input box) the submitHandler is called. When we modify the text in the input field, the textChangeHandler is called and the value of this.state.chatInput is bound to the input box. We bind this value back to the input field so that we can easily clear the field after the form is submitted. Let's look at these event handlers:

#### 1) Text change handler
The text change handler should take the input from the text box and put it in the component state so that we can use this value later. The handler should look like this:
```
  textChangeHandler(event)  {
    this.setState({ chatInput: event.target.value });
  }
```

#### 2) Submit handler
The submit handler should clear the current message from the input field and should emit an event back to the parent component with the typed message.
```
 submitHandler(event) {
    // Stop the form from refreshing the page on submit
    event.preventDefault();

    // Call the onSend callback with the chatInput message
    this.props.onSend(this.state.chatInput);
    
    // Clear the input box
    this.setState({ chatInput: '' });
  }
```
Let's analyse this method in detail.

Firstly, ```event.preventDefault()``` prevents the native HTML form from refreshing the page when it is submitted.

Secondly, we emit an event to the parent component with the value of ```chatInput```. You will notice that in the parent component (ChatApp.js) we pass in a property called ```onSend``` to the ChatInput component. In this case, the onSend property is a function. The actual onSend function lives inside the parent component and we are passing a reference of that function to the child through the props. The child is able to call this function reference and it will run whatever code is defined in the parent. This function does not exist currently, but we will create it in part 6.

Lastly, once we have emitted the event to the parent, we want to clear the user's input. We do this by simple setting the chatInput inside the state to '' (remember in the render method we bound ```this.state.chatInput``` to the ```value``` of the ```<input />``` field. This allows us to update the value of the field simply by setting the state field that is bound to it).


As we did before, we need to bind ```this``` to our event handlers. We should also set an initial state of chatInput so that it is not undefined when the component is loaded.

```
  constructor(props) {
    super(props);
    // Set initial state of the chatInput so that it is not undefined
    this.state = { chatInput: '' };

    // React ES6 does not bind 'this' to event handlers by default
    this.submitHandler = this.submitHandler.bind(this);
    this.textChangeHandler = this.textChangeHandler.bind(this);
  }
```

Your final component should look like the one [here](https://github.com/kentandlime/react-instant-chat/blob/master/src/components/ChatInput.js)


## 6. Tying it all together
Now comes the exciting part, tying it all together and making it work!

The last thing left to do is to connect the chat api to our App. 

> *NOTE:* Make sure that you have [simple-chat-api](https://github.com/kentandlime/simple-chat-api) running at this stage. To get it running, download it and read the instructions in the README of the [repo](https://github.com/kentandlime/simple-chat-api)

I also recommend checking out how socket.IO works before continuing, it's very simple. Learn more [here](http://socket.io/)

We do all of the communication with the server from within the ```ChatApp``` component. Firstly, we need to connect to our socket.io server. In the constructor of ```ChatApp``` we should add the following:

```
constructor(props) {
    super(props);
    // set the initial state of messages so that it is not undefined on load
    this.state = { messages: [] };
        
    // Connect to the server
    this.socket = io(config.api).connect();
    ...
```

This line of code is initialising the socket.IO library by passing in the address of the server. We define the address of the server inside a config file so that we can change it easily if we need to (the config file is located in src/config/index.js).

Next, we should create the ```onSend``` handler to send the message to the server when the user sends a message. Remember earlier when we emitted the ```onSend``` from inside the ChatInput component. Here is where we define what that onSend event actually does. Inside ChatApp we should define the following function:

```
  sendHandler(message) {
    const messageObject = {
      username: this.props.username,
      message
    };

    // Emit the message to the server
    this.socket.emit('client:message', messageObject);

    messageObject.fromMe = true;
    this.addMessage(messageObject);
  }
  
  // Remember that we bound this function in step 2 of this tutorial
  // You will see this in the render method of ChatApp.js <ChatInput onSend={this.sendHandler} />
```

Let's break this method down.
- 1) We create a messageObject that we can easily reuse. The object contains the username and the actual message which was passed up from the ChatInput component through the parameters of the function (remember when we called this.props.onSend(this.state.chatInput) from the child component).
- 2) Next, we actually send the message. Through the magic of socket.io, this line of code will send the message to the server. So easy and simple, right!?
- 3) The current user is sending the message, so we want to add the ```fromMe``` flag so that our message is displayed correctly on the right in the messages view.
- 4) We call the addMessage function to append our method to the state. 

> **NOTE**: Remember to bind `this` to the sendHandler.

Let's define the addMessage function now:
```
  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }
```

This is a very simple function that takes the message object and appends it to the state.

Now that the state is updated, the render method of ChatApp is automatically run, and the new message is passed into the Messages component. Remember this line in the render method ``` <Messages messages={this.state.messages} />```.

The very last step is to define what happens when we receive a message from the server; we want to add it to the state as well, right?
Let's do that now. Add this to the bottom of the constructor inside ChatApp:

```
  constructor(props) {
    ...
    
    // Listen for messages from the server
    this.socket.on('server:message', message => {
      this.addMessage(message);
    });
  }
```

Through the magic of socket.io, this callback will be run every time a message is received from another person in the chat room. When we receive a message, all we need to do is add it to the state by calling the ```addMessage``` function that we defined earlier.


Your final ChatApp.js file should look like the one located [here](https://github.com/kentandlime/react-instant-chat/blob/master/src/components/ChatApp.js)


:tada: :tada: :tada: :tada:

Congratulations, you have successfully completed a React instant chat application. Happy chatting!

