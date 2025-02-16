'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
  onIconClick?: () => void
}

const Input = ({ 
  label, 
  error, 
  icon, 
  onIconClick, 
  ...props 
}: InputProps) => {
  return (
    <div>
      <label className="text-gray-800 text-sm mb-2 block">{label}</label>
      <div className="relative flex items-center">
        <input
          className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
          {...props}
        />
        {icon && (
          <div 
            onClick={onIconClick} 
            className={`absolute right-4 ${onIconClick ? 'cursor-pointer' : ''}`}
          >
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default Input