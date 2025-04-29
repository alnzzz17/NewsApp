async function renderFooter() {
    return `
    <footer class="footer">
        <div class="footer-content">
            
            <div class="footer-section">
                <h3>TAUTAN</h3>
                <ul>
                    <li>
                        <a href="https://winnicode.com" target="_blank">
                             <i class="fas fa-globe icon"></i>
                            www.winnicode.com
                        </a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com/winnicodeofficial/" target="_blank">
                             <i class="fab fa-instagram icon"></i>
                            Instagram
                        </a>
                    </li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>SITEMAP</h3>
                <ul>
                    <li><a href="/">Beranda</a></li>
                    <li><a href="/explore/berita">Berita</a></li>
                    <li><a href="/kontak-kami">Kontak Kami</a></li>
                    <li><a href="/privasi-policy">Privasi & Policy</a></li>
                    <li><a href="/tentang">Tentang</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>KONTAK KAMI</h3>
                <p><strong>E-Mail:</strong> winnicodegarudaofficial@gmail.com</p>
                <p><strong>Call Center:</strong> 6285159932501 (24 Jam)</p>
                <p><strong>Alamat (Cabang Bandung):</strong><br>
                    Jl. Asia Afrika No.158, Kb. Pisang, Kec. Sumur Bandung,<br>
                    Kota Bandung, Jawa Barat 40261
                </p>
                <p><strong>Alamat (Cabang Yogyakarta):</strong><br>
                    Bantul, Yogyakarta
                </p>
                <p><strong>Alamat (Cabang Jakarta):</strong><br>
                    Bekasi, Jawa Barat
                </p>
                <p><strong>Administrasi Berkas:</strong><br>
                    Hubungi Admin Telp: +6285159932501
                </p>
            </div>

            <div class="footer-section footer-logos">
                <div class="logo-row">
                    <img src="/assets/images/winnicode-logo.png" alt="Winnicode Logo" class="footer-logo">
                    <img src="/assets/images/km-logo.png" alt="Kampus Merdeka Logo" class="footer-logo">
                </div>
                <p class="footer-description">
                    Jurnalistik Program winnicode adalah program pengembangan sumber daya manusia yang ditujukan bagi pemuda pemudi yang berkarir di dunia report.
                </p>
            </div>

        </div>

        <div class="footer-bottom">
            <p>Copyright © 2025 PT. WINNICODE GARUDA TEKNOLOGI</p>
        </div>
    </footer>
    `;
}

window.renderFooter = renderFooter;
