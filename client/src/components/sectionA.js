async function renderSectionA() {
    const container = document.createElement('div');
    container.className = 'news-grid';

    try {
        const response = await fetch('http://localhost:3000/api/news/all');
        const result = await response.json();

        if (result.status === 'success') {
            // ambil 4 berita pertama
            const news = result.data.slice(0, 4);

            news.forEach(item => {
                const card = `
                <div class="news-card">
                    <h3>${item.title}</h3>
                    <p>${item.content.substring(0, 100)}...</p>
                    <small>By ${item.User.userName} | ${new Date(item.createdAt).toLocaleDateString()}</small>
                </div>
                `;
                container.innerHTML += card;
            });
        }
    } catch (error) {
        container.innerHTML = `<p>Failed to load news: ${error.message}</p>`;
    }

    return container.outerHTML;
}
