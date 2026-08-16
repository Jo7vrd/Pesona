/* =========================================================================
   UI kustom WebGIS - Layer Kontrol
   Membangun panel kontrol layer + legenda dari daftar layer qgis2web
   (variabel global `layersList` di layers/layers.js).
   Dimuat SETELAH resources/qgis2web.js.
   ========================================================================= */
(function () {
    'use strict';

    /* ---------------------------------------------------------------
       PENGATURAN - silakan ubah bagian ini saja bila perlu
       --------------------------------------------------------------- */

    // Nama pendek yang tampil di panel (kunci = judul layer dari QGIS).
    // Kalau tidak terdaftar di sini, nama asli dari QGIS yang dipakai.
    var NAMA_TAMPIL = {
        'Potensi Tutupan Lahan Kei Kecil Timur Selatan': 'Potensi Tutupan Lahan',
        'Demografi Elaar': 'Demografi Elaar'
    };

    // Layer yang legendanya terbuka otomatis saat halaman dibuka
    var TERBUKA_AWAL = [];

    // Layer bersimbol lingkaran bergradasi: legendanya digambar ulang memakai
    // jari-jari asli dari file style, bukan PNG bawaan QGIS (PNG-nya berukuran
    // seragam sehingga gradasi ukurannya tidak terlihat).
    // kunci = judul layer dari QGIS, nilai = nama variabel global berisi
    //         array jari-jari, urut dari kelas terkecil.
    var LEGENDA_LINGKARAN = {
        'Demografi Elaar': { radius: 'RADIUS_ELAAR', isi: 'WARNA_ELAAR', garis: 'GARIS_ELAAR' }
    };

    // Tampilkan slider opasitas di dalam legenda
    var PAKAI_OPASITAS = true;

    /* --------------------------------------------------------------- */

    function siap(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    /**
     * Judul layer qgis2web berisi HTML:
     *   "Nama Layer<br /><img src="..."/> Kelas A<br /><img .../> Kelas B<br />"
     * Fungsi ini memecahnya menjadi { nama, legenda: [{src, label}] }.
     */
    function uraikanJudul(judulHtml) {
        var kotak = document.createElement('div');
        kotak.innerHTML = judulHtml || '';

        var nama = '';
        var legenda = [];
        var imgAktif = null;
        var teksAktif = '';
        var sudahLewatBr = false;

        function simpan() {
            if (imgAktif) {
                legenda.push({ src: imgAktif, label: teksAktif.trim() });
            }
            imgAktif = null;
            teksAktif = '';
        }

        Array.prototype.forEach.call(kotak.childNodes, function (node) {
            if (node.nodeType === 3) {                       // teks
                if (!sudahLewatBr) { nama += node.textContent; }
                else { teksAktif += node.textContent; }
            } else if (node.nodeName === 'BR') {
                simpan();
                sudahLewatBr = true;
            } else if (node.nodeName === 'IMG') {
                simpan();
                imgAktif = node.getAttribute('src');
            } else {
                if (!sudahLewatBr) { nama += node.textContent; }
                else { teksAktif += node.textContent; }
            }
        });
        simpan();

        return { nama: nama.trim(), legenda: legenda };
    }

    function el(tag, cls, isi) {
        var d = document.createElement(tag);
        if (cls) { d.className = cls; }
        if (isi !== undefined) { d.textContent = isi; }
        return d;
    }

    function buatSwitch(aktif, onChange) {
        var wrap = el('label', 'lk-switch');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!aktif;
        input.addEventListener('change', function () { onChange(input.checked); });
        wrap.appendChild(input);
        wrap.appendChild(el('span', 'lk-slider'));
        return wrap;
    }

    function buatItemLayer(layer) {
        var info = uraikanJudul(layer.get('title'));
        var namaAsli = info.nama;
        var nama = NAMA_TAMPIL[namaAsli] || namaAsli;

        var item = el('div', 'lk-item');
        var row = el('div', 'lk-row');

        var label = el('span', 'lk-nama', nama);
        label.title = namaAsli;
        row.appendChild(label);

        var punyaLegenda = info.legenda.length > 0;
        var chev = null;
        if (punyaLegenda) {
            chev = el('button', 'lk-chev', '▼');
            chev.type = 'button';
            chev.setAttribute('aria-label', 'Tampilkan legenda ' + nama);
            row.appendChild(chev);
        }

        row.appendChild(buatSwitch(layer.getVisible(), function (nyala) {
            layer.setVisible(nyala);
            item.classList.toggle('mati', !nyala);
        }));
        item.appendChild(row);

        if (punyaLegenda) {
            var box = el('div', 'lk-legenda');

            // apakah layer ini pakai simbol lingkaran bergradasi?
            var cfg = LEGENDA_LINGKARAN[namaAsli];
            var radii = cfg && window[cfg.radius];
            if (radii && radii.length !== info.legenda.length) { radii = null; }
            if (radii) { box.classList.add('lk-legenda-lingkaran'); }

            info.legenda.forEach(function (l, i) {
                var b = el('div', 'lk-legenda-baris');
                if (radii) {
                    var d = Math.round(radii[i] * 2);
                    var bulat = el('span', 'lk-bulat');
                    bulat.style.width = d + 'px';
                    bulat.style.height = d + 'px';
                    bulat.style.background = window[cfg.isi] || '#db1e2a';
                    bulat.style.borderColor = window[cfg.garis] || '#801119';
                    var slot = el('span', 'lk-slot');
                    slot.style.width = (Math.round(radii[radii.length - 1] * 2) + 4) + 'px';
                    slot.appendChild(bulat);
                    b.appendChild(slot);
                } else {
                    var img = document.createElement('img');
                    img.src = l.src;
                    img.alt = '';
                    b.appendChild(img);
                }
                b.appendChild(el('span', null, l.label));
                box.appendChild(b);
            });

            if (PAKAI_OPASITAS) {
                var op = el('div', 'lk-opasitas');
                op.appendChild(el('span', null, 'Opasitas'));
                var rng = document.createElement('input');
                rng.type = 'range';
                rng.min = 0; rng.max = 100; rng.step = 5;
                rng.value = Math.round(layer.getOpacity() * 100);
                var nilai = el('span', null, rng.value + '%');
                rng.addEventListener('input', function () {
                    layer.setOpacity(rng.value / 100);
                    nilai.textContent = rng.value + '%';
                });
                op.appendChild(rng);
                op.appendChild(nilai);
                box.appendChild(op);
            }

            item.appendChild(box);

            var buka = function () { item.classList.toggle('terbuka'); };
            chev.addEventListener('click', buka);
            label.addEventListener('click', buka);

            if (TERBUKA_AWAL.indexOf(namaAsli) !== -1) { item.classList.add('terbuka'); }
        }

        return item;
    }

    function buatItemBasemap(layer, grup) {
        var info = uraikanJudul(layer.get('title'));
        var wrap = el('label', 'lk-basemap');
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'lk-basemap';
        radio.checked = layer.getVisible();
        radio.addEventListener('change', function () {
            grup.forEach(function (l) { l.setVisible(l === layer); });
        });
        wrap.appendChild(radio);
        wrap.appendChild(el('span', null, NAMA_TAMPIL[info.nama] || info.nama));
        return wrap;
    }

    function bangun() {
        if (typeof map === 'undefined' || typeof layersList === 'undefined') {
            console.error('[ui-panel] map / layersList tidak ditemukan.');
            return;
        }

        // matikan layer switcher bawaan qgis2web
        try {
            if (typeof layerSwitcher !== 'undefined' && layerSwitcher) {
                map.removeControl(layerSwitcher);
            }
        } catch (e) { /* abaikan */ }

        var target = document.getElementById('map');

        /* ---- judul peta ---- */
        var judul = document.getElementById('peta-judul');
        if (judul) { target.appendChild(judul); }

        /* ---- panel ---- */
        var panel = el('div', null);
        panel.id = 'layer-kontrol';

        panel.appendChild(el('div', 'lk-head', 'Layer Kontrol'));

        var body = el('div', 'lk-body');

        var basemaps = [];
        var overlays = [];
        layersList.forEach(function (l) {
            if (l.get('type') === 'base') { basemaps.push(l); } else { overlays.push(l); }
        });

        // tampilkan layer paling atas lebih dulu
        overlays.slice().reverse().forEach(function (l, i) {
            if (i === 0) { body.appendChild(el('div', 'lk-subjudul', 'Kategori')); }
            body.appendChild(buatItemLayer(l));
        });

        if (basemaps.length) {
            body.appendChild(el('div', 'lk-subjudul', 'Peta Dasar'));
            var wrapBm = el('div', 'lk-item');
            basemaps.forEach(function (l) { wrapBm.appendChild(buatItemBasemap(l, basemaps)); });
            body.appendChild(wrapBm);
        }

        panel.appendChild(body);

        var foot = el('div', 'lk-foot');
        var tombolTutup = el('button', null, '‹  Sembunyikan Menu');
        tombolTutup.type = 'button';
        foot.appendChild(tombolTutup);
        panel.appendChild(foot);

        target.appendChild(panel);

        /* ---- tombol buka kembali ---- */
        var tombolBuka = el('button', null, 'Layer Kontrol  ›');
        tombolBuka.id = 'lk-buka';
        tombolBuka.type = 'button';
        target.appendChild(tombolBuka);

        tombolTutup.addEventListener('click', function () {
            panel.classList.add('tersembunyi');
            tombolBuka.classList.add('tampil');
        });
        tombolBuka.addEventListener('click', function () {
            panel.classList.remove('tersembunyi');
            tombolBuka.classList.remove('tampil');
        });

        // di layar kecil, panel tertutup dulu
        if (window.innerWidth < 650) { tombolTutup.click(); }

        // label nama desa digambar di canvas: gambar ulang setelah font siap
        // supaya tidak sempat memakai font cadangan
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () { map.render(); });
        }

        // cegah klik di panel ikut memicu popup peta
        ['click', 'dblclick', 'pointerdown', 'mousedown', 'wheel', 'touchstart'].forEach(function (ev) {
            [panel, tombolBuka].forEach(function (n) {
                n.addEventListener(ev, function (e) { e.stopPropagation(); });
            });
        });
    }

    siap(bangun);
})();
