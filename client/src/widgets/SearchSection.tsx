import { useState } from "react";
import Button from "../shared/ui/button";
import Input from "../shared/ui/input";

interface SearchSectionProps {
  searchFunc: (input: string) => void;
}

function SearchSection({ searchFunc }: SearchSectionProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchFunc(searchInput);
  };
  return (
    <section className="relative bg-gradient-to-r from-slate-50 to-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 xl:px-0">
        <div className="grid xl:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
              최고 품질의
              <br />
              <span className="text-destructive">한우</span>를<br />
              집에서 만나보세요
            </h1>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>신선 보장</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>당일 배송</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>1등급 한우</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="상품이름으로 검색"
                className="flex-1"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" title="검색" className="px-5" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchSection;
