var wms_layers = [];


        var lyr_GoogleSatellite_0 = new ol.layer.Tile({
            'title': 'Google Satellite',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            })
        });
var format_PotensiTutupanLahanKeiKecilTimurSelatan_1 = new ol.format.GeoJSON();
var features_PotensiTutupanLahanKeiKecilTimurSelatan_1 = format_PotensiTutupanLahanKeiKecilTimurSelatan_1.readFeatures(json_PotensiTutupanLahanKeiKecilTimurSelatan_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_PotensiTutupanLahanKeiKecilTimurSelatan_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_PotensiTutupanLahanKeiKecilTimurSelatan_1.addFeatures(features_PotensiTutupanLahanKeiKecilTimurSelatan_1);
var lyr_PotensiTutupanLahanKeiKecilTimurSelatan_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_PotensiTutupanLahanKeiKecilTimurSelatan_1, 
                style: style_PotensiTutupanLahanKeiKecilTimurSelatan_1,
                popuplayertitle: 'Potensi Tutupan Lahan Kei Kecil Timur Selatan',
                interactive: true,
    title: 'Potensi Tutupan Lahan Kei Kecil Timur Selatan<br />\
    <img src="styles/legend/PotensiTutupanLahanKeiKecilTimurSelatan_1_0.png" /> Bangunan Permukiman/Campuran<br />\
    <img src="styles/legend/PotensiTutupanLahanKeiKecilTimurSelatan_1_1.png" /> Hutan<br />\
    <img src="styles/legend/PotensiTutupanLahanKeiKecilTimurSelatan_1_2.png" /> Pasir/Bukit Pasir Laut<br />\
    <img src="styles/legend/PotensiTutupanLahanKeiKecilTimurSelatan_1_3.png" /> Perkebunan/Kebun<br />\
    <img src="styles/legend/PotensiTutupanLahanKeiKecilTimurSelatan_1_4.png" /> Semak Belukar<br />\
    <img src="styles/legend/PotensiTutupanLahanKeiKecilTimurSelatan_1_5.png" /> Tegalan/Ladang<br />' });
var format_DemografiElaar_2 = new ol.format.GeoJSON();
var features_DemografiElaar_2 = format_DemografiElaar_2.readFeatures(json_DemografiElaar_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_DemografiElaar_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_DemografiElaar_2.addFeatures(features_DemografiElaar_2);
var lyr_DemografiElaar_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_DemografiElaar_2, 
                style: style_DemografiElaar_2,
                popuplayertitle: 'Demografi Elaar',
                interactive: true,
    title: 'Demografi Elaar<br />\
    <img src="styles/legend/DemografiElaar_2_0.png" /> 436 - 521 (Elaar Ngursoin)<br />\
    <img src="styles/legend/DemografiElaar_2_1.png" /> 521 - 586 (Elaar Let)<br />\
    <img src="styles/legend/DemografiElaar_2_2.png" /> 586 - 633 (Elaar Lamagorang)<br />' });

lyr_GoogleSatellite_0.setVisible(true);lyr_PotensiTutupanLahanKeiKecilTimurSelatan_1.setVisible(true);lyr_DemografiElaar_2.setVisible(true);
var layersList = [lyr_GoogleSatellite_0,lyr_PotensiTutupanLahanKeiKecilTimurSelatan_1,lyr_DemografiElaar_2];
lyr_PotensiTutupanLahanKeiKecilTimurSelatan_1.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'PENUTUP_LA': 'Jenis Tutupan Lahan', 'SUMBER_1': 'Sumber Data', 'SHAPE_Leng': 'Keliling', 'SHAPE_Area': 'Luas (m²)', });
lyr_DemografiElaar_2.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'NAMA': 'Nama Desa', 'JMLH_JIWA': 'Jumlah Jiwa', 'JMLH_KK': 'Jumlah Kepala Keluarga', });
lyr_PotensiTutupanLahanKeiKecilTimurSelatan_1.set('fieldImages', {'OBJECTID': 'TextEdit', 'PENUTUP_LA': 'TextEdit', 'SUMBER_1': 'TextEdit', 'SHAPE_Leng': 'TextEdit', 'SHAPE_Area': 'TextEdit', });
lyr_DemografiElaar_2.set('fieldImages', {'OBJECTID': 'TextEdit', 'NAMA': 'TextEdit', 'JMLH_JIWA': 'Range', 'JMLH_KK': 'TextEdit', });
lyr_PotensiTutupanLahanKeiKecilTimurSelatan_1.set('fieldLabels', {'OBJECTID': 'hidden field', 'PENUTUP_LA': 'header label - visible with data', 'SUMBER_1': 'hidden field', 'SHAPE_Leng': 'hidden field', 'SHAPE_Area': 'header label - visible with data', });
lyr_DemografiElaar_2.set('fieldLabels', {'OBJECTID': 'hidden field', 'NAMA': 'header label - visible with data', 'JMLH_JIWA': 'header label - visible with data', 'JMLH_KK': 'header label - visible with data', });
lyr_DemografiElaar_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});