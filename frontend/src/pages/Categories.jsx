import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { addCategory, getCategories } from '../services/categoryService'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data ?? [])
      setError('')
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? 'Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
  }, [])

  const visibleCategories = useMemo(() => {
    const seen = new Set()
    return categories.filter((category) => {
      const categoryName = (category.category_name ?? category.name ?? category.title ?? '').trim()
      const key = categoryName.toLowerCase()
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [categories])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await addCategory({ category_name: name })
      setName('')
      setModalOpen(false)
      fetchCategories()
    } catch (err) {
      setError(err?.response?.data?.detail ?? err.message ?? 'Failed to add category.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">
            Category Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Categories</h1>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      {error && <EmptyState title="Category Error" description={error} />}

      {loading ? (
        <Loader label="Loading categories" />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories" description="Create your first category." />
      ) : (
        <div className="grid grid-auto-fit gap-4">
          {visibleCategories.map((category) => (
            <div
              key={category.category_id ?? category.id ?? category.category_name ?? category.name}
              className="glass-card p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-silver-muted">Category</p>
              <h3 className="mt-3 text-lg font-semibold text-silver">
                {category.category_name ?? category.name ?? category.title}
              </h3>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Category">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Category Name"
            placeholder="Lifestyle"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Button type="submit" className="w-full btn-slide">
            Add Category
          </Button>
        </form>
      </Modal>
    </div>
  )
}

export default Categories
