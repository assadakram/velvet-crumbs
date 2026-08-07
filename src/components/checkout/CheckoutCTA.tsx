import React from "react";

interface CheckoutCTAProps {
  t: (key: string) => string;
  finalTotal: number;
  paymentAcknowledge: boolean;
  setPaymentAcknowledge: (val: boolean) => void;
  validationError: string;
  isRedirecting: boolean;
  handleOrderSubmit: (e: React.FormEvent) => void;
  isCurrentlyPaused?: boolean;
}

export default function CheckoutCTA({
  t,
  finalTotal,
  paymentAcknowledge,
  setPaymentAcknowledge,
  validationError,
  isRedirecting,
  handleOrderSubmit,
  isCurrentlyPaused = false,
}: CheckoutCTAProps) {
  return (
    <div id="checkout-cta-section" className="bg-[#F48B7D] text-white p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-lg">
      <div className="space-y-1">
        <p className="text-xs uppercase font-bold tracking-widest opacity-80">
          {t('estTotal')}
        </p>
        <div className="text-4xl sm:text-5xl font-extrabold font-serif">
          {finalTotal.toFixed(2).replace('.', ',')} €
        </div>
        <p className="text-xs opacity-75">
          {t('waWarning')}
        </p>
      </div>

      <div className="bg-white border border-rose-100 rounded-2xl p-4.5 text-left space-y-2 max-w-md mx-auto text-[11px] sm:text-xs shadow-md">
        <h4 className="font-bold flex items-center gap-1.5 text-amber-700">
          <span>💡</span> {t('payTitle')}
        </h4>
        <p className="text-gray-600 leading-relaxed font-medium">
          {t('payDesc')}
        </p>
      </div>

      <label className="cursor-pointer flex items-start gap-3 max-w-md mx-auto text-left text-white/95 text-[11px] sm:text-xs font-semibold select-none mt-3.5 group">
        <div className="relative shrink-0 mt-0.5">
          <input 
            type="checkbox" 
            checked={paymentAcknowledge} 
            onChange={(e) => setPaymentAcknowledge(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            paymentAcknowledge 
              ? 'bg-white border-white text-[#F48B7D] scale-105 shadow-md' 
              : 'border-white/50 bg-white/10 group-hover:border-white group-hover:bg-white/20'
          }`}>
            {paymentAcknowledge && (
              <svg className="w-3.5 h-3.5 stroke-current stroke-[3.5] fill-none" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <span className="leading-relaxed">
          {t('payAck')}
        </span>
      </label>

      {validationError && (
        <div className="bg-white/15 border border-white/25 text-rose-50 text-xs sm:text-sm font-bold p-3 rounded-xl max-w-md mx-auto">
          {validationError}
        </div>
      )}

      <button 
        type="submit" 
        onClick={handleOrderSubmit}
        disabled={isRedirecting || isCurrentlyPaused}
        className={`w-full max-w-md mx-auto px-6 py-4 rounded-xl font-bold text-base sm:text-lg shadow-md duration-200 transition-all flex items-center justify-center gap-2 ${
          isCurrentlyPaused 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white text-[#F48B7D] hover:bg-rose-50 cursor-pointer active:scale-95'
        }`}
      >
        <span>{isCurrentlyPaused ? '🔒' : '📲'}</span>
        <span>{isCurrentlyPaused ? t('ordersPaused') : t('btnSendWA')}</span>
      </button>

      <p className="text-xs opacity-75 italic">
        {t('waNote')}
      </p>
    </div>
  );
}
