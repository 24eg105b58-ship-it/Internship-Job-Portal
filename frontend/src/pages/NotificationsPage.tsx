import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { notificationApi } from '../api/notificationApi';
import { Notification, PagedResponse } from '../types';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatTimeAgo, formatDate } from '../utils/formatters';
import {
  Bell,
  CheckCheck,
  ExternalLink,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { markAsRead, markAllAsRead, refreshUnreadCount } = useNotifications();
  const [notificationsData, setNotificationsData] = useState<PagedResponse<Notification> | null>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const fetchPage = async () => {
    setIsLoading(true);
    try {
      const data = await notificationApi.getNotifications(page, 15);
      setNotificationsData(data);
      refreshUnreadCount();
    } catch (err) {
      console.error('Failed to load notifications page', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [page]);

  const handleMarkRead = async (id: number) => {
    await markAsRead(id);
    setNotificationsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map((n) => (n.id === id ? { ...n, read: true } : n)),
      };
    });
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotificationsData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map((n) => ({ ...n, read: true })),
      };
    });
  };

  const filteredContent = notificationsData?.content.filter((n) => {
    if (filterUnreadOnly) return !n.read;
    return true;
  }) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-600" />
            <span>Notification & Alert Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time notifications regarding job status changes, candidate pipeline updates, and platform alerts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              filterUnreadOnly
                ? 'bg-brand-50 border-brand-200 text-brand-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filterUnreadOnly ? 'Showing Unread' : 'Filter Unread'}
          </button>
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredContent.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description={
            filterUnreadOnly
              ? 'You have caught up with all notifications. No unread alerts.'
              : 'You have no notifications yet.'
          }
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {filteredContent.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.read) handleMarkRead(n.id);
              }}
              className={`p-5 hover:bg-slate-50 transition-colors flex items-start gap-4 ${
                !n.read ? 'bg-brand-50/30' : ''
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${
                  !n.read ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-slate-300'
                }`}
              />
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(n.createdAt)} ({formatTimeAgo(n.createdAt)})
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                {n.actionUrl && (
                  <div className="pt-2">
                    <Link
                      to={n.actionUrl}
                      onClick={() => {
                        if (!n.read) handleMarkRead(n.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                    >
                      View Details & Respond <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {notificationsData && notificationsData.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-600 px-2">
            Page {notificationsData.page + 1} of {notificationsData.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(notificationsData.totalPages - 1, prev + 1))}
            disabled={page >= notificationsData.totalPages - 1}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
