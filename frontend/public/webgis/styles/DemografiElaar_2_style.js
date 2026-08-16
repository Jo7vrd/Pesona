var size = 0;
var placement = 'point';

/* --- pengaturan simbol & label (silakan ubah angkanya sesuai selera) --- */
// Jari-jari lingkaran per kelas jumlah jiwa, urut dari kelas terkecil.
// [ 436-521 , 521-586 , 586-633 ]   -> dipakai juga oleh legenda di panel.
var RADIUS_ELAAR = [10, 15, 21];
var WARNA_ELAAR  = 'rgba(219,30,42,1.0)';
var GARIS_ELAAR  = 'rgba(128,17,25,1.0)';

var UKURAN_LABEL_ELAAR = 24;     // ukuran font label, dulu 39
var JARAK_LABEL_ELAAR  = 10;     // jarak label dari tepi lingkaran (px)
var TEBAL_GARIS_LABEL  = 2.5;    // tebal garis hitam di sekeliling teks

/**
 * Label dibuat manual (tidak lewat createTextStyle) supaya jaraknya bisa
 * mengikuti besar lingkaran tiap desa - kalau tidak, teks menempel/menimpa
 * lingkaran yang berukuran besar.
 */
function labelElaar(feature, labelText, radius) {
    if (feature.hide || !labelText) { return; }
    return new ol.style.Text({
        font: '600 ' + UKURAN_LABEL_ELAAR + 'px \'Montserrat\', \'Open Sans\', sans-serif',
        text: labelText,
        textBaseline: 'middle',
        textAlign: 'left',
        offsetX: radius + JARAK_LABEL_ELAAR,
        offsetY: 0,
        placement: 'point',
        maxAngle: 0,
        overflow: true,
        fill: new ol.style.Fill({ color: '#ffffff' }),
        stroke: new ol.style.Stroke({ color: '#000000', width: TEBAL_GARIS_LABEL })
    });
}

function titikElaar(feature, labelText, radius) {
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: radius + size,
            displacement: [0, 0],
            stroke: new ol.style.Stroke({ color: GARIS_ELAAR, lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.52 }),
            fill: new ol.style.Fill({ color: WARNA_ELAAR })
        }),
        text: labelElaar(feature, labelText, radius + size)
    });
}

var style_DemografiElaar_2 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };

    var style;
    var labelText = "";
    // JMLH_JIWA tersimpan sebagai teks di GeoJSON -> paksa jadi angka
    var value = parseFloat(feature.get("JMLH_JIWA"));
    if (feature.get("NAMA") !== null) {
        labelText = String(feature.get("NAMA"));
    }

    if (value >= 436.000000 && value <= 520.666667) {
        style = [ titikElaar(feature, labelText, RADIUS_ELAAR[0]) ];
    } else if (value >= 520.666667 && value <= 586.333333) {
        style = [ titikElaar(feature, labelText, RADIUS_ELAAR[1]) ];
    } else if (value >= 586.333333 && value <= 633.000000) {
        style = [ titikElaar(feature, labelText, RADIUS_ELAAR[2]) ];
    }

    // nilai di luar rentang klasifikasi tetap digambar
    if (!style) {
        style = [ titikElaar(feature, labelText, RADIUS_ELAAR[0] * 0.8) ];
    }

    return style;
};
