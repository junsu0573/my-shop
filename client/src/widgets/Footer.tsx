import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">한우마켓</h3>
            <p className="text-sm mb-4">
              최고 품질의 한우만을 엄선하여 고객님께 신선하고 맛있는 한우를
              합리적인 가격에 제공합니다.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">고객 서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  주문/배송 조회
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  취소/교환/반품
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  1:1 문의
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  공지사항
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">회사 정보</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  회사 소개
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  사업자 정보
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  채용정보
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">연락처</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>1588-1234</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>hanwoo-bc@market.co.kr</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                <span>
                  경기도 화성시
                  <br />
                  우주동 5000
                </span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              <p>평일: 09:00 - 18:00</p>
              <p>토요일: 09:00 - 15:00</p>
              <p>일요일/공휴일: 휴무</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 한우마켓. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
