export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'font-semibold px-6 py-2.5 rounded-full transition text-sm'
  const variants = {
    primary: 'bg-indigo-700 text-white hover:bg-indigo-800',
    outline: 'border-2 border-indigo-700 text-indigo-700 hover:bg-indigo-50',
    ghost: 'text-indigo-700 hover:bg-indigo-50',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
