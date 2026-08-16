var size = 0;
var placement = 'point';

/* -------------------------------------------------------------------------
   FIX: definisi fill pola garis (line pattern) untuk kelas "Semak Belukar".
   Sebelumnya variabel fill_PotensiTutupanLahanKeiKecilTimurSelatan_1 dipakai
   di bawah tetapi TIDAK PERNAH didefinisikan oleh qgis2web -> ReferenceError.
   Error itu terjadi saat OpenLayers merender poligon Semak Belukar, dan
   membuat SELURUH layer vektor gagal digambar (gejala: shapefile hilang
   ketika peta di-zoom out, muncul lagi saat di-zoom in).
   ------------------------------------------------------------------------- */
var fill_PotensiTutupanLahanKeiKecilTimurSelatan_1;
try {
    fill_PotensiTutupanLahanKeiKecilTimurSelatan_1 = new ol.style.Fill({
        color: stripe(1.748, 4.0, 45, 'rgba(77,175,74,1.0)')
    });
} catch (e) {
    // fallback aman kalau pattern gagal dibuat
    fill_PotensiTutupanLahanKeiKecilTimurSelatan_1 = new ol.style.Fill({
        color: 'rgba(77,175,74,0.45)'
    });
}

// style cadangan bila terjadi error tak terduga saat styling sebuah fitur
var fallbackStyle_PotensiTutupanLahanKeiKecilTimurSelatan_1 = new ol.style.Style({
    stroke: new ol.style.Stroke({color: 'rgba(35,35,35,1.0)', width: 0.5}),
    fill: new ol.style.Fill({color: 'rgba(200,200,200,0.5)'})
});

function categories_PotensiTutupanLahanKeiKecilTimurSelatan_1(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, bufferWidth,
                       placement) {
                var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
                switch(valueStr) {case 'Bangunan Permukiman/Campuran':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(35,35,35,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.38}),fill: new ol.style.Fill({color: 'rgba(255,204,191,1.0)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Hutan':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(35,35,35,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.38}),fill: new ol.style.Fill({color: 'rgba(199,224,176,1.0)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Pasir/Bukit Pasir Laut':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(35,35,35,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.988}),fill: new ol.style.Fill({color: 'rgba(255,240,219,1.0)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Perkebunan/Kebun':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(0,0,0,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.0771632}),fill: new ol.style.Fill({color: 'rgba(217,255,201,1.0)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Semak Belukar':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(35,35,35,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.988}),fill: new ol.style.Fill({color: 'rgba(255,255,255,1.0)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    }),new ol.style.Style({
        
        fill: fill_PotensiTutupanLahanKeiKecilTimurSelatan_1,
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    }),new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(77,175,74,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 1.748}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;
case 'Tegalan/Ladang':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(35,35,35,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 0.38}),fill: new ol.style.Fill({color: 'rgba(255,255,153,1.0)'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];
                    break;}};

var style_PotensiTutupanLahanKeiKecilTimurSelatan_1 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("PENUTUP_LA");
    var labelFont = "10px, sans-serif";
    var labelFill = "#000000";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 0;
    var offsetY = 0;
    var placement = 'point';
    if ("" !== null) {
        labelText = String("");
    }
    
    var style;
    try {
        style = categories_PotensiTutupanLahanKeiKecilTimurSelatan_1(feature, value, size, resolution, labelText,
                                labelFont, labelFill, bufferColor,
                                bufferWidth, placement);
    } catch (e) {
        // jangan biarkan satu fitur bermasalah membuat seluruh layer hilang
        if (window.console) { console.warn('Style error PENUTUP_LA =', value, e); }
        style = [fallbackStyle_PotensiTutupanLahanKeiKecilTimurSelatan_1];
    }
    // kelas yang tidak dikenal -> tetap digambar, bukan undefined
    if (!style) { style = [fallbackStyle_PotensiTutupanLahanKeiKecilTimurSelatan_1]; }

    return style;
};
