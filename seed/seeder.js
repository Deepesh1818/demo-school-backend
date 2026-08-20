require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Enquiry = require('../models/Enquiry');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Achievement = require('../models/Achievement');
const LibraryBook = require('../models/LibraryBook');
const LibraryTransaction = require('../models/LibraryTransaction');
const TransportRoute = require('../models/TransportRoute');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/goshen_school');
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Rudra', 'Krishna', 'Kabir', 'Ananya', 'Diya', 'Ishika', 'Aanya', 'Priya', 'Sneha', 'Rohan', 'Vikram', 'Amit', 'Neha', 'Pooja', 'Rahul', 'Siddharth', 'Varun', 'Karan', 'Dev', 'Manish', 'Jyoti', 'Shreya', 'Kriti', 'Simran', 'Tanvi', 'Abhishek', 'Gaurav', 'Nikhil', 'Yash', 'Vivek', 'Meera', 'Riya', 'Komal', 'Sonia', 'Preeti'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Iyer', 'Nair', 'Sen', 'Malhotra', 'Patel', 'Reddy', 'Singh', 'Choudhury', 'Joshi', 'Mehta', 'Kapoor', 'Rao', 'Bose', 'Das', 'Roy', 'Prasad', 'Mishra', 'Trivedi', 'Pandey', 'Saxena', 'Deshmukh', 'Kulkarni', 'Bhatt', 'Nath', 'Dubey', 'Sinha', 'Thakur'];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Class.deleteMany();
    await Subject.deleteMany();
    await Attendance.deleteMany();
    await Exam.deleteMany();
    await Result.deleteMany();
    await Fee.deleteMany();
    await Enquiry.deleteMany();
    await Notice.deleteMany();
    await Event.deleteMany();
    await Achievement.deleteMany();
    await LibraryBook.deleteMany();
    await LibraryTransaction.deleteMany();
    await TransportRoute.deleteMany();

    console.log('Database cleared.');

    // 1. Seed Subjects
    const subjectsData = [
      { name: 'Mathematics', code: 'MATH101', department: 'Mathematics' },
      { name: 'Physics', code: 'PHYS101', department: 'Science' },
      { name: 'Chemistry', code: 'CHEM101', department: 'Science' },
      { name: 'Biology', code: 'BIO101', department: 'Science' },
      { name: 'English Literature', code: 'ENGL101', department: 'Languages' },
      { name: 'Computer Science', code: 'COMP101', department: 'Computer Science' },
      { name: 'History', code: 'HIST101', department: 'Humanities' },
      { name: 'Geography', code: 'GEOG101', department: 'Humanities' },
      { name: 'Accountancy', code: 'ACCT101', department: 'Commerce' },
      { name: 'Business Studies', code: 'BUSS101', department: 'Commerce' }
    ];
    const seededSubjects = await Subject.insertMany(subjectsData);
    console.log(`${seededSubjects.length} subjects seeded.`);

    // 2. Seed Teachers
    const teachersData = [
      { name: 'Dr. Ramesh Sharma', designation: 'Senior Physics Faculty', department: 'Science', experience: 15, subjects: ['Physics'], email: 'ramesh.sharma@goshenschool.demo', bio: 'Specialize in mechanics and quantum theories.' },
      { name: 'Mrs. Sunita Iyer', designation: 'Head of Mathematics', department: 'Mathematics', experience: 18, subjects: ['Mathematics'], email: 'sunita.iyer@goshenschool.demo', bio: 'Passionate about algebraic geometries.' },
      { name: 'Mr. John Dsouza', designation: 'English Instructor', department: 'Languages', experience: 8, subjects: ['English Literature'], email: 'john.dsouza@goshenschool.demo', bio: 'Shakespearean drama expert.' },
      { name: 'Mrs. Anjali Sen', designation: 'Chemistry Head', department: 'Science', experience: 12, subjects: ['Chemistry'], email: 'anjali.sen@goshenschool.demo', bio: 'Specialist in organic polymers.' },
      { name: 'Mr. Rajesh Gupta', designation: 'Computer Science Instructor', department: 'Computer Science', experience: 10, subjects: ['Computer Science'], email: 'teacher@goshenschool.demo', bio: 'Full-stack software developer and robotics guide.' }, // Demo Teacher Account
      { name: 'Mr. Anil Kumar', designation: 'History Teacher', department: 'Humanities', experience: 6, subjects: ['History'], email: 'anil.kumar@goshenschool.demo', bio: 'Expert in medieval history.' },
      { name: 'Mrs. Rekha Nair', designation: 'Biology Specialist', department: 'Science', experience: 11, subjects: ['Biology'], email: 'rekha.nair@goshenschool.demo', bio: 'Genetic engineering researcher.' },
      { name: 'Mr. Sandeep Malhotra', designation: 'Commerce Lecturer', department: 'Commerce', experience: 14, subjects: ['Accountancy', 'Business Studies'], email: 'sandeep.malhotra@goshenschool.demo', bio: 'Corporate auditor.' }
    ];
    const seededTeachers = await Teacher.insertMany(teachersData);
    console.log(`${seededTeachers.length} teachers seeded.`);

    // 3. Seed Classes
    const classesData = [
      { name: 'Class IX - A', code: 'C09A', section: 'A', room: '101', classTeacher: seededTeachers[0]._id, subjects: [seededSubjects[0]._id, seededSubjects[4]._id, seededSubjects[6]._id] },
      { name: 'Class X - A', code: 'C10A', section: 'A', room: '102', classTeacher: seededTeachers[1]._id, subjects: [seededSubjects[0]._id, seededSubjects[4]._id, seededSubjects[7]._id] },
      { name: 'Class XI Science', code: 'C11S', section: 'A', room: '201', classTeacher: seededTeachers[3]._id, subjects: [seededSubjects[0]._id, seededSubjects[1]._id, seededSubjects[2]._id, seededSubjects[5]._id] },
      { name: 'Class XI Commerce', code: 'C11C', section: 'A', room: '202', classTeacher: seededTeachers[7]._id, subjects: [seededSubjects[4]._id, seededSubjects[8]._id, seededSubjects[9]._id] },
      { name: 'Class XII Science', code: 'C12S', section: 'A', room: '301', classTeacher: seededTeachers[4]._id, subjects: [seededSubjects[0]._id, seededSubjects[1]._id, seededSubjects[2]._id, seededSubjects[5]._id] }, // Class XII science led by Demo Teacher
      { name: 'Class XII Commerce', code: 'C12C', section: 'A', room: '302', classTeacher: seededTeachers[7]._id, subjects: [seededSubjects[4]._id, seededSubjects[8]._id, seededSubjects[9]._id] }
    ];
    const seededClasses = await Class.insertMany(classesData);
    console.log(`${seededClasses.length} classes seeded.`);

    // 4. Seed 100+ Students Programmatically
    const studentsList = [];
    let count = 1;

    // Create one specific demo student in Class XII Science
    const demoStudent = {
      studentId: 'GS-2026-001',
      firstName: 'Aarav',
      lastName: 'Sharma',
      dateOfBirth: new Date('2008-05-15'),
      gender: 'Male',
      class: seededClasses[4]._id, // Class XII Science
      rollNumber: 1,
      parentName: 'Mr. Devendra Sharma',
      phone: '9876543210',
      email: 'student@goshenschool.demo', // Demo Student Account email
      address: '102, Royal Residency, Sector 5, New Delhi',
      status: 'Active'
    };
    const createdDemoStudent = await Student.create(demoStudent);
    studentsList.push(createdDemoStudent);

    // Generate remaining 104 students across different classes
    for (let i = 0; i < seededClasses.length; i++) {
      const cls = seededClasses[i];
      const startRoll = cls.code === 'C12S' ? 2 : 1;
      const numStudents = 18; // 18 students per class

      for (let r = startRoll; r <= numStudents; r++) {
        const studentId = `GS-2026-${String(count + 1).padStart(3, '0')}`;
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const dobYear = cls.name.includes('XII') ? 2008 : cls.name.includes('XI') ? 2009 : cls.name.includes('X') ? 2010 : 2011;
        const dob = new Date(`${dobYear}-${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`);
        const email = `${fName.toLowerCase()}.${lName.toLowerCase()}.${studentId.toLowerCase().split('-')[2]}@goshenschool.demo`;

        studentsList.push({
          studentId,
          firstName: fName,
          lastName: lName,
          dateOfBirth: dob,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          class: cls._id,
          rollNumber: r,
          parentName: `Mr. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lName}`,
          phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
          email,
          address: `${Math.floor(10 + Math.random() * 500)}, Green Meadows, New Delhi`,
          status: 'Active'
        });
        count++;
      }
    }

    const seededStudents = await Student.insertMany(studentsList.slice(1)); // Insert programmatic ones
    const allStudents = [createdDemoStudent, ...seededStudents];
    console.log(`${allStudents.length} students seeded.`);

    // 5. Seed Users Accounts for Admin, Teacher, Student, Parent
    // Create Demo Admin User
    await User.create({
      email: 'admin@goshenschool.demo',
      password: 'Admin@123',
      role: 'admin',
      roleRefModel: 'User'
    });

    // Create Demo Teacher User account
    await User.create({
      email: 'teacher@goshenschool.demo',
      password: 'Teacher@123',
      role: 'teacher',
      referenceId: seededTeachers[4]._id, // Mr. Rajesh Gupta
      roleRefModel: 'Teacher'
    });

    // Create User accounts for all other teachers
    for (let t of seededTeachers) {
      if (t.email !== 'teacher@goshenschool.demo') {
        await User.create({
          email: t.email,
          password: 'Teacher@123',
          role: 'teacher',
          referenceId: t._id,
          roleRefModel: 'Teacher'
        });
      }
    }

    // Create Demo Student User
    await User.create({
      email: 'student@goshenschool.demo',
      password: 'Student@123',
      role: 'student',
      referenceId: createdDemoStudent._id,
      roleRefModel: 'Student'
    });

    // Create Demo Parent User (maps to createdDemoStudent)
    await User.create({
      email: 'parent@goshenschool.demo',
      password: 'Parent@123',
      role: 'parent',
      referenceId: createdDemoStudent._id,
      roleRefModel: 'Student'
    });

    // Add login credentials for every single programmatically generated student and parent
    for (let s of seededStudents) {
      // Student User
      await User.create({
        email: s.email,
        password: 'Student@123',
        role: 'student',
        referenceId: s._id,
        roleRefModel: 'Student'
      });

      // Parent User
      const pEmail = `parent.${s.studentId.toLowerCase()}@goshenschool.demo`;
      await User.create({
        email: pEmail,
        password: 'Parent@123',
        role: 'parent',
        referenceId: s._id,
        roleRefModel: 'Student'
      });
    }

    console.log('User credential accounts populated.');

    // 6. Seed Attendance logs for last 10 school days
    const attendanceOps = [];
    const schoolDays = [];
    let dayCursor = new Date();
    while (schoolDays.length < 10) {
      dayCursor.setDate(dayCursor.getDate() - 1);
      const dayOfWeek = dayCursor.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Weekdays only
        schoolDays.push(new Date(dayCursor));
      }
    }

    for (let d of schoolDays) {
      d.setHours(0, 0, 0, 0);
      for (let s of allStudents) {
        // 92% attendance rate simulation
        const status = Math.random() > 0.08 ? 'Present' : Math.random() > 0.5 ? 'Absent' : 'Late';
        attendanceOps.push({
          date: d,
          student: s._id,
          status,
          markedBy: 'system.seeder@goshenschool.demo'
        });
      }
    }
    await Attendance.insertMany(attendanceOps);
    console.log(`Seeded ${attendanceOps.length} attendance sheets.`);

    // 7. Seed Exams & Test Results
    const examsData = [
      { name: 'First Quarterly Exam', class: seededClasses[4]._id, type: 'Quarterly', date: new Date('2026-06-12'), maxMarks: 100, passingMarks: 33 },
      { name: 'First Quarterly Exam', class: seededClasses[1]._id, type: 'Quarterly', date: new Date('2026-06-13'), maxMarks: 100, passingMarks: 33 }
    ];
    const seededExams = await Exam.insertMany(examsData);

    // Save grades for class XII Science students for First Quarterly Exam
    const classXIIStudents = allStudents.filter(s => s.class.toString() === seededClasses[4]._id.toString());
    const resultsOps = [];

    // Mathematics subject in Class XII Science
    const xiiScienceSubjects = seededClasses[4].subjects; // references

    for (let s of classXIIStudents) {
      for (let subId of xiiScienceSubjects) {
        const score = Math.floor(40 + Math.random() * 60); // Scores between 40 and 100
        let grade = 'F';
        if (score >= 90) grade = 'A+';
        else if (score >= 80) grade = 'A';
        else if (score >= 70) grade = 'B';
        else if (score >= 60) grade = 'C';
        else if (score >= 50) grade = 'D';
        else if (score >= 33) grade = 'E';

        resultsOps.push({
          student: s._id,
          exam: seededExams[0]._id,
          subject: subId,
          marks: score,
          grade,
          remarks: score > 80 ? 'Excellent effort!' : score > 50 ? 'Good work, keep improving' : 'Needs attention.'
        });
      }
    }
    await Result.insertMany(resultsOps);
    console.log(`Seeded ${resultsOps.length} exam report cards.`);

    // 8. Seed Fee ledger invoices
    const feeInvoices = [];
    allStudents.forEach(s => {
      // Tuition fee Invoice
      feeInvoices.push({
        student: s._id,
        feeType: 'Tuition Fee',
        expectedAmount: 18000,
        collectedAmount: Math.random() > 0.3 ? 18000 : 0,
        dueDate: new Date('2026-09-01'),
        invoiceNumber: `INV-2026-${s.studentId.split('-')[2]}-T`,
        status: Math.random() > 0.3 ? 'Paid' : 'Pending',
        paymentMethod: Math.random() > 0.3 ? 'Card' : 'None'
      });

      // Transport Invoice (for some students)
      if (Math.random() > 0.6) {
        feeInvoices.push({
          student: s._id,
          feeType: 'Transport Fee',
          expectedAmount: 3200,
          collectedAmount: 0,
          dueDate: new Date('2026-08-15'), // Overdue!
          invoiceNumber: `INV-2026-${s.studentId.split('-')[2]}-TR`,
          status: 'Overdue',
          paymentMethod: 'None'
        });
      }
    });
    await Fee.insertMany(feeInvoices);
    console.log(`${feeInvoices.length} invoices generated.`);

    // 9. Seed Admissions Enquiries
    const enquiriesData = [
      { parentName: 'Vikram Seth', email: 'vikram.seth@gmail.com', phone: '9988776655', studentName: 'Karan Seth', targetClass: 'Class IX', message: 'Looking for details about science labs and sports facility details.', status: 'New' },
      { parentName: 'Neelam Gupta', email: 'neelam.gupta@yahoo.com', phone: '9922334455', studentName: 'Vikas Gupta', targetClass: 'Class XI Science', message: 'Enquiring about board pass results & hostel housing.', status: 'Contacted' },
      { parentName: 'Sunil Nair', email: 'sunil.nair@hotmail.com', phone: '9845123456', studentName: 'Shruti Nair', targetClass: 'Class VI', message: 'Admission guidelines for mid-term transfers.', status: 'Follow-up' }
    ];
    await Enquiry.insertMany(enquiriesData);

    // 10. Seed Notices/Bulletins
    const noticesData = [
      { title: 'Admission Open for Session 2026-27', description: 'Registrations are open for classes Nursery to IX and XI. Please visit the portal or submit inquiries on our website.', category: 'Admission', priority: 'High', status: 'Published' },
      { title: 'First Term Examination Schedule', description: 'The schedule and syllabus for the upcoming First Term Exam scheduled from Sept 15th has been posted in respective portal folders.', category: 'Exam', priority: 'High', status: 'Published' },
      { title: 'Annual Sports Meet 2026', description: 'The Sports meet will commence from November 12th. Registrations for individual athletic events close next week.', category: 'Activity', priority: 'Medium', status: 'Published' },
      { title: 'Parent-Teacher Meeting (PTM)', description: 'PTM for Classes IX to XII is scheduled this Saturday in respective homerooms between 9:00 AM - 12:30 PM.', category: 'Meeting', priority: 'Medium', status: 'Published' }
    ];
    await Notice.insertMany(noticesData);

    // 11. Seed Events
    const eventsData = [
      { title: 'Science & Robotics Exhibition 2026', description: 'Displaying innovative smart models, autonomous robots, and experimental models designed by students from Science and IT streams.', category: 'Academic', date: new Date('2026-09-08'), time: '09:00 AM - 03:00 PM', location: 'Open Grounds & Robotics Lab', registrationRequired: false },
      { title: 'Inter-School Football Championship', description: 'Goshen School is hosting 16 regional school teams for the prestigious championship shield.', category: 'Sports', date: new Date('2026-10-18'), time: '08:30 AM - 05:00 PM', location: 'Main Sports Complex', registrationRequired: true },
      { title: 'Independence Day Cultural Gala', description: 'Choreographed dances, drama, and classical choir performances paying tribute to our national heritage.', category: 'Cultural', date: new Date('2026-08-15'), time: '08:00 AM - 12:00 PM', location: 'Auditorium Main Wing', registrationRequired: false }
    ];
    await Event.insertMany(eventsData);

    // 12. Seed Achievements
    const achievementsData = [
      { title: 'National Science Olympiad - Gold Medal', description: 'Rohan Deshmukh clinched first prize in the national level physics and space research segment.', category: 'Science & Innovation', studentName: 'Rohan Deshmukh', year: 2026, iconType: 'medal' },
      { title: 'State Football Shield Champions', description: 'The senior boys soccer team lifted the district shield beating Sector 12 club 3-1 in finals.', category: 'Sports', studentName: 'School Football Team', year: 2025, iconType: 'trophy' },
      { title: 'CBSE Regional Topper in Commerce', description: 'Ananya Malhotra secured 99.4% in XII boards standing first across Delhi zones.', category: 'Academic', studentName: 'Ananya Malhotra', year: 2025, iconType: 'star' }
    ];
    await Achievement.insertMany(achievementsData);

    // 13. Seed Library Inventory
    const booksData = [
      { title: 'Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Science', totalCopies: 5, availableCopies: 4 },
      { name: 'Introduction to Algorithms', title: 'Thomas H. Cormen', author: 'Thomas Cormen', isbn: '978-0262033848', category: 'Computers', totalCopies: 3, availableCopies: 2 },
      { title: 'The Story of My Life', author: 'Helen Keller', isbn: '978-0486292496', category: 'Biography', totalCopies: 4, availableCopies: 4 },
      { title: 'Calculus Vol 1', author: 'Tom M. Apostol', isbn: '978-8126515196', category: 'Mathematics', totalCopies: 6, availableCopies: 5 }
    ];
    const seededBooks = await LibraryBook.insertMany(booksData);

    // Issue transactions
    await LibraryTransaction.create({
      student: createdDemoStudent._id,
      book: seededBooks[0]._id,
      issueDate: new Date(),
      status: 'Issued'
    });
    await LibraryTransaction.create({
      student: createdDemoStudent._id,
      book: seededBooks[1]._id,
      issueDate: new Date(),
      status: 'Issued'
    });

    // 14. Seed Transport Routes
    const transportData = [
      { routeName: 'Route Alpha - Rohini / Pitampura', busNumber: 'DL-1PB-4321', driverName: 'Harpal Singh', driverPhone: '9812345678', stops: ['Rohini Sector 9', 'Pitampura Metro Station', 'Madhuban Chowk', 'School Gate'], cost: 3200 },
      { routeName: 'Route Beta - Janakpuri / Dwarka', busNumber: 'DL-1PC-5678', driverName: 'Satish Yadav', driverPhone: '9934567890', stops: ['Dwarka Mor', 'Janakpuri District Center', 'Rajouri Garden', 'School Gate'], cost: 3800 }
    ];
    await TransportRoute.insertMany(transportData);

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(seedData);
