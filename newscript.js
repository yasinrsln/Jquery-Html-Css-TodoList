$(document).ready(function() {
 
    // DIV'LERİ GİZLE
    $("#tabloKontrol").hide();
    $("#kayitDefteri").hide();
 
    if (window.openDatabase) {
        var veritabani = openDatabase('local_veritabani', '1.0', 'Web SQL Veritabanı', 10 * 1024 * 1024);  
        console.log("local_veritabani isimli veritabanı 1.0 versiyonu ile 10MB olacak şekilde oluşturuldu veya zaten varsa yeniden oluşturulmadı!");
        kayitlariOku();
    }else{
         alert("Maalesef tarayıcınızda Web SQL desteği bulunmamaktadır.")
    }
 
    $("#tabloOlustur").click(function() {
            veritabani.transaction(function(tx) {
            tx.executeSql('CREATE TABLE notlar(id INTEGER PRIMARY KEY, metin VARCHAR(512), tarih DATETIME )', [], function(islem, sonuc) {
                console.log(sonuc);
                console.log('Notlar tablosu oluşturuldu.');
                $("#tabloKontrol").hide();
                $("#kayitDefteri").show();
 
            }, function(islem, hata) {
                console.log("Hata: ", hata);
            });
        }, islemHatali, islemBasarili);
    });
  
    // TABLO SİL BUTONUNA TIKLANINCA TABLOYU SİL
    $("#tabloSil").click(function() {
        veritabani.transaction(function(tx) {
            tx.executeSql('DROP TABLE notlar', [], function(islem, sonuc) {
                console.log(sonuc);
                console.log('Notlar tablosu silindi.');
               
                $("#tabloKontrol").show();
                $("#kayitDefteri").hide();
          
                kayitlariOku ();
            }, function(islem, hata) {
                console.log("Hata: ", hata);
            });
        }, islemHatali, islemBasarili);
        $("#tablo").empty();
    });
 
    $("#notKaydet").click(function() {
        veritabani.transaction(function(tx) {
 


            var metin = $("#notMetini").val();
 
         
                tx.executeSql('INSERT INTO notlar (metin, tarih) VALUES (?,?)', [metin, new Date().getTime()], function(islem, sonuc) {
                    console.log(sonuc);
                    console.log('Notlar tablosu silindi.');
                 
                    $("#notMetini").val("");
    
                    kayitlariOku();
                }, function(islem, hata) {
                    console.log("Hata: ", hata);
                });
        }, islemHatali, islemBasarili);
    });
 

    function kayitlariOku (){
        veritabani.transaction(function(tx) {
            tx.executeSql('SELECT * FROM notlar', [], function(islem, sonuc) {
                console.log("Kayıtlar listeleniyor:")
                console.log(sonuc.rows);
                $("#tabloKontrol").hide();
                $("#kayitDefteri").show();
            
                $("#tablo").empty();
            
                jQuery.each(sonuc.rows, function(index, value) {
                   
                     $("#tablo").append(
                        "<tr>" +
                             "<td>"+value.id+"</td>"+
                             "<td><a id='metin"+value.id+"' >"+value.metin+"</a></td>"+
                             "<td>"+ new Date(value.tarih).toLocaleString()+"</td>"+
                             "<td><input type='text' id='guncellenecek"+value.id+"' placeholder='yeni değeri giriniz'></a></td>"+
                             "<td><button type='button' data-index='"+value.id+"' class='guncelle btn btn-success'>Güncelle</button>&nbsp&nbsp<button type='button' data-index='"+value.id+"' class='sil btn btn-danger' >Sil</button></td>"+
                        "</tr>");

                 });
            }, function(islem, hata) {
                console.log("Tabo Yok")
                console.log("Hata: ", hata);
                $("#tabloKontrol").show();
                $("#kayitDefteri").hide();
            });
        });
 
    }
 
  
    $(document).on('click','.guncelle',function(){
      
        var index = $(this).attr('data-index');
        var metin = $("#metin"+index).val();
        var yeniDeger = $("#guncellenecek"+index).val();
       
        if(yeniDeger){
            veritabani.transaction(function(tx) {
                tx.executeSql('UPDATE notlar SET metin=? WHERE id=?', [yeniDeger, index], function(islem, sonuc) {
                    console.log(sonuc);
                    console.log('Kayıt güncellendi.');
            
                    kayitlariOku();
                }, function(islem, hata) {
                    console.log("Hata: ", hata);
                });
            });
        }
    });
 
  
    $(document).on('click','.sil',function(){
        var index = $(this).attr('data-index');
        veritabani.transaction(function(tx) {
            tx.executeSql('DELETE FROM notlar WHERE id = ?', [index], function(islem, sonuc) {
                console.log(sonuc);
                console.log('Kayıt silindi.');
                // KAYITLAR TEKRAR GÜNCELLENİYOR
                kayitlariOku();
            }, function(islem, hata) {
                console.log("Hata: ", hata);
            });
        });
 
    });
 
    function islemHatali(e) {
        console.log("İşlem hatası ! Kod:" + e.code + " Mesaj : " + e.message);
    }
 
    function islemBasarili() {
        console.log("İşlem başarılı bir şekilde gerçekleştirildi!");
    }
 
});
