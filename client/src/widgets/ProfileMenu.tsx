import { User } from "lucide-react";
import Button from "../shared/ui/button";
import { Link } from "react-router-dom";

export default function ProfileMenu() {
  return (
    <div className="relative inline-block group">
      <Button variant="ghost" icon={<User size={16} />} />

      {/* 빈틈을 pt-2로 부모 영역에 포함시켜 hover가 끊기지 않게 */}
      <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block">
        <div className="w-48 rounded-lg border border-gray-100 bg-white shadow-lg overflow-hidden animate-fadeIn">
          <Link
            to={"/user-info"}
            className="block px-4 py-2 hover:bg-primary/10 transition"
          >
            내 정보
          </Link>
          <Link
            to={"/user-order"}
            className="block px-4 py-2 hover:bg-primary/10 transition"
          >
            주문내역
          </Link>
        </div>
      </div>
    </div>
  );
}
