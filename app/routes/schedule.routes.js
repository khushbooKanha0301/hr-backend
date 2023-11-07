module.exports = (app) => {
  const scheduleList = require("../controllers/schedule.controller.js");

  const router = require("express").Router();

  // Create a new Schedule
  router.post("/", scheduleList.create);

  // Retrieve all Schedules
  router.get("/", scheduleList.findAll);

  // Retrieve a single Schedule with id
  router.get("/:id", scheduleList.findOne);

  // Update a Schedule with id
  router.put("/:id", scheduleList.update);

  // Delete a Schedule with id
  router.delete("/:id", scheduleList.delete);

  app.use("/api/schedules", router);
};
