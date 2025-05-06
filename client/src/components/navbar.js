function renderNavbar() {
    return `
    <div class="navbar">
        <div class="navbar-left">
            <img src="/assets/images/winnicode-logo.png" alt="WinniCode Logo" class="logo">
        </div>
        <div class="navbar-right">
            <button class="hamburger-btn" id="hamburgerBtn">
                ☰
            </button>
        </div>
        <div class="menu" id="navMenu">
            <a href="https://winnicode.com/">BERANDA</a>
            <a href="#">PROGRAM ▼</a>
            <a href="#">PENGUMUMAN ▼</a>
            <a onClick="toHome()">BERITA</a>
            <a href="#">TENTANG ▼</a>
        </div>
    </div>
    `;
}

function toHome() {
    window.location.href = `/`;
}
