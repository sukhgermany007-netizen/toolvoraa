import KundliPaymentResult from "./KundliPaymentResult";

type Props = {
  searchParams: Promise<{ order_id?: string | string[] }>;
};

export default async function KundliSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawOrderId = params.order_id;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] ?? "" : rawOrderId ?? "";

  return <KundliPaymentResult orderId={orderId} />;
}
