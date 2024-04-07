const mongoose = require('mongoose');

// Define a sub-schema for AppliedStudent
const appliedStudentSchema = new mongoose.Schema({
  regno: { type: String, required: true },
  name: { type: String, required: true }, // Adding student name
  department: { type: String, required: true }, // Adding student department
  status: { type: String }
}, { _id: false }); 

// Sub-schema for Not Interested Students
const declinedStudentSchema = new mongoose.Schema({
  regno: { type: String, required: true },
  name: { type: String, required: true }, // Adding student name
  department: { type: String, required: true } // Adding student department
}, { _id: false });

const jobSchema = new mongoose.Schema({
  companyName: String,
  campus: String,
  institution: String,
  jobRole: String,
  salary: String,
  date: String,
  hrName: String,
  hrMobile: {
    type: Number,
    validate: {
      validator: function(v) {
        // Check if the mobile number is a 10-digit number
        return /^\d{10}$/.test(v);
      },
      message: 'Mobile number must be a 10-digit number.',
    },
  },
  hrGmail: String,
  companyAddress: String,
  venue: String,
  jobDescription: String,
  offCampusDetails:String,
  // selectedCheckboxes: [String] ,
  selectedCheckboxes: String,
  Appliedstudent: [appliedStudentSchema],
  DeclineStudent: [declinedStudentSchema],

});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
