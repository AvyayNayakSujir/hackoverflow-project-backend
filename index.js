const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/User");
const Issue = require("./models/Issue");
const Event = require("./models/Event");
const Comment = require("./models/Comment");
const Room = require("./models/Room");
const cors = require("cors");
const email = require("./email");
//image upload
// form should have enctype ="multipart/form-data"
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

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
  cloudinary.config({
    cloud_name: "dh0sqelog",
    api_key: "392653166693636",
    api_secret: "VHCj31Ru3 - GeQUy8nu6OjqbGeXY",
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "HiNeighbour_DEV",
      allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
    },
  });
  const upload = multer({
    storage,
    onError: function (err, next) {
      console.error(err);
      next(err);
    },
  });

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

  app.post(
    "/api/issue",
    upload.single("data[image]"),
    (req, res, next) => {
      const newIssue = new Issue(req.body);
      newIssue
        .save()
        .then((issue) => {
          res.json({ issue: issue });
          next();
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    },
    async (req, res, next) => {
      const admins = await User.find({ Type: "ADMIN" });
      admins.map((admin) => {
        email(
          admin.email,
          `New Issue: ${req.body.title}`,
          `Description: ${req.body.description} \n
          Location: ${req.body.location} \n
          website: http://localhost:3000/api/getIssue/${req.body.title
            .split(" ")
            .join("%20")}`
        );
      });
    }
  );

  app.get("/api/getIssue/:title", async (req, res) => {
    try {
      const title = req.params.title;
      const issueData = await Issue.findOne({ title: title });
      res.status(200).json({ Issue: issueData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/updateIssue/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      await Issue.findByIdAndUpdate(id, data);

      res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/deleteIssue/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await Issue.findByIdAndDelete(id);
      res.status(200).json({ message: "deleted successfully" });
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

  app.post("/single", upload.single("image"), (req, res) => {
    //image upload demo
    console.log(req.file);
    res.send("image uploaded succesfully");
  });

  app.post(
    "/api/event",
    async (req, res, next) => {
      try {
        // Extract event data from request body
        const eventData = req.body;

        // Find the user by email
        const user = await User.findOne({ email: eventData.email });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        // Assign the user's _id to the createdBy field of the event
        eventData.createdBy = user._id;
        // Create a new event using the event data
        const newEvent = new Event(eventData);
        // Save the new event to the database
        await newEvent.save();

        res.json({ message: "Event created", event: newEvent });
        next();
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    //FIX
    async (req, res, next) => {
      const allUsers = await User.find();
      allUsers.map((user) => {
        email(
          user.email,
          `New Upcoming Event: ${req.body.name}`,
          `Description: ${req.body.description} \n
            Location: ${req.body.location} \n
            website: http://localhost:3000/api/getIssue/${req.body.title
              .split(" ")
              .join("%20")}`
        );
      });
    }
  );

  app.get("/api/getEvent/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const eventData = await Event.findOne({ _id: id });
      res.status(200).json({ Event: eventData });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/updateEvent/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      await Event.findByIdAndUpdate(id, data);

      res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/deleteEvent/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await Event.findByIdAndDelete(id);
      res.status(200).json({ message: "deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(504).json({ error: err });
    }
  });

  //-------------------------------Comment-------------------------

  app.get("/api/:issueId/comment", async (req, res) => {
    try {
      const { issueId } = req.params;

      // Find the issue by its ID and populate its comments
      const issue = await Issue.findById(issueId).populate("Comments");

      if (!issue) {
        return res.status(404).json({ error: "Issue not found" });
      }

      const comments = issue.Comments; // Get the populated comments from the issue

      res.json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/:issueId/comment", async (req, res) => {
    const { issueId } = req.params;
    const issue = await Issue.findById(issueId);
    const newComment = new Comment(req.body);

    issue.Comments.push(newComment);
    await issue.save();
    await newComment.save();
    if (issue.Comments === " ") {
      res.json({ message: "couldnt" });
    }
    res.json({ message: "added em comments vro!" });
  });
}

// PUT route to handle user likes for comments
app.put("/comments/:iid/:email", async (req, res) => {
  try {
    const { iid, email } = req.params;

    // Find the comment by its ID
    const comment = await Comment.findById(iid);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Assuming you have a User model for user management
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has already liked the comment
    if (comment.likedBy.includes(user._id)) {
      return res
        .status(400)
        .json({ error: "User has already liked this comment" });
    }

    // Update the comment's likedBy array with the user's ObjectId
    comment.likedBy.push(user._id);

    // Increment the likes count
    comment.likes++;

    // Save the updated comment
    await comment.save();

    res.json({ message: "Comment liked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("");

app.listen(3000, (req, res) => {
  console.log("listening at port 3000");
});
