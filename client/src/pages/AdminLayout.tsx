import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r border-border p-4">
        <Link to={"/"}>
          <h1>한우마켓</h1>
        </Link>

        <h2 className="mb-8">Admin</h2>
        <nav className="space-y-4">
          <Link to="/admin/users" className="block hover:text-primary">
            유저 관리
          </Link>
          <Link to="/admin/products" className="block hover:text-primary">
            상품 관리
          </Link>
          <Link to="/admin/orders" className="block hover:text-primary">
            주문 관리
          </Link>
        </nav>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
