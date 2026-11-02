import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ============================================================================
// VERIFIED PORTFOLIO DATA FOR DEBIAN FIRWANTO (NAUFAL NIZAR DE BIAN S. F.)
// Sources: CV Prestasi (SMK Telkom Malang), OKTAL 2026 Certificate,
// Dicoding AI Certificate, BINUS DIGION 2026 Certificate, VocAZ & Meditrack Projects
// ============================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !secretKey) {
  console.error("❌ Missing Supabase configuration in environment (SUPABASE_URL or SUPABASE_SECRET_KEY).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKET = "portfolio-public";

/**
 * Uploads a local file buffer to Supabase Storage if it does not already exist.
 * Also registers metadata into public.media_assets.
 */
async function uploadMediaIfMissing({
  localPath,
  storagePath,
  mimeType,
  originalFilename,
  altText,
}) {
  if (!fs.existsSync(localPath)) {
    console.warn(`  ⚠️ Local file not found at ${localPath}, skipping media upload.`);
    return null;
  }

  const fileBuffer = fs.readFileSync(localPath);
  const sizeBytes = fileBuffer.length;

  // Check if file already exists in Storage
  const folder = storagePath.split("/")[0];
  const filename = storagePath.split("/")[1];

  const { data: existingFiles } = await supabase.storage.from(BUCKET).list(folder, {
    search: filename,
  });

  const alreadyUploaded = existingFiles && existingFiles.some((f) => f.name === filename);

  if (!alreadyUploaded) {
    const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

    if (uploadErr) {
      console.error(`  ❌ Failed uploading ${storagePath}: ${uploadErr.message}`);
      return null;
    }
    console.log(`  ✓ Uploaded media asset: ${storagePath} (${(sizeBytes / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`  ℹ Media asset already present in Storage: ${storagePath}`);
  }

  // Register in media_assets
  await supabase.from("media_assets").upsert(
    {
      storage_path: storagePath,
      original_filename: originalFilename,
      mime_type: mimeType,
      size_bytes: sizeBytes,
      alt_text: altText,
    },
    { onConflict: "storage_path" }
  );

  return storagePath;
}

async function seed() {
  console.log("==================================================================");
  console.log("STARTING IDEMPOTENT PORTFOLIO CONTENT SEEDING");
  console.log("Target Supabase:", supabaseUrl);
  console.log("==================================================================\n");

  // ──────────────────────────────────────────────────────────────────────────
  // 1. MEDIA ASSETS
  // ──────────────────────────────────────────────────────────────────────────
  console.log("[1/7] Processing and uploading verified media assets...");

  const mediaMap = {};

  // Avatar
  if (fs.existsSync("/tmp/avatar_debian_perfect.png")) {
    mediaMap.avatar = await uploadMediaIfMissing({
      localPath: "/tmp/avatar_debian_perfect.png",
      storagePath: "profiles/avatar-debian.png",
      mimeType: "image/png",
      originalFilename: "avatar-debian.png",
      altText: "Foto Profil Naufal Nizar De Bian S.F. (Debian Firwanto)",
    });
  }

  // Certificates
  if (fs.existsSync("/tmp/Sertifikat Oktal - Bian.pdf.png")) {
    mediaMap.oktalCert = await uploadMediaIfMissing({
      localPath: "/tmp/Sertifikat Oktal - Bian.pdf.png",
      storagePath: "achievements/sertifikat-oktal-2026.png",
      mimeType: "image/png",
      originalFilename: "Sertifikat Oktal - Bian.png",
      altText: "Sertifikat Juara 1 OKTAL 2026 Kota Malang",
    });
  }

  if (fs.existsSync("/tmp/Sertifikat Dicoding AI.pdf.png")) {
    mediaMap.dicodingCert = await uploadMediaIfMissing({
      localPath: "/tmp/Sertifikat Dicoding AI.pdf.png",
      storagePath: "achievements/sertifikat-dicoding-ai.png",
      mimeType: "image/png",
      originalFilename: "Sertifikat Dicoding AI.png",
      altText: "Sertifikat Kelulusan Belajar Dasar AI Dicoding",
    });
  }

  if (fs.existsSync("/tmp/01_DGN-2026-0175_NAUFAL_NIZAR_DE_BIAN_S.F.pdf.png")) {
    mediaMap.digionCert = await uploadMediaIfMissing({
      localPath: "/tmp/01_DGN-2026-0175_NAUFAL_NIZAR_DE_BIAN_S.F.pdf.png",
      storagePath: "achievements/sertifikat-digion-2026.png",
      mimeType: "image/png",
      originalFilename: "Sertifikat DIGION 2026 BINUS.png",
      altText: "Sertifikat Peserta DIGION 2026 BINUS University Malang",
    });
  }

  // Projects
  const meditrackPath = "/Users/firwanto/Downloads/Infografik Alur dan Sitemap Meditrack.png";
  if (fs.existsSync(meditrackPath)) {
    mediaMap.meditrackCover = await uploadMediaIfMissing({
      localPath: meditrackPath,
      storagePath: "projects/meditrack-sitemap.png",
      mimeType: "image/png",
      originalFilename: "Infografik Alur dan Sitemap Meditrack.png",
      altText: "Sitemap dan Alur Sistem Meditrack",
    });
  }

  const topologyPath = "/Users/firwanto/Downloads/Star Network Topology Diagram.png";
  if (fs.existsSync(topologyPath)) {
    mediaMap.topologyCover = await uploadMediaIfMissing({
      localPath: topologyPath,
      storagePath: "projects/star-network-topology.png",
      mimeType: "image/png",
      originalFilename: "Star Network Topology Diagram.png",
      altText: "Diagram Topologi Bintang Lab Komputer",
    });
  }

  // Gallery
  const photo1 = "/Users/firwanto/Documents/Photo on 08-10-26 at 17.48 #2.jpg";
  if (fs.existsSync(photo1)) {
    mediaMap.gallery1 = await uploadMediaIfMissing({
      localPath: photo1,
      storagePath: "gallery/kegiatan-smk-telkom-1.jpg",
      mimeType: "image/jpeg",
      originalFilename: "Photo on 08-10-26 at 17.48 #2.jpg",
      altText: "Kebersamaan Siswa SMK Telkom Malang",
    });
  }

  const photo2 = "/Users/firwanto/Documents/Photo on 08-10-26 at 17.49.jpg";
  if (fs.existsSync(photo2)) {
    mediaMap.gallery2 = await uploadMediaIfMissing({
      localPath: photo2,
      storagePath: "gallery/kegiatan-smk-telkom-2.jpg",
      mimeType: "image/jpeg",
      originalFilename: "Photo on 08-10-26 at 17.49.jpg",
      altText: "Diskusi dan Kolaborasi Proyek Tim",
    });
  }

  const bmcPath = "/Users/firwanto/Downloads/MeMompa (SMK Telkom Malang)/1.png";
  if (fs.existsSync(bmcPath)) {
    mediaMap.galleryBmc = await uploadMediaIfMissing({
      localPath: bmcPath,
      storagePath: "gallery/bmc-kontrolsehat.png",
      mimeType: "image/png",
      originalFilename: "Business Model Canvas KontrolSehat.png",
      altText: "Business Model Canvas KontrolSehat",
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. PROFILE & BIOGRAPHY
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n[2/7] Seeding profile...");
  const { data: existingProfiles, error: profFetchErr } = await supabase
    .from("profiles")
    .select("id, full_name")
    .limit(1);

  if (profFetchErr) {
    console.error("  ❌ Error checking profiles table:", profFetchErr.message);
  } else if (existingProfiles && existingProfiles.length > 0) {
    console.log(`  ℹ Profile already exists for '${existingProfiles[0].full_name}' (preserving existing row)`);
  } else {
    const { error: profInsertErr } = await supabase.from("profiles").insert({
      full_name: "Naufal Nizar De Bian Setyo Firwanto",
      nickname: "Bian",
      headline: "Computer & Network Engineering Student • Software & AI Enthusiast",
      bio_id:
        "Siswa Teknik Jaringan Komputer dan Telekomunikasi (TJKT) di SMK Telkom Malang dengan dedikasi tinggi pada rekayasa perangkat lunak, arsitektur jaringan komputer, dan kecerdasan artifisial. Aktif mengembangkan aplikasi web modern dan berkompetisi di bidang AI.",
      bio_en:
        "Computer and Telecommunications Network Engineering student at SMK Telkom Malang with strong focus on software engineering, network architecture, and artificial intelligence. Actively building modern web applications and competing in AI competitions.",
      school: "SMK Telkom Malang",
      study_program: "Teknik Jaringan Komputer dan Telekomunikasi",
      location: "Malang, Jawa Timur, Indonesia",
      avatar_path: mediaMap.avatar || "profiles/avatar-debian.png",
      email_public: "firwanto.debian@gmail.com",
      github_url: "https://github.com/biannihgenk",
      linkedin_url: "https://www.linkedin.com/in/debian-firwanto-49728635a/",
      interests: [
        "Software Engineering",
        "Computer Networks",
        "Artificial Intelligence",
        "Next.js & TypeScript",
        "Network Security",
      ],
      random_facts: [
        "Juara 1 Olimpiade Kecerdasan Artifisial (OKTAL) 2026 Kota Malang",
        "Siswa aktif di SMK Telkom Malang kelas X TKJ 1",
        "Tertarik mendalami Full-stack Development dan AI-driven Systems",
      ],
    });

    if (profInsertErr) {
      console.error("  ❌ Failed inserting profile:", profInsertErr.message);
    } else {
      console.log("  ✓ Profile seeded successfully");
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. SITE SETTINGS
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n[3/7] Seeding site settings...");
  const settingsToSeed = [
    {
      key: "general",
      value: {
        site_name: "Debian Firwanto",
        site_tagline: "Computer & Network Engineering Student • Software & AI Enthusiast",
        contact_email: "firwanto.debian@gmail.com",
        available_for_hire: true,
      },
      description: "General website branding and availability status",
      is_public: true,
    },
    {
      key: "socials",
      value: {
        github: "https://github.com/biannihgenk",
        linkedin: "https://www.linkedin.com/in/debian-firwanto-49728635a/",
      },
      description: "Social media and contact profile links",
      is_public: true,
    },
  ];

  for (const s of settingsToSeed) {
    const { data: existingSetting } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", s.key)
      .maybeSingle();

    if (!existingSetting) {
      const { error: setErr } = await supabase.from("site_settings").insert(s);
      if (setErr) console.error(`  ❌ Failed inserting setting '${s.key}': ${setErr.message}`);
      else console.log(`  ✓ Setting '${s.key}' seeded`);
    } else {
      console.log(`  ℹ Setting '${s.key}' already exists (preserved)`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. EDUCATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n[4/7] Seeding education...");
  const educationEntries = [
    {
      institution: "SMK Telkom Malang",
      program: "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)",
      description_id:
        "Konsentrasi keahlian Teknik Jaringan Komputer dan Telekomunikasi. Mempelajari administrasi infrastruktur jaringan, konfigurasi perangkat switching & routing, keamanan jaringan, dan dasar rekayasa sistem.",
      description_en:
        "Specialization in Computer and Telecommunications Network Engineering. Covering network infrastructure administration, switching & routing configuration, network security, and fundamental systems engineering.",
      start_date: "2026-07-01",
      end_date: null,
      is_current: true,
      entry_type: "education",
      sort_order: 1,
      status: "published",
      published_at: new Date().toISOString(),
    },
  ];

  for (const edu of educationEntries) {
    const { data: existingEdu } = await supabase
      .from("education")
      .select("id")
      .eq("institution", edu.institution)
      .eq("program", edu.program)
      .maybeSingle();

    if (!existingEdu) {
      const { error: eduErr } = await supabase.from("education").insert(edu);
      if (eduErr) console.error(`  ❌ Failed inserting education for ${edu.institution}: ${eduErr.message}`);
      else console.log(`  ✓ Education record '${edu.institution}' seeded`);
    } else {
      console.log(`  ℹ Education '${edu.institution}' already exists (preserved)`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. ACHIEVEMENTS & CERTIFICATIONS
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n[5/7] Seeding achievements...");
  const achievements = [
    {
      slug: "juara-1-oktal-2026-kota-malang",
      title_id: "Juara 1 Tingkat Kota Malang — Olimpiade Kecerdasan Artifisial (OKTAL) 2026",
      title_en: "1st Place City Level — Artificial Intelligence Olympiad (OKTAL) 2026",
      description_id:
        "Meraih Juara 1 Tingkat Kota Malang dalam Olimpiade Kecerdasan Artifisial (OKTAL) 2026 yang diselenggarakan oleh PT Talenta Prestasi Indonesia (TAPRESNESIA) dan PT Sentana Teknologi Informasi. Terkurasi oleh Pusat Prestasi Nasional (Puspresnas) dengan No. Sertifikat: 129/OKTAL.TAPRESNESIA/IX/2026.",
      description_en:
        "Awarded 1st Place at the City Level in the 2026 Artificial Intelligence Olympiad (OKTAL) organized by PT Talenta Prestasi Indonesia and PT Sentana Teknologi Informasi. Curated by the National Achievement Center (Puspresnas), Certificate No: 129/OKTAL.TAPRESNESIA/IX/2026.",
      organization: "PT Talenta Prestasi Indonesia & PT Sentana Teknologi Informasi",
      achievement_date: "2026-09-12",
      category: "Kompetisi",
      image_path: mediaMap.oktalCert || "achievements/sertifikat-oktal-2026.png",
      credential_url: "https://serdig.id",
      sort_order: 1,
      status: "published",
      published_at: "2026-09-14T00:00:00Z",
    },
    {
      slug: "dicoding-belajar-dasar-ai",
      title_id: "Sertifikasi Kompetensi: Belajar Dasar AI",
      title_en: "Competence Certificate: Fundamentals of AI",
      description_id:
        "Sertifikasi kelulusan kelas Belajar Dasar AI dari Dicoding Indonesia (ID: JLX1K79EJP72) dengan materi pengenalan artificial intelligence, machine learning pipeline, deep learning basics, dan etika kecerdasan buatan.",
      description_en:
        "Certificate of completion for Fundamentals of AI course at Dicoding Indonesia (ID: JLX1K79EJP72) covering artificial intelligence fundamentals, machine learning pipelines, deep learning basics, and AI ethics.",
      organization: "Dicoding Indonesia",
      achievement_date: "2026-08-29",
      category: "Sertifikasi",
      image_path: mediaMap.dicodingCert || "achievements/sertifikat-dicoding-ai.png",
      credential_url: "https://dicoding.com/certificates/JLX1K79EJP72",
      sort_order: 2,
      status: "published",
      published_at: "2026-08-29T00:00:00Z",
    },
    {
      slug: "digion-2026-binus-data-analytics",
      title_id: "Peserta Kompetisi DIGION 2026 — Data Analytics Track",
      title_en: "Participant of DIGION 2026 Competition — Data Analytics Track",
      description_id:
        "Sertifikat partisipasi dalam kompetisi DIGION 2026 bidang Data Analytics yang diselenggarakan oleh Himpunan Mahasiswa Teknik Informatika (HIMTI) BINUS University Malang dan Program Studi Computer Science BINUS@Malang.",
      description_en:
        "Certificate of participation in DIGION 2026 Competition (Data Analytics track) hosted by HIMTI and Computer Science Program of BINUS University Malang.",
      organization: "HIMTI BINUS University @ Malang",
      achievement_date: "2026-09-12",
      category: "Kompetisi",
      image_path: mediaMap.digionCert || "achievements/sertifikat-digion-2026.png",
      sort_order: 3,
      status: "published",
      published_at: "2026-09-12T00:00:00Z",
    },
  ];

  for (const ach of achievements) {
    const { data: existingAch } = await supabase
      .from("achievements")
      .select("id")
      .eq("slug", ach.slug)
      .maybeSingle();

    if (!existingAch) {
      const { error: achErr } = await supabase.from("achievements").insert(ach);
      if (achErr) console.error(`  ❌ Failed inserting achievement '${ach.slug}': ${achErr.message}`);
      else console.log(`  ✓ Achievement '${ach.slug}' seeded`);
    } else {
      console.log(`  ℹ Achievement '${ach.slug}' already exists (preserved)`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. PROJECTS
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n[6/7] Seeding projects...");
  const projects = [
    {
      slug: "vocaz-vocational-career-platform",
      title_id: "VocAZ — Platform Ekosistem Karier & Talenta Vokasi",
      title_en: "VocAZ — Vocational Career Ecosystem & Talent Platform",
      summary_id:
        "Platform komprehensif yang mempertemukan talenta SMK, Bursa Kerja Khusus (BKK), dunia industri, dan lembaga sertifikasi dalam satu ekosistem terpadu.",
      summary_en:
        "Comprehensive ecosystem platform connecting vocational school (SMK) talents, school career centers (BKK), enterprises, and certification bodies.",
      description_id:
        "VocAZ dikembangkan untuk menjawab tantangan penyerapan kerja lulusan SMK dengan menyediakan kurasi portofolio siswa, verifikasi kompetensi berbasis industri, matching magang, dan portal rekrutmen terintegrasi. Dibangun dengan Next.js App Router, Prisma ORM, Neon Serverless PostgreSQL, dan Tailwind CSS.",
      description_en:
        "VocAZ addresses vocational career matching by delivering student portfolio curation, industry skill verification, internship matching, and automated recruitment pipelines. Built with Next.js App Router, Prisma ORM, Neon Serverless PostgreSQL, and Tailwind CSS.",
      category: "web",
      technologies: ["Next.js", "TypeScript", "Prisma", "Neon PostgreSQL", "Tailwind CSS", "Framer Motion"],
      project_status: "in_development",
      is_featured: true,
      sort_order: 1,
      status: "published",
      published_at: "2026-10-10T00:00:00Z",
    },
    {
      slug: "kontrolsehat-meditrack",
      title_id: "KontrolSehat (Meditrack) — Platform Pemantauan Pasien Penyakit Kronis",
      title_en: "KontrolSehat (Meditrack) — Chronic Care Patient Monitoring Platform",
      summary_id:
        "Platform digital inovatif untuk deteksi dini risiko, pemantauan kesehatan pasien kronis (hipertensi & diabetes tipe 2), serta kolaborasi perawatan dokter, perawat, dan keluarga.",
      summary_en:
        "Digital health platform for early risk screening, continuous chronic condition monitoring (hypertension & diabetes type 2), and collaborative care with healthcare teams and families.",
      description_id:
        "Inovasi health-tech yang dipersiapkan untuk kompetisi Pitch It Business Plan (UKSW). Dilengkapi sitemap komprehensif multi-peran (Pasien, Keluarga, Perawat, Dokter, Admin Faskes), alur skrining kesehatan mandiri, integrasi program Prolanis BPJS, dan sistem peringatan dini berbasis analitik.",
      description_en:
        "Health-tech innovation developed for the Pitch It Business Plan competition (UKSW). Features comprehensive multi-role sitemaps (Patient, Family, Nurse, Doctor, Facility Admin), self-screening workflows, BPJS Prolanis integration, and analytics-driven early health alerts.",
      cover_image_path: mediaMap.meditrackCover || "projects/meditrack-sitemap.png",
      category: "web",
      technologies: ["HealthTech", "System Architecture", "Business Model Canvas", "Data Analytics", "UI/UX Design"],
      project_status: "prototype",
      is_featured: true,
      sort_order: 2,
      status: "published",
      published_at: "2026-10-09T00:00:00Z",
    },
    {
      slug: "star-network-topology-lab",
      title_id: "Perancangan & Simulasi Topologi Jaringan Bintang Lab Komputer",
      title_en: "Computer Lab Star Network Topology Design & Simulation",
      summary_id:
        "Perancangan arsitektur jaringan lokal (LAN) berbasis topologi star dengan segmentasi switch, alokasi IP statis/DHCP, dan gateway routing 10.192.37.1.",
      summary_en:
        "Local area network (LAN) architecture design based on star topology featuring switch segmentation, static/DHCP IP addressing, and 10.192.37.1 gateway routing.",
      description_id:
        "Praktikum dan implementasi keahlian Teknik Jaringan Komputer dan Telekomunikasi di SMK Telkom Malang. Menghubungkan workstation laboratorium ke switch terpusat dengan skema subnet 10.192.37.0/24, pengujian latency, dan manajemen konektivitas gateway.",
      description_en:
        "Practical laboratory design and implementation for Computer & Telecommunication Network Engineering at SMK Telkom Malang. Connecting lab workstations to a central switch using 10.192.37.0/24 subnetting, latency benchmarking, and gateway connectivity management.",
      cover_image_path: mediaMap.topologyCover || "projects/star-network-topology.png",
      category: "backend",
      technologies: ["Computer Networks", "Switching", "TCP/IP Subnetting", "Network Topology", "Routing"],
      project_status: "completed",
      is_featured: false,
      sort_order: 3,
      status: "published",
      published_at: "2026-10-15T00:00:00Z",
    },
  ];

  for (const p of projects) {
    const { data: existingProj } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", p.slug)
      .maybeSingle();

    if (!existingProj) {
      const { error: projErr } = await supabase.from("projects").insert(p);
      if (projErr) console.error(`  ❌ Failed inserting project '${p.slug}': ${projErr.message}`);
      else console.log(`  ✓ Project '${p.slug}' seeded`);
    } else {
      console.log(`  ℹ Project '${p.slug}' already exists (preserved)`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. GALLERY & BLOG CATEGORIES
  // ──────────────────────────────────────────────────────────────────────────
  console.log("\n[7/7] Seeding gallery items and blog categories...");

  const galleryItems = [
    {
      title: "Kebersamaan Siswa SMK Telkom Malang",
      caption_id: "Momen kebersamaan rekan sejawat di SMK Telkom Malang dalam suasana belajar dan kolaborasi tim.",
      caption_en: "Collaboration and student life at SMK Telkom Malang during group studies and teamwork.",
      image_path: mediaMap.gallery1 || "gallery/kegiatan-smk-telkom-1.jpg",
      alt_text: "Dokumentasi kebersamaan siswa SMK Telkom Malang",
      category: "activity",
      sort_order: 1,
      status: "published",
      published_at: "2026-10-08T00:00:00Z",
    },
    {
      title: "Diskusi & Brainstorming Proyek Tim",
      caption_id: "Sesi diskusi perencanaan arsitektur proyek dan pengujian teknologi bersama tim.",
      caption_en: "Project planning and technical discussion session with team members.",
      image_path: mediaMap.gallery2 || "gallery/kegiatan-smk-telkom-2.jpg",
      alt_text: "Sesi diskusi dan perencanaan sistem",
      category: "activity",
      sort_order: 2,
      status: "published",
      published_at: "2026-10-08T00:00:00Z",
    },
    {
      title: "Business Model Canvas — KontrolSehat",
      caption_id: "Kanvas model bisnis platform pemantauan penyakit kronis KontrolSehat untuk kompetisi inovasi kesehatan.",
      caption_en: "Comprehensive Business Model Canvas for the KontrolSehat chronic care platform.",
      image_path: mediaMap.galleryBmc || "gallery/bmc-kontrolsehat.png",
      alt_text: "Diagram Business Model Canvas KontrolSehat",
      category: "project",
      sort_order: 3,
      status: "published",
      published_at: "2026-10-19T00:00:00Z",
    },
  ];

  for (const g of galleryItems) {
    if (!g.image_path) continue;
    const { data: existingG } = await supabase
      .from("gallery_items")
      .select("id")
      .eq("image_path", g.image_path)
      .maybeSingle();

    if (!existingG) {
      const { error: gErr } = await supabase.from("gallery_items").insert(g);
      if (gErr) console.error(`  ❌ Failed inserting gallery item '${g.title}': ${gErr.message}`);
      else console.log(`  ✓ Gallery item '${g.title}' seeded`);
    } else {
      console.log(`  ℹ Gallery item '${g.title}' already exists (preserved)`);
    }
  }

  const blogCategories = [
    {
      name_id: "Rekayasa Perangkat Lunak",
      name_en: "Software Engineering",
      slug: "software-engineering",
      sort_order: 1,
    },
    {
      name_id: "Jaringan Komputer & Infrastruktur",
      name_en: "Computer Networks & Infrastructure",
      slug: "computer-networks",
      sort_order: 2,
    },
    {
      name_id: "Kecerdasan Artifisial",
      name_en: "Artificial Intelligence",
      slug: "artificial-intelligence",
      sort_order: 3,
    },
  ];

  for (const cat of blogCategories) {
    const { data: existingCat } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("slug", cat.slug)
      .maybeSingle();

    if (!existingCat) {
      const { error: catErr } = await supabase.from("blog_categories").insert(cat);
      if (catErr) console.error(`  ❌ Failed inserting category '${cat.slug}': ${catErr.message}`);
      else console.log(`  ✓ Blog category '${cat.slug}' seeded`);
    } else {
      console.log(`  ℹ Blog category '${cat.slug}' already exists (preserved)`);
    }
  }

  console.log("\n==================================================================");
  console.log("PORTFOLIO CONTENT SEEDING COMPLETED SUCCESSFULLY");
  console.log("==================================================================");
}

seed().catch((err) => {
  console.error("❌ Fatal error during seeding:", err);
  process.exit(1);
});
