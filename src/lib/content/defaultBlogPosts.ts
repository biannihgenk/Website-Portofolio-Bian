import type { BlogPost } from "@/types/content";

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-vlan-packet-drop",
    slug: "membongkar-misteri-packet-drop-vlan-lab",
    title_id: "Membongkar Misteri Packet Drop di Jaringan VLAN Lab Sekolah",
    title_en: "Unraveling Packet Drop Mysteries on Our School Lab VLAN",
    excerpt_id:
      "Berawal dari keluhan koneksi putus-nyambung saat praktikum lab TKJ, kami menelusuri konfigurasi Trunking 802.1Q dan mendapati broadcast storm akibat miskonfigurasi spanning tree.",
    excerpt_en:
      "Triggered by intermittent dropouts during high school network lab sessions, we traced the 802.1Q trunking configuration and isolated a broadcast storm caused by spanning tree misconfiguration.",
    content_id: `Saat sesi praktikum routing dan switching di SMK Telkom Malang, tim lab kami menemui anomali yang cukup membingungkan: paket ICMP drop secara berkala setiap 45 detik saat trafik menuju gateway utama melonjak di atas 80 Mbps. Pada simulator Cisco Packet Tracer, topologi identik berjalan mulus tanpa kendala, namun begitu diimplementasikan pada perangkat fisik MikroTik RB4011 dan switch manageable Cisco Catalyst 2960, lampu indikator port mulai berkedip liar (*packet storm*).

## Menelusuri Jalur Melalui Port Mirroring

Langkah investigasi pertama yang kami lakukan adalah mengaktifkan port mirroring (SPAN) pada switch inti dan mengalirkan salinan frame Ethernet ke laptop Linux yang menjalankan Wireshark.

\`\`\`bash
# Konfigurasi SPAN session pada Cisco Catalyst
Switch(config)# monitor session 1 source interface GigabitEthernet0/24
Switch(config)# monitor session 1 destination interface GigabitEthernet0/10
Switch(config)# end
\`\`\`

Begitu capture dimulai, Wireshark langsung dibanjiri jutaan frame ARP request *who-has* dengan laju ribuan packet per detik. Kami mendapati adanya loop layer-2 karena salah satu kabel patch di patch panel B dicolokkan melingkar (*cross-connect loop*) oleh siswa sesi praktikum sebelumnya, sementara protokol Rapid Spanning Tree Protocol (RSTP) pada switch trunking tersebut berada dalam kondisi \`disabled\`.

## Solusi & Konfigurasi Proteksi

Untuk memitigasi anomali ini secara permanen, kami menerapkan tiga lapis proteksi di level switch access dan gateway MikroTik:

1. **Mengaktifkan RSTP secara global** agar port otomatis memblokir jalur alternatif jika mendeteksi BPDU loop.
2. **Mengaktifkan BPDU Guard** pada semua port akses terminal siswa.
3. **Mengonfigurasi Storm Control** pada interface trunking untuk membatasi paket broadcast maksimal 5% dari total bandwidth interface.

\`\`\`bash
# Mengaktifkan RSTP dan BPDU Guard
Switch(config)# spanning-tree mode rapid-pvst
Switch(config)# interface range FastEthernet0/1 - 24
Switch(config-if-range)# spanning-tree portfast
Switch(config-if-range)# spanning-tree bpduguard enable
Switch(config-if-range)# storm-control broadcast level 5.00
Switch(config-if-range)# exit
\`\`\`

## Refleksi Pembelajaran

> Simulasi software adalah guru yang baik untuk memahami konsep dasar protokol, tapi kabel fisik lab dengan switch sungguhan mengajarkan kita kenyataan pahit: kabel berisik, loop manusiawi, dan pentingnya storm control sebelum memasang uplink utama.

Kini, setiap kali praktikum dimulai, checklist pertama kami bukan lagi membuka browser, melainkan memverifikasi status spanning-tree bridge dan memastikan tidak ada kabel jumper liar yang terhubung tanpa isolasi VLAN yang benar.`,
    content_en: `During our switching and routing lab session at SMK Telkom Malang, our team encountered an anomalous bottleneck: ICMP ping packets dropped periodically every 45 seconds once uplink traffic exceeded 80 Mbps. In Cisco Packet Tracer simulations, the exact same topology behaved flawlessly, but once deployed onto physical MikroTik RB4011 routers and Cisco Catalyst 2960 switches, interface LEDs flashed erratically in a clear packet storm.

## Capturing the Anomaly via Port Mirroring

Our first diagnostic step was enabling Switch Port Analyzer (SPAN) on the core switch, streaming mirrored frames into Wireshark on our Linux laptop.

\`\`\`bash
# Configure SPAN monitor session on Cisco Catalyst
Switch(config)# monitor session 1 source interface GigabitEthernet0/24
Switch(config)# monitor session 1 destination interface GigabitEthernet0/10
Switch(config)# end
\`\`\`

Immediately, Wireshark flooded with millions of repetitive ARP broadcast packets. A patch cable in rack panel B had been looped back onto itself during an earlier student drill, while Rapid Spanning Tree Protocol (RSTP) had inadvertently been left disabled on the trunk bridge.

## Resolution & Defense in Depth

To resolve this issue permanently, we implemented three key protective layers:

1. **Globally enabled Rapid PVST+** to automatically prune redundant paths upon detecting loop BPDUs.
2. **Enabled BPDU Guard** on all edge access ports connected to student benches.
3. **Applied Storm Control** on trunk links capping broadcast traffic at 5% capacity.

## The Takeaway

> Software simulators teach you how protocols theoretically communicate; physical lab switches teach you human error, crimping flaws, and the absolute necessity of storm control before turning on uplinks.`,
    cover_image_path:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCJ4kTy6Iwmr-c5ACv8yZ-W2fETdmQxj2D-ww0mr7wTMIOfyCzTf2OWLpUnh1JQENJpkjYu4xVDVJCBIALvit88tszmPQc9OK16Cv7M6Vj_utv457rPIpmK_kwmejapkuxgiWtPtb3L3brdJfXylkepFWpQGQJxTtDLkZCdpv2qtKSnC7yRwSIZlqSn-9EdVyj7VaokI3taBF0nZjRl--zrTakba_0mSPfXuJd8_Gfi_uTmCy5csBYpOVuxZ_rKa0QRA",
    category_id: "5c89eb9a-d6bc-4c85-8b46-ee98011c3daf",
    category: {
      id: "5c89eb9a-d6bc-4c85-8b46-ee98011c3daf",
      name_id: "Jaringan & Eksperimen",
      name_en: "Tech & Experiments",
      slug: "tech-experiments",
      sort_order: 1,
      created_at: "2026-10-22T08:18:35.880148+00:00",
      updated_at: "2026-10-22T08:18:35.880148+00:00",
    },
    tags: ["#MikroTik", "#VLAN", "#Wireshark", "#Cisco", "#SpanningTree"],
    is_featured: true,
    reading_time_minutes: 7,
    seo_title_id: "Membongkar Misteri Packet Drop di Jaringan VLAN Lab Sekolah",
    seo_title_en: "Unraveling Packet Drop Mysteries on Our School Lab VLAN",
    seo_description_id: "Analisis packet storm, wireshark capture, dan perbaikan konfigurasi RSTP di SMK Telkom Malang.",
    seo_description_en: "Deep dive packet storm analysis, wireshark debugging, and RSTP remediation.",
    status: "published",
    published_at: "2026-10-24T00:00:00.000Z",
    created_at: "2026-10-24T00:00:00.000Z",
    updated_at: "2026-10-24T00:00:00.000Z",
  },
  {
    id: "post-sqlite-portfolio-db",
    slug: "merancang-arsitektur-database-portofolio-tanpa-beban",
    title_id: "Merancang Arsitektur Database Portofolio Tanpa Beban",
    title_en: "Designing a Frictionless Portfolio Database Architecture",
    excerpt_id:
      "Refleksi memilih database yang pas untuk projek portofolio siswa SMK: cepat, portabel, dan mudah di-maintain saat live demo tanpa VPS rumit.",
    excerpt_en:
      "Reflections on choosing the ideal database setup for high school student portfolios: rapid hydration, zero VPS headaches, and portable migration.",
    content_id: `Banyak pemula tergoda langsung menggunakan kluster Postgres terdistribusi atau microservices yang rumit hanya untuk website portofolio personal. Akibatnya, saat server free tier tertidur atau kehabisan kredit, website portofolio gagal dibuka oleh reviewer dan calon pembimbing magang.

## Kenapa Arsitektur Sederhana Selalu Menang

Dalam artikel ini, saya membedah arsitektur hybrid yang kami gunakan: database PostgreSQL terkelola dengan Row Level Security (RLS) di Supabase yang digabungkan dengan Next.js Server Components.

\`\`\`typescript
// Pola query aman dan cepat dengan Next.js Server Components
export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
\`\`\`

## Keunggulan yang Terasa Langsung

1. **Cold-start nol detik**: Karena memanfaatkan Next.js dynamic caching dan static pre-render.
2. **Keamanan terjamin**: Secret role key tidak pernah bocor ke bundle JavaScript browser.
3. **Data real-time**: Setiap update di CMS langsung tampil di halaman publik saat cache direvalidasi.`,
    content_en: `Many junior developers get seduced into spinning up heavyweight distributed databases and convoluted architectures just for a portfolio showcase. The consequence? When free-tier instances sleep, recruiters and internship mentors are greeted with timeout spinners.

## Why Sensible Architecture Wins

Here is a breakdown of our hybrid approach: managed Supabase PostgreSQL secured via Row Level Security (RLS), consumed directly through Next.js Server Components.

## The Key Advantages

1. **Sub-20ms response times**: Benefiting from edge pre-rendering and clean query indices.
2. **Zero exposed secrets**: Service keys stay strictly on the server boundary.
3. **Instant publishing**: Admin CMS edits reflect without rebuilding static assets.`,
    cover_image_path:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhnwawLpaSEP3umksZwsQ5kv0Th8Sa6kOWv_ThpionlsL6FY3Uq-MFOFD6PIrgCfJbfsvZpLzlYN48TAON4X-Pe7O9QfphdJ9VO3IVFtmfh2HU2uja8ejLXRBOMbFh-s_t2-bLCJp0xhFITx45ywtHIvQIDxtHCj9Ta5eO5CfpoAgvwJTLItj0Rz8ksOMghw871zBGgwZI2dyUYNoZrQ0qf64jX2f0JoHIMNhC8RhTXFWrDxUUMiYNWqFtb1119lsFPg",
    category_id: "4b5c3fe9-0c81-4132-be52-e5d509ea8c04",
    category: {
      id: "4b5c3fe9-0c81-4132-be52-e5d509ea8c04",
      name_id: "Proyek & Rekayasa",
      name_en: "Building Projects",
      slug: "building-projects",
      sort_order: 2,
      created_at: "2026-10-22T08:18:35.407529+00:00",
      updated_at: "2026-10-22T08:18:35.407529+00:00",
    },
    tags: ["#NextJS", "#Supabase", "#PostgreSQL", "#Architecture"],
    is_featured: false,
    reading_time_minutes: 5,
    seo_title_id: "Merancang Arsitektur Database Portofolio Tanpa Beban",
    seo_title_en: "Designing a Frictionless Portfolio Database Architecture",
    seo_description_id: "Pilihan arsitektur database modern untuk portofolio developer muda.",
    seo_description_en: "Modern lightweight database patterns for developer portfolios.",
    status: "published",
    published_at: "2026-10-18T00:00:00.000Z",
    created_at: "2026-10-18T00:00:00.000Z",
    updated_at: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "post-clear-command-psychology",
    slug: "perintah-clear-5-kali-dan-kebiasaan-developer",
    title_id: "Perintah 'clear' 5 Kali dan Anatomi Kebiasaan Developer Pemula",
    title_en: "Running 'clear' Five Times: The Anatomy of a Developer Habit",
    excerpt_id:
      "Sebuah esai ringan tentang kebiasaan psikologis di terminal Linux, mengapa kita butuh kanvas kosong sebelum mengetik perintah berbahaya.",
    excerpt_en:
      "A lighthearted essay on terminal psychology: why developers crave a blank canvas before executing high-stakes shell commands.",
    content_id: `Setiap kali terminal Linux dipenuhi tumpukan pesan error atau log output yang panjang, hal pertama yang hampir secara refleks dilakukan seorang programmer adalah mengetik \`clear\` berulang kali, atau menekan shortcut \`Ctrl + L\` berkali-kali.

Secara psikologis, ini bukan sekadar membersihkan baris teks pada terminal emulator. Ini adalah **ritual reset mental**: membuang kegagalan sebelumnya dan membuka ruang fokus baru tanpa distorsi error lama.

> Jangan merasa bersalah jika kamu sering melakukannya. Layar yang bersih mencerminkan pikiran yang siap menyusun hipotesis baru untuk mengatasi problem teknis berikutnya.`,
    content_en: `Whenever a shell terminal fills up with stack traces, failed compile logs, or noisy verbose output, almost every developer instinctively types \`clear\` multiple times or mashes \`Ctrl + L\`.

Cognitively, this is more than refreshing terminal scrollback. It acts as a **mental reset ritual**: closing the visual weight of previous failures to make room for a clean slate.`,
    cover_image_path:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoUP05yQctOP8r340uXy-HAVq_3G7WdVNXO-TpHsuqLWnuLY63jQDMgS7Kqq1ZCbxoQWL5u0o4tDpVEAxvmXLnIh7Ufg0di4U9K-CWvWgkhbOGxz8TtZ3b2HEAXM4qqncHvkMThc5w3Ngs-8ktKI5xRxZjXSJPlcUaCILgknFHK_AUC5qFSZUxi6E-PRdUdXDdl057AnTUj3Q5ViWLpTIhkgerwo7x42_B9GJP_QUyHI8F3C8vMWzG",
    category_id: "7f11794f-8a33-414b-822f-5e3d6bc45898",
    category: {
      id: "7f11794f-8a33-414b-822f-5e3d6bc45898",
      name_id: "Catatan Belajar",
      name_en: "Learning Notes",
      slug: "learning-notes",
      sort_order: 3,
      created_at: "2026-10-22T08:18:36.392745+00:00",
      updated_at: "2026-10-22T08:18:36.392745+00:00",
    },
    tags: ["#Linux", "#Bash", "#Terminal", "#Productivity"],
    is_featured: false,
    reading_time_minutes: 4,
    seo_title_id: "Perintah 'clear' 5 Kali dan Anatomi Kebiasaan Developer Pemula",
    seo_title_en: "Running 'clear' Five Times: The Anatomy of a Developer Habit",
    seo_description_id: "Refleksi psikologis kebiasaan mengetik clear di terminal Linux.",
    seo_description_en: "Psychological reflections on terminal habits.",
    status: "published",
    published_at: "2026-10-12T00:00:00.000Z",
    created_at: "2026-10-12T00:00:00.000Z",
    updated_at: "2026-10-12T00:00:00.000Z",
  },
  {
    id: "post-laravel-api-security",
    slug: "mengamankan-rest-api-laravel-sanitasi-input",
    title_id: "Mengamankan REST API Laravel: Implementasi Sanitasi Input & Rate Limiter",
    title_en: "Hardening Laravel REST APIs: Input Sanitization & Rate Limiting in Practice",
    excerpt_id:
      "Menerapkan ilmu dari spesialisasi Secure Coding: proteksi SQL injection, pencegahan brute-force token JWT, dan isolasi role middleware.",
    excerpt_en:
      "Putting Secure Coding principles to work: SQL injection mitigations, JWT brute-force prevention, and middleware role isolation.",
    content_id: `Membangun REST API yang fungsional itu mudah, namun menjaganya agar tidak tumbang saat menerima serangan payload berbahaya adalah tantangan sesungguhnya. Artikel ini mengupas sanitasi data payload menggunakan FormRequest dan validasi regex ketat di Laravel.

\`\`\`php
// Contoh FormRequest dengan sanitasi ketat dan rate limiting
namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StoreTelemetryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Telemetry::class);
    }

    public function rules(): array
    {
        return [
            'device_id' => ['required', 'string', 'regex:/^[A-Z0-9_-]{6,16}$/'],
            'voltage'   => ['required', 'numeric', 'between:0,50'],
            'timestamp' => ['required', 'date'],
        ];
    }
}
\`\`\`

Dengan langkah-langkah sanitasi ini, celah injection umum dan bot scraping berulang dapat dibendung sebelum query database dieksekusi.`,
    content_en: `Crafting a functional REST endpoint is easy; shielding it against malicious payloads and runaway concurrency is where real craft begins. This log details FormRequest sanitization and Redis throttle gates.`,
    cover_image_path:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvFYdL_ZGBBZY-U4uYcY8xhfOWuyH0PS9D2M5j3EDzvLq_YAvsHtaffqUdS7hT9Ra0667FMVUH44DlMUThEz413QtD63seml9GA7zEiw7IbjJDWsNarFycHG8s4LHUmWk3Y0bU98bvAG39jl7JBT0nBvj8HrwzOX20rJp9p-pA7GjeJx4XqcFp__Y0VQL93ohK3WQ49caYclrXdtSM2EyPy7R6yNTmMb2uD2htKLB3L7OdvD5smjbMu02qH0ug0gkqEA",
    category_id: "5c89eb9a-d6bc-4c85-8b46-ee98011c3daf",
    category: {
      id: "5c89eb9a-d6bc-4c85-8b46-ee98011c3daf",
      name_id: "Jaringan & Eksperimen",
      name_en: "Tech & Experiments",
      slug: "tech-experiments",
      sort_order: 1,
      created_at: "2026-10-22T08:18:35.880148+00:00",
      updated_at: "2026-10-22T08:18:35.880148+00:00",
    },
    tags: ["#Laravel", "#API", "#Security", "#Backend"],
    is_featured: false,
    reading_time_minutes: 6,
    seo_title_id: "Mengamankan REST API Laravel: Implementasi Sanitasi Input",
    seo_title_en: "Hardening Laravel REST APIs: Input Sanitization",
    seo_description_id: "Langkah pengamanan API backend Laravel dengan validasi ketat.",
    seo_description_en: "Security best practices for Laravel REST backend.",
    status: "published",
    published_at: "2026-10-04T00:00:00.000Z",
    created_at: "2026-10-04T00:00:00.000Z",
    updated_at: "2026-10-04T00:00:00.000Z",
  },
  {
    id: "post-mindful-outside-server-room",
    slug: "di-luar-ruang-server-mengapa-menjauh-dari-layar-memecahkan-bug",
    title_id: "Di Luar Ruang Server: Mengapa Menjauh dari Layar Selalu Memecahkan 'Bug'",
    title_en: "Beyond the Server Room: Why Stepping Away Always Solves Tough Bugs",
    excerpt_id:
      "Jalan santai di pematang sawah Jawa Timur bukan sekadar healing, tapi cara biologis otak kita melakukan background garbage collection.",
    excerpt_en:
      "A quiet walk through East Java rice paddies isn't just relaxation—it's how our brain performs background garbage collection on stubborn bugs.",
    content_id: `Pernahkah kamu duduk berjam-jam memelototi satu file kode yang error, mencoba berbagai \`console.log\` tanpa hasil, lalu solusinya justru tiba-tiba muncul saat sedang mandi atau berjalan di luar ruangan?

Ilmu neurosains menyebut fenomena ini sebagai **mode berpikir difus** (*diffuse mode thinking*). Ketika kita berhenti memusatkan pandangan secara tegang ke monitor, otak bawah sadar tetap menghubungkan potongan memori dan pola masalah di latar belakang.

> Berjalan santai keluar lab bukan lagi tanda menyerah, melainkan bagian metodis dari proses debugging yang sah.`,
    content_en: `Have you ever spent four straight hours staring down a cryptic compiler error, only for the correct insight to strike unprompted while taking a walk outside?

Neuroscience describes this as **diffuse mode thinking**. Stepping away lets the subconscious mind assemble pattern fragments without tunnel vision.`,
    cover_image_path:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCIUtiT8RsDkoH40f8sevWHIFVruuX5lk_SOR-RGMCcuLXWcSetkymjavfdYvVJzuM5B12er_M3w86S96vLkc3hmu4wUk1jON0RXiA27Ls6CDq0vg8ZXMPejkX6X2vmR-xFMCdC5RwVd2fgwBF7fD5MSK3yiLDmLjnWjYhdADeadWOMaeLDdm-spQUXPyQOCq5Kqx5jq2y5HGilR-K9fs9hwROtFEWOuSv1lZn9W62evAhl07RQaM3cux9jx2APOAsKCg",
    category_id: "7f11794f-8a33-414b-822f-5e3d6bc45898",
    category: {
      id: "7f11794f-8a33-414b-822f-5e3d6bc45898",
      name_id: "Gagasan & Refleksi",
      name_en: "Ideas & Reflections",
      slug: "ideas-reflections",
      sort_order: 4,
      created_at: "2026-10-22T08:18:36.392745+00:00",
      updated_at: "2026-10-22T08:18:36.392745+00:00",
    },
    tags: ["#Reflections", "#Mindset", "#Malang", "#Debugging"],
    is_featured: false,
    reading_time_minutes: 3,
    seo_title_id: "Di Luar Ruang Server: Mengapa Menjauh dari Layar Selalu Memecahkan 'Bug'",
    seo_title_en: "Beyond the Server Room: Why Stepping Away Always Solves Tough Bugs",
    seo_description_id: "Eksplorasi diffuse mode thinking saat debugging di lab TKJ.",
    seo_description_en: "Exploration of diffuse thinking mode during software debugging.",
    status: "published",
    published_at: "2026-09-28T00:00:00.000Z",
    created_at: "2026-09-28T00:00:00.000Z",
    updated_at: "2026-09-28T00:00:00.000Z",
  },
  {
    id: "post-inotek-competition-retrospective",
    slug: "kilas-balik-lomba-inotek-48-jam-menjelang-presentasi",
    title_id: "Kilas Balik Lomba Inotek: 48 Jam Menjelang Presentasi Dewan Juri",
    title_en: "Inotek Competition Retrospective: 48 Hours Before the Jury Pitch",
    excerpt_id:
      "Cerita di balik panggung kompetisi inovasi digital: revisi UI menit akhir, persiapan offline cache, dan bagaimana kepanikan mengajarkan kami arti arsitektur cadangan yang tangguh.",
    excerpt_en:
      "Behind the curtain of our regional digital innovation pitch: last-minute UI tune-ups, offline caching fail-safes, and lessons in resilient architecture.",
    content_id: `Dua malam sebelum penjurian Inotek tingkat regional di Jawa Timur, koneksi Wi-Fi di aula venue mendadak tidak stabil karena ratusan peserta terhubung bersamaan. Projek kami yang bergantung pada webhook eksternal terancam gagal saat demo live di depan para akademisi.

Malam itu tim kami memutuskan refactor darurat: membangun offline mode menggunakan mock data server lokal dengan Docker container yang berjalan langsung di laptop presentasi.

Saat giliran tiba dan dewan juri meminta uji coba cepat tanpa internet, aplikasi kami berjalan tanpa kendala sedikit pun. 

> Aplikasi hebat di atas kertas tidak berguna jika ia gagal tampil tangguh di kondisi lapangan yang tak terduga.`,
    content_en: `Two nights before our Inotek competition presentation, the venue Wi-Fi collapsed under conference congestion. Our prototype, which relied on live webhooks, risked failing in front of the judging panel.

We pulled an emergency refactor: provisioning an offline containerized mock environment on localhost. When the jury asked for a live test without internet, our demo ran instantly without hiccups.`,
    cover_image_path:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsSshwDY8-2X2yEy_CMtVdKIPppiRZdpoJ8FkCo8rBzwMv17HV1d1bJvYmf_QEtxOKe-Hmmrn-bWSuDNZ_F_sRjioO7dOVFflwJqbt8n2AGStrYnAfOeQfRQGJ9lGkN91rEEYVy55EiUpsAi8zp6cKeeRcIyIpLIS0_LofWVfWYCNpgXAoEhOLyGFJ4rQ0vAty7VKm34XhwcDbtBpVx0G2KucjVduwf_TfbgJwbiq28WxI0pBf2BoxKzdQDffcCkN7Xw",
    category_id: "4b5c3fe9-0c81-4132-be52-e5d509ea8c04",
    category: {
      id: "4b5c3fe9-0c81-4132-be52-e5d509ea8c04",
      name_id: "Proyek & Rekayasa",
      name_en: "Building Projects",
      slug: "building-projects",
      sort_order: 2,
      created_at: "2026-10-22T08:18:35.407529+00:00",
      updated_at: "2026-10-22T08:18:35.407529+00:00",
    },
    tags: ["#Competition", "#Pitching", "#OfflineFirst", "#Inotek"],
    is_featured: false,
    reading_time_minutes: 8,
    seo_title_id: "Kilas Balik Lomba Inotek: 48 Jam Menjelang Presentasi",
    seo_title_en: "Inotek Competition Retrospective: 48 Hours Before Pitch",
    seo_description_id: "Catatan pengalaman kompetisi inovasi digital siswa SMK Telkom.",
    seo_description_en: "Lessons learned from digital innovation competition.",
    status: "published",
    published_at: "2026-09-15T00:00:00.000Z",
    created_at: "2026-09-15T00:00:00.000Z",
    updated_at: "2026-09-15T00:00:00.000Z",
  },
];
