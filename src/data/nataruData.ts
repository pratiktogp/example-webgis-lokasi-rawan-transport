import { BlackspotPoint, TransportCorridor, EmergencyPost, EscapeRamp } from '../types/gis';

export const BLACKSPOT_POINTS: BlackspotPoint[] = [
  {
    id: 'bs-01',
    code: 'JBR-TOL-01',
    name: 'Tol Cipali KM 86 - KM 92 (Subang)',
    roadName: 'Jalan Tol Cikopo - Palimanan',
    kmMarker: 'KM 86+200 s/d KM 92+800',
    province: 'Jawa Barat',
    cityRegency: 'Kabupaten Subang',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Tol',
    severity: 'Tinggi',
    coordinates: [107.643, -6.483],
    elevationMeters: 45,
    riskFactors: [
      'Titik jenuh / lelah pengemudi (micro-sleep) pasca perjalanan malam dari Jabodetabek',
      'Jalur geometrik lurus panjang memicu kecepatan tinggi (>120 km/jam)',
      'Perbedaan kecepatan signifikan antara kendaraan pribadi dan truk muatan berat (ODOL)'
    ],
    historicalIncidentSummary: '18 Kasus Laka Lantas (Nataru 2024 & 2025), 6 Meninggal Dunia, 14 Luka Berat',
    recommendedSpeedKmh: 80,
    mitigationActions: [
      'Pemasangan pita kejut (rumble strips) dan lampu strobo malam hari',
      'Patroli mobile Polisi PJR dan Jasa Marga bersirene setiap 30 menit',
      'Pos Pelayanan Kesehatan rest area darurat KM 86'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pengamanan Terpadu Rest Area KM 86 B',
      distanceKm: 2.1,
      phone: '0260-418123'
    },
    facilities: ['Mobil Derek Gratis 24 Jam', 'Ambulans Siaga Trauma Center', 'Pos Polisi PJR', 'Variable Message Sign (VMS)'],
    description: 'Segmen Tol Cipali KM 86-92 merupakan salah satu blackspot paling rawan kecelakaan fatal di Pulau Jawa saat arus mudik/balik libur Nataru. Pengemudi dari Jakarta umumnya memasuki fase kelelahan berat pada titik ini.',
    operationalNotes2026: 'Diberlakukan penambahan speed gun portable dan pos istirahat kopi gratis untuk mitigasi microsleep.'
  },
  {
    id: 'bs-02',
    code: 'JBR-TOL-02',
    name: 'Tol Cipali KM 117 - KM 130 (Subang - Indramayu)',
    roadName: 'Jalan Tol Cikopo - Palimanan',
    kmMarker: 'KM 117+800 s/d KM 130+200',
    province: 'Jawa Barat',
    cityRegency: 'Kabupaten Indramayu',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Tol',
    severity: 'Tinggi',
    coordinates: [108.019, -6.602],
    elevationMeters: 38,
    riskFactors: [
      'Tabrak belakang akibat jarak aman tidak terjaga di lajur cepat',
      'Genangan air (aquaplaning) saat hujan lebat musim penghujan Desember',
      'Lampu penerangan jalan minim pada malam hari'
    ],
    historicalIncidentSummary: '14 Kasus Laka Lantas, 5 Meninggal Dunia, 9 Luka Berat',
    recommendedSpeedKmh: 80,
    mitigationActions: [
      'Pembersihan saluran drainase samping jalan tol secara berkala',
      'Speed trap optik dan peringatan dini cuaca pada layar VMS',
      'Penyiagaan rescue vehicle khusus evakuasi cepat laka ganda'
    ],
    nearestEmergencyPost: {
      name: 'Pos Siaga Nataru Rest Area KM 130 A',
      distanceKm: 1.4,
      phone: '0234-567890'
    },
    facilities: ['Mobil Derek Berat', 'Pos Medis Dinkes', 'CCTV Pemantau Korlantas'],
    description: 'Kawasan ini memiliki intensitas angin samping dan sering dilanda hujan lebat mendadak di akhir Desember yang menimbulkan lapisan tipis air berisiko aquaplaning.',
    operationalNotes2026: 'Penerapan batas kecepatan dinamis 60-80 km/jam saat cuaca hujan lebat terpantau radar BMKG.'
  },
  {
    id: 'bs-03',
    code: 'JBR-ART-01',
    name: 'Turunan & Tanjakan Nagreg (Bandung - Garut)',
    roadName: 'Jalan Nasional Arteri Jalur Selatan',
    kmMarker: 'KM 36 s/d KM 41 Nagreg',
    province: 'Jawa Barat',
    cityRegency: 'Kabupaten Bandung',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Tinggi',
    coordinates: [107.893, -7.026],
    elevationMeters: 840,
    riskFactors: [
      'Kemiringan jalan ekstrem mencapai 15% memicu rem blong kendaraan bus/truk',
      'Tikungan tajam berkontur pegunungan dengan jurang di sisi jalan',
      'Kepadatan antrean pemudik roda dua yang rentan terserempet'
    ],
    historicalIncidentSummary: '22 Insiden (Mayoritas Rem Blong & Truk Mundur), 2 Meninggal Dunia, 18 Luka-Luka',
    recommendedSpeedKmh: 40,
    mitigationActions: [
      'Pengoperasian jalur lingkar Nagreg untuk pemecahan arus',
      'Penyiagaan ganjal ban darurat oleh petugas linmas dan pramuka',
      'Pengecekan kelaikan rem (ramp check) mendadak sebelum tanjakan'
    ],
    nearestEmergencyPost: {
      name: 'Pos Gabungan Nagreg Satlantas Polresta Bandung',
      distanceKm: 0.8,
      phone: '022-7951110'
    },
    facilities: ['Jalur Penyelamat (Escape Ramp Nagreg)', 'Derek Khusus Truk Berat', 'Tenda Istirahat Rider Motor'],
    description: 'Titik krusial lintasan selatan Jawa Barat yang menghubungkan Bandung menuju Garut, Tasikmalaya, dan Jawa Tengah. Sangat rawan rem blong pada turunan curam saat hujan.',
    operationalNotes2026: 'Posko ganjal ban resmi disediakan di 4 titik tanjakan curam oleh Dishub Jabar.'
  },
  {
    id: 'bs-04',
    code: 'JTG-ART-01',
    name: 'Jalur Alas Roban (Kawasan Batang)',
    roadName: 'Jalan Nasional 1 Pantura Jawa',
    kmMarker: 'Jalur Lama Alas Roban KM 48-52',
    province: 'Jawa Tengah',
    cityRegency: 'Kabupaten Batang',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Sedang',
    coordinates: [109.916, -6.973],
    elevationMeters: 160,
    riskFactors: [
      'Tikungan tajam ganda beruntun di tengah kawasan hutan jati',
      'Truk tronton bermuatan berat sering mogok atau terguling di tanjakan',
      'Kondisi jalan licin bercampur embun/hujan malam hari'
    ],
    historicalIncidentSummary: '11 Kasus Laka, 3 Meninggal Dunia, 12 Luka Ringan',
    recommendedSpeedKmh: 45,
    mitigationActions: [
      'Pemisahan arus bus/truk ke Jalur Lingkar Alas Roban',
      'Pemasangan mata kucing reflektif ekstra di aspal sepanjang tikungan',
      'Peningkatan penerangan jalan tenaga surya (PJU)'
    ],
    nearestEmergencyPost: {
      name: 'Pos Lantas Alas Roban Polres Batang',
      distanceKm: 1.2,
      phone: '0285-391010'
    },
    facilities: ['Derek Polantas', 'Bengkel Siaga Darurat', 'Pos Reaksi Cepat'],
    description: 'Jalur legendaris pantura berbukit dengan tikungan parabolik tajam. Walaupun ada jalan tol, jalur arteri ini tetap dipadati pemotor dan angkutan logistik saat puncak Nataru.',
    operationalNotes2026: 'Dilarang melintas untuk truk roda 6 ke atas pada jam sibuk mudik malam hari.'
  },
  {
    id: 'bs-05',
    code: 'JTG-TOL-01',
    name: 'Tol Batang - Semarang KM 370 - KM 375',
    roadName: 'Jalan Tol Batang - Semarang',
    kmMarker: 'KM 370+400',
    province: 'Jawa Tengah',
    cityRegency: 'Kabupaten Kendal',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Tol',
    severity: 'Tinggi',
    coordinates: [110.044, -6.978],
    elevationMeters: 22,
    riskFactors: [
      'Titik kantuk ekstrem akumulatif (jarak tempuh 350+ km dari barat)',
      'Kontur aspal bergelombang minor pada kecepatan di atas 100 km/jam',
      'Kepadatan kendaraan melambat mendekati exit rest area'
    ],
    historicalIncidentSummary: '9 Kecelakaan Fatal (Termasuk Insiden Bus Pariwisata Terguling), 7 Meninggal Dunia',
    recommendedSpeedKmh: 80,
    mitigationActions: [
      'Pemberlakuan delay system dan pengalihan ke rest area KM 379 A',
      'Pemasangan simulator suara gemuruh ban di lajur 1 dan 2',
      'Pos pengingat istirahat (wake-up call patrol)'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pelayanan Rest Area KM 379 A Batang',
      distanceKm: 2.5,
      phone: '0285-449231'
    },
    facilities: ['Layanan Medis 24 Jam', 'Mobil Derek Tol Trans Jawa', 'Helipad Darurat RS'],
    description: 'Lokasi insiden tragis tabrak pembatas pada periode liburan sebelumnya akibat sopir mengantuk berat saat fajar (03.00 - 06.00 WIB).',
    operationalNotes2026: 'Fasilitas sound alarm peringatan kantuk aktif di KM 368 menyala otomatis setiap 10 detik di dini hari.'
  },
  {
    id: 'bs-06',
    code: 'JTG-TOL-02',
    name: 'Turunan Tembalang / Jatingaleh KM 424 (Semarang)',
    roadName: 'Jalan Tol Semarang Seksi ABC',
    kmMarker: 'KM 424+200',
    province: 'Jawa Tengah',
    cityRegency: 'Kota Semarang',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Tol',
    severity: 'Tinggi',
    coordinates: [110.428, -7.039],
    elevationMeters: 195,
    riskFactors: [
      'Turunan panjang berkelok tajam sebelum gerbang tol Tembalang',
      'Brake fade (rem kehilangan daya cengkeram karena panas berlebih)',
      'Pertemuan arus padat dari arah Solo/Yogya dan Jakarta'
    ],
    historicalIncidentSummary: '16 Kasus Laka, 4 Meninggal Dunia, 10 Luka Berat',
    recommendedSpeedKmh: 60,
    mitigationActions: [
      'Jalur penyelamat darurat (emergency escape ramp) di dasar turunan',
      'Rambu imbauan gigi rendah (low gear) bertaraf internasional',
      'Thermal camera deteksi suhu piringan rem truk'
    ],
    nearestEmergencyPost: {
      name: 'Posko Terpadu Simpang Lima / Jatingaleh',
      distanceKm: 1.8,
      phone: '024-8415050'
    },
    facilities: ['Emergency Escape Ramp (Jalur Penyelamat)', 'Mobil Pemadam Kebakaran Kecil', 'Derek Siaga'],
    description: 'Turunan paling curam di jaringan tol dalam kota Semarang. Banyak kendaraan muatan gagal mengerem dan menabrak pembatas jalan atau mobil di depannya.',
    operationalNotes2026: 'Pemeriksaan rem mandiri di rest area KM 429 wajib bagi bus wisata tujuan Solo/Surabaya.'
  },
  {
    id: 'bs-07',
    code: 'JTM-WIS-01',
    name: 'Jalur Cangar - Pacet (Mojokerto - Kota Batu)',
    roadName: 'Jalur Alternatif Pegunungan Cangar',
    kmMarker: 'KM 14 s/d KM 19 Pacet',
    province: 'Jawa Timur',
    cityRegency: 'Kabupaten Mojokerto',
    region: 'Jawa - Bali',
    transportMode: 'Jalur Wisata Pegunungan',
    severity: 'Tinggi',
    coordinates: [112.533, -7.712],
    elevationMeters: 1150,
    riskFactors: [
      'Turunan terjal turunan AMD Gotekan dengan gradien lebih dari 20%',
      'Mayoritas rem motor matic blong (vapor lock) saat wisatawan turun dari Batu',
      'Jurang sedalam puluhan meter di sisi kanan-kiri jalur tanpa guardrail penuh'
    ],
    historicalIncidentSummary: '34 Insiden Rem Blong Motor Matic, 5 Meninggal Dunia, 28 Luka-Luka',
    recommendedSpeedKmh: 30,
    mitigationActions: [
      'Penyediaan bantalan sekam penyelamat (emergency arresting beds)',
      'Relawan Welirang Rescue bersiaga 24 jam dengan air pendingin rem',
      'Pemberlakuan pembatasan kendaraan angkutan barang/bus besar'
    ],
    nearestEmergencyPost: {
      name: 'Posko Relawan Welirang Community Gotekan',
      distanceKm: 0.5,
      phone: '0321-681999'
    },
    facilities: ['Jalur Penyelamat Sekam & Ban', 'Pangkalan Air Dingin Rem', 'Unit Ambulans Siaga'],
    description: 'Blackspot nomor satu untuk wisatawan roda dua di Jawa Timur saat liburan Natal dan Tahun Baru. Sering terjadi motor matic meluncur bebas karena piringan cakram terbakar.',
    operationalNotes2026: 'Pos rest cooling wajib di rest area Cangar atas; petugas menghentikan pengendara untuk mendinginkan rem 15 menit.'
  },
  {
    id: 'bs-08',
    code: 'JTM-TOL-01',
    name: 'Tol Pandaan - Malang KM 77 (Lawang)',
    roadName: 'Jalan Tol Pandaan - Malang',
    kmMarker: 'KM 77+000 s/d KM 80+000',
    province: 'Jawa Timur',
    cityRegency: 'Kabupaten Malang',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Tol',
    severity: 'Sedang',
    coordinates: [112.697, -7.842],
    elevationMeters: 490,
    riskFactors: [
      'Kabut tebal mendadak di kawasan perbukitan Lawang sore-malam hari',
      'Jarak pandang terbatas di bawah 20 meter saat hujan lereng Gunung Arjuno',
      'Turunan melandai panjang yang memicu kecepatan tidak terkendali'
    ],
    historicalIncidentSummary: '10 Kasus Tabrakan Beruntun, 2 Meninggal Dunia, 11 Luka Ringan',
    recommendedSpeedKmh: 60,
    mitigationActions: [
      'Penyalaan lampu kabut otomatis dan sirine peringatan kabut',
      'Pemandu konvoi kendaraan (escorting) oleh mobil patroli tol saat kabut pekat',
      'Sensor cuaca otomatis (Automatic Weather Station) terintegrasi TMC'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pelayanan Rest Area Lawang KM 84',
      distanceKm: 3.2,
      phone: '0341-426800'
    },
    facilities: ['Mobil Derek Hidrolik', 'Lampu Sorot Kabut Bergerak', 'Pos Kesehatan'],
    description: 'Gerbang utama menuju kawasan wisata Malang Raya dan Kota Batu. Arus wisata melonjak tajam saat malam Tahun Baru bertepatan dengan kabut pegunungan pekat.',
    operationalNotes2026: 'Pemasangan marka reflektor fluorescent berkekuatan tinggi di sepanjang median jalan.'
  },
  {
    id: 'bs-09',
    code: 'JTM-ART-01',
    name: 'Jalur Pantura Hutan Baluran (Situbondo - Banyuwangi)',
    roadName: 'Jalan Nasional 1 Situbondo - Banyuwangi',
    kmMarker: 'KM 240 s/d KM 255 Baluran',
    province: 'Jawa Timur',
    cityRegency: 'Kabupaten Situbondo',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Sedang',
    coordinates: [114.398, -7.854],
    elevationMeters: 35,
    riskFactors: [
      'Jalur sempit melintasi tengah Taman Nasional Baluran tanpa penerangan',
      'Potensi satwa liar (banteng/monyet) melintas mendadak di jalan aspal',
      'Sulit sinyal seluler untuk panggilan darurat di beberapa titik hutan'
    ],
    historicalIncidentSummary: '8 Kasus Laka, 2 Meninggal Dunia, 6 Luka Berat',
    recommendedSpeedKmh: 50,
    mitigationActions: [
      'Penambahan pagar pengaman satwa di tepi kawasan konservasi',
      'Penyediaan Emergency Phone Solar Panel di 3 titik kritis',
      'Patroli gabungan Polhut Taman Nasional dan Satlantas Situbondo'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pantau Batangan Taman Nasional Baluran',
      distanceKm: 4.0,
      phone: '0338-672525'
    },
    facilities: ['Derek Polsek Banyuputih', 'Unit P3K Baluran', 'Pos Pemantau Dishub'],
    description: 'Satu-satunya urat nadi darat menuju Pelabuhan Ketapang bagi kendaraan dari jalur utara Jawa. Jalur sepi dan gelap menuntut kewaspadaan tinggi pengemudi.',
    operationalNotes2026: 'Disediakan radio komunikasi darurat VHF channel khusus pemudik di Pos Batangan.'
  },
  {
    id: 'bs-10',
    code: 'ASDP-MRK-01',
    name: 'Kompleks Buffer Zone & Dermaga Pelabuhan Merak',
    roadName: 'Akses Pelabuhan Penyeberangan Merak (Tol Tangerang - Merak Exit KM 98)',
    kmMarker: 'KM 98 Tol Merak s/d Dermaga Eksekutif',
    province: 'Banten',
    cityRegency: 'Kota Cilegon',
    region: 'Jawa - Bali',
    transportMode: 'Penyeberangan Ferry',
    severity: 'Tinggi',
    coordinates: [105.998, -5.932],
    elevationMeters: 5,
    riskFactors: [
      'Penumpukan kendaraan calon penumpang kapal ferry berjam-jam (bottleneck)',
      'Kelelahan ekstrem pengemudi dalam antrean antarkota memicu emosi & gesekan',
      'Cuaca buruk gelombang tinggi Selat Sunda mengganggu jadwal sandar kapal'
    ],
    historicalIncidentSummary: 'Antrean hingga 14 km (Nataru 2024), 22 Kasus Pengemudi Pingsan/Dehidrasi, 5 Senggolan Beruntun',
    recommendedSpeedKmh: 20,
    mitigationActions: [
      'Penerapan delaying system di Rest Area KM 43 dan KM 68 Tol Merak',
      'Wajib tiket Ferizy minimal H-1 sebelum tiba di pelabuhan',
      'Pengalihan truk logistik non-sembako ke Pelabuhan Ciwandan / BBJ Bojonegara'
    ],
    nearestEmergencyPost: {
      name: 'Posko Terpadu Angkutan Nataru ASDP Merak',
      distanceKm: 0.2,
      phone: '0254-571000'
    },
    facilities: ['Dapur Umum PMI', 'Posko Medis Dinkes & KKP', 'Mobil Bengkel Darurat', 'Toilet Portabel Mobile'],
    description: 'Titik tumpu penyeberangan tersibuk penghubung Pulau Jawa dan Sumatera. Rawan kemacetan total berhari-hari bila terjadi cuaca buruk gelombang Selat Sunda.',
    operationalNotes2026: 'Screening geofencing tiket Ferizy radius 4.7 km dari pelabuhan; kendaraan tanpa tiket dialihkan keluar tol.'
  },
  {
    id: 'bs-11',
    code: 'ASDP-BKU-01',
    name: 'Akses Pelabuhan Bakauheni & Tol Trans Sumatera KM 0-4',
    roadName: 'Jalan Tol Bakauheni - Terbanggi Besar (Bakter)',
    kmMarker: 'KM 0+000 s/d KM 4+500',
    province: 'Lampung',
    cityRegency: 'Kabupaten Lampung Selatan',
    region: 'Sumatera',
    transportMode: 'Penyeberangan Ferry',
    severity: 'Tinggi',
    coordinates: [105.753, -5.867],
    elevationMeters: 25,
    riskFactors: [
      'Turunan tajam berkelok menuju gerbang tol Bakauheni Selatan',
      'Antrean panjang kendaraan keluar kapal yang bertemu arus masuk tol',
      'Risiko rem blong bus antarkota dari arah Sumatera menuju dermaga'
    ],
    historicalIncidentSummary: '12 Kasus Laka, 3 Meninggal Dunia, 8 Luka Berat',
    recommendedSpeedKmh: 40,
    mitigationActions: [
      'Pemanfaatan jalur penyelamat di turunan KM 2 Bakter',
      'Rekayasa contra-flow keluar pelabuhan saat arus balik',
      'Pos terpadu gabungan TNI, Polri, Basarnas, dan ASDP'
    ],
    nearestEmergencyPost: {
      name: 'Pos Terpadu Bakauheni Satlantas Polres Lamsel',
      distanceKm: 0.6,
      phone: '0727-331070'
    },
    facilities: ['Emergency Escape Ramp Bakauheni', 'Rescue Boat Basarnas', 'Posko Kesehatan Terpadu'],
    description: 'Pintu gerbang Sumatera dengan kontur perbukitan curam langsung mengarah ke bibir pelabuhan. Rawan laka rem blong bagi kendaraan berat.',
    operationalNotes2026: 'Operasional 7 dermaga secara simultan didukung buffer zone rest area KM 20 B.'
  },
  {
    id: 'bs-12',
    code: 'LPG-TOL-01',
    name: 'Tol Bakter KM 108 - KM 115 (Gunung Sugih)',
    roadName: 'Jalan Tol Bakauheni - Terbanggi Besar',
    kmMarker: 'KM 108+000',
    province: 'Lampung',
    cityRegency: 'Kabupaten Lampung Tengah',
    region: 'Sumatera',
    transportMode: 'Jalan Tol',
    severity: 'Tinggi',
    coordinates: [105.321, -5.201],
    elevationMeters: 55,
    riskFactors: [
      'Jalan tol cor beton lurus monoton lebih dari 40 km memicu hipnosis jalan (highway hypnosis)',
      'Titik lelah fatal bagi pemudik yang baru menyeberang kapal tengah malam',
      'Perbedaan tinggi aspal perbaikan yang memicu oleng'
    ],
    historicalIncidentSummary: '15 Kasus Kecelakaan Tunggal Fatal, 7 Meninggal Dunia',
    recommendedSpeedKmh: 80,
    mitigationActions: [
      'Singgah wajib (rest obligation) di Rest Area KM 116 A/B',
      'Patroli biru (Blue Light Patrol) rutin menyalakan strobo setiap 15 menit',
      'Pemasangan rambu getar melintang di kedua lajur'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pelayanan Terpadu Rest Area KM 116 A',
      distanceKm: 3.5,
      phone: '0725-528111'
    },
    facilities: ['Mobil Derek Hutama Karya', 'Posko Medis Siaga', 'Pusat Informasi Lalu Lintas'],
    description: 'Dikenal sebagai segmen paling rawan microsleep di Tol Trans Sumatera bagian selatan. Udara panas dan jalan lurus panjang kerap menipu konsentrasi pengemudi.',
    operationalNotes2026: 'Disediakan pembagian kopi hitam hangat gratis dan cek tensi darah cuma-cuma oleh Jasa Raharja.'
  },
  {
    id: 'bs-13',
    code: 'SMB-ART-01',
    name: 'Tanjakan Sitinjau Lauik (Padang - Solok)',
    roadName: 'Jalan Raya Padang - Solok Nasional Lintas Tengah',
    kmMarker: 'KM 18 s/d KM 22 Lubuk Kilangan',
    province: 'Sumatera Barat',
    cityRegency: 'Kota Padang',
    region: 'Sumatera',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Tinggi',
    coordinates: [100.518, -0.957],
    elevationMeters: 620,
    riskFactors: [
      'Tanjakan dengan radius belok 45 derajat bergradien curam >18%',
      'Truk tronton bermuatan CPO/semen sering tidak kuat menanjak atau amblas',
      'Sisi jalan berupa tebing batu rawan longsor dan jurang tanpa batas pengaman kaku'
    ],
    historicalIncidentSummary: '28 Insiden (Truk Mogok Melintang, Rem Blong, Longsor), 3 Korban Jiwa, Kemacetan Total 12 Jam',
    recommendedSpeedKmh: 20,
    mitigationActions: [
      'Pemberlakuan buka-tutup prioritas kendaraan muatan besar saat menanjak',
      'Siaga alat berat wheel loader dan excavator di basecamp Sitinjau',
      'Relawan Pengatur Jalan Sitinjau Lauik bekerjasama dengan Ditlantas Polda Sumbar'
    ],
    nearestEmergencyPost: {
      name: 'Pos Polisi Ladang Padi Sitinjau Lauik',
      distanceKm: 2.1,
      phone: '0751-778899'
    },
    facilities: ['Alat Berat Siaga Longsor (Excavator BPBD)', 'Jalur Penyelamat Gravel', 'Derek Truk Tronton'],
    description: 'Ikon jalur ekstrem nasional Indonesia. Menghubungkan pelabuhan Teluk Bayur Padang dengan kota-kota di Solok, Jambi, dan Pekanbaru. Menjadi titik kemacetan parah saat arus libur Nataru.',
    operationalNotes2026: 'Pembangunan flyover Sitinjau Lauik tahap konstruksi; diberlakukan rekayasa giliran lewat sistem radar.'
  },
  {
    id: 'bs-14',
    code: 'SMB-ART-02',
    name: 'Tikungan Lembah Anai (Padang Panjang)',
    roadName: 'Jalan Lintas Padang - Bukittinggi',
    kmMarker: 'KM 62 Lembah Anai',
    province: 'Sumatera Barat',
    cityRegency: 'Kabupaten Tanah Datar',
    region: 'Sumatera',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Tinggi',
    coordinates: [100.354, -0.479],
    elevationMeters: 480,
    riskFactors: [
      'Rawan banjir bandang lahar dingin dan luapan sungai Batang Anai saat hujan lebat',
      'Jalan sempit berkelok tajam di bawah dinding tebing cadas air terjun',
      'Tanah labil dan ancaman guguran batu (rockfall) ke badan jalan'
    ],
    historicalIncidentSummary: 'Bencana Jalan Putus Total (2024), 6 Insiden Tertimpa Pohon & Longsoran Kecil',
    recommendedSpeedKmh: 30,
    mitigationActions: [
      'Early warning system (EWS) sensor ketinggian air hulu sungai Gunung Marapi',
      'Pengalihan ke rute alternatif via Malalak bila curah hujan melebihi 100 mm/hari',
      'Penutupan jalan otomatis saat status siaga bencana level 3'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pengamanan Lembah Anai Polres Padang Panjang',
      distanceKm: 0.9,
      phone: '0752-82110'
    },
    facilities: ['Sensor Peringatan Banjir Lahar Dingin', 'Alat Berat Balai Jalan Nasional', 'Ambulans Tanggap Darurat'],
    description: 'Koridor vital pariwisata Sumatera Barat menuju Bukittinggi. Menjadi perhatian utama nasional terhadap potensi ancaman hidrometeorologi basah akhir tahun.',
    operationalNotes2026: 'Pos pengamatan EWS sungai dilengkapi sirene peringatan dini beradius dengar 3 km.'
  },
  {
    id: 'bs-15',
    code: 'RIA-TOL-01',
    name: 'Tol Permai KM 45 - KM 60 (Kandis - Duri)',
    roadName: 'Jalan Tol Pekanbaru - Dumai',
    kmMarker: 'KM 45+000 s/d KM 60+000',
    province: 'Riau',
    cityRegency: 'Kabupaten Siak',
    region: 'Sumatera',
    transportMode: 'Jalan Tol',
    severity: 'Sedang',
    coordinates: [101.272, 0.952],
    elevationMeters: 60,
    riskFactors: [
      'Kecepatan tinggi kendaraan pribadi menabrak bagian belakang truk sawit/minyak lambat',
      'Titik perlintasan satwa liar gajah sumatera (underpass gajah)',
      'Hujan lebat tropis yang mengurangi daya cengkeram aspal'
    ],
    historicalIncidentSummary: '11 Kasus Laka, 3 Meninggal Dunia, 7 Luka Berat',
    recommendedSpeedKmh: 80,
    mitigationActions: [
      'Pemasangan rambu digital peringatan gajah melintas & kamera termal satwa',
      'Operasi ODOL bersama Dishub dan BPTD Riau',
      'Peningkatan patroli keamanan tol'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pelayanan Rest Area KM 45 Tol Permai',
      distanceKm: 0.5,
      phone: '0761-884400'
    },
    facilities: ['Derek Mobil Derek Siaga', 'Pos Satlantas', 'Layanan Medis Tol'],
    description: 'Tol pertama di Indonesia dengan terowongan gajah. Saat libur Nataru arus kendaraan warga Riau menuju pelabuhan Ro-Ro Dumai dan wisata Sumbar meningkat tajam.',
    operationalNotes2026: 'Wajib lajur kiri bagi truk pengangkut CPO dan TBS sawit dengan pengawasan CCTV AI.'
  },
  {
    id: 'bs-16',
    code: 'SMU-ART-01',
    name: 'Jalur Medan - Berastagi (Sembahe - Sibolangit)',
    roadName: 'Jalan Letjen Jamin Ginting',
    kmMarker: 'KM 38 s/d KM 48 Sibolangit',
    province: 'Sumatera Utara',
    cityRegency: 'Kabupaten Deli Serdang',
    region: 'Sumatera',
    transportMode: 'Jalur Wisata Pegunungan',
    severity: 'Tinggi',
    coordinates: [98.577, 3.284],
    elevationMeters: 780,
    riskFactors: [
      'Tebing curam rawan longsor saat musim hujan Desember menutup seluruh badan jalan',
      'Kemacetan parah ratusan ribu wisatawan kota Medan berlibur ke dataran tinggi Karo',
      'Tikungan tajam berkabut dengan jurang lembah Sungai Sembahe'
    ],
    historicalIncidentSummary: '24 Kejadian Longsor & Laka Tabrak Tebing, 4 Meninggal Dunia, 19 Luka-Luka',
    recommendedSpeedKmh: 35,
    mitigationActions: [
      'Pemasangan bronjong kawat penahan longsor dan jaring geotekstil tebing',
      'Standby alat berat loader di 2 titik rawan Sembahe',
      'Sistem satu arah (one way) situasional dari Medan ke Karo pagi hari, sebaliknya sore hari'
    ],
    nearestEmergencyPost: {
      name: 'Pos Terpadu Sibolangit Polrestabes Medan',
      distanceKm: 1.5,
      phone: '061-891023'
    },
    facilities: ['Heavy Loader BPBD', 'Rescue Basarnas Medan', 'Tenda Tanggap Darurat Bencana'],
    description: 'Jalur utama penghubung Medan dengan Berastagi dan Danau Toba. Selalu mengalami puncak kepadatan ekstrem pada 24 Desember - 1 Januari.',
    operationalNotes2026: 'Pemberlakuan pembatasan truk non-sembako mulai 22 Desember 2026 s/d 3 Januari 2027.'
  },
  {
    id: 'bs-17',
    code: 'ASDP-KTP-01',
    name: 'Pelabuhan Penyeberangan Ketapang (Banyuwangi)',
    roadName: 'Jalan Raya Situbondo - Banyuwangi Akses Pelabuhan',
    kmMarker: 'KM 8 Ketapang',
    province: 'Jawa Timur',
    cityRegency: 'Kabupaten Banyuwangi',
    region: 'Jawa - Bali',
    transportMode: 'Penyeberangan Ferry',
    severity: 'Tinggi',
    coordinates: [114.397, -8.148],
    elevationMeters: 6,
    riskFactors: [
      'Lonjakan ribuan mobil pribadi dan bus wisatawan menuju liburan Tahun Baru di Bali',
      'Antrean panjang kendaraan meluber ke jalur nasional hingga 10 km',
      'Cuaca buruk angin muson barat daya memicu arus laut Selat Bali bergelombang tinggi'
    ],
    historicalIncidentSummary: 'Antrean Hingga Pelabuhan Tanjungwangi (Nataru 2024), 9 Insiden Tabrak Belakang Antrean',
    recommendedSpeedKmh: 30,
    mitigationActions: [
      'Pemberlakuan kantong parkir buffer zone di Lapangan Bulusan dan Grand Watu Dodol',
      'Pemberlakuan radius geofencing pembelian tiket online kapal',
      'Operasional kapal berukuran besar (KMP) bantuan dari Selat Sunda'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pelayanan Terpadu Nataru Pelabuhan Ketapang',
      distanceKm: 0.1,
      phone: '0333-510070'
    },
    facilities: ['Dapur Umum Dinsos', 'Pos Kesehatan Lanal Banyuwangi', 'Pusat Informasi Cuaca BMKG Maritim'],
    description: 'Pintu gerbang penyeberangan Jawa ke Bali. Puncak arus libur Nataru mencatat lebih dari 50.000 penumpang dan 12.000 kendaraan per hari melintasi Selat Bali.',
    operationalNotes2026: 'Bila gelombang laut di atas 2.5 meter, operasional kapal ponton ditunda demi keselamatan jiwa.'
  },
  {
    id: 'bs-18',
    code: 'ASDP-GLM-01',
    name: 'Pelabuhan Gilimanuk & Cek Fisik KTP (Jembrana - Bali)',
    roadName: 'Jalan Raya Denpasar - Gilimanuk',
    kmMarker: 'KM 0 Gilimanuk',
    province: 'Bali',
    cityRegency: 'Kabupaten Jembrana',
    region: 'Jawa - Bali',
    transportMode: 'Penyeberangan Ferry',
    severity: 'Sedang',
    coordinates: [114.437, -8.163],
    elevationMeters: 4,
    riskFactors: [
      'Pemeriksaan keamanan dan identitas masuk Bali (Pos KTP) menciptakan perlambatan antrean',
      'Pertemuan arus wisata keluar-masuk Pulau Dewata di malam pergantian tahun',
      'Suhu panas pelabuhan menyebabkan kondisi mesin kendaraan overheat'
    ],
    historicalIncidentSummary: '6 Kasus Kendaraan Mogok Terbakar Kecil, 8 Tabrak Bumper Antrean',
    recommendedSpeedKmh: 30,
    mitigationActions: [
      'Digitalisasi pemindaian KTP / e-KTP nirsentuh di gerbang Gilimanuk',
      'Penambahan lajur pemeriksaan dari 4 menjadi 8 pintu saat arus puncak',
      'Penyediaan mobil derek tarik gratis dari area dermaga ke luar pelabuhan'
    ],
    nearestEmergencyPost: {
      name: 'Posko Gabungan Terpadu Gilimanuk Polres Jembrana',
      distanceKm: 0.3,
      phone: '0365-41110'
    },
    facilities: ['Posko Gabungan Polda Bali', 'Unit Pemadam Kebakaran Cepat', 'Mobil Ambulans BPBD'],
    description: 'Titik masuk utama perjalanan darat ke Bali. Penjagaan diperketat selama perayaan Natal dan Tahun Baru untuk menjamin keamanan destinasi pariwisata internasional.',
    operationalNotes2026: 'Sistem jalur hijau untuk kendaraan berpenumpang yang telah melengkapi deklarasi digital online.'
  },
  {
    id: 'bs-19',
    code: 'BAL-ART-01',
    name: 'Jalur Denpasar - Gilimanuk Jalur Tengkorak (Tabanan)',
    roadName: 'Jalan Nasional Denpasar - Gilimanuk',
    kmMarker: 'KM 38 s/d KM 48 Selemadeg - Kerambitan',
    province: 'Bali',
    cityRegency: 'Kabupaten Tabanan',
    region: 'Jawa - Bali',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Tinggi',
    coordinates: [115.068, -8.498],
    elevationMeters: 120,
    riskFactors: [
      'Jalan arteri 2 lajur sempit dilintasi bus pariwisata antar-pulau berkecepatan tinggi',
      'Banyak tikungan blind spot dengan tebing jurang sungai di Kabupaten Tabanan',
      'Truk besar pengangkut barang logistik melaju beriringan tanpa memberi ruang menyalip'
    ],
    historicalIncidentSummary: '19 Kasus Laka Fatal, 8 Meninggal Dunia, 17 Luka Berat',
    recommendedSpeedKmh: 40,
    mitigationActions: [
      'Pemasangan pita penggaduh dan cermin cembung tikungan di 12 titik rawan',
      'Penempatan mobil patroli lantas di kawasan Selemadeg',
      'Pengawalan bus rombongan wisata skala besar oleh Patwal'
    ],
    nearestEmergencyPost: {
      name: 'Pos Lantas Selemadeg Polres Tabanan',
      distanceKm: 1.1,
      phone: '0361-811210'
    },
    facilities: ['Mobil Derek Tabanan', 'RS Rujukan Kasih Ibu / Tabanan', 'Pos Siaga PJR Bali'],
    description: 'Dikenal masyarakat lokal sebagai "Jalur Tengkorak Tabanan". Menjadi rute paling mematikan di Bali bagi pengendara yang mendahului di tikungan tidak aman.',
    operationalNotes2026: 'Patroli speed trap laser diterapkan di sepanjang Selemadeg untuk menindak bus ugal-ugalan.'
  },
  {
    id: 'bs-20',
    code: 'NTB-ART-01',
    name: 'Jalur Wisata Tebing Senggigi - Malimbu (Lombok Barat)',
    roadName: 'Jalan Raya Pantai Senggigi',
    kmMarker: 'KM 12 s/d KM 22 Malimbu',
    province: 'Nusa Tenggara Barat',
    cityRegency: 'Kabupaten Lombok Barat',
    region: 'Nusa Tenggara',
    transportMode: 'Jalur Wisata Pegunungan',
    severity: 'Sedang',
    coordinates: [116.035, -8.468],
    elevationMeters: 85,
    riskFactors: [
      'Tebing batuan rapuh di tepi laut rawan longsor menutup jalan saat hujan monsun',
      'Jalan berliku di bibir jurang pantai curam menuju dermaga penyeberangan 3 Gili',
      'Arus konvoi motor perayaan malam tahun baru anak muda'
    ],
    historicalIncidentSummary: '7 Kasus Laka & Tebing Terban, 2 Meninggal Dunia, 5 Luka-Luka',
    recommendedSpeedKmh: 40,
    mitigationActions: [
      'Pemasangan jaring kawat penahan longsor (rockfall net)',
      'Penyekatan konvoi knalpot brong pada malam 31 Desember',
      'Siaga perahu penyelamat Basarnas Mataram di perairan pantai'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pam Senggigi Polresta Mataram',
      distanceKm: 1.8,
      phone: '0370-693110'
    },
    facilities: ['Perahu Karet Basarnas', 'Posko Medis Puskesmas Meninting', 'Ambulans Gawat Darurat'],
    description: 'Pusat perayaan pergantian tahun di Lombok. Akses pantai berbukit dengan pemandangan spektakuler Gunung Agung di seberang laut namun menyimpan risiko longsor tepi laut.',
    operationalNotes2026: 'Pengalihan arus malam tahun baru berlaku sistem satu arah masuk via Meninting keluar via Pusuk.'
  },
  {
    id: 'bs-21',
    code: 'NTT-ART-01',
    name: 'Jalur Trans Timor KM 70 - KM 75 (Kupang - Soe)',
    roadName: 'Jalan Nasional Trans Timor',
    kmMarker: 'KM 73 Batu Putih',
    province: 'Nusa Tenggara Timur',
    cityRegency: 'Kabupaten Timor Tengah Selatan',
    region: 'Nusa Tenggara',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Sedang',
    coordinates: [124.195, -9.921],
    elevationMeters: 420,
    riskFactors: [
      'Struktur tanah lempung ekspansif (tanah bergerak) yang merusak aspal saat hujan lebat',
      'Banyak jembatan sempit satu jalur peninggalan lama yang belum diperlebar',
      'Kabut dingin pegunungan Timor tebal saat malam Natal'
    ],
    historicalIncidentSummary: '9 Kasus Truk/Bus Terperosok, 1 Meninggal Dunia, 8 Luka Berat',
    recommendedSpeedKmh: 40,
    mitigationActions: [
      'Penimbunan agregat darurat pada patahan jalan amblas',
      'Rambu prioritas jembatan satu arah',
      'Pos terpadu pengamanan perayaan ibadah Natal gereja lintas Timor'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pelayanan Nataru Batu Putih Polres TTS',
      distanceKm: 2.0,
      phone: '0388-21010'
    },
    facilities: ['Derek Dinas PUPR NTT', 'Puskesmas Siaga 24 Jam', 'Posko Komunikasi RAPI'],
    description: 'Urat nadi penghubung Kota Kupang dengan kabupaten di pedalaman Pulau Timor hingga perbatasan Timor Leste. Aktivitas mobilitas warga beribadah Natal sangat tinggi.',
    operationalNotes2026: 'Disediakan jembatan bailey darurat siaga oleh Balai Pelaksanaan Jalan Nasional (BPJN) NTT.'
  },
  {
    id: 'bs-22',
    code: 'KLM-TOL-01',
    name: 'Tol Balsam KM 38 - KM 50 (Samboja - IKN Corridor)',
    roadName: 'Jalan Tol Balikpapan - Samarinda',
    kmMarker: 'KM 38+000 s/d KM 50+000',
    province: 'Kalimantan Timur',
    cityRegency: 'Kabupaten Kutai Kartanegara',
    region: 'Kalimantan',
    transportMode: 'Jalan Tol',
    severity: 'Sedang',
    coordinates: [116.985, -1.026],
    elevationMeters: 75,
    riskFactors: [
      'Jalan berkontur rolling naik-turun perbukitan Kalimantan dengan hujan deras mendadak',
      'Risiko aquaplaning parah karena aliran limpasan air hujan di aspal berbukit',
      'Peningkatan volume kendaraan menuju kawasan Ibu Kota Nusantara (IKN)'
    ],
    historicalIncidentSummary: '12 Kasus Kecelakaan Tunggal Tergelincir, 2 Meninggal Dunia, 9 Luka Ringan',
    recommendedSpeedKmh: 70,
    mitigationActions: [
      'Pembuatan alur ban (grooving) di permukaan aspal untuk memecah lapisan air',
      'Pemasangan peringatan aquaplaning digital di VMS gerbang tol Samboja',
      'Patroli mobile Jasamarga Balikpapan Samarinda (JBS)'
    ],
    nearestEmergencyPost: {
      name: 'Posko Siaga Rest Area KM 37 Tol Balsam',
      distanceKm: 1.0,
      phone: '0542-8531000'
    },
    facilities: ['Mobil Derek JBS', 'Ambulans Emergency IKN', 'Mobil Tangki Air Bersih'],
    description: 'Jalan tol pertama di Pulau Kalimantan yang menghubungkan dua kota terbesar dan koridor menuju IKN. Di musim penghujan akhir tahun, kabut hujan tropis sangat tebal.',
    operationalNotes2026: 'Pemberlakuan kecepatan maksimal 60 km/jam bila sensor curah hujan mencatat intensitas tinggi.'
  },
  {
    id: 'bs-23',
    code: 'KLM-ART-01',
    name: 'Jalur Trans Kalimantan Poros Tengah (Palangka Raya - Sampit)',
    roadName: 'Jalan Tjilik Riwut / Trans Kalimantan Poros Selatan',
    kmMarker: 'KM 45 s/d KM 65 Kasongan',
    province: 'Kalimantan Tengah',
    cityRegency: 'Kabupaten Katingan',
    region: 'Kalimantan',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Sedang',
    coordinates: [113.385, -1.895],
    elevationMeters: 25,
    riskFactors: [
      'Potensi genangan banjir luapan sungai Katingan di badan jalan nasional',
      'Banyak lubang jalan tersembunyi genangan air gambut',
      'Jarak antar pemukiman jauh menyulitkan penanganan bantuan darurat cepat'
    ],
    historicalIncidentSummary: '8 Kasus Truk Sawit Terguling, 1 Meninggal Dunia, 7 Luka-Luka',
    recommendedSpeedKmh: 50,
    mitigationActions: [
      'Peninggian tanggul darurat geobag di titik langganan banjir',
      'Penempatan rambu patok duga kedalaman air di sisi jalan',
      'Posko siaga BPBD Katingan dengan perahu karet rescue'
    ],
    nearestEmergencyPost: {
      name: 'Posko Siaga Kasongan Dishub Kalteng',
      distanceKm: 3.0,
      phone: '0536-322110'
    },
    facilities: ['Perahu Karet Evakuasi', 'Mobil Truk Derek BPBD', 'Posko Medis Puskesmas Kasongan'],
    description: 'Jalur utama penghubung ibukota provinsi Palangka Raya menuju kawasan industri Kotawaringin Timur dan pelabuhan Sampit. Menghadapi potensi curah hujan lebat di akhir tahun.',
    operationalNotes2026: 'Disediakan truk angkut panggung militer untuk melangsir sepeda motor jika terjadi banjir luapan.'
  },
  {
    id: 'bs-24',
    code: 'SLW-ART-01',
    name: 'Jalur Kebun Kopi Trans Sulawesi (Palu - Parigi)',
    roadName: 'Jalan Nasional Trans Sulawesi Poros Palu - Parigi',
    kmMarker: 'KM 30 s/d KM 48 Kebun Kopi',
    province: 'Sulawesi Tengah',
    cityRegency: 'Kabupaten Parigi Moutong',
    region: 'Sulawesi',
    transportMode: 'Jalur Wisata Pegunungan',
    severity: 'Tinggi',
    coordinates: [119.985, -0.822],
    elevationMeters: 920,
    riskFactors: [
      'Dinding pegunungan sesar Palu-Koro yang sangat labil dan terus menerus longsor',
      'Sisi luar jalan adalah jurang tebing tegak sedalam ratusan meter',
      'Kabut pekat dingin dengan jarak pandang hanya 10 meter di ketinggian puncak'
    ],
    historicalIncidentSummary: '17 Kejadian Tanah Longsor & Kendaraan Terjebak, 3 Meninggal Dunia, Kemacetan Berhari-hari',
    recommendedSpeedKmh: 30,
    mitigationActions: [
      'Penempatan alat berat excavator 24 jam di Pos Kebun Kopi',
      'Pemasangan jaring baja pengikat tebing (wire mesh anchoring)',
      'Sistem buka tutup jalur satu arah saat pembersihan guguran batu'
    ],
    nearestEmergencyPost: {
      name: 'Pos Komando Tanggap Bencana Kebun Kopi BPJN Sulteng',
      distanceKm: 0.5,
      phone: '0451-481910'
    },
    facilities: ['Excavator & Wheel Loader Siaga', 'Pos SAR Palu', 'Ambulans Rujukan RS Anutapura'],
    description: 'Jalur paling krusial sekaligus paling rawan longsor di Sulawesi Tengah. Menghubungkan Kota Palu dengan pesisir Teluk Tomini dan provinsi Gorontalo/Sulut.',
    operationalNotes2026: 'Pemudik Nataru dilarang melintas pada malam hari (21.00 - 05.00 WITA) saat hujan lebat berlangsung.'
  },
  {
    id: 'bs-25',
    code: 'SLW-ART-02',
    name: 'Poros Maros - Bone Kawasan Hutan Karaenta (Sulsel)',
    roadName: 'Jalan Nasional Maros - Bone',
    kmMarker: 'KM 45 s/d KM 58 Kappang',
    province: 'Sulawesi Selatan',
    cityRegency: 'Kabupaten Maros',
    region: 'Sulawesi',
    transportMode: 'Jalur Wisata Pegunungan',
    severity: 'Tinggi',
    coordinates: [119.782, -5.021],
    elevationMeters: 460,
    riskFactors: [
      'Proyek pelebaran jalan dan pemotongan tebing karst menciptakan material licin',
      'Tikungan ekstrem 180 derajat (kelok sembilan Kappang) dilintasi bus malam antardaerah',
      'Pohon tumbang dari kawasan cagar alam hutan Karaenta saat angin kencang'
    ],
    historicalIncidentSummary: '19 Insiden Truk/Bus Mogok Terguling, 2 Meninggal Dunia, 14 Luka-Luka',
    recommendedSpeedKmh: 35,
    mitigationActions: [
      'Penghentian sementara aktivitas cut & fill tebing selama H-7 s/d H+7 Nataru',
      'Penempatan pos tim gergaji pohon Dishub dan BPBD Maros',
      'Pengaturan buka-tutup arus di jembatan layang Kappang'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pelayanan Kappang Satlantas Polres Maros',
      distanceKm: 1.2,
      phone: '0411-371110'
    },
    facilities: ['Alat Berat Pemotong Batu', 'Mobil Derek Polres Maros', 'Pos Kesehatan Lapangan'],
    description: 'Jalur lintas pegunungan karst penghubung utama Kota Makassar dengan wilayah Bone, Sinjai, dan Tenggara Sulawesi. Sangat padat oleh pemudik Natal di Tana Toraja dan Bone.',
    operationalNotes2026: 'Bus angkutan mudik wajib melalui uji petik kelaikan jalan di Terminal Daya sebelum menempuh jalur Kappang.'
  },
  {
    id: 'bs-26',
    code: 'SLW-ART-03',
    name: 'Jalur Manado - Tomohon Tikungan Tinoor (Sulut)',
    roadName: 'Jalan Raya Manado - Tomohon',
    kmMarker: 'KM 14 s/d KM 18 Tinoor',
    province: 'Sulawesi Utara',
    cityRegency: 'Kota Tomohon',
    region: 'Sulawesi',
    transportMode: 'Jalur Wisata Pegunungan',
    severity: 'Sedang',
    coordinates: [124.839, 1.378],
    elevationMeters: 750,
    riskFactors: [
      'Tebing curam rawan longsor di tepi lereng Gunung Lokon',
      'Puncak mobilitas warga merayakan Natal dan belanja akhir tahun antar kota',
      'Kabut dingin tebal dan jalan licin akibat intensitas hujan tinggi pegunungan Minahasa'
    ],
    historicalIncidentSummary: '10 Kasus Laka Tergelincir & Longsoran Kecil, 1 Korban Jiwa, 8 Luka-Luka',
    recommendedSpeedKmh: 40,
    mitigationActions: [
      'Pembersihan parit saluran air dari endapan lumpur vulkanik',
      'Pengalihan ke jalur alternatif via Warembungan saat kondisi darurat',
      'Pos Operasi Lilin Samrat terpadu di Tinoor'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pam Terpadu Tinoor Polres Tomohon',
      distanceKm: 0.8,
      phone: '0431-351010'
    },
    facilities: ['Ambulans PSC 119 Tomohon', 'Derek Dishub Sulut', 'Pos Pengamanan Lilin Samrat'],
    description: 'Pusat perayaan Natal terbesar di Sulawesi Utara. Ribuan jemaat bepergian antara Manado dan Tomohon untuk safari ibadah Natal dan silaturahmi keluarga.',
    operationalNotes2026: 'Posko kesehatan siap melayani pemeriksaan kesehatan dan oksigen portable bagi pengendara.'
  },
  {
    id: 'bs-27',
    code: 'MAL-PEL-01',
    name: 'Pelabuhan Yos Sudarso & Slamet Riyadi Ambon',
    roadName: 'Kawasan Pelabuhan Nusantara Ambon',
    kmMarker: 'Dermaga Penyeberangan Ferry Galala & Slamet Riyadi',
    province: 'Maluku',
    cityRegency: 'Kota Ambon',
    region: 'Maluku - Papua',
    transportMode: 'Pelabuhan Laut',
    severity: 'Sedang',
    coordinates: [128.181, -3.693],
    elevationMeters: 3,
    riskFactors: [
      'Lonjakan pemudik kepulauan perintis Maluku (Banda, Seram, Buru, Kei) jelang Natal',
      'Cuaca gelombang tinggi musim barat di Laut Banda dan Laut Seram',
      'Over-capacity penumpang pada kapal cepat antarpulau'
    ],
    historicalIncidentSummary: '3 Insiden Penundaan Berlayar Akibat Gelombang 4 Meter, Desak-desakan Penumpang',
    recommendedSpeedKmh: 20,
    mitigationActions: [
      'Pemeriksaan ketat manifes penumpang dan ketersediaan jaket pelampung (life jacket)',
      'Penetapan maklumat pelayaran oleh KSOP Kelas I Ambon berdasar info BMKG',
      'Penyiagaan armada kapal patroli KN SAR Abimanyu Basarnas Ambon'
    ],
    nearestEmergencyPost: {
      name: 'Posko Terpadu Nataru KSOP Ambon & Basarnas',
      distanceKm: 0.2,
      phone: '0911-342115'
    },
    facilities: ['Kapal Penyelamat KN SAR Abimanyu', 'Pos Karantina Kesehatan Pelabuhan', 'Tenda Penampungan Pemudik'],
    description: 'Hub transportasi laut kepulauan Maluku. Menghadapi mobilitas laut luar biasa tinggi saat tradisi mudik Natal warga kepulauan.',
    operationalNotes2026: 'Larangan keras kapal penumpang berlayar tanpa persetujuan berlayar (SPB) resmi saat peringatan cuaca buruk BMKG.'
  },
  {
    id: 'bs-28',
    code: 'PAP-ART-01',
    name: 'Jalur Trans Papua Puncak Pass Yalimo (Wamena - Jayapura)',
    roadName: 'Jalan Trans Papua Segmen Wamena - Elelim - Jayapura',
    kmMarker: 'KM 110 s/d KM 135 Puncak Pass',
    province: 'Papua Pegunungan',
    cityRegency: 'Kabupaten Yalimo',
    region: 'Maluku - Papua',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Tinggi',
    coordinates: [139.421, -3.951],
    elevationMeters: 2850,
    riskFactors: [
      'Ketinggian ekstrem >2.800 mdpl dengan cuaca dingin berkabut tebal dan hujan es lokal',
      'Tanah lempung galian jalan rentan amblas menjadi kubangan lumpur pekat',
      'Jurang ngarai sungai berarus deras tanpa pembatas'
    ],
    historicalIncidentSummary: '14 Kasus Truk Sembako Terjebak Lumpur Berhari-hari, 2 Truk Masuk Jurang',
    recommendedSpeedKmh: 30,
    mitigationActions: [
      'Konvoi kendaraan berpenggerak 4x4 dengan pemandu lokal',
      'Penyediaan excavator derek di basecamp perbaikan jalan Trans Papua',
      'Pos koordinasi keamanan dan logistik satgas pengamanan jalan'
    ],
    nearestEmergencyPost: {
      name: 'Posko Gabungan Satgas Trans Papua Elelim',
      distanceKm: 8.5,
      phone: '0969-31010'
    },
    facilities: ['Alat Berat Bulldozer & Excavator', 'Radio Komunikasi Satelit', 'Peralatan Medis Lapangan'],
    description: 'Jalur darat strategis penyalur logistik sembako Nataru dari Jayapura ke seluruh kabupaten pegunungan tengah Papua. Kondisi medan geografis paling menantang di NKRI.',
    operationalNotes2026: 'Pengemudi diimbau membawa rantai ban dan perlengkapan survival mandiri.'
  },
  {
    id: 'bs-29',
    code: 'JTG-KA-01',
    name: 'Perlintasan Sebidang KA JPL 43 Kaligawe (Semarang)',
    roadName: 'Jalan Kaligawe Raya Jalur Pantura',
    kmMarker: 'JPL 43 Genuk',
    province: 'Jawa Tengah',
    cityRegency: 'Kota Semarang',
    region: 'Jawa - Bali',
    transportMode: 'Perlintasan Kereta Api',
    severity: 'Tinggi',
    coordinates: [110.456, -6.958],
    elevationMeters: 4,
    riskFactors: [
      'Pertemuan rel ganda (double track) kereta api berkecepatan tinggi dengan jalan arteri pantura',
      'Genangan banjir rob air laut pasang yang sering merendam rel dan aspal hingga 40 cm',
      'Kemacetan panjang yang membuat kendaraan terjebak di tengah perlintasan saat sirine berbunyi'
    ],
    historicalIncidentSummary: '6 Insiden Kendaraan Tertemper Kereta / Terjebak Rel, 2 Korban Jiwa',
    recommendedSpeedKmh: 20,
    mitigationActions: [
      'Penyiagaan petugas penjaga palang pintu (PJL) ganda dari Dishub dan KAI Daop 4',
      'Pompa portabel penyedot rob berdaya sedot tinggi di sisi rel',
      'Pemasangan yellow box junction larangan berhenti di area rel'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pengamanan Nataru Kaligawe Polrestabes Semarang',
      distanceKm: 0.4,
      phone: '024-6581100'
    },
    facilities: ['Derek Cepat KAI', 'Pompa Mobile BBWS Pemali Juana', 'Pos Pantau Dishub'],
    description: 'Titik krusial pertemuan moda transportasi darat dan kereta api di Jawa Tengah. Rawan banjir rob air pasang laut Jawa di akhir Desember.',
    operationalNotes2026: 'Dilarang keras melintas bagi kendaraan besar bila sirine peringatan dini rob telah dibunyikan.'
  },
  {
    id: 'bs-30',
    code: 'JBR-WIS-01',
    name: 'Jalur Puncak Gadog - Megamendung (Bogor)',
    roadName: 'Jalan Raya Puncak Pass',
    kmMarker: 'KM 72 s/d KM 85 Puncak Pass',
    province: 'Jawa Barat',
    cityRegency: 'Kabupaten Bogor',
    region: 'Jawa - Bali',
    transportMode: 'Jalur Wisata Pegunungan',
    severity: 'Tinggi',
    coordinates: [106.942, -6.698],
    elevationMeters: 1350,
    riskFactors: [
      'Kepadatan kendaraan liburan warga ibukota hingga puluhan ribu mobil di jalan berliku sempit',
      'Tebing perkebunan teh rawan longsor saat hujan lebat berturut-turut',
      'Turunan panjang dari Puncak Pass menuju Gadog rawan rem blong bus wisata pariwisata'
    ],
    historicalIncidentSummary: 'Kemacetan Horor >18 Jam (Nataru & Libur Panjang), 12 Kasus Rem Blong, 3 Korban Jiwa',
    recommendedSpeedKmh: 35,
    mitigationActions: [
      'Penerapan sistem ganjil-genap ketat sejak Gerbang Tol Ciawi',
      'Rekayasa jalur one-way (satu arah) bergantian dipandu Satlantas Polres Bogor',
      'Penyiagaan tim urai macet bersepeda motor trail'
    ],
    nearestEmergencyPost: {
      name: 'Pos Polisi Gadog Terpadu Polres Bogor',
      distanceKm: 0.5,
      phone: '0251-8240110'
    },
    facilities: ['Rescue Damkar Bogor', 'Jalur Penyelamat Puncak Pass', 'RSUD Ciawi Siaga Trauma'],
    description: 'Destinasi wisata favorit akhir tahun kawasan Megapolitan Jabodetabek. Menjadi barometer nasional kelancaran arus wisata perayaan tahun baru.',
    operationalNotes2026: 'Car Free Night berlaku mulai 31 Desember pukul 18.00 WIB hingga 1 Januari pukul 06.00 WIB.'
  },
  {
    id: 'bs-31',
    code: 'KLS-ART-01',
    name: 'Jalur Trans Kalimantan Poros Selatan (Kalsel - Kaltim)',
    roadName: 'Jalan Nasional Banjarmasin - Balikpapan',
    kmMarker: 'KM 180 s/d KM 195 Batulicin - Tanah Bumbu',
    province: 'Kalimantan Selatan',
    cityRegency: 'Kabupaten Tanah Bumbu',
    region: 'Kalimantan',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Waspada',
    coordinates: [115.982, -3.421],
    elevationMeters: 40,
    riskFactors: [
      'Perlintasan truk angkutan batubara dan CPO di persimpangan jalan nasional',
      'Debu tebal saat cuaca panas dan jalan licin berlumpur saat hujan',
      'Kurangnya rambu cermin di tikungan perkebunan kelapa sawit'
    ],
    historicalIncidentSummary: '7 Kasus Laka Tabrak Samping, 1 Meninggal Dunia, 5 Luka Ringan',
    recommendedSpeedKmh: 50,
    mitigationActions: [
      'Penertiban portal hauling batubara melintas jalan umum',
      'Penyiraman rutin debu jalan dan pembersihan aspal',
      'Penambahan lampu penerangan jalan'
    ],
    nearestEmergencyPost: {
      name: 'Pos Lantas Simpang Empat Tanah Bumbu',
      distanceKm: 2.3,
      phone: '0518-71110'
    },
    facilities: ['Derek Dishub Tanbu', 'Pos Pelayanan Terpadu', 'Puskesmas Perawatan Simpang Empat'],
    description: 'Jalur utama penghubung Kalimantan Selatan dan Kalimantan Timur bagian pesisir timur yang ramai dilintasi pemudik darat.',
    operationalNotes2026: 'Pembatasan truk muatan tambang pada tanggal 24-26 Desember dan 31 Desember-2 Januari.'
  },
  {
    id: 'bs-32',
    code: 'SUL-ART-04',
    name: 'Jalur Poros Makassar - Parepare KM 75 (Barru)',
    roadName: 'Jalan Trans Sulawesi Poros Barat',
    kmMarker: 'KM 75 Bojo - Barru',
    province: 'Sulawesi Selatan',
    cityRegency: 'Kabupaten Barru',
    region: 'Sulawesi',
    transportMode: 'Jalan Arteri Primer',
    severity: 'Waspada',
    coordinates: [119.645, -4.285],
    elevationMeters: 18,
    riskFactors: [
      'Jalur pesisir lurus memicu kecepatan tinggi beradu dengan pasar tumpah tradisional nelayan',
      'Ternak sapi warga yang sering melintas mendadak tanpa pengawasan',
      'Jalanan tergenang rob air laut pasang di pesisir Selat Makassar'
    ],
    historicalIncidentSummary: '9 Kasus Laka Tabrak Pejalan Kaki & Hewan Ternak, 2 Korban Jiwa',
    recommendedSpeedKmh: 60,
    mitigationActions: [
      'Pemasangan pembatas pagar pengaman di dekat area pasar Bojo',
      'Penugasan petugas Dishub di titik penyeberangan pasar',
      'Pita kejut sebelum zona pemukiman nelayan'
    ],
    nearestEmergencyPost: {
      name: 'Pos Pengamanan Bojo Polres Barru',
      distanceKm: 0.7,
      phone: '0427-21010'
    },
    facilities: ['Pos Medis Puskesmas Bojo', 'Derek Polres', 'Patroli Sabhara'],
    description: 'Jalur cepat trans pesisir barat Sulawesi Selatan yang mengarah ke pelabuhan Nusantara Parepare tujuan Kalimantan.',
    operationalNotes2026: 'Pengawasan kecepatan dengan radar tembak Ditlantas Polda Sulsel di KM 70-85.'
  }
];

export const TRANSPORT_CORRIDORS: TransportCorridor[] = [
  {
    id: 'cor-01',
    name: 'Koridor Tol Trans Jawa (Jakarta - Semarang - Surabaya - Banyuwangi)',
    code: 'TOL-TRANS-JAWA',
    type: 'Tol Trans Jawa',
    coordinates: [
      [106.845, -6.214],
      [107.152, -6.321],
      [107.643, -6.483],
      [108.019, -6.602],
      [108.552, -6.745],
      [109.135, -6.883],
      [109.684, -6.912],
      [110.044, -6.978],
      [110.428, -7.039],
      [110.825, -7.558],
      [111.452, -7.421],
      [112.752, -7.257],
      [112.697, -7.842],
      [113.882, -7.712],
      [114.397, -8.148]
    ],
    lengthKm: 1167,
    peakPeriodEstimated: '23 - 26 Desember 2026 & 1 - 3 Januari 2027',
    trafficForecast: 'Sangat Padat',
    description: 'Tulang punggung transportasi darat utama Indonesia dengan estimasi volume arus mudik libur Nataru mencapai 2.4 juta kendaraan melintas.'
  },
  {
    id: 'cor-02',
    name: 'Koridor Tol Trans Sumatera (Bakauheni - Terbanggi Besar - Kayu Agung - Palembang)',
    code: 'TOL-TRANS-SUMATERA',
    type: 'Tol Trans Sumatera',
    coordinates: [
      [105.753, -5.867],
      [105.321, -5.201],
      [105.215, -4.852],
      [105.021, -4.112],
      [104.832, -3.341],
      [104.756, -2.991]
    ],
    lengthKm: 371,
    peakPeriodEstimated: '22 - 25 Desember 2026 & 2 - 4 Januari 2027',
    trafficForecast: 'Padat Lancar',
    description: 'Jalur bebas hambatan vital Sumatera penghubung gerbang pulau dengan Sumatera Selatan, dengan karakteristik jalan beton lurus yang menuntut fokus penuh.'
  },
  {
    id: 'cor-03',
    name: 'Koridor Penyeberangan Ferry Selat Sunda (Merak - Bakauheni)',
    code: 'ASDP-SELAT-SUNDA',
    type: 'Penyeberangan Selat',
    coordinates: [
      [105.998, -5.932],
      [105.882, -5.901],
      [105.753, -5.867]
    ],
    lengthKm: 30,
    peakPeriodEstimated: '21 - 25 Desember 2026 & 1 - 4 Januari 2027',
    trafficForecast: 'Waspada Antrean Penyeberangan',
    description: 'Jalur penyeberangan terpadat di Asia Tenggara. Menghubungkan Pulau Jawa dan Sumatera dengan 65 armada kapal ferry roll-on roll-off (Ro-Ro).'
  },
  {
    id: 'cor-04',
    name: 'Koridor Penyeberangan Ferry Selat Bali (Ketapang - Gilimanuk)',
    code: 'ASDP-SELAT-BALI',
    type: 'Penyeberangan Selat',
    coordinates: [
      [114.397, -8.148],
      [114.417, -8.155],
      [114.437, -8.163]
    ],
    lengthKm: 6,
    peakPeriodEstimated: '23 - 31 Desember 2026 & 1 - 5 Januari 2027',
    trafficForecast: 'Waspada Antrean Penyeberangan',
    description: 'Urat nadi wisatawan nusantara dan logistik pangan menuju Pulau Bali dengan waktu tempuh pelayaran ferry rata-rata 45 menit.'
  },
  {
    id: 'cor-05',
    name: 'Lintas Arteri Pantura Jawa (Jakarta - Cirebon - Tegal - Semarang - Surabaya)',
    code: 'JALUR-PANTURA',
    type: 'Lintas Arteri Pantura',
    coordinates: [
      [106.828, -6.175],
      [107.132, -6.284],
      [107.621, -6.312],
      [108.541, -6.712],
      [109.135, -6.872],
      [109.675, -6.902],
      [110.421, -6.982],
      [111.342, -6.711],
      [112.052, -6.901],
      [112.748, -7.248]
    ],
    lengthKm: 820,
    peakPeriodEstimated: '24 - 27 Desember 2026',
    trafficForecast: 'Padat Lancar',
    description: 'Jalur arteri legendaris penopang pemudik sepeda motor dan kendaraan angkutan barang dengan banyak pasar tumpah dan perlintasan rel kereta.'
  }
];

export const EMERGENCY_POSTS: EmergencyPost[] = [
  {
    id: 'post-01',
    name: 'Posko Pelayanan Terpadu Terpusat Korlantas Polri - KM 57 Tol Japek',
    type: 'Pos Terpadu POLRI',
    locationName: 'Rest Area KM 57 Tol Jakarta - Cikampek',
    coordinates: [107.382, -6.378],
    phone: '1500669 / 0267-845110',
    active24h: true,
    standbyUnits: ['Unit Patroli Patwal PJR', 'Ambulans IGD Bergerak', 'Mobil Derek Gendong', 'CCTV Monitoring Command Center']
  },
  {
    id: 'post-02',
    name: 'Posko Siaga Gabungan Banten - Pelabuhan ASDP Merak',
    type: 'Posko Kemenhub',
    locationName: 'Terminal Terpadu Merak Dermaga Eksekutif',
    coordinates: [105.998, -5.932],
    phone: '151 / 0254-571000',
    active24h: true,
    standbyUnits: ['Petugas BPTD Kelas II Banten', 'Rescue KSOP Merak', 'Kantor Kesehatan Pelabuhan (KKP)', 'Polairud Polda Banten']
  },
  {
    id: 'post-03',
    name: 'Posko SAR Nasional Selat Sunda - BASARNAS Banten',
    type: 'Kantor SAR / BASARNAS',
    locationName: 'Dermaga SAR Merak Cilegon',
    coordinates: [106.012, -5.952],
    phone: '115 / 0254-398115',
    active24h: true,
    standbyUnits: ['Kapal Penyelamat KN SAR Tetuka', 'Rigid Inflatable Boat (RIB)', 'Helikopter Penyelamat Basarnas Standby']
  },
  {
    id: 'post-04',
    name: 'Posko Terpadu Operasi Lilin Candi - Simpang Nagreg',
    type: 'Pos Terpadu POLRI',
    locationName: 'Pos Tangan Nagreg Kabupaten Bandung',
    coordinates: [107.893, -7.026],
    phone: '022-7951110',
    active24h: true,
    standbyUnits: ['Ganjal Ban Khusus Relawan', 'Derek Tronton Dishub', 'Dokkes Polresta Bandung']
  },
  {
    id: 'post-05',
    name: 'RSUD Kabupaten Subang - Trauma Center Tol Cipali',
    type: 'RS Rujukan Trauma Center',
    locationName: 'Jl. Brigjen Katamso No.37 Subang',
    coordinates: [107.761, -6.568],
    phone: '0260-411425 / IGD: 118',
    active24h: true,
    standbyUnits: ['Tim Bedah Tulang Siaga', 'Bank Darah PMI', '3 Unit Ambulans Trauma Transport']
  },
  {
    id: 'post-06',
    name: 'Posko Siaga Terpadu Alas Roban - Kendal Batang',
    type: 'Pos Terpadu POLRI',
    locationName: 'Pangkalan Pos Lantas Plelen Gringsing',
    coordinates: [109.952, -6.981],
    phone: '0285-391010',
    active24h: true,
    standbyUnits: ['Derek Jalur Pantura', 'Pos Istirahat Rider Reaksi Cepat', 'Polres Batang']
  },
  {
    id: 'post-07',
    name: 'Posko Terpadu Pelabuhan Ketapang - Selat Bali',
    type: 'Posko Kemenhub',
    locationName: 'Area Pintu Masuk ASDP Ketapang Banyuwangi',
    coordinates: [114.397, -8.148],
    phone: '0333-510070',
    active24h: true,
    standbyUnits: ['Pos Pelayanan Gabungan TNI-AL', 'Polsek Kawasan Pelabuhan', 'Tim Kesehatan Terpadu']
  },
  {
    id: 'post-08',
    name: 'Pos SAR Basarnas Padang - Sitinjau Lauik Base',
    type: 'Kantor SAR / BASARNAS',
    locationName: 'Jl. Raya Padang - Solok KM 15',
    coordinates: [100.485, -0.945],
    phone: '115 / 0751-778899',
    active24h: true,
    standbyUnits: ['Kendaraan All Terrain Vehicle (ATV)', 'Peralatan Ekstrikasi Korban Terjepit', 'Alat Berat Loader Tanggap Bencana']
  }
];

export const ESCAPE_RAMPS: EscapeRamp[] = [
  {
    id: 'ramp-01',
    name: 'Jalur Penyelamat Nagreg Turunan Curam',
    corridor: 'Jalur Selatan Jawa Barat (Nagreg KM 39)',
    locationDetails: 'Sisi kiri turunan tajam Nagreg mengarah ke Limbangan',
    coordinates: [107.896, -7.029],
    bedMaterial: 'Kerikil Gravitasi 40 cm & Dinding Ban Peredam Benturan',
    lastInspected: '15 Oktober 2026 (Kondisi Siap Pakai 100%)'
  },
  {
    id: 'ramp-02',
    name: 'Jalur Penyelamat Tol Semarang KM 424',
    corridor: 'Tol Semarang Seksi ABC Turunan Tembalang',
    locationDetails: 'KM 424+300 lajur darurat sisi barat',
    coordinates: [110.429, -7.041],
    bedMaterial: 'Hamparan Pasir Silika & Drum Air Pelindung Struktur',
    lastInspected: '18 Oktober 2026 (Kondisi Siap Pakai 100%)'
  },
  {
    id: 'ramp-03',
    name: 'Jalur Penyelamat Tikungan Sitinjau Lauik',
    corridor: 'Jalan Nasional Padang - Solok KM 19',
    locationDetails: 'Tepat di dasar turunan panorama Sitinjau Lauik',
    coordinates: [100.521, -0.959],
    bedMaterial: 'Ramp Menanjak Kemiringan 30 Derajat dengan Bantalan Batu Pecah',
    lastInspected: '12 Oktober 2026 (Kondisi Siap Pakai 100%)'
  },
  {
    id: 'ramp-04',
    name: 'Jalur Penyelamat Gotekan Pacet - Cangar',
    corridor: 'Jalur Wisata Pegunungan Welirang Mojokerto',
    locationDetails: 'Tikungan maut turunan AMD Gotekan',
    coordinates: [112.535, -7.714],
    bedMaterial: 'Gunungan Karung Sekam Padi & Bantalan Ban Karet Truk',
    lastInspected: '20 Oktober 2026 (Kondisi Siap Pakai 100%)'
  },
  {
    id: 'ramp-05',
    name: 'Jalur Penyelamat Tol Bakter KM 2',
    corridor: 'Akses Masuk Pelabuhan Bakauheni Lampung',
    locationDetails: 'KM 2+100 lajur kiri sebelum gerbang masuk dermaga ferry',
    coordinates: [105.756, -5.869],
    bedMaterial: 'Agregat Granular Penahan Kecepatan Tinggi',
    lastInspected: '10 Oktober 2026 (Kondisi Siap Pakai 100%)'
  }
];

export const OPERATIONAL_HOTLINES = [
  { name: 'NTMC Korlantas POLRI', number: '1500669', desc: 'Informasi Rekayasa Lalu Lintas, One-Way & Laka Darurat' },
  { name: 'Kemenhub Kontak Center', number: '151', desc: 'Pengaduan Angkutan Nataru, Tarif & Keselamatan Transportasi' },
  { name: 'Call Center Jasa Marga', number: '14080', desc: 'Bantuan Derek Tol, Layanan BBM Darurat & Info Lalu Lintas Tol' },
  { name: 'Basarnas Search and Rescue', number: '115', desc: 'Evakuasi Bencana, Kecelakaan Laut & Kondisi Bahaya Darurat' },
  { name: 'Ambulans & Gawat Darurat', number: '118 / 119', desc: 'Penanganan Korban Laka & Rujukan Medis Trauma Center' },
  { name: 'ASDP Contact Center Ferizy', number: '191 / 021-191', desc: 'Informasi Penyeberangan Ferry & Tiket Online ASDP' },
  { name: 'BMKG Info Cuaca & Gelombang', number: '196', desc: 'Peringatan Dini Cuaca Ekstrem, Hujan Lebat & Gelombang Tinggi' }
];
