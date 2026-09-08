/*
 * Collision-safe Indonesian translation corrections from the completed one-pass audit.
 * Scope is /id/* only. German source pages and the unfinished FAQ are never changed.
 * Missing Indonesian pages, open image-pixel/render checks, source questions and disputed
 * second-episode percentages remain untouched.
 */
const VERSION = "2026-09-07-v1";

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function replaceRegex(text: string, pattern: RegExp, replacement: string) {
  return text.replace(pattern, replacement);
}

function commonFixes(html: string) {
  // Navigation source says "Lösungsansatz", not merely "Ansatz".
  html = replaceAll(html, '>Pendekatan Saya</a>', '>Pendekatan Solusi Saya</a>');
  html = replaceAll(html, 'Krisis Tinnitus Saya (Kisah Singkat)', 'Kolaps Tinnitus Saya (Kisah Singkat)');
  return html;
}

function fixBio1(html: string) {
  // Binding chronology: on day 3 the right ear had no perceived tinnitus.
  html = replaceAll(
    html,
    'Di telinga kanan, pada saat itu saya juga sudah mendengar bunyi bip yang lemah.',
    'Di telinga kanan, pada saat itu saya belum merasakan tinnitus apa pun.'
  );
  html = replaceAll(
    html,
    'bunyi bip lemah yang sebelumnya sudah ada di telinga kanan kini juga jauh lebih keras',
    'beberapa hari kemudian, setelah paparan suara tambahan, untuk pertama kalinya saya juga mulai mendengar bunyi bip di telinga kanan'
  );
  html = replaceAll(
    html,
    'memperkuat bunyi yang sudah ada di telinga kanan',
    'menyeret telinga kanan ikut masuk ke dalam masalah ini'
  );
  // Keep the metaphorical weight; do not convert the German unit into kilograms.
  html = replaceAll(html, 'Beban seberat 50 kilogram.', 'Beban yang luar biasa berat.');
  // German "bodenlose Trauer" describes depth, not lack of a reason.
  html = replaceAll(html, 'kesedihan tanpa dasar', 'kesedihan yang begitu dalam');
  html = replaceAll(html, 'untuk sia-sia', 'sia-sia');
  // On this biography the named role is Heilpraktiker, not a generic health practitioner.
  html = replaceAll(html, 'praktisi kesehatan', 'praktisi naturopati (Heilpraktiker)');
  return html;
}

function fixBio2(html: string) {
  html = replaceAll(html, 'praktisi kesehatan', 'praktisi naturopati (Heilpraktiker)');
  html = replaceAll(html, 'perusahaan yang saya tutup', 'situs perusahaan yang saya tutup');
  return html;
}

function fixShortBio(html: string) {
  // Binding chronology: day 3 left only; right appears later after further sound exposure.
  html = replaceAll(
    html,
    'Namun pada hari ke-3, monster yang sebenarnya terbangun: Mendadak muncul siulan dan derau neraka di telinga kiri – serta bunyi bip pelan di telinga kanan. Sistem saya akhirnya benar-benar kolaps.',
    'Namun pada hari ke-3, monster yang sebenarnya terbangun: Mendadak muncul siulan dan derau neraka di telinga kiri. Di telinga kanan, pada saat itu saya belum merasakan tinnitus apa pun. Sistem saya akhirnya benar-benar kolaps.'
  );
  html = replaceAll(
    html,
    'Setelah saya mengikuti saran itu dan terus membombardir diri saya dengan musik dan derau, bunyi pelan yang sudah ada di telinga kanan menjadi jauh lebih parah beberapa hari kemudian.',
    'Setelah saya mengikuti saran itu dan terus membombardir diri saya dengan musik dan derau, beberapa hari kemudian, setelah paparan suara tambahan, untuk pertama kalinya saya juga mulai mendengar bunyi di telinga kanan.'
  );
  // Source says the 100 -> 0 outcome was achieved, not merely fought for.
  html = replaceAll(
    html,
    'bagaimana saat itu saya bertarung menurunkan tinnitus saya dari 100% menjadi 0% lewat logika sekeras besi dan biohacking.',
    'bagaimana saat itu saya menurunkan tinnitus saya dari 100% menjadi 0% lewat logika sekeras besi dan biohacking.'
  );
  return html;
}

function fixApproach(html: string) {
  html = replaceAll(
    html,
    '<h1>Pendekatan saya: Apa tepatnya yang saya lakukan terhadap tinnitus kronis?</h1>',
    '<h1>Pendekatan solusi saya: Apa tepatnya yang saya lakukan terhadap tinnitus kronis?</h1>'
  );
  html = replaceAll(
    html,
    '"headline": "Pendekatan saya: Apa tepatnya yang saya lakukan terhadap tinnitus kronis?"',
    '"headline": "Pendekatan solusi saya: Apa tepatnya yang saya lakukan terhadap tinnitus kronis?"'
  );
  html = replaceAll(
    html,
    '"name": "Pendekatan pribadi terhadap tinnitus"',
    '"name": "Pendekatan solusi pribadi terhadap tinnitus"'
  );
  // Explicit author deletion: do not preserve the old causal bridge from first tinnitus to later CFS.
  html = replaceAll(
    html,
    '<p>Bukan tanpa alasan sekitar satu setengah sampai hampir dua tahun kemudian saya jatuh ke sindrom kelelahan kronis yang berat.</p>',
    ''
  );
  // It was a supplement pause, not stopping nutrition in general.
  html = replaceAll(html, 'pada awalnya saya sengaja menghentikan nutrisi', 'pada awalnya saya sengaja berhenti mengonsumsi suplemen');
  // "Sich nicht wehren" is not an inability to defend oneself.
  html = replaceAll(html, '“Tidak dapat membela diri”', '“Tidak membela diri”');
  // Local German source says Prgomet helped dissolve deep-seated tensions; do not add complete conflict resolution here.
  html = replaceAll(
    html,
    'saat itu sangat membantu saya menyelesaikan sepenuhnya konflik yang tertanam dalam dan mengembalikan keseimbangan sistem saraf otonom',
    'saat itu membantu saya mengurai ketegangan batin yang tertanam dalam itu'
  );
  html = replaceAll(
    html,
    'saya melihat dan mendengar kasus serta laporan pengalaman dari praktik Prgomet, ketika pasien lain membaik dengan jelas melalui kerja ini',
    'saya menyaksikan langsung di praktik bagaimana pasien lain membaik dengan jelas melalui kerja ini'
  );
  // German says "sobald" removal is happening, not only after it is over.
  html = replaceAll(html, 'setelah logam berat dikeluarkan', 'ketika logam berat mulai dikeluarkan');
  return html;
}

function fixProducts(html: string) {
  // Local Person source contains balance restoration but not the extra complete-conflict clause.
  html = replaceAll(
    html,
    'membantunya menyelesaikan konflik-konflik tersebut sepenuhnya dan mengembalikan keseimbangan sistem saraf otonomnya',
    'membantunya mengembalikan keseimbangan sistem saraf otonomnya'
  );
  // Source describes taking the measured amount, not merely putting it into water.
  html = replaceAll(
    html,
    'saya memasukkan tiga sendok takar bubuk ke dalam segelas air',
    'saya mengonsumsi tiga sendok takar bubuk dalam segelas air'
  );
  // Keep the list natural: the work caused stress; stress itself was not "used up".
  html = replaceAll(
    html,
    'selama bertahun-tahun semua itu menghabiskan sangat banyak waktu, energi, stres, dan uang saya.',
    'selama bertahun-tahun semua itu menyita sangat banyak waktu, energi, dan uang saya serta menimbulkan sangat banyak stres.'
  );
  return html;
}

function fixNoise(html: string) {
  // Current German noise page is already corrected: no right-ear tinnitus on day 3.
  html = replaceAll(
    html,
    'Seolah belum cukup, pada hari ketiga sudah muncul pula bunyi bip lemah di telinga kanan. Tak lama kemudian, bunyi di telinga kanan yang sudah ada itu menjadi jauh lebih kuat – sebagai akibat langsung dari instruksi dokter yang bagi saya pribadi ternyata sepenuhnya keliru.',
    'Seolah belum cukup, tak lama kemudian telinga kanan juga ikut terseret – sebagai akibat langsung dari instruksi dokter yang bagi saya pribadi ternyata sepenuhnya keliru.'
  );
  html = replaceAll(
    html,
    'karena justru itulah yang memperburuk keadaan saya dan membuat bunyi lemah yang sudah ada di telinga kanan menjadi jauh lebih kuat.',
    'karena justru itulah yang memperburuk keadaan saya dan membuat telinga kedua ikut terseret ke dalam masalah ini.'
  );
  // Restore the source's general onset distribution instead of a page-local autobiographical rewrite.
  html = replaceAll(
    html,
    'Tinnitus akibat kebisingan dapat langsung terasa setelah kejadian bising, tetapi juga baru disadari beberapa jam atau hari kemudian. Pada saya, nadanya baru terasa pada hari ke-3; sampai hari ini saya tidak tahu pasti mengapa. Kemungkinan penjelasannya akan saya jelaskan secara tegas sebagai hipotesis di bagian FAQ.',
    'Pada kebanyakan penderita, tinnitus muncul relatif segera setelah kejadian bising – dalam hitungan menit hingga beberapa jam. Namun ada juga kasus ketika tinnitus baru muncul beberapa jam atau bahkan beberapa hari kemudian. Mengapa perjalanannya bisa berbeda dan peran struktur tertentu di telinga saya jelaskan secara rinci di bagian FAQ.'
  );
  // A pathological tinnitus-like behaviour regressed; it did not "recover".
  html = replaceAll(
    html,
    'pola perilaku khas tinnitus hampir sepenuhnya pulih selama lima minggu',
    'pola perilaku khas tinnitus hampir sepenuhnya menghilang selama lima minggu'
  );
  // Restore the direct German conclusion; do not add a new menu of possible peripheral sources here.
  html = replaceAll(
    html,
    'Menurut model utama saya, tinnitus kronis akibat kebisingan secara fisiologis adalah sinyal keliru aktif dari jaringan perifer yang masih dapat dirangsang. Pada episode saya sendiri, saya menduga sumber utamanya berada pada sel rambut dalam yang masih hidup dan terjebak dalam mode darurat energi; keterlibatan saraf pendengaran atau mielin tetap saya anggap mungkin, tetapi tidak dapat saya buktikan dengan pasti pada diri saya. Otak tidak menciptakan nadanya dari ketiadaan sinyal, melainkan memperkuat sinyal keliru yang sudah ada.',
    html.includes('Menurut model utama saya, tinnitus kronis akibat kebisingan secara fisiologis adalah sinyal keliru aktif dari jaringan perifer yang masih dapat dirangsang.')
      ? 'Menurut keyakinan saya, secara fisiologis tinnitus kronis akibat kebisingan adalah sel hidup yang terjebak dalam mode darurat energi dan perbaikannya sebagian besar membeku di fase 1 karena energi untuk fase 2 tidak tersedia. Telinga bukan “rusak total” dan otak tidak mengarang sinyal hantu. Bunyi itu adalah hasil perjuangan bertahan hidup nyata di perifer yang hanya diperkuat oleh otak.'
      : 'Menurut model utama saya, tinnitus kronis akibat kebisingan secara fisiologis adalah sinyal keliru aktif dari jaringan perifer yang masih dapat dirangsang.'
  );
  html = replaceAll(html, 'Bagaimana saya berhasil – pendekatan saya', 'Bagaimana saya berhasil – pendekatan solusi saya');
  return html;
}

function fixGift(html: string) {
  // German source says exclusively noise-induced in Dustin's own case.
  html = replaceAll(
    html,
    'Pada saya, pemicu utamanya saat itu memang kebisingan, sehingga yang saya alami adalah tinnitus klasik akibat kebisingan – bukan kejadian obat akut –',
    'Pada saya, tinnitus saat itu memang sepenuhnya disebabkan oleh kebisingan – bukan dipicu oleh kejadian obat akut –'
  );
  // The calcium pump is the enzyme in this local model, not an alternative object.
  html = replaceAll(
    html,
    'pada enzim atau pompa kalsium bertenaga ATP,',
    'pada enzim, yaitu pompa kalsium bertenaga ATP,'
  );
  html = replaceAll(
    html,
    'enzim atau pompa kalsium bertenaga ATP membengkok',
    'enzim, yaitu pompa kalsium bertenaga ATP, membengkok'
  );
  // Part and whole are simultaneous, not alternatives.
  html = replaceAll(
    html,
    'pompa kalsium sudah bekerja mendekati batas, atau sel bekerja di tepi jurang.',
    'pompa kalsium sudah bekerja mendekati batas, dan sel sendiri juga bekerja di tepi jurang.'
  );
  html = replaceAll(html, 'Pendekatan saya – apa tepatnya yang saya lakukan?', 'Pendekatan solusi saya – apa tepatnya yang saya lakukan?');
  return html;
}

function fixStress(html: string) {
  // Restore the source's gradual early progress instead of pulling later full-resolution claims forward.
  html = replaceAll(
    html,
    '<p>Saya begitu putus asa sampai tidak mau membiarkan satu kemungkinan pun terlewat. Yang membantu saya saat itu bukan obat dan bukan pula terapi klasik, melainkan kerja bersama seorang praktisi naturopati dan dosen bernama Michael Prgomet, yang selama lebih dari 30 tahun menekuni mekanisme yang dibahas di halaman ini. Baru melalui pekerjaannya saya mendapat bantuan yang sangat kuat untuk menyelesaikan sepenuhnya konflik-konflik pada fase CFS dan psikosomatik saya serta mengembalikan keseimbangan sistem saraf otonom saya.</p>',
    '<p>Saya begitu putus asa sampai tidak mau membiarkan satu kemungkinan pun terlewat. Yang membantu saya saat itu bukan obat dan bukan pula terapi klasik, melainkan kerja bersama seorang Heilpraktiker dan dosen bernama Michael Prgomet, yang selama lebih dari 30 tahun menekuni mekanisme yang dibahas di halaman ini.</p>\n  <p>Baru melalui pekerjaannya saya saat itu mendapat bantuan untuk mengurai ketegangan batin yang tertanam dalam itu sedikit demi sedikit.</p>'
  );
  html = replaceAll(
    html,
    'Menurut model penjelasan saya, tinnitus akibat stres dapat muncul ketika konflik emosional yang belum terselesaikan mempertahankan pusat konflik sentral yang terus terlalu aktif dan ikut mengaktifkan jalur pemrosesan pendengaran. Ini adalah sintesis saya dari pendekatan Prgomet dan Klinghardt, kasus-kasus orang lain, serta riset saya sendiri – bukan khayalan.',
    'Hari ini saya bisa berkata: Tinnitus akibat stres bukan misteri dan bukan khayalan. Ia adalah akibat yang terdengar dari keadaan listrik permanen di otak, dipicu oleh konflik yang tidak pernah benar-benar terselesaikan. Jika kita memahami apa yang terjadi di sana, kita juga memahami mengapa bunyi itu ada – dan apa yang bisa kita lakukan sendiri.'
  );
  // Remove locally added source inventories/defensive framing that are not in the German blocks.
  html = replaceAll(
    html,
    '<p>Gagasan tentang proses tegangan dan medan lokal yang kecil saya ambil dari pendekatan Michael Prgomet dan Dr. Klinghardt lalu saya hubungkan dengan riset saya sendiri. Saya tidak mengklaim ada bukti MEG langsung untuk seluruh rantai “konflik yang belum terselesaikan → medan tegangan lokal → tinnitus”.</p>',
    ''
  );
  html = replaceRegex(
    html,
    /\s*<p><strong>Penting untuk penempatan yang tepat:<\/strong> Kedua episode tinnitus saya[^<]*<\/p>/,
    ''
  );
  // Restore the source's own field-effect statement instead of an added attribution/measurement caveat.
  html = replaceAll(
    html,
    '<p><strong>Keempat, melalui efek medan listrik kecil.</strong> Dalam bagian model saya yang diambil dari Michael Prgomet dan Dr. Klinghardt, efek medan dan muatan lokal yang kecil tetapi nyata memainkan peran. Menurut gambaran ini, sel saraf yang aktif secara sinkron dapat ikut merangsang sel di dekatnya. Ini adalah asumsi model yang secara jelas saya kaitkan dengan pendekatan tersebut, bukan proses yang diukur langsung pada tinnitus akibat stres.</p>',
    '<p><strong>Keempat, melalui efek medan listrik kecil.</strong> Ketika banyak sel saraf di suatu area kecil aktif secara bersamaan dan sinkron, terbentuk medan listrik lokal. Medan ini kecil – tetapi nyata, dan dapat benar-benar mendorong sel tetangga melewati ambangnya sehingga sel-sel itu ikut menembak.</p>'
  );
  html = replaceAll(
    html,
    '<p>Bola Van de Graaff dan “kilat kecil” dalam model ini menggambarkan proses fisik kecil yang diasumsikan – bukan tegangan tinggi, bukan percikan yang terlihat, dan bukan proses yang diukur langsung pada tinnitus akibat stres. Jika muncul pemicu atau faktor seperti kurang tidur, kelelahan, dan ketegangan batin tinggi bekerja bersama, medan yang diasumsikan ini dapat menguat dan menurut model tersebut ikut merangsang jalur saraf peka di dekatnya.</p>',
    '<p>Mekanisme listrik ini dapat dibayangkan kira-kira seperti bola Van de Graaff kecil di sistem saraf (tentu hanya sebagai gambaran – tegangan sebenarnya jauh lebih rendah daripada bola tegangan tinggi sungguhan, tetapi prinsip kerjanya sama): Selama konflik hanya sedikit aktif, tidak banyak yang terjadi. Namun ketika ada pemicu – atau beberapa faktor bekerja bersama seperti kurang tidur, kelelahan, dan ketegangan batin tinggi – medan itu semakin terisi. Pada suatu titik tegangannya cukup besar dan melepaskan muatan seperti kilat kecil ke jalur saraf sensitif di dekatnya. Jalur itu lalu ikut menembak.</p>'
  );
  // Remove the added HPA/cortisol excursus from this local translation block.
  html = replaceRegex(
    html,
    /\s*<p><strong>Penting untuk membedakannya:<\/strong> Stres HPA\/kortisol umum[^<]*<\/p>/,
    ''
  );
  html = replaceAll(
    html,
    'Fakta bahwa suatu gejala bertahan tanpa stres akut tidak dengan sendirinya menunjukkan satu penyebab tertentu; di dalam model ini, aktivitas sentral keliru yang menetap dapat menjadi salah satu penjelasan.',
    'Petunjuk yang menentukan adalah durasinya: Jika suatu gejala tetap ada bahkan tanpa stres akut, biasanya terdapat aktivitas listrik keliru yang kronis di dalam sistem saraf.'
  );
  // Restore the source's historical proof claim and keep it local; do not add new external caveats.
  html = replaceAll(html, 'Apa yang dapat ditunjukkan oleh rangsangan listrik pada otak', 'Bukti ilmiah: rangsangan listrik menghasilkan bunyi');
  html = replaceAll(
    html,
    'Penfield dan Perot melaporkan pada 1963 bahwa stimulasi listrik pada korteks memicu pengalaman auditori tanpa sumber suara eksternal pada sebagian pasien. Hal itu mendukung titik sempit bahwa rangsangan listrik pada otak dapat memicu persepsi bunyi. Hal itu tidak membuktikan pusat konflik yang belum terselesaikan maupun jalur medan dan pelepasan muatan yang diasumsikan.',
    'Sejak tahun 1950-an, peneliti seperti Wilder Penfield di Montreal melakukan eksperimen dengan merangsang otak pasien secara listrik. Banyak pasien mendengar bunyi, musik, atau suara meski tidak ada sumber akustik. Eksperimen ini menunjukkan: Jika area otak tertentu atau saraf pendengaran dirangsang secara listrik, sebuah bunyi dapat muncul – bahkan tanpa sumber suara.'
  );
  html = replaceAll(
    html,
    'Penerapannya pada tinnitus akibat stres adalah bagian dari model penjelasan saya, bukan bukti eksperimen langsung. Dalam model ini, rangsangan tidak datang dari luar melalui elektroda, melainkan dari aktivitas sentral yang terus berlangsung berkaitan dengan konflik yang belum terselesaikan.',
    'Prinsip inilah yang menurut model saya juga berlaku pada tinnitus akibat stres. Hanya saja rangsangannya tidak datang dari luar melalui elektroda, melainkan dari dalam melalui aktivitas listrik permanen akibat konflik yang belum terselesaikan.'
  );
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  html = commonFixes(html);
  const p = pathname.replace(/\.html$/, '');
  switch (p) {
    case '/id/kisah-tinnitus-saya-bagian-1': return fixBio1(html);
    case '/id/kisah-tinnitus-saya-bagian-2': return fixBio2(html);
    case '/id/tinnitus-sembuh-kisah-saya': return fixShortBio(html);
    case '/id/pendekatan-saya': return fixApproach(html);
    case '/id/produk': return fixProducts(html);
    case '/id/tinnitus-akibat-kebisingan': return fixNoise(html);
    case '/id/tinnitus-akibat-obat-dan-zat-beracun': return fixGift(html);
    case '/id/tinnitus-akibat-stres': return fixStress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  if (url.pathname === '/id/faq' || url.pathname === '/id/faq.html') return context.next();
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const fixed = applyPathFixes(url.pathname, html);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-id-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/id/*' };
export { applyPathFixes };
