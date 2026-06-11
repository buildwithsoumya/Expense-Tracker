import { useState, useEffect } from 'react';
import { MessageSquareHeart, Star } from 'lucide-react';
import api from '../api/adminApi';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeedbacks = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get('/admin/feedbacks', { params: { page: pageNum, limit: 20 } });
      setFeedbacks(res.data.items);
      setTotalPages(res.data.pages);
      setPage(res.data.page);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(1);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500">
          <MessageSquareHeart size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-silver">User Feedback</h1>
          <p className="text-sm text-silver-muted mt-1">See what users are saying about SmartSpend AI.</p>
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card p-8 text-center text-silver-muted">Loading feedbacks...</div>
      ) : feedbacks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-graphite text-silver-muted mb-4">
            <MessageSquareHeart size={32} />
          </div>
          <h3 className="text-lg font-semibold text-silver">No Feedback Yet</h3>
          <p className="text-sm text-silver-muted mt-2">When users submit feedback, it will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="glass-card p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-silver">{fb.user_name}</h4>
                  <p className="text-xs text-silver-muted">{fb.user_email}</p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-current" />
                  ))}
                  {[...Array(5 - fb.rating)].map((_, i) => (
                    <Star key={i + fb.rating} size={14} className="text-silver-muted/30" />
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-graphite/50 rounded p-4 text-sm text-silver">
                {fb.comment ? (
                  <p className="whitespace-pre-wrap">{fb.comment}</p>
                ) : (
                  <p className="text-silver-muted italic">No comment provided.</p>
                )}
              </div>
              <p className="text-xs text-silver-muted text-right mt-4">
                {new Date(fb.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-glass-border pt-4 mt-6">
          <button
            className="rounded bg-graphite px-4 py-2 text-sm text-silver hover:bg-glass disabled:opacity-50"
            disabled={page === 1 || loading}
            onClick={() => fetchFeedbacks(page - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-silver-muted">
            Page {page} of {totalPages}
          </span>
          <button
            className="rounded bg-graphite px-4 py-2 text-sm text-silver hover:bg-glass disabled:opacity-50"
            disabled={page === totalPages || loading}
            onClick={() => fetchFeedbacks(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Feedback;
