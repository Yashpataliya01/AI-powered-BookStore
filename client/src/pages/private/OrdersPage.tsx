// src/pages/private/OrdersPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

// Mock orders — replace with useGetOrdersQuery() from ordersApi when backend is ready
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2024-03-15',
    status: 'delivered' as const,
    total: 45.97,
    items: [
      { title: 'The Midnight Library', author: 'Matt Haig',    price: 14.99, quantity: 1, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=80&h=110&fit=crop' },
      { title: 'Atomic Habits',        author: 'James Clear',  price: 16.99, quantity: 1, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=80&h=110&fit=crop' },
      { title: 'The Alchemist',        author: 'Paulo Coelho', price: 11.99, quantity: 1, cover: 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=80&h=110&fit=crop' },
    ],
  },
  {
    id: 'ORD-002',
    date: '2024-02-28',
    status: 'shipped' as const,
    total: 30.98,
    items: [
      { title: 'Sapiens',     author: 'Yuval Noah Harari', price: 13.99, quantity: 1, cover: 'https://images.unsplash.com/photo-1531072901881-d644216d4bf9?w=80&h=110&fit=crop' },
      { title: 'Meditations', author: 'Marcus Aurelius',   price: 9.99,  quantity: 1, cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=80&h=110&fit=crop' },
      { title: 'Deep Work',   author: 'Cal Newport',       price: 14.49, quantity: 1, cover: 'https://images.unsplash.com/photo-1476275466078-4cdc8462c831?w=80&h=110&fit=crop' },
    ],
  },
];

const statusConfig = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200'       },
  shipped:   { label: 'Shipped',   color: 'bg-purple-100 text-purple-700 border-purple-200' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const OrdersPage: React.FC = () => (
  <div className="min-h-screen pt-24 pb-20">
    <div className="max-w-4xl mx-auto px-6 lg:px-10">
      <div className="mb-10">
        <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[var(--text-primary)]">My Orders</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{MOCK_ORDERS.length} orders placed</p>
      </div>

      {MOCK_ORDERS.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text-primary)] mb-2">No orders yet</h2>
          <p className="text-sm text-[var(--text-muted)] mb-8">Start exploring our collection and place your first order.</p>
          <Button as={Link as any} to="/shop" variant="primary" size="lg">Browse Books</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {MOCK_ORDERS.map(order => {
            const sc = statusConfig[order.status];
            return (
              <div key={order.id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)]">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Order</p>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{order.id}</p>
                    </div>
                    <div className="w-px h-8 bg-[var(--border)]" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Date</p>
                      <p className="text-sm text-[var(--text-primary)]">{new Date(order.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                    </div>
                    <div className="w-px h-8 bg-[var(--border)]" />
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Total</p>
                      <p className="text-sm font-bold text-[var(--text-primary)]">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>

                {/* Order items */}
                <div className="px-6 py-4 space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img src={item.cover} alt={item.title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{item.author}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[var(--text-primary)]">${item.price.toFixed(2)}</p>
                        <p className="text-xs text-[var(--text-muted)]">Qty {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-[var(--border)] flex gap-3">
                  <Button variant="outline" size="sm">Track Order</Button>
                  {order.status === 'delivered' && <Button variant="ghost" size="sm">Leave a Review</Button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

export default OrdersPage;
