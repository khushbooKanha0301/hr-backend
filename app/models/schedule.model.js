const sql = require("./db.js");
const fs = require("fs");

// constructor
const ScheduleModel = function (schedule_list) {
  this.full_name = schedule_list.full_name;
  this.schedule_date_time = schedule_list.schedule_date_time;
  this.resume = schedule_list.resume;
};

ScheduleModel.create = (newSchedule, result) => {
  sql.query("INSERT INTO schedule_list SET ?", newSchedule, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newSchedule });
  });
};

ScheduleModel.findById = (id, result) => {
  sql.query(`SELECT * FROM schedule_list WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found schedyle with the id
    result({ kind: "not_found" }, null);
  });
};

ScheduleModel.getAll = (title, result) => {
  let query =
    "SELECT *,resume as file_name, CASE WHEN resume='' THEN '' ELSE (CONCAT('http://localhost:8080/uploads/', resume)) END AS resume FROM schedule_list";

  if (title) {
    query += ` WHERE title LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

ScheduleModel.updateById = (id, schedule, result) => {
  let updateFields = "full_name = ?, schedule_date_time = ?";
  let updateFieldsArray = [schedule.full_name, schedule.schedule_date_time, id];

  if (schedule?.resume) {
    updateFields = "full_name = ?, schedule_date_time = ?, resume = ?";
    updateFieldsArray = [
      schedule.full_name,
      schedule.schedule_date_time,
      schedule.resume,
      id,
    ];
  }

  sql.query(
    `UPDATE schedule_list SET ${updateFields} WHERE id = ?`,
    updateFieldsArray,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found schedule with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...schedule });
    }
  );
};

ScheduleModel.remove = (id, result) => {
  sql.query(`SELECT resume FROM schedule_list WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      const fileName = res[0].resume;
      const directoryPath = __basedir + "/uploads/";

      // Delete File
      fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
          return;
        }
      });
    }
  });

  sql.query("DELETE FROM schedule_list WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found schedule with the id
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};

module.exports = ScheduleModel;
