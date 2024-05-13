const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

// Step: 1
// Create an email transporter.
// SMTP (Simple Mail Transfer Protocol.)
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.ADMIN_USER,
      pass: process.env.ADMIN_PASSWORD
   }
})

app.post("/contact", async (req, res) => {
   try {
      const details = req.body;
      const { name, email, message } = details;

      // Step: 2
      // Configure Mail Content.
      const mailOptions = {
         from: email,
         to: process.env.ADMIN_USER,
         subject: 'Contact Regarding Job',
         html: `
        <div class="container">
            <h1>New Contact Form Submission</h1>
            <div class="details">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
            </div>
            <div class="message">
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            </div>
        </div>
    `
      }

      // Step: 3
      // Send Email
      try {
         const result = await transporter.sendMail(mailOptions);
         res.status(200).json({ status: 'Form submitted successfully' });
      } catch (error) {
         res.status(400).json({ status: 'Something went wrong' })
      }
   } catch (error) {
      console.log('Email sent failed with error', error);
   }
})

app.listen(PORT, () => {
   console.log("server is runing at port : " + PORT);
})