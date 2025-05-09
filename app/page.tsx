const renderPostCard = (post: any) => (
  <div key={post.id} className="bg-white shadow-sm border rounded-lg p-3 card-hover">
    <img
      src={`https://source.unsplash.com/400x300/?house,home,building&sig=${post.id}`}
      alt={post.title}
      className="w-full h-40 object-cover rounded"
    />
    <h3 className="font-semibold mt-2">{post.title}</h3>
    <p className="text-sm text-gray-500">{post.location}</p>
    <p className="text-sm mt-1">📅 {new Date(post.created_at).toLocaleString()}</p>
    <p className="text-sm mt-1">
      Trạng thái:{' '}
      <span className="text-green-600 font-medium">✅ Đang hiển thị</span>
    </p>
    <p className="text-blue-600 text-sm mt-2 block">Xem chi tiết</p>
  </div>
);
