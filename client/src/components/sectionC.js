async function renderSectionC() {
    const container = document.createElement('div');
    container.className = 'news-grid';

    try {
        const response = await fetch('http://localhost:3000/api/news/all');
        const result = await response.json();

        if (result.status === 'success') {
            // ambil berita 9 - 12
            const news = result.data.slice(8, 12);

            news.forEach(item => {
                const card = `
                <div class="news-card">
                    <h3>${item.title}</h3>
                    <p>${item.content.substring(0, 100)}...</p>
                    <small>Posted at ${new Date(item.createdAt).toLocaleTimeString()}</small>
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
