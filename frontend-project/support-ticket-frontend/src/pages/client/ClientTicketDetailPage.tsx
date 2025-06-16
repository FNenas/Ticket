// src/pages/client/ClientTicketDetailPage.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketById, getTicketComments, addTicketComment } from '../../services/ticketService';
import { Ticket, TicketComment, AddCommentServicePayload } from '../../types/ticketTypes'; // Ensure AddCommentServicePayload is imported
import { useAuthStore } from '../../store/authStore';
import { toastSuccess, handleApiErrorToast } from '../../utils/toastHelper'; // Import

const ClientTicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // For page load error
  // const [commentError, setCommentError] = useState<string | null>(null); // Replaced by toast for comment error
  const [submittingComment, setSubmittingComment] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!id) {
      setError("Ticket ID is missing.");
      setLoading(false);
      return;
    }

    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const ticketData = await getTicketById(id);
        if (user?.role === 'CLIENT' && ticketData.client_user_id !== user.id) {
             handleApiErrorToast({ message: "Access Denied: You are not authorized to view this ticket." });
             setTicket(null);
        } else {
            setTicket(ticketData);
            const commentsData = await getTicketComments(id);
            setComments(commentsData);
        }
        setError(null); // Clear page load error
      } catch (err: any) {
        handleApiErrorToast(err, 'Failed to fetch ticket details.');
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTicketDetails();
  }, [id, user]);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    setSubmittingComment(true);
    // setCommentError(null); // Clear previous inline comment error
    // For clients, isInternalNote is not applicable or should be false.
    // The backend should enforce this if a client somehow sends isInternalNote: true.
    const payload: AddCommentServicePayload = { comment: newComment };
    try {
      const addedComment = await addTicketComment(id, payload);
      setComments([...comments, addedComment]);
      setNewComment('');
      toastSuccess('Comment added successfully!');
    } catch (err: any) {
      // setCommentError(err.response?.data?.message || 'Failed to add comment.');
      handleApiErrorToast(err, 'Failed to add comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading ticket details...</p>;
  // Error state for page load is still useful
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!ticket) return <p className="text-center text-red-500 mt-8">Ticket not found or access denied.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{ticket.subject}</h1>
                <p className="text-sm text-gray-500">Ticket ID: #{ticket.id}</p>
            </div>
            <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                {ticket.status}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(ticket.updated_at).toLocaleString()}</p>
            <p><strong>Client:</strong> {ticket.client_name} ({ticket.client_email})</p>
            {ticket.assigned_agent_name && <p><strong>Agent:</strong> {ticket.assigned_agent_name}</p>}
        </div>

        <div className="prose max-w-none mb-6"> {/* Consider adding @tailwindcss/typography for prose styling */}
            <h3 className="text-lg font-semibold">Description:</h3>
            <p className="whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Conversation</h2>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className={`p-3 rounded-lg max-w-xl clear-both ${comment.user_id === user?.id ? 'bg-blue-50 ml-auto' : 'bg-gray-100 mr-auto'}`}>
              <p className="font-semibold text-sm text-gray-700">
                {comment.user_name} <span className="text-xs text-gray-500">({comment.user_role})</span>
              </p>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.comment}</p>
              <p className="text-xs text-gray-400 text-right mt-1">{new Date(comment.created_at).toLocaleString()}</p>
            </div>
          ))}
          {comments.length === 0 && <p>No comments yet.</p>}
        </div>

        <form onSubmit={handleAddComment}>
          <textarea
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your comment here..."
            className="input-field w-full mb-2"
            required
            disabled={submittingComment}
          />
          {/* {commentError && <p className="text-red-500 text-sm mb-2">{commentError}</p>} Replaced by toast */}
          <button type="submit" className="btn-primary" disabled={submittingComment}>
            {submittingComment ? 'Adding Comment...' : 'Add Comment'}
          </button>
        </form>
      </div>
      <div className="mt-6">
        <Link to="/dashboard" className="link-style">
            &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
export default ClientTicketDetailPage;
