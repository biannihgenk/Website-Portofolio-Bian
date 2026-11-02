-- ============================================================================
-- Supabase Portfolio Seed Data
-- Personal Portfolio Website — Naufal Nizar De Bian Setyo Firwanto (Debian Firwanto)
--
-- Idempotent initial seed script for verified portfolio content.
-- Safe to run multiple times without duplicating or overwriting records.
-- ============================================================================

-- 1. Profile Initial Structure
INSERT INTO public.profiles (
  full_name,
  nickname,
  headline,
  bio_id,
  bio_en,
  school,
  study_program,
  location,
  avatar_path,
  email_public,
  github_url,
  linkedin_url,
  interests,
  random_facts
) VALUES (
  'Naufal Nizar De Bian Setyo Firwanto',
  'Bian',
  'Computer & Network Engineering Student • Software & AI Enthusiast',
  'Siswa Teknik Jaringan Komputer dan Telekomunikasi (TJKT) di SMK Telkom Malang dengan dedikasi tinggi pada rekayasa perangkat lunak, arsitektur jaringan komputer, dan kecerdasan artifisial. Aktif mengembangkan aplikasi web modern dan berkompetisi di bidang AI.',
  'Computer and Telecommunications Network Engineering student at SMK Telkom Malang with strong focus on software engineering, network architecture, and artificial intelligence. Actively building modern web applications and competing in AI competitions.',
  'SMK Telkom Malang',
  'Teknik Jaringan Komputer dan Telekomunikasi',
  'Malang, Jawa Timur, Indonesia',
  'profiles/avatar-debian.png',
  'firwanto.debian@gmail.com',
  'https://github.com/biannihgenk',
  'https://www.linkedin.com/in/debian-firwanto-49728635a/',
  '["Software Engineering", "Computer Networks", "Artificial Intelligence", "Next.js & TypeScript", "Network Security"]'::jsonb,
  '["Juara 1 Olimpiade Kecerdasan Artifisial (OKTAL) 2026 Kota Malang", "Siswa aktif di SMK Telkom Malang kelas X TKJ 1", "Tertarik mendalami Full-stack Development dan AI-driven Systems"]'::jsonb
) ON CONFLICT DO NOTHING;

-- 2. Site Settings
INSERT INTO public.site_settings (key, value, description, is_public) VALUES
  (
    'general',
    '{"site_name": "Debian Firwanto", "site_tagline": "Computer & Network Engineering Student • Software & AI Enthusiast", "contact_email": "firwanto.debian@gmail.com", "available_for_hire": true}'::jsonb,
    'General website branding and availability status',
    true
  ),
  (
    'socials',
    '{"github": "https://github.com/biannihgenk", "linkedin": "https://www.linkedin.com/in/debian-firwanto-49728635a/"}'::jsonb,
    'Social media and contact profile links',
    true
  )
ON CONFLICT (key) DO NOTHING;

-- 3. Education
INSERT INTO public.education (
  institution,
  program,
  description_id,
  description_en,
  start_date,
  is_current,
  entry_type,
  sort_order,
  status,
  published_at
) VALUES (
  'SMK Telkom Malang',
  'Teknik Jaringan Komputer dan Telekomunikasi (TJKT)',
  'Konsentrasi keahlian Teknik Jaringan Komputer dan Telekomunikasi (Kelas X TKJ 1). Mempelajari administrasi infrastruktur jaringan, konfigurasi perangkat switching & routing, keamanan jaringan, dan dasar rekayasa sistem.',
  'Specialization in Computer and Telecommunications Network Engineering (Class X TKJ 1). Covering network infrastructure administration, switching & routing configuration, network security, and fundamental systems engineering.',
  '2026-07-01',
  true,
  'education',
  1,
  'published',
  now()
) ON CONFLICT DO NOTHING;

-- 4. Achievements & Certifications
INSERT INTO public.achievements (
  slug,
  title_id,
  title_en,
  description_id,
  description_en,
  organization,
  achievement_date,
  category,
  image_path,
  credential_url,
  sort_order,
  status,
  published_at
) VALUES
  (
    'juara-1-oktal-2026-kota-malang',
    'Juara 1 Tingkat Kota Malang — Olimpiade Kecerdasan Artifisial (OKTAL) 2026',
    '1st Place City Level — Artificial Intelligence Olympiad (OKTAL) 2026',
    'Meraih Juara 1 Tingkat Kota Malang dalam Olimpiade Kecerdasan Artifisial (OKTAL) 2026 yang diselenggarakan oleh PT Talenta Prestasi Indonesia (TAPRESNESIA) dan PT Sentana Teknologi Informasi. Terkurasi oleh Pusat Prestasi Nasional (Puspresnas) dengan No. Sertifikat: 129/OKTAL.TAPRESNESIA/IX/2026.',
    'Awarded 1st Place at the City Level in the 2026 Artificial Intelligence Olympiad (OKTAL) organized by PT Talenta Prestasi Indonesia and PT Sentana Teknologi Informasi. Curated by the National Achievement Center (Puspresnas), Certificate No: 129/OKTAL.TAPRESNESIA/IX/2026.',
    'PT Talenta Prestasi Indonesia & PT Sentana Teknologi Informasi',
    '2026-09-12',
    'Kompetisi',
    'achievements/sertifikat-oktal-2026.png',
    'https://serdig.id',
    1,
    'published',
    '2026-09-14 00:00:00+00'
  ),
  (
    'dicoding-belajar-dasar-ai',
    'Sertifikasi Kompetensi: Belajar Dasar AI',
    'Competence Certificate: Fundamentals of AI',
    'Sertifikasi kelulusan kelas Belajar Dasar AI dari Dicoding Indonesia (ID: JLX1K79EJP72) dengan materi pengenalan artificial intelligence, machine learning pipeline, deep learning basics, dan etika kecerdasan buatan.',
    'Certificate of completion for Fundamentals of AI course at Dicoding Indonesia (ID: JLX1K79EJP72) covering artificial intelligence fundamentals, machine learning pipelines, deep learning basics, and AI ethics.',
    'Dicoding Indonesia',
    '2026-08-29',
    'Sertifikasi',
    'achievements/sertifikat-dicoding-ai.png',
    'https://dicoding.com/certificates/JLX1K79EJP72',
    2,
    'published',
    '2026-08-29 00:00:00+00'
  ),
  (
    'digion-2026-binus-data-analytics',
    'Peserta Kompetisi DIGION 2026 — Data Analytics Track',
    'Participant of DIGION 2026 Competition — Data Analytics Track',
    'Sertifikat partisipasi dalam kompetisi DIGION 2026 bidang Data Analytics yang diselenggarakan oleh Himpunan Mahasiswa Teknik Informatika (HIMTI) BINUS University Malang dan Program Studi Computer Science BINUS@Malang.',
    'Certificate of participation in DIGION 2026 Competition (Data Analytics track) hosted by HIMTI and Computer Science Program of BINUS University Malang.',
    'HIMTI BINUS University @ Malang',
    '2026-09-12',
    'Kompetisi',
    'achievements/sertifikat-digion-2026.png',
    NULL,
    3,
    'published',
    '2026-09-12 00:00:00+00'
  )
ON CONFLICT (slug) DO NOTHING;

-- 5. Projects
INSERT INTO public.projects (
  slug,
  title_id,
  title_en,
  summary_id,
  summary_en,
  description_id,
  description_en,
  cover_image_path,
  category,
  technologies,
  project_status,
  is_featured,
  sort_order,
  status,
  published_at
) VALUES
  (
    'vocaz-vocational-career-platform',
    'VocAZ — Platform Ekosistem Karier & Talenta Vokasi',
    'VocAZ — Vocational Career Ecosystem & Talent Platform',
    'Platform komprehensif yang mempertemukan talenta SMK, Bursa Kerja Khusus (BKK), dunia industri, dan lembaga sertifikasi dalam satu ekosistem terpadu.',
    'Comprehensive ecosystem platform connecting vocational school (SMK) talents, school career centers (BKK), enterprises, and certification bodies.',
    'VocAZ dikembangkan untuk menjawab tantangan penyerapan kerja lulusan SMK dengan menyediakan kurasi portofolio siswa, verifikasi kompetensi berbasis industri, matching magang, dan portal rekrutmen terintegrasi. Dibangun dengan Next.js App Router, Prisma ORM, Neon Serverless PostgreSQL, dan Tailwind CSS.',
    'VocAZ addresses vocational career matching by delivering student portfolio curation, industry skill verification, internship matching, and automated recruitment pipelines. Built with Next.js App Router, Prisma ORM, Neon Serverless PostgreSQL, and Tailwind CSS.',
    NULL,
    'web',
    '["Next.js", "TypeScript", "Prisma", "Neon PostgreSQL", "Tailwind CSS", "Framer Motion"]'::jsonb,
    'in_development',
    true,
    1,
    'published',
    '2026-10-10 00:00:00+00'
  ),
  (
    'kontrolsehat-meditrack',
    'KontrolSehat (Meditrack) — Platform Pemantauan Pasien Penyakit Kronis',
    'KontrolSehat (Meditrack) — Chronic Care Patient Monitoring Platform',
    'Platform digital inovatif untuk deteksi dini risiko, pemantauan kesehatan pasien kronis (hipertensi & diabetes tipe 2), serta kolaborasi perawatan dokter, perawat, dan keluarga.',
    'Digital health platform for early risk screening, continuous chronic condition monitoring (hypertension & diabetes type 2), and collaborative care with healthcare teams and families.',
    'Inovasi health-tech yang dipersiapkan untuk kompetisi Pitch It Business Plan (UKSW). Dilengkapi sitemap komprehensif multi-peran (Pasien, Keluarga, Perawat, Dokter, Admin Faskes), alur skrining kesehatan mandiri, integrasi program Prolanis BPJS, dan sistem peringatan dini berbasis analitik.',
    'Health-tech innovation developed for the Pitch It Business Plan competition (UKSW). Features comprehensive multi-role sitemaps (Patient, Family, Nurse, Doctor, Facility Admin), self-screening workflows, BPJS Prolanis integration, and analytics-driven early health alerts.',
    'projects/meditrack-sitemap.png',
    'web',
    '["HealthTech", "System Architecture", "Business Model Canvas", "Data Analytics", "UI/UX Design"]'::jsonb,
    'prototype',
    true,
    2,
    'published',
    '2026-10-09 00:00:00+00'
  ),
  (
    'star-network-topology-lab',
    'Perancangan & Simulasi Topologi Jaringan Bintang Lab Komputer',
    'Computer Lab Star Network Topology Design & Simulation',
    'Perancangan arsitektur jaringan lokal (LAN) berbasis topologi star dengan segmentasi switch, alokasi IP statis/DHCP, dan gateway routing 10.192.37.1.',
    'Local area network (LAN) architecture design based on star topology featuring switch segmentation, static/DHCP IP addressing, and 10.192.37.1 gateway routing.',
    'Praktikum dan implementasi keahlian Teknik Jaringan Komputer dan Telekomunikasi di SMK Telkom Malang. Menghubungkan workstation laboratorium ke switch terpusat dengan skema subnet 10.192.37.0/24, pengujian latency, dan manajemen konektivitas gateway.',
    'Practical laboratory design and implementation for Computer & Telecommunication Network Engineering at SMK Telkom Malang. Connecting lab workstations to a central switch using 10.192.37.0/24 subnetting, latency benchmarking, and gateway connectivity management.',
    'projects/star-network-topology.png',
    'backend',
    '["Computer Networks", "Switching", "TCP/IP Subnetting", "Network Topology", "Routing"]'::jsonb,
    'completed',
    false,
    3,
    'published',
    '2026-10-15 00:00:00+00'
  )
ON CONFLICT (slug) DO NOTHING;

-- 6. Gallery Items
INSERT INTO public.gallery_items (
  title,
  caption_id,
  caption_en,
  image_path,
  alt_text,
  category,
  sort_order,
  status,
  published_at
) VALUES
  (
    'Kebersamaan Siswa SMK Telkom Malang',
    'Momen kebersamaan rekan sejawat di SMK Telkom Malang dalam suasana belajar dan kolaborasi tim.',
    'Collaboration and student life at SMK Telkom Malang during group studies and teamwork.',
    'gallery/kegiatan-smk-telkom-1.jpg',
    'Dokumentasi kebersamaan siswa SMK Telkom Malang',
    'activity',
    1,
    'published',
    '2026-10-08 00:00:00+00'
  ),
  (
    'Diskusi & Brainstorming Proyek Tim',
    'Sesi diskusi perencanaan arsitektur proyek dan pengujian teknologi bersama tim.',
    'Project planning and technical discussion session with team members.',
    'gallery/kegiatan-smk-telkom-2.jpg',
    'Sesi diskusi dan perencanaan sistem',
    'activity',
    2,
    'published',
    '2026-10-08 00:00:00+00'
  ),
  (
    'Business Model Canvas — KontrolSehat',
    'Kanvas model bisnis platform pemantauan penyakit kronis KontrolSehat untuk kompetisi inovasi kesehatan.',
    'Comprehensive Business Model Canvas for the KontrolSehat chronic care platform.',
    'gallery/bmc-kontrolsehat.png',
    'Diagram Business Model Canvas KontrolSehat',
    'project',
    3,
    'published',
    '2026-10-19 00:00:00+00'
  )
ON CONFLICT DO NOTHING;

-- 7. Blog Categories
INSERT INTO public.blog_categories (name_id, name_en, slug, sort_order) VALUES
  ('Rekayasa Perangkat Lunak', 'Software Engineering', 'software-engineering', 1),
  ('Jaringan Komputer & Infrastruktur', 'Computer Networks & Infrastructure', 'computer-networks', 2),
  ('Kecerdasan Artifisial', 'Artificial Intelligence', 'artificial-intelligence', 3)
ON CONFLICT (slug) DO NOTHING;
