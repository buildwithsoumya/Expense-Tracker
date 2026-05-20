import { formatCurrency, formatDate } from '../utils/format'

const ExpenseTable = ({ expenses, onEdit, onDelete }) => (
  <div className="overflow-hidden rounded-2xl border border-glass-border">
    <table className="w-full text-left text-sm">
      <thead className="bg-charcoal/80 text-xs uppercase tracking-[0.2em] text-silver-muted">
        <tr>
          <th className="px-5 py-4">Title</th>
          <th className="px-5 py-4">Category</th>
          <th className="px-5 py-4">Payment</th>
          <th className="px-5 py-4">Date</th>
          <th className="px-5 py-4 text-right">Amount</th>
          <th className="px-5 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-glass-border bg-glass-fill">
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td className="px-5 py-4 text-silver">{expense.title ?? expense.description}</td>
            <td className="px-5 py-4 text-silver-muted">{expense.category}</td>
            <td className="px-5 py-4 text-silver-muted">{expense.payment_method ?? 'Card'}</td>
            <td className="px-5 py-4 text-silver-muted">
              {formatDate(expense.date)}
            </td>
            <td className="px-5 py-4 text-right font-semibold text-silver">
              {formatCurrency(expense.amount)}
            </td>
            <td className="px-5 py-4 text-right">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-glass-border px-3 py-1 text-xs text-silver-muted hover:text-white"
                  onClick={() => onEdit(expense)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-300 hover:text-red-200"
                  onClick={() => onDelete(expense)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default ExpenseTable
