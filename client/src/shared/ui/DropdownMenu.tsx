type DropdownMenuProps = {
  list: string[];
};

function DropdownMenu({ list }: DropdownMenuProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden animate-fadeIn">
        {list.map((item, i) => (
          <a
            key={i}
            href="#"
            className="block px-4 py-2 hover:bg-primary/10 transition"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

export default DropdownMenu;
