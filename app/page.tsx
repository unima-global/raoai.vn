import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = createClient();

  // Lấy danh mục cha
  const { data: parentCategories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name');

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh mục nổi bật</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parentCategories?.map((cat) => (
          <CategoryPreview key={cat.id} category={cat} />
        ))}
      </div>
    </main>
  );
}

async function CategoryPreview({ category }: { category: any }) {
  const supabase = createClient();

  // Lấy tin mới nhất trong danh mục con của category cha
  const { data: subCats } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', category.id);

  const subCatIds = subCats?.map((c) => c.id);

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title')
    .in('category_id', subCatIds || [])
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="border rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
      <ul className="list-disc list-inside text-sm">
        {posts?.map((post) => (
          <li key={post.id}>
            <Link href={`/tin/${post.id}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-2">
        <Link
          href={`/danh-muc/${category.slug}`}
          className="text-sm text-gray-600 hover:underline"
        >
          Xem tất cả tin trong {category.name}
        </Link>
      </div>
    </div>
  );
}
