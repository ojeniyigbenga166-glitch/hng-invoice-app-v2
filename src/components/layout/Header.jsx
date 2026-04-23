import Button from '../ui/Button';

export default function Header({ invoiceCount = 7 }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8 md:mb-12">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600 text-sm md:text-base mt-1">There are {invoiceCount} total invoices</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
        {/* Filter Dropdown */}
        <div className="relative">
          <select className="w-full sm:w-auto appearance-none bg-transparent text-gray-900 font-semibold px-4 py-3 pr-8 rounded-lg border-0 cursor-pointer hover:text-purple-600 transition-colors">
            <option value="">Filter by status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <svg className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900 pointer-events-none mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* New Invoice Button */}
        <Button variant="primary" className="bg-purple-600 hover:shadow-lg">
          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
            <path d="M12 5v14m7-7H5" strokeWidth={2} stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">New Invoice</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </header>
  );
}
