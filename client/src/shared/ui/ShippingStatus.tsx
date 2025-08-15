import {
  statusBadgeClass,
  statusLabel,
  type OrderStatus,
} from "../../features/order/orderAPI";

function ShippingStatus({ status }: { status: OrderStatus }) {
  return (
    <div>
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClass[status]}`}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        {statusLabel[status]}
      </span>
    </div>
  );
}

export default ShippingStatus;
