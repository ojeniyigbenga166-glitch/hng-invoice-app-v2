export default function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}) {
  const baseStyles = 'font-semibold rounded-full transition-shadow duration-300 flex items-center gap-2 justify-center';
  
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white px-6 py-3',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3',
    tertiary: 'bg-transparent hover:bg-gray-100 text-gray-700 px-6 py-3'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
