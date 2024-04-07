const express = require("express");
const port = 5001;
const bodyParser = require('body-parser');
const User = require('./models/User')
const Student = require('./models/studentModel')
const Admin = require('./models/Admin')
const Job = require("./models/Job")

const app = express();
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const AdminRoute = require('./routes/AdminRouts')
const requireToken = require('./Middlewares/AuthTokenRequired');
const studentToken = require('./Middlewares/studentAuthMiddleware');
const AdminToken = require("./Middlewares/AdminToken");


app.use(bodyParser.json());
app.use(authRoutes);
app.use(studentRoutes);
app.use("/Admin", AdminRoute);

require('./db');


app.get('/faculty', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
});

app.get('/student', studentToken, (req, res) => {
    // console.log(req.user);
    res.send(req.user);
});

app.get('/admin', AdminToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
});

app.post('/job', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(200).send({ message: 'Job details added successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error adding job details' });
  }
});

app.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).send(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching jobs');
  }
});

app.get('/Selected', async (req, res) => {
  try {
    const jobs = await Job.find().populate('Appliedstudent'); // Populate Appliedstudent field
    // Filter jobs where at least one Appliedstudent has status 'Selected'
    const selectedJobs = jobs.filter(job => 
      job.Appliedstudent.some(student => student.status === 'Selected')
    );
    // Extract selected students along with company details
    const selectedStudentsDetails = selectedJobs.map(job => ({
      company: job.companyName,
      selectedStudents: job.Appliedstudent.filter(student => student.status === 'Selected')
    }));
    res.status(200).json(selectedStudentsDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching jobs');
  }
});

  
app.get('/NotSelected', async (req, res) => {
  try {
    // Fetch all jobs with Appliedstudent populated
    const jobs = await Job.find().populate('Appliedstudent');

    // Filter jobs where no Appliedstudent has status 'Selected'
    const notSelectedStudentsDetails = [];

    jobs.forEach(job => {
      const notSelectedStudents = job.Appliedstudent.filter(student => student.status === 'Not Selected');
      if (notSelectedStudents.length > 0) {
        notSelectedStudentsDetails.push({
          company: job.companyName,
          notSelectedStudents: notSelectedStudents
        });
      }
    });

    res.status(200).json(notSelectedStudentsDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching jobs');
  }
});


// Define the route handlers for applying and declining to a job directly using app.post
app.post('/jobs/:jobId/apply', async (req, res) => {
  const { jobId } = req.params;
  const { regno, department, name } = req.body;
  const status = "Attending";
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job with applied student, including department and name
    job.Appliedstudent.push({ regno, department, name, status });
    await job.save();

    res.status(200).json({ message: "Applied successfully" });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: "Server error" });
  }
});

//job status update
app.post('/updateStudentStatus', async (req, res) => {
  const { regno, status } = req.body;
  console.log(regno,status)
  try {
    // Find the job document where the Appliedstudent array contains the specified regno
    const job = await Job.findOne({ 'Appliedstudent.regno': regno });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    // Find the index of the AppliedStudent within the Appliedstudent array
    const studentIndex = job.Appliedstudent.findIndex(student => student.regno === regno);
    if (studentIndex === -1) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the status of the student
    job.Appliedstudent[studentIndex].status = status;
    await job.save();
    console.log(job);
    res.status(200).json({ message: "Student status updated successfully" });
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post('/jobs/:jobId/decline', async (req, res) => {
  const { jobId } = req.params;
  const { regno, department, name } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    // Update job with declined student
    job.DeclineStudent.push({ regno, department, name });
    await job.save();
    res.status(200).json({ message: "Declined successfully" });
  } catch (error) {
    console.error('Error declining job:', error);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete('/jobs/:id/delete', async (req, res) => {
  const jobId = req.params.id;

  try {
    // Find the job by ID and delete it
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});


// app.put('/jobs/:jobId/applications/:applicationId/status', async (req, res) => {
//   const { jobId, applicationId } = req.params;
//   const { status } = req.body;

//   try {
//     if (!jobId || !applicationId) {
//       return res.status(400).json({ message: "Invalid job or application ID" });
//     }

//     // Rest of your code...
//   } catch (error) {
//     console.error('Error updating status:', error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
