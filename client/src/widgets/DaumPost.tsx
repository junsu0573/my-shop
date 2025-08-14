import { useDaumPostcodePopup } from "react-daum-postcode";
import Button from "../shared/ui/button";
import type { OrderFormData } from "../features/order/orderAPI";

type DaumPostProps = {
  disabled: boolean;
  setAddress: React.Dispatch<React.SetStateAction<OrderFormData>>;
};

const DaumPost = ({ disabled, setAddress }: DaumPostProps) => {
  const open = useDaumPostcodePopup(
    "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress((prev) => ({
      ...prev,
      shippingAddress: {
        address: fullAddress,
        detailAddress: prev.shippingAddress.detailAddress,
      },
    }));
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <Button
      type="button"
      title="주소검색"
      onClick={handleClick}
      className="px-4"
      disabled={disabled}
    />
  );
};

export default DaumPost;
