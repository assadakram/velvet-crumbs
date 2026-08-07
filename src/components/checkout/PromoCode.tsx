import React, { useState } from 'react';
import { Tag, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

type Coupon = {
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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mt-6">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2 mb-4">
        <Tag size={16} className="text-orange-400" />
        Promo Code
      </h3>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 size={18} />
            <span className="font-bold">{appliedCoupon.code}</span>
            <span className="text-sm opacity-80">
              ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `${appliedCoupon.discountValue}€`} off)
            </span>
          </div>
          <button
            onClick={handleRemove}
            className="text-sm text-green-700 underline hover:text-green-800 transition"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={disabled || loading}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none uppercase text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || loading || !code.trim()}
            className="bg-gray-800 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center min-w-[80px]"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : 'Apply'}
          </button>
        </form>
      )}

      {error && (
        <div className="flex items-center gap-1 text-red-500 text-xs mt-2">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
}
