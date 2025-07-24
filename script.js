// Menü verilerini yükleyen fonksiyon
async function menuYukle() {
    // Menülerin ekleneceği ana container'ı seçiyoruz
    const container = document.getElementById('menu-container');
    try {
        // menu.json dosyasını fetch ile çekiyoruz
        const res = await fetch('menu.json');
        // Gelen cevabı JSON formatına çeviriyoruz
        const data = await res.json();
        // Container'ın içeriğini temizliyoruz
        container.innerHTML = '';
        // Her kategori için dönüyoruz (ör: Çorbalar, Ana Yemekler)
        Object.keys(data).forEach(kategori => {
            // Kategori verilerini al (yeni json formatı desteği)
            let urunler = data[kategori];
            let kategoriGoster = true;
            if (typeof urunler === 'object' && urunler.urunler) {
                kategoriGoster = urunler.goster !== undefined ? urunler.goster : true;
                urunler = urunler.urunler;
            }

            // Eğer kategori gizli ise veya hiç ürün yoksa kategoriyi gösterme
            if (!kategoriGoster || !Array.isArray(urunler) || urunler.length === 0) return;

            // Yeni bir section elementi oluşturuyoruz
            const section = document.createElement('section');
            section.className = 'menu-category';
            // Kategori başlığını ekliyoruz
            section.innerHTML = `<h2>${kategori}</h2>`;
            // Liste modeli (arka plan fotoğraf)
            const ul = document.createElement('ul');
            ul.className = 'menu-list';
            // Kategorideki her ürün için dönüyoruz
            urunler.forEach(urun => {
                const li = document.createElement('li');
                li.className = 'menu-list-item';
                if (urun.resim) {
                    li.style.backgroundImage = `url('${urun.resim}')`;
                }
                let overlay = `
                    <div class=\"menu-list-info-overlay\">
                        <div class=\"menu-list-info-left\">
                            <div class=\"menu-list-title\">${urun.isim}</div>
                        </div>
                        <div class=\"menu-list-info-right\">
                            ${urun.kilo > 0 ? `<span class=\"menu-list-kilo\">${urun.kilo} kg</span>` : ''}
                            ${(urun.kisiSayisi > 0 || urun.kisi > 0) ? `<span class=\"menu-list-kisi\">${urun.kisiSayisi || urun.kisi} Kişilik</span>` : ''}
                            <span class=\"menu-list-price\">${urun.fiyat}₺</span>
                        </div>
                    </div>
                `;
                if (urun.goster === false) {
                    overlay += `<div class=\"stokta-degil-filtre\"><span>Stokta değil</span></div>`;
                    li.style.position = 'relative';
                }
                li.innerHTML = overlay;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            // Section'ı ana container'a ekliyoruz
            container.appendChild(section);
        });
    } catch (e) {
        // Eğer bir hata olursa kullanıcıya hata mesajı gösteriyoruz
        container.innerHTML = '<p>Menü yüklenemedi.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde menüyü getir
    menuYukle();

    // Menüyü Keşfet butonu için yumuşak kaydırma
    const scrollBtn = document.querySelector('.btn[href="#navslider"]');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const nav = document.getElementById('navslider');
            const menuContainer = document.getElementById('menu-container');
            if (nav && menuContainer) {
                const navHeight = nav.offsetHeight;
                const bodyRect = document.body.getBoundingClientRect().top;
                const menuRect = menuContainer.getBoundingClientRect().top;
                const menuPosition = menuRect - bodyRect;
                const offsetPosition = menuPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Stil ekle: stokta olmayan ürünler için gri filtre ve yazı
    const style = document.createElement('style');
    style.innerHTML = `
    .stokta-degil-filtre {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(120,120,120,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        border-radius: 12px;
        pointer-events: none;
    }
    .stokta-degil-filtre span {
        color: #fff;
        font-size: 1.25rem;
        font-weight: bold;
        background: rgba(60,60,60,0.7);
        padding: 0.5em 1.2em;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.13);
    }
    `;
    document.head.appendChild(style);
});