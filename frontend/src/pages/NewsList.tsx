import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews, NewsItem } from '../services/news';

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await getNews(page, 10, undefined, search || undefined);
        setNews(data.items);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [page, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Новости</h1>
        <div className="join">
          <input
            type="text"
            placeholder="Поиск..."
            className="input input-bordered join-item"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {news.map((item) => (
              <div key={item.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body">
                  <h2 className="card-title">
                    <Link to={`/news/${item.id}`} className="hover:text-primary">{item.title}</Link>
                  </h2>
                  {item.subtitle && <p className="text-gray-500">{item.subtitle}</p>}
                  {item.image_path && (
                    <img src={`http://localhost:8000${item.image_path}`} alt={item.title} className="rounded-lg h-48 object-cover" />
                  )}
                  <p className="line-clamp-3">{item.text}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      {item.tags.map(tag => (
                        <span key={tag.id} className="badge badge-outline">{tag.name}</span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span>{item.author.first_name} {item.author.last_name}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>💬 {item.comments_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="join mt-8 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`join-item btn ${p === page ? 'btn-primary' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NewsList;
