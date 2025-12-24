import os
import sys

depts = ['pharmacy', 'chemistry', 'computer-application', 'economics', 'education', 'english', 'environmental-science', 'fine-arts', 'food-science', 'foreign-language', 'forensic-science', 'genetics', 'geography', 'hindi', 'history', 'home-science', 'horticulture', 'business-studies', 'engineering', 'jewellery', 'legal-studies', 'library-science', 'mathematics', 'microbiology', 'physical-education', 'physics', 'plant-protection', 'political-science', 'psychology', 'sanskrit', 'seed-science', 'sociology', 'statistics', 'journalism', 'toxicology', 'urdu', 'yoga', 'zoology']

template = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>DEPTNAME Department - Sri Dev Suman Uttarakhand University</title>
  <link href="../assets/img/favicon.png" rel="icon">
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
  <link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="../assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="../assets/vendor/aos/aos.css" rel="stylesheet">
  <link href="../assets/css/main.css" rel="stylesheet">
</head>
<body class="department-page">
  <header id="header" class="header d-flex align-items-center sticky-top">
    <div class="container-fluid container-xl position-relative d-flex align-items-center">
      <a href="../index.html" class="logo d-flex align-items-center me-auto">
        <h1 class="sitename">sridev suman university</h1>
      </a>
      <nav id="navmenu" class="navmenu">
        <ul>
          <li><a href="../index.html">Home</a></li>
          <li><a href="../about.html">About</a></li>
          <li><a href="../courses.html">Courses</a></li>
          <li><a href="../contact.html">Contact</a></li>
        </ul>
        <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>
      <a class="btn-getstarted" href="../admission.html">Admission 2026-2027</a>
    </div>
  </header>
  <main class="main">
    <div class="page-title" data-aos="fade">
      <div class="heading">
        <div class="container">
          <div class="row d-flex justify-content-center text-center">
            <div class="col-lg-8">
              <h1>DEPTNAME Department</h1>
              <p class="mb-0">Excellence in Education and Research</p>
            </div>
          </div>
        </div>
      </div>
      <nav class="breadcrumbs">
        <div class="container">
          <ol>
            <li><a href="../index.html">Home</a></li>
            <li class="current">DEPTNAME Department</li>
          </ol>
        </div>
      </nav>
    </div>
    <section id="about" class="about section">
      <div class="container" data-aos="fade-up">
        <div class="row gy-4">
          <div class="col-lg-6">
            <h2>About the Department</h2>
            <p>The DEPTNAME Department is dedicated to providing comprehensive education and professional training with state-of-the-art facilities and experienced faculty.</p>
            <ul>
              <li><i class="bi bi-check-circle"></i> <span>Advanced Learning Facilities</span></li>
              <li><i class="bi bi-check-circle"></i> <span>Expert Faculty</span></li>
              <li><i class="bi bi-check-circle"></i> <span>Research Opportunities</span></li>
              <li><i class="bi bi-check-circle"></i> <span>Industry Partnerships</span></li>
            </ul>
          </div>
          <div class="col-lg-6">
            <img src="../assets/img/about.jpg" class="img-fluid" alt="DEPTNAME Department">
          </div>
        </div>
      </div>
    </section>
    <section id="programs" class="courses section">
      <div class="container" data-aos="fade-up">
        <div class="section-title">
          <h2>Programs Offered</h2>
        </div>
        <div class="row gy-4">
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="100">
            <div class="course-item">
              <h3><a href="#">Bachelor Degree</a></h3>
              <p class="description">Full-time Program</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="200">
            <div class="course-item">
              <h3><a href="#">Master Degree</a></h3>
              <p class="description">Full-time Program</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 d-flex align-items-stretch" data-aos="zoom-in" data-aos-delay="300">
            <div class="course-item">
              <h3><a href="#">Ph.D. Program</a></h3>
              <p class="description">Doctoral Research</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer id="footer" class="footer">
    <div class="container copyright text-center mt-4">
      <p>&copy; <span>2024</span> <strong class="sitename">Sri Dev Suman Uttarakhand University</strong></p>
    </div>
  </footer>
  <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="../assets/vendor/aos/aos.js"></script>
  <script src="../assets/js/main.js"></script>
</body>
</html>'''

base_dir = r'c:\Users\Omar\OneDrive\Desktop\SSS\33\test01\departments'
os.chdir(base_dir)

for dept in depts:
    dept_display = ' '.join(word.capitalize() for word in dept.split('-'))
    content = template.replace('DEPTNAME', dept_display)
    filepath = os.path.join(base_dir, f'{dept}.html')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated: {dept}.html')

print('All departments updated successfully!')
