import { Link } from 'react-router-dom'; // Import Link

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card for Calculator Data Editor */}
            <Link to="/admin/calculator-data" className="block">
              <div className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Calculator Data</h2>
                  <p className="text-gray-600">Edit base costs, coefficients, room sizes, and work item percentages.</p>
                </div>
              </div>
            </Link>

            {/* Add more admin cards here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
