import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-[#ddd6cc] bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Admin · Xà Động</h1>
      <p className="mt-2 text-sm text-[#7a6f62]">
        Đăng nhập để chỉnh giao diện blog hiển thị cho user.
      </p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-[#7a6f62]">Đang tải...</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
