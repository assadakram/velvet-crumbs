import React, { useState } from 'react';
import { Tag, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export type Coupon = {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
};

type Props = {
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  disabled: boolean;
};

export default function PromoCode({ appliedCoupon, setAppliedCoupon, disabled }: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setAppliedCoupon(data.coupon);
      setCode('');
    } catch (err: any) {
      setError('Failed to apply promo code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    setError('');
  };

  return (
    <div className="bg-[#FFF9F5]/40 border border-orange-100/50 p-6 sm:p-8 rounded-3xl space-y-5">
      <div className="flex items-center gap-3 border-b border-orange-100 pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-[#F48B7D] text-sm font-bold">
          <Tag size={14} className="text-[#F48B7D]" />
        </span>
        <h3 className="font-bold text-base sm:text-lg text-[#F48B7D] uppercase tracking-wider">
          Promo Code
        </h3>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-emerald-800">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span className="font-bold text-base">{appliedCoupon.code}</span>
            <span className="text-sm font-medium bg-white px-2 py-1 rounded-lg border border-emerald-100 opacity-90">
              ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue} €`} off)
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-sm font-bold text-[#F48B7D] underline hover:text-rose-600 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (code.trim() && !disabled && !loading) {
                  handleApply();
                }
              }
            }}
            disabled={disabled || loading}
            className="flex-1 bg-white border border-orange-100 rounded-2xl px-5 py-4 text-sm sm:text-base text-gray-800 uppercase placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/40 focus:border-[#F48B7D] transition-all disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleApply}
            disabled={disabled || loading || !code.trim()}
            className="bg-[#F48B7D] text-white font-bold px-8 py-4 rounded-2xl hover:bg-rose-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px] h-[58px] sm:h-auto"
          >
            {loading ? <RefreshCw size={20} className="animate-spin" /> : 'Apply'}
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-2 font-medium bg-red-50 p-3 rounded-xl border border-red-100">
          <AlertCircle size={16} className="text-red-500" />
          {error}
        </div>
      )}
    </div>
  );
}
