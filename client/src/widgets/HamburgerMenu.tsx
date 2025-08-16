import { useState } from "react";
import { Menu } from "lucide-react";
import Button from "../shared/ui/button";
import { Link } from "react-router-dom";

function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <div
      className="relative inline-block group"
      onMouseLeave={() => setOpen(false)}
    >
      <Button
        variant="ghost"
        icon={<Menu size={16} />}
        onClick={toggleMenu}
        onMouseEnter={toggleMenu}
      />

      {open && (
        <div className="absolute right-0 top-full pt-2 hidden group-hover:block sm:block">
          <div className="w-48 rounded-lg border border-gray-100 bg-white shadow-lg overflow-hidden animate-fadeIn">
            <Link
              to={"/"}
              className="block px-4 py-2 hover:bg-primary/10 transition"
              onClick={() => setOpen(false)}
            >
              홈
            </Link>
            <Link
              to={"/products"}
              className="block px-4 py-2 hover:bg-primary/10 transition"
              onClick={() => setOpen(false)}
            >
              전체상품
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
