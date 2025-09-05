import type { GraphDoc } from './graphTypes';

export const sampleGraph: GraphDoc = {
  nodes: [
    { id: 'svc_checkout', label: 'checkout-service', kind: 'service', personaTags: ['Code','Infrastructure','Cloud','Product'] },
    { id: 'svc_cart', label: 'cart-service', kind: 'service', personaTags: ['Code','Infrastructure','Cloud','Product'] },
    { id: 'api_gw_checkout', label: 'API Gateway (checkout)', kind: 'resource', personaTags: ['Infrastructure','Cloud'] },
    { id: 'lambda_checkout', label: 'Lambda (checkout)', kind: 'resource', personaTags: ['Infrastructure','Cloud'] },
    { id: 'db_orders', label: 'DynamoDB (orders)', kind: 'db', personaTags: ['Infrastructure','Cloud'] },
    { id: 'wf_deploy_checkout', label: 'GHA deploy checkout', kind: 'workflow', personaTags: ['Infrastructure'] },
  ],
  edges: [
    { id: 'e1', from: 'svc_checkout', to: 'svc_cart', rel: 'relies_on' },
    { id: 'e2', from: 'svc_checkout', to: 'api_gw_checkout', rel: 'exposed_via' },
    { id: 'e3', from: 'api_gw_checkout', to: 'lambda_checkout', rel: 'runs_in' },
    { id: 'e4', from: 'lambda_checkout', to: 'db_orders', rel: 'reads_writes' },
    { id: 'e5', from: 'svc_checkout', to: 'wf_deploy_checkout', rel: 'deployed_by' },
  ],
}; 