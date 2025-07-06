import { Suspense } from 'react';
import { getCategories } from '@/app/lib/actions';

// Loading component for Suspense fallback
function CategoryLoading() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
      <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
    </div>
  );
}

// Server component that fetches categories
async function CategoryData({ children }: { children: (categories: any[]) => React.ReactNode }) {
  // Fetch categories from the server
  const categories = await getCategories();

  // Pass categories to children
  return children(categories);
}

// Provider component that wraps the CategoryData with Suspense
export function CategoryProvider({ children }: { children: (categories: any[]) => React.ReactNode }) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryData>{children}</CategoryData>
    </Suspense>
  );
}
