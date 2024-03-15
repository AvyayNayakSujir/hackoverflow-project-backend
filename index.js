const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");
const Issue = require("./models/Issue");
const Event = require("./models/Event");
const Comment = require("./models/Comment");
const Room = require("./models/Room");
const cors = require("cors");

const app = express();

//-----------------------------------------------------trial area
// const userRouter = require("./routes/user");
// const issueRouter = require("./routes/issue");
// const roomRouter = require("./routes/room");
// const eventRouter = require("./routes/event");
// const commentRouter = require("./routes/comment");
//-------------------------------------------------------------------

//Auth imports
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const passportLocalMongoose = require("passport-local-mongoose");
// const session = require("express-session");
// const sessionOptions = {
//   secret: "mysupersecretcode",
//   resave: false,
//   saveUninitialized: true,

//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };
// app.use(session(sessionOptions));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());

// app.use('/api/user', userRouter);
// app.use('/api/issue', issueRouter);
// app.use('/api/room', roomRouter);
// app.use('/api/event', eventRouter);
// app.use('/api/comment', commentRouter);

// passport.deserializeUser(User.deserializeUser());

// mongoose.connect(
//   "",
// //   {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   }
// );

//--------------------------------------------------------------------------
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  // every api is written inside this function
  //mongoose connectivirt is in here
  await mongoose.connect(
    "mongodb+srv://msayeemahmed76:ZhpFIWqw4NxMUVBO@cluster0.gwqpncw.mongodb.net/Hack-Overflow?retryWrites=true&w=majority&appName=Cluster0"
  );
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors());

  //---------------------------------User---------------------------
  app.get("/api/user", (req, res) => {
    User.find()
      .then((users) => {
        console.log(users);
        res.json({ users: users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.post("/api/user", (req, res) => {
    const newUser = new User(req.body);
    newUser
      .save()
      .then((user) => {
        res.json({ user: user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  app.get("/api/getUser/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const user = await User.find({ username: name });
      res.status(200).json({ User: user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.put("/api/updateUser/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const data = req.body;
      const editedUser = await User.updateOne(
        { username: name },
        { $set: data }
      );

      res.status(200).json({ editedUser: editedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/deleteUser/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const deletedUser = await User.deleteOne({ username: name });
      res.status(200).json({ editedRoom: deletedUser });
    } catch (err) {
      console.log(err);
      res.status(504).json({ error: err });
    }
  });

  //----------------------------Issue----------------------
  app.get("/api/issue", (req, res) => {
    Issue.find()
      .then((issues) => {
        res.json({ issues: issues });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.post("/api/issue", (req, res) => {
    const newIssue = new Issue(req.body);
    newIssue
      .save()
      .then((issue) => {
        res.json({ issue: issue });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.get("/api/getIssue/:title", async (req, res) => {
    try {
      const title = req.params.title;
      const issueData = await Issue.findOne({ title: title });
      res.status(200).json({ Issue: issueData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/updateIssue/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const data = req.body;
      const editedUser = await User.updateOne(
        { username: name },
        { $set: data }
      );

      res.status(200).json({ editedUser: editedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/deleteUser/:name", async (req, res) => {
    try {
      const name = req.params.name;
      const deletedUser = await User.deleteOne({ username: name });
      res.status(200).json({ editedRoom: deletedUser });
    } catch (err) {
      console.log(err);
      res.status(504).json({ error: err });
    }
  });

  //----------------------------------Room-----------------------
  app.get("/api/rooms", (req, res) => {
    Room.find()
      .then((rooms) => {
        res.json({ rooms: rooms });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.post("/api/rooms", (req, res) => {
    const newRoom = new Room(req.body);
    newRoom
      .save()
      .then((room) => {
        res.json({ room: room });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.get("/api/getRoom/:id", async (req, res) => {
    const roomId = req.params.id;

    const room = await Room.findById(roomId);
    res.status(200).json({ Room: room });
  });

  app.put("/api/updateRoom/:id", async (req, res) => {
    const roomId = req.params.id;
    const data = req.body.json();

    const editedroom = await Room.findByIdAndUpdate({ id: roomId }, { data });
    res.status(200).json({ editedRoom: editedroom });
  });

  app.delete("/api/deleteRoom/:id", async (req, res) => {
    const roomId = req.params.id;
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    res.status(200).json({ editedRoom: deletedRoom });
  });
  //FIXME:----------------------------------Event--------------------------
  app.get("/api/event", (req, res) => {
    Event.find()
      .then((events) => {
        res.json({ events: events });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.post("/api/event", (req, res) => {
    const newEvent = new Event(req.body);
    newEvent
      .save()
      .then((event) => {
        res.json({ event: event });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //-------------------------------Comment-------------------------
  app.get("/api/comment", (req, res) => {
    Comment.find()
      .then((comments) => {
        res.json({ comments: comments });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  app.post("/api/comment", (req, res) => {
    const newComment = new Comment(req.body);
    newComment
      .save()
      .then((comment) => {
        res.json({ comment: comment });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
}

app.listen(3000, (req, res) => {
  console.log("listening at port 3000");
});
