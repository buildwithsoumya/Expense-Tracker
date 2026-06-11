import { useState } from 'react'
import { Star } from 'lucide-react'
import Button from './Button'
import api from '../api/axios'

const FeedbackCard = () => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      setErrorMessage('Please select a star rating')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      await api.post('/feedback', { rating, comment })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.response?.data?.detail || 'Failed to submit feedback')
    }
  }

  if (status === 'success') {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
          <Star className="fill-emerald-400" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-silver">Thank you!</h3>
        <p className="text-sm text-silver-muted mt-2">Your feedback helps us improve SmartSpend AI.</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-silver mb-2">Rate Your Experience</h3>
      <p className="text-sm text-silver-muted mb-4">How do you like SmartSpend AI so far?</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={28}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-silver-muted/50'
                }`}
              />
            </button>
          ))}
        </div>
        
        <textarea
          className="input-base min-h-[80px] w-full resize-none bg-graphite/50"
          placeholder="Tell us what you think... (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
        />
        
        {status === 'error' && <p className="text-xs text-red-400">{errorMessage}</p>}
        {errorMessage && status !== 'error' && <p className="text-xs text-red-400">{errorMessage}</p>}
        
        <Button 
          type="submit" 
          disabled={status === 'loading'} 
          className="w-full"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </div>
  )
}

export default FeedbackCard
