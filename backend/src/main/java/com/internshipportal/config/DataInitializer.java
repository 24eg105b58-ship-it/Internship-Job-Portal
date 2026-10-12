package com.internshipportal.config;

import com.internshipportal.entity.*;
import com.internshipportal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already initialized with users. Skipping seed.");
            return;
        }

        log.info("Seeding initial portal data...");

        // 1. Create Admin
        User adminUser = User.builder()
                .email("admin@portal.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Platform Administrator")
                .role(Role.ADMIN)
                .active(true)
                .phoneNumber("+1 (555) 019-2834")
                .profileSummary("Chief System Administrator with platform oversight authority.")
                .build();
        userRepository.save(adminUser);

        // 2. Create Recruiter 1
        User recruiterUser1 = User.builder()
                .email("recruiter@portal.com")
                .password(passwordEncoder.encode("recruiter123"))
                .fullName("Sarah Jenkins")
                .role(Role.RECRUITER)
                .active(true)
                .phoneNumber("+1 (555) 234-5678")
                .profileSummary("Senior Talent Acquisition Lead at TechCorp Solutions.")
                .build();
        recruiterUser1 = userRepository.save(recruiterUser1);

        Recruiter recruiter1 = Recruiter.builder()
                .user(recruiterUser1)
                .companyName("TechCorp Solutions")
                .companyWebsite("https://techcorp-solutions.example.com")
                .companyDescription("Leading cloud infrastructure and software engineering services provider.")
                .designation("Head of University Recruiting")
                .location("San Francisco, CA (Hybrid)")
                .verified(true)
                .build();
        recruiter1 = recruiterRepository.save(recruiter1);

        // 3. Create Recruiter 2
        User recruiterUser2 = User.builder()
                .email("recruiter2@portal.com")
                .password(passwordEncoder.encode("recruiter123"))
                .fullName("David Chen")
                .role(Role.RECRUITER)
                .active(true)
                .phoneNumber("+1 (555) 345-6789")
                .profileSummary("VP of People & Culture at InnovateX AI Labs.")
                .build();
        recruiterUser2 = userRepository.save(recruiterUser2);

        Recruiter recruiter2 = Recruiter.builder()
                .user(recruiterUser2)
                .companyName("InnovateX AI Labs")
                .companyWebsite("https://innovatex-labs.example.com")
                .companyDescription("Next-generation artificial intelligence and autonomous system research lab.")
                .designation("Talent Partner")
                .location("New York, NY (Remote)")
                .verified(true)
                .build();
        recruiter2 = recruiterRepository.save(recruiter2);

        // 4. Create Student 1
        User studentUser1 = User.builder()
                .email("student@portal.com")
                .password(passwordEncoder.encode("student123"))
                .fullName("Alex Johnson")
                .role(Role.STUDENT)
                .active(true)
                .phoneNumber("+1 (555) 456-7890")
                .profileSummary("Motivated Computer Science senior passionate about full-stack web development, distributed systems, and cloud architecture.")
                .build();
        studentUser1 = userRepository.save(studentUser1);

        Student student1 = Student.builder()
                .user(studentUser1)
                .university("Stanford University")
                .degree("B.S. in Computer Science")
                .graduationYear(2026)
                .cgpa(3.88)
                .skills("Java, Spring Boot, React, TypeScript, MySQL, Docker, Tailwind CSS, REST APIs")
                .experienceYears(1)
                .githubUrl("https://github.com/alexjohnson-dev")
                .linkedinUrl("https://linkedin.com/in/alexjohnson-demo")
                .portfolioUrl("https://alexjohnson.dev")
                .location("San Francisco, CA")
                .build();
        student1 = studentRepository.save(student1);

        // 5. Create Student 2
        User studentUser2 = User.builder()
                .email("student2@portal.com")
                .password(passwordEncoder.encode("student123"))
                .fullName("Emily Davis")
                .role(Role.STUDENT)
                .active(true)
                .phoneNumber("+1 (555) 567-8901")
                .profileSummary("Data science enthusiast with experience in Python, machine learning models, and backend RESTful services.")
                .build();
        studentUser2 = userRepository.save(studentUser2);

        Student student2 = Student.builder()
                .user(studentUser2)
                .university("University of Washington")
                .degree("B.S. in Software Engineering")
                .graduationYear(2027)
                .cgpa(3.75)
                .skills("Python, React, PostgreSQL, PyTorch, Node.js, Git")
                .experienceYears(0)
                .githubUrl("https://github.com/emilydavis-code")
                .linkedinUrl("https://linkedin.com/in/emilydavis-demo")
                .location("Seattle, WA")
                .build();
        student2 = studentRepository.save(student2);

        // 6. Create Sample Jobs
        Job job1 = Job.builder()
                .title("Software Engineering Intern (Summer 2026)")
                .companyName("TechCorp Solutions")
                .description("Join our engineering team to build scalable microservices and real-time collaborative UI tools.")
                .responsibilities("• Design and implement REST APIs using Spring Boot and Java\n• Build modern interactive frontend modules using React and TypeScript\n• Collaborate with senior engineers on system design and automated test suites\n• Participate in code reviews and agile sprints")
                .requirements("• Pursuing Bachelor's or Master's in Computer Science or related field\n• Familiarity with Java, React, SQL, and Git\n• Strong problem solving and communication skills")
                .location("San Francisco, CA (Hybrid)")
                .jobType(JobType.INTERNSHIP)
                .salary("$45 - $55 / hour")
                .experience("Fresher / Student")
                .skills("Java, Spring Boot, React, TypeScript, MySQL")
                .deadline(LocalDate.now().plusMonths(3))
                .openings(5)
                .status(JobStatus.APPROVED)
                .recruiter(recruiter1)
                .build();
        job1 = jobRepository.save(job1);

        Job job2 = Job.builder()
                .title("Junior Full-Stack Developer")
                .companyName("TechCorp Solutions")
                .description("We are looking for a proactive junior engineer to contribute across our entire modern web stack.")
                .responsibilities("• Develop end-to-end features for our enterprise SaaS product\n• Maintain clean database schemas and perform query optimization\n• Ensure high test coverage and CI/CD automated deployments")
                .requirements("• 0-2 years of software engineering experience\n• Proficiency in React, TypeScript, and Java/Spring or Node.js\n• Solid understanding of relational databases and REST standards")
                .location("San Francisco, CA (Remote)")
                .jobType(JobType.FULL_TIME)
                .salary("$85,000 - $110,000 / year")
                .experience("0-2 years")
                .skills("Java, Spring Boot, React, REST, Docker")
                .deadline(LocalDate.now().plusMonths(2))
                .openings(3)
                .status(JobStatus.APPROVED)
                .recruiter(recruiter1)
                .build();
        job2 = jobRepository.save(job2);

        Job job3 = Job.builder()
                .title("AI & Machine Learning Research Intern")
                .companyName("InnovateX AI Labs")
                .description("Collaborate with world-class researchers on large multimodal models and generative applications.")
                .responsibilities("• Implement neural network training pipelines\n• Benchmark retrieval-augmented generation architectures\n• Create intuitive demo frontends for research prototypes")
                .requirements("• Background in CS, Mathematics, or Data Science\n• Experience with Python, PyTorch, and Web APIs\n• Passion for cutting-edge AI breakthroughs")
                .location("New York, NY (Remote)")
                .jobType(JobType.INTERNSHIP)
                .salary("$50 - $65 / hour")
                .experience("Student / Fresher")
                .skills("Python, PyTorch, React, Machine Learning, FastApi")
                .deadline(LocalDate.now().plusMonths(4))
                .openings(2)
                .status(JobStatus.APPROVED)
                .recruiter(recruiter2)
                .build();
        job3 = jobRepository.save(job3);

        Job job4 = Job.builder()
                .title("Frontend Engineer (React / TypeScript)")
                .companyName("InnovateX AI Labs")
                .description("Craft fluid, beautiful, and accessible user interfaces for our AI productivity platform.")
                .responsibilities("• Build performant web components and state workflows in React 18+\n• Implement rich data visualization dashboards using Recharts\n• Optimize client bundle sizes and web vitals")
                .requirements("• Strong JavaScript/TypeScript fundamentals and CSS Mastery\n• Experience with responsive UI frameworks (Tailwind CSS)\n• Keen eye for UX details and motion design")
                .location("New York, NY (Hybrid)")
                .jobType(JobType.FULL_TIME)
                .salary("$95,000 - $125,000 / year")
                .experience("1-3 years")
                .skills("React, TypeScript, Tailwind CSS, Next.js, Webpack")
                .deadline(LocalDate.now().plusMonths(2))
                .openings(2)
                .status(JobStatus.APPROVED)
                .recruiter(recruiter2)
                .build();
        job4 = jobRepository.save(job4);

        Job job5 = Job.builder()
                .title("Backend Systems Engineer (Contract)")
                .companyName("TechCorp Solutions")
                .description("High-throughput microservices engineering contract focusing on performance and database scaling.")
                .responsibilities("• Optimize MySQL read/write replicas and caching layers\n• Implement event-driven asynchronous queues\n• Write comprehensive integration test suites")
                .requirements("• 2+ years backend engineering with Java or Go\n• Strong SQL tuning and database schema knowledge")
                .location("San Francisco, CA")
                .jobType(JobType.CONTRACT)
                .salary("$60 - $80 / hour")
                .experience("2+ years")
                .skills("Java, MySQL, Redis, Kafka, Spring Cloud")
                .deadline(LocalDate.now().plusMonths(1))
                .openings(1)
                .status(JobStatus.PENDING)
                .recruiter(recruiter1)
                .build();
        job5 = jobRepository.save(job5);

        // 7. Seed Applications
        Application app1 = Application.builder()
                .student(student1)
                .job(job1)
                .status(ApplicationStatus.SHORTLISTED)
                .coverNote("I am extremely excited about the Software Engineering internship at TechCorp Solutions. I have built multiple full-stack Spring Boot and React applications.")
                .notes("Strong profile, shortlisted for technical round.")
                .build();
        applicationRepository.save(app1);

        Application app2 = Application.builder()
                .student(student1)
                .job(job3)
                .status(ApplicationStatus.UNDER_REVIEW)
                .coverNote("Excited about AI research and developing generative tooling frontends.")
                .build();
        applicationRepository.save(app2);

        Application app3 = Application.builder()
                .student(student2)
                .job(job1)
                .status(ApplicationStatus.APPLIED)
                .coverNote("Passionate about cloud software engineering and looking forward to learning from TechCorp's engineering team.")
                .build();
        applicationRepository.save(app3);

        // 8. Seed Notifications
        notificationRepository.save(Notification.builder()
                .user(studentUser1)
                .title("Application Shortlisted!")
                .message("Congratulations! TechCorp Solutions has shortlisted your application for 'Software Engineering Intern (Summer 2026)'.")
                .type(NotificationType.CANDIDATE_SHORTLISTED)
                .actionUrl("/applications")
                .read(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(recruiterUser1)
                .title("New Candidate Applied")
                .message("Alex Johnson submitted an application for 'Software Engineering Intern (Summer 2026)'.")
                .type(NotificationType.APPLICATION_SUBMITTED)
                .actionUrl("/recruiter/applicants")
                .read(false)
                .build());

        notificationRepository.save(Notification.builder()
                .user(adminUser)
                .title("New Job Pending Approval")
                .message("TechCorp Solutions posted 'Backend Systems Engineer (Contract)' awaiting moderation.")
                .type(NotificationType.NEW_JOB_POSTED)
                .actionUrl("/admin/jobs")
                .read(false)
                .build());

        log.info("Initial seed completed successfully! Admin: admin@portal.com, Recruiter: recruiter@portal.com, Student: student@portal.com (password: admin123/recruiter123/student123)");
    }
}
