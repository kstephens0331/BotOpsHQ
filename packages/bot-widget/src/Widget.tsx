import React from 'react';

type WidgetProps = {
  tenantId: string;
  botId: string;
  config?: Record<string, any>;
};

export const Widget = ({ tenantId, botId }: WidgetProps) => {
  return (
    <div className="botops-widget">
      {/* Chat interface implementation */}
    </div>
  );
};