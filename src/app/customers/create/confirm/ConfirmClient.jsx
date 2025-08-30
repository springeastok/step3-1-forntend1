"use client";

import OneCustomerInfoCard from "@/app/components/one_customer_info_card.jsx";
import fetchCustomer from "./fetchCustomer";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const customer_id = sp.get("customer_id");

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (!customer_id) {
      setError("customer_id が見つかりません。");
      setLoading(false);
      return;
    }
    const run = async () => {
      try {
        const customerData = await fetchCustomer(customer_id);
        setCustomer(customerData);
      } catch (e) {
        setError("顧客情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [customer_id]); // ← 依存に入れる

  if (loading) return <div className="m-4">読み込み中...</div>;
  if (error)   return <div className="m-4 text-red-600">{error}</div>;

  return (
    <div className="card bordered bg-white border-blue-200 border-2 max-w-sm m-4">
      <div className="alert alert-success p-4 text-center">正常に作成しました</div>

      {/* customer が null のまま広げると落ちるので条件付きで描画 */}
      {customer ? (
        <OneCustomerInfoCard {...customer} />
      ) : (
        <div className="p-4 text-gray-500">顧客データなし</div>
      )}

      <button onClick={() => router.push("/customers")}>
        <div className="btn btn-primary m-4 text-2xl">戻る</div>
      </button>
    </div>
  );
}
