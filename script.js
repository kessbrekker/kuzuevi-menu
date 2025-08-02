// Menü verilerini yükleyen fonksiyon
async function menuYukle() {
    const container = document.getElementById('menu-container');
    try {
        const res = await fetch('menu.json');
        const data = await res.json();
        container.innerHTML = '';
        Object.keys(data).forEach(kategori => {
            const kategoriObj = data[kategori];
            let urunler = kategoriObj;
            let sutun = 1;
            let kategoriGoster = true;
            if (typeof kategoriObj === 'object' && kategoriObj.urunler) {
                urunler = kategoriObj.urunler;
                sutun = kategoriObj.sutun || 1;
                kategoriGoster = kategoriObj.goster !== undefined ? kategoriObj.goster : true;
            }
            if (!kategoriGoster || !Array.isArray(urunler) || urunler.length === 0) return;
            const section = document.createElement('section');
            section.className = 'menu-category';
            section.innerHTML = `<h2 data-kategori-baslik="${kategori}">${kategori}</h2>`;
            const ul = document.createElement('ul');
            ul.className = 'menu-list';
            ul.classList.add(`sutun-${sutun}`);
            urunler.forEach(urun => {
                const li = document.createElement('li');
                li.className = 'menu-list-item';
                if (urun.highlight === true) {
                    li.classList.add('highlighted');
                }
                if (urun.resim) {
                    li.style.backgroundImage = `url('${urun.resim}')`;
                }
                let overlay = `
                    <div class="menu-list-info-overlay">
                        <div class="menu-list-info-left">
                            <div class="menu-list-title">${urun.isim}</div>
                        </div>
                        <div class="menu-list-info-right">
                            ${(urun.kilo && String(urun.kilo).trim() !== '' && urun.kilo !== 'null' && urun.kilo !== null) ? `<span class="menu-list-kilo">${urun.kilo}</span>` : ''}
                            ${(urun.kisiSayisi > 0 || urun.kisi > 0) ? `<span class="menu-list-kisi">${urun.kisiSayisi || urun.kisi} Kişilik</span>` : ''}
                            <span class="menu-list-price">${urun.fiyat}₺</span>
                        </div>
                    </div>
                `;
                if (urun.goster === false) {
                    overlay += `<div class="stokta-degil-filtre"><span>Stokta değil</span></div>`;
                    li.style.position = 'relative';
                }
                li.innerHTML = overlay;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            container.appendChild(section);
        });
    } catch (e) {
        container.innerHTML = '<p>Menü yüklenemedi.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
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

// Header slider görsel sayısına göre genişlik ve animasyon ayarı
(function() {
    const slider = document.querySelector('.header-bg-slider');
    const imgs = document.querySelectorAll('.header-bg-slider .header-bg-img');
    if (!slider || imgs.length < 2) return;
    const count = imgs.length;
    const imgWidth = 100 / count;
    imgs.forEach(img => img.style.width = imgWidth + '%');
    slider.style.width = (count * 100) + '%';
    const stay = 3;
    const transition = 1.5;
    const duration = count * (stay + transition);
    slider.style.animation = `header-slide-loop ${duration}s cubic-bezier(0.77,0,0.18,1) infinite`;
    let keyframes = `@keyframes header-slide-loop {\n`;
    let percent = 0;
    for (let i = 0; i < count; i++) {
        const move = (-i * 100 / count).toFixed(4);
        const nextMove = (-(i+1) * 100 / count).toFixed(4);
        const stayPercent = (stay / duration) * 100;
        const transPercent = (transition / duration) * 100;
        keyframes += `  ${percent.toFixed(4)}% { transform: translateX(${move}%); }\n`;
        percent += stayPercent;
        keyframes += `  ${percent.toFixed(4)}% { transform: translateX(${move}%); }\n`;
        percent += transPercent;
        keyframes += `  ${percent.toFixed(4)}% { transform: translateX(${nextMove}%); }\n`;
    }
    keyframes += `  100% { transform: translateX(-${((count-1)*100/count).toFixed(4)}%); }\n}`;
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
})();