const ScheduleModel = require("../models/schedule.model.js");
const uploadFile = require("../middleware/upload");

// Create and Save a new Schedule
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Upload File to Folder
  await uploadFile(req, res);

  // Create a new Schedule
  const scheduleData = new ScheduleModel({
    full_name: req.body.full_name,
    schedule_date_time: req.body.schedule_date_time,
    resume: req?.file?.newFileName || "",
  });

  // Save Schedule in the database
  ScheduleModel.create(scheduleData, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    else res.send({ message: "Schedule Added Successfully", data });
  });
};

// Retrieve all Schedules from the database (with condition).
exports.findAll = (req, res) => {
  const title = req.query.title;

  ScheduleModel.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    else res.send({ data });
  });
};

// Find a single Schedule by Id
exports.findOne = (req, res) => {
  ScheduleModel.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Schedule with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Schedule with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// Update a Schedule identified by the id in the request
exports.update = async (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Upload File to Folder
  await uploadFile(req, res);
  console.log("req.body", req.body);

  // Create a new Schedule
  const updatedScheduleData = {
    full_name: req.body.full_name,
    schedule_date_time: req.body.schedule_date_time,
  };

  if (req?.file) {
    updatedScheduleData.resume = req?.file?.newFileName || "";
  }

  ScheduleModel.updateById(
    req.params.id,
    new ScheduleModel(updatedScheduleData),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found schedule with id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating schedule with id " + req.params.id,
          });
        }
      } else res.send({ message: "Schedule Updated Successfully", data });
    }
  );
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  ScheduleModel.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Schedule with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Schedule with id " + req.params.id,
        });
      }
    } else res.send({ message: `Schedule was deleted successfully!` });
  });
};
