-- =========================================================
-- Internship and Job Application Portal Seed Data
-- Passwords below are BCrypt hashed for 'admin123', 'recruiter123', 'student123'
-- =========================================================

USE internship_portal_db;

-- 1. Insert Users
INSERT INTO users (id, email, password, full_name, role, active, phone_number, profile_summary) VALUES
(1, 'admin@portal.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1pbo4DYvR8Gz07gYp96UqV0/041FkG', 'Platform Administrator', 'ADMIN', TRUE, '+1 (555) 019-2834', 'Chief System Administrator with platform oversight authority.'),
(2, 'recruiter@portal.com', '$2a$10$7q5f5mKk650N5X5hE58Pce0/M6aF2/Q.R8v6W8.2.u9.i04F4Qz/m', 'Sarah Jenkins', 'RECRUITER', TRUE, '+1 (555) 234-5678', 'Senior Talent Acquisition Lead at TechCorp Solutions.'),
(3, 'recruiter2@portal.com', '$2a$10$7q5f5mKk650N5X5hE58Pce0/M6aF2/Q.R8v6W8.2.u9.i04F4Qz/m', 'David Chen', 'RECRUITER', TRUE, '+1 (555) 345-6789', 'VP of People & Culture at InnovateX AI Labs.'),
(4, 'student@portal.com', '$2a$10$4B9Y3f1gP111E99fQ2.uIe8620gYqV96UqV07gYp96UqV0/041FkG', 'Alex Johnson', 'STUDENT', TRUE, '+1 (555) 456-7890', 'Motivated Computer Science senior passionate about full-stack web development and cloud architecture.'),
(5, 'student2@portal.com', '$2a$10$4B9Y3f1gP111E99fQ2.uIe8620gYqV96UqV07gYp96UqV0/041FkG', 'Emily Davis', 'STUDENT', TRUE, '+1 (555) 567-8901', 'Data science and software engineering student experienced in Python, React, and REST APIs.');

-- 2. Insert Recruiter Profiles
INSERT INTO recruiters (id, user_id, company_name, company_website, company_description, designation, location, verified) VALUES
(1, 2, 'TechCorp Solutions', 'https://techcorp-solutions.example.com', 'Leading cloud infrastructure and software engineering services provider.', 'Head of University Recruiting', 'San Francisco, CA (Hybrid)', TRUE),
(2, 3, 'InnovateX AI Labs', 'https://innovatex-labs.example.com', 'Next-generation artificial intelligence and autonomous system research lab.', 'Talent Partner', 'New York, NY (Remote)', TRUE);

-- 3. Insert Student Profiles
INSERT INTO students (id, user_id, university, degree, graduation_year, cgpa, skills, experience_years, github_url, linkedin_url, portfolio_url, location) VALUES
(1, 4, 'Stanford University', 'B.S. in Computer Science', 2026, 3.88, 'Java, Spring Boot, React, TypeScript, MySQL, Docker, Tailwind CSS, REST APIs', 1, 'https://github.com/alexjohnson-dev', 'https://linkedin.com/in/alexjohnson-demo', 'https://alexjohnson.dev', 'San Francisco, CA'),
(2, 5, 'University of Washington', 'B.S. in Software Engineering', 2027, 3.75, 'Python, React, PostgreSQL, PyTorch, Node.js, Git', 0, 'https://github.com/emilydavis-code', 'https://linkedin.com/in/emilydavis-demo', NULL, 'Seattle, WA');

-- 4. Insert Job Postings
INSERT INTO jobs (id, title, company_name, description, responsibilities, requirements, location, job_type, salary, experience, skills, deadline, openings, status, recruiter_id) VALUES
(1, 'Software Engineering Intern (Summer 2026)', 'TechCorp Solutions', 'Join our engineering team to build scalable microservices and real-time collaborative UI tools.', '• Design and implement REST APIs using Spring Boot and Java\n• Build modern interactive frontend modules using React and TypeScript\n• Collaborate with senior engineers on system design and automated test suites', '• Pursuing Bachelor\'s or Master\'s in Computer Science or related field\n• Familiarity with Java, React, SQL, and Git\n• Strong problem solving and communication skills', 'San Francisco, CA (Hybrid)', 'INTERNSHIP', '$45 - $55 / hour', 'Fresher / Student', 'Java, Spring Boot, React, TypeScript, MySQL', DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY), 5, 'APPROVED', 1),
(2, 'Junior Full-Stack Developer', 'TechCorp Solutions', 'We are looking for a proactive junior engineer to contribute across our entire modern web stack.', '• Develop end-to-end features for our enterprise SaaS product\n• Maintain clean database schemas and perform query optimization\n• Ensure high test coverage and CI/CD automated deployments', '• 0-2 years of software engineering experience\n• Proficiency in React, TypeScript, and Java/Spring or Node.js\n• Solid understanding of relational databases and REST standards', 'San Francisco, CA (Remote)', 'FULL_TIME', '$85,000 - $110,000 / year', '0-2 years', 'Java, Spring Boot, React, REST, Docker', DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY), 3, 'APPROVED', 1),
(3, 'AI & Machine Learning Research Intern', 'InnovateX AI Labs', 'Collaborate with world-class researchers on large multimodal models and generative applications.', '• Implement neural network training pipelines\n• Benchmark retrieval-augmented generation architectures\n• Create intuitive demo frontends for research prototypes', '• Background in CS, Mathematics, or Data Science\n• Experience with Python, PyTorch, and Web APIs\n• Passion for cutting-edge AI breakthroughs', 'New York, NY (Remote)', 'INTERNSHIP', '$50 - $65 / hour', 'Student / Fresher', 'Python, PyTorch, React, Machine Learning, FastAPI', DATE_ADD(CURRENT_DATE, INTERVAL 120 DAY), 2, 'APPROVED', 2),
(4, 'Frontend Engineer (React / TypeScript)', 'InnovateX AI Labs', 'Craft fluid, beautiful, and accessible user interfaces for our AI productivity platform.', '• Build performant web components and state workflows in React 18+\n• Implement rich data visualization dashboards using Recharts\n• Optimize client bundle sizes and web vitals', '• Strong JavaScript/TypeScript fundamentals and CSS Mastery\n• Experience with responsive UI frameworks (Tailwind CSS)\n• Keen eye for UX details and motion design', 'New York, NY (Hybrid)', 'FULL_TIME', '$95,000 - $125,000 / year', '1-3 years', 'React, TypeScript, Tailwind CSS, Next.js', DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY), 2, 'APPROVED', 2),
(5, 'Backend Systems Engineer (Contract)', 'TechCorp Solutions', 'High-throughput microservices engineering contract focusing on performance and database scaling.', '• Optimize MySQL read/write replicas and caching layers\n• Implement event-driven asynchronous queues\n• Write comprehensive integration test suites', '• 2+ years backend engineering with Java or Go\n• Strong SQL tuning and database schema knowledge', 'San Francisco, CA', 'CONTRACT', '$60 - $80 / hour', '2+ years', 'Java, MySQL, Redis, Kafka, Spring Cloud', DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 1, 'PENDING', 1);

-- 5. Insert Applications
INSERT INTO applications (id, student_id, job_id, status, cover_note, notes) VALUES
(1, 1, 1, 'SHORTLISTED', 'I am extremely excited about the Software Engineering internship at TechCorp Solutions. I have built multiple full-stack Spring Boot and React applications.', 'Strong profile, shortlisted for technical interview.'),
(2, 1, 3, 'UNDER_REVIEW', 'Excited about AI research and developing generative tooling frontends.', NULL),
(3, 2, 1, 'APPLIED', 'Passionate about cloud software engineering and looking forward to learning from TechCorp.', NULL);

-- 6. Insert Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, action_url) VALUES
(1, 4, 'Application Shortlisted!', 'Congratulations! TechCorp Solutions has shortlisted your application for Software Engineering Intern (Summer 2026).', 'CANDIDATE_SHORTLISTED', FALSE, '/applications'),
(2, 2, 'New Candidate Applied', 'Alex Johnson submitted an application for Software Engineering Intern (Summer 2026).', 'APPLICATION_SUBMITTED', FALSE, '/recruiter/applicants'),
(3, 1, 'New Job Pending Approval', 'TechCorp Solutions posted Backend Systems Engineer (Contract) awaiting moderation.', 'NEW_JOB_POSTED', FALSE, '/admin/jobs');
