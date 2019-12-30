const express = require("express");
const router = express.Router();
const passport = require("passport");

const Project = require("../../models/Project");
const upload = require("../../photojs/multer");
const google = require("../../google/uploadgoogle");
router.use(express.json()); // idk why req.file keeps fucking up

router.get("/getall", (req, res) => {
  Project.aggregate([
    {
      $sort: {
        likes: -1
      }
    },
    {
      $group: {
        _id: {
          username: "$owner.email",
          name: "$owner.name"
        },
        likes: {
          $max: "$likes"
        },
        projectname: {
          $push: "$name"
        },
        link: {
          $push: "$link"
        }
      }
    },
    {
      $project: {
        username: "$_id.username",
        name: "$_id.name",
        projectname: {
          $arrayElemAt: ["$projectname", 0]
        },
        link: {
          $arrayElemAt: ["$link", 0]
        },
        likes: 1
      }
    }
  ])
    .then(project => {
      res.json(project);
    })
    .catch(err => {
      console.log(err);
    });
});

router.put(
  "/like",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user.email);
    res.send(req.user.email);
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let projectsArr = [];

    // Member projects
    await Project.find({})
      .then(projects => {
        projects.map(project => {
          project.teamMembers &&
            project.teamMembers.map(member => {
              if (member.email == req.user.email) {
                projectsArr.push(project);
              }
            });
        });
      })
      .catch(err => console.log(err));

    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    // Combine with owner projects
    await Project.find({ owner: OWNER })
      .then(projects => {
        let finalArr = [...projects, ...projectsArr];
        res.json(finalArr);
      })
      .catch(err => console.log(err));
  }
);

// @route GET api/projects/:id
// @desc Get specific project by id
// @access Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;

    Project.findById(id).then(project => res.json(project));
  }
);

// @route POST api/projects/create
// @desc Create a new project
// @access Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    // console.log("this is owner", OWNER);
    const NEW_PROJECT = await new Project({
      owner: OWNER,
      name: req.body.projectName,
      teamMembers: req.body.members
    });
    // console.log("this is NEW_PROJECT", NEW_PROJECT);
    NEW_PROJECT.save().then(project => {
      res.json(project);
    });
  }
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id).then(project => {
      project.link.forEach(el => {
        let new_str = el.slice(44, el.length);
        google.deletepicture("stormybucket", new_str);
      });
      project.remove().then(() => res.json({ success: true }));
      //Project.findOneAndDelete(project).then(() => res.json({ success: true }));
    });
  }
);

router.patch(
  "/deletepicture/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let link = req.body.url.slice(44, req.body.url.length);
    console.log(link);
    Project.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { link: req.body.url } },
      { new: true }
    ).then(projects => {
      google.deletepicture("stormybucket", link);
      //easyrun32@gmail.com/wp2204403.jpg
      res.send(projects);
    });
  }
);

router.patch("/createpicture", upload.single("photolink"), (req, res) => {
  const googlefolder = {
    file: req.body.email + "/" + req.file.filename
  };

  const photolink =
    "https://storage.googleapis.com" +
    "/" +
    "stormybucket" +
    "/" +
    req.body.email +
    "/" +
    req.file.filename;

  Project.findOneAndUpdate(
    { _id: req.body._id },
    { $addToSet: { link: photolink } },
    { new: true }
  ).then(projects => {
    google
      .uploadpicture("stormybucket", googlefolder["file"], "./" + req.file.path)
      .then(bool => {
        if (bool == true) {
          //when bool is true then give a response to the client
          res.json(projects);
        }
      });
  });
});
// @route PATCH api/projects/update
// @desc Update an existing project
// @access Private
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let projectFields = {};

    projectFields.name = req.body.projectName;
    projectFields.teamMembers = req.body.members;

    Project.findOneAndUpdate(
      { _id: req.body.id },
      { $set: projectFields },
      { new: true }
    )
      .then(project => {
        res.json(project);
      })
      .catch(err => console.log(err));
  }
);

// @route DELETE api/projects/delete/:id
// @desc Delete an existing project
// @access Private

module.exports = router;
