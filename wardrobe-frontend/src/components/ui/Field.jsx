import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Field = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = true
}) => {
  const isPassword = type === 'password'
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="
            w-full
            rounded-xl
            border
            border-neutral-300 dark:border-neutral-700
            bg-white dark:bg-neutral-900
            px-3 py-2 pr-10
            text-sm
            text-neutral-900 dark:text-neutral-100
            outline-none
            transition
            focus:border-black dark:focus:border-white
            focus:ring-1
            focus:ring-black dark:focus:ring-white
            disabled:bg-neutral-100 dark:disabled:bg-neutral-800
            disabled:cursor-not-allowed
          "
        />

        {/* 👁 Toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(v => !v)}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-neutral-400 dark:text-neutral-500
              hover:text-neutral-700 dark:hover:text-neutral-300
              transition
            "
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

export default Field
