import { formatCurrency, formatDate } from '../utils/format'

const ExpenseCard = ({ expense, onEdit, onDelete }) => (
  <div className="glass-card flex flex-col gap-4 p-5">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-silver">
        {expense.title ?? expense.description}
      </h4>
      <span className="tag">{expense.category}</span>
    </div>
    <div className="flex items-center justify-between text-sm text-silver-muted">
      <span>{expense.payment_method ?? 'Card'}</span>
      <span>{formatDate(expense.date)}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-xl font-semibold text-silver">
        {formatCurrency(expense.amount)}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="border border-glass-border px-3 py-1 text-xs text-silver-muted hover:text-white"
          onClick={() => onEdit(expense)}
        >
          Edit
        </button>
        <button
          type="button"
          className="border border-red-400/40 px-3 py-1 text-xs text-red-300 hover:text-red-200"
          onClick={() => onDelete(expense)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)

export default ExpenseCard
