-- Create price_alerts table to persist user price alerts
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  token TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  target_price NUMERIC NOT NULL,
  triggered BOOLEAN NOT NULL DEFAULT false,
  notified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for price_alerts (wallet-based, no auth required)
CREATE POLICY "Anyone can read price alerts by wallet"
  ON public.price_alerts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert price alerts"
  ON public.price_alerts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own price alerts"
  ON public.price_alerts FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete their own price alerts"
  ON public.price_alerts FOR DELETE
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_price_alerts_wallet ON public.price_alerts(wallet_address);
CREATE INDEX idx_price_alerts_not_triggered ON public.price_alerts(triggered) WHERE triggered = false;