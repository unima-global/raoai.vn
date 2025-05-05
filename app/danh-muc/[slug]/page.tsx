import { createClient } from '@/utils/supabase/server';

export default async function DanhMucPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: parentCategory } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', params.slug)
    .single();

  const { data: subCats } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', parentCategory.id);

  const subCatIds = subCats?.map((c) => c.id);

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title')
    .in('category_id', subCatIds || [])
    .order('created_at', { ascending: false });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tin đăng trong {parentCategory?.name}</h1>
      <ul className="space-y-2">
        {posts?.map((post) => (
          <li key={post.id}>
            <a href={`/tin/${post.id}`} className="text-blue-600 hover:underline">
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
