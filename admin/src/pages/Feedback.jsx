import { useState, useEffect } from 'react';
import api from '../api/adminApi';

// Inline SVG icons — no lucide-react dependency needed in admin
const IconMessage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const StarFilled = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarEmpty = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchFeedbacks = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get('/admin/feedbacks', { params: { page: pageNum, limit: 20 } });
      setFeedbacks(res.data.items);
      setTotalPages(res.data.pages);
      setPage(res.data.page);
      setTotal(res.data.total);
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

  // Average rating
  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '8px',
            background: 'rgba(236, 72, 153, 0.1)',
            color: '#ec4899',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconMessage />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              User Feedback
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              See what users are saying about SmartSpend AI
            </p>
          </div>
        </div>

        {/* Stats pills */}
        {!loading && feedbacks.length > 0 && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="glass-card" style={{ padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{total}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Reviews</div>
            </div>
            <div className="glass-card" style={{ padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                {avgRating} <StarFilled />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Rating</div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-sm)',
          color: '#f87171',
          fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px', width: '24px', height: '24px' }} />
          Loading feedback...
        </div>
      ) : feedbacks.length === 0 ? (
        /* Empty state */
        <div className="glass-card" style={{ padding: '64px', textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--bg-tertiary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--text-muted)',
          }}>
            <IconMessage />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Feedback Yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            When users submit feedback, it will appear here.
          </p>
        </div>
      ) : (
        /* Feedback grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {feedbacks.map((fb) => (
            <div key={fb.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* User info + stars */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: '700', color: '#fff',
                    flexShrink: 0,
                  }}>
                    {fb.user_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {fb.user_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {fb.user_email}
                    </div>
                  </div>
                </div>

                {/* Star rating */}
                <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= fb.rating
                      ? <StarFilled key={star} />
                      : <span key={star} style={{ color: 'var(--text-muted)', opacity: 0.3 }}><StarEmpty /></span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div style={{
                flex: 1,
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                minHeight: '60px',
              }}>
                {fb.comment
                  ? <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{fb.comment}</p>
                  : <p style={{ margin: 0, color: 'var(--text-muted)', fontStyle: 'italic' }}>No comment provided.</p>
                }
              </div>

              {/* Date */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {new Date(fb.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px',
        }}>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: page === 1 || loading ? 'not-allowed' : 'pointer',
              opacity: page === 1 || loading ? 0.5 : 1,
              fontSize: '0.875rem',
              fontFamily: 'var(--font-family)',
            }}
            disabled={page === 1 || loading}
            onClick={() => fetchFeedbacks(page - 1)}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: page === totalPages || loading ? 'not-allowed' : 'pointer',
              opacity: page === totalPages || loading ? 0.5 : 1,
              fontSize: '0.875rem',
              fontFamily: 'var(--font-family)',
            }}
            disabled={page === totalPages || loading}
            onClick={() => fetchFeedbacks(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Feedback;
