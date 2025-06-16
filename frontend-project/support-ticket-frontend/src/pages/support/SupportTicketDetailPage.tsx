// src/pages/support/SupportTicketDetailPage.tsx
import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom'; // Removed useNavigate as it's not used
import { getTicketById, getTicketComments, addTicketComment, updateTicketStatus, assignTicketToAgent } from '../../services/ticketService';
import { Ticket, TicketComment, AddCommentServicePayload } from '../../types/ticketTypes';
import { useAuthStore } from '../../store/authStore';
import { toastSuccess, handleApiErrorToast, toastInfo } from '../../utils/toastHelper'; // Import

const SupportTicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate(); // Not used
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null); // For overall page load errors
  // const [commentError, setCommentError] = useState<string | null>(null); // Replaced by toast
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Ticket['status'] | ''>('');
  const [assignToAgentId, setAssignToAgentId] = useState<string>('');

  const user = useAuthStore((state) => state.user);

  const fetchTicketDetails = async (showLoadingSpinner = true) => {
    if (!id) {
      setPageError("Ticket ID is missing."); setLoading(false); return;
    }
    if(showLoadingSpinner) setLoading(true);
    try {
      const ticketData = await getTicketById(id);
      setTicket(ticketData);
      setSelectedStatus(ticketData.status);
      const commentsData = await getTicketComments(id);
      setComments(commentsData);
      setPageError(null);
    } catch (err: any) {
      handleApiErrorToast(err, 'Failed to fetch ticket details.');
      setTicket(null); // Clear ticket on error
    } finally {
      if(showLoadingSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    setSubmittingComment(true);
    const payload: AddCommentServicePayload = { comment: newComment, isInternalNote: isInternal };
    try {
      const addedComment = await addTicketComment(id, payload);
      setComments([...comments, addedComment]); // Optimistically update UI
      setNewComment('');
      setIsInternal(false);
      toastSuccess('Comment added successfully!');
      fetchTicketDetails(false); // Re-fetch ticket details to update updated_at timestamp potentially
    } catch (err: any) {
      handleApiErrorToast(err, 'Failed to add comment.');
    }
    finally { setSubmittingComment(false); }
  };

  const handleStatusChange = async () => {
    if (!id || !selectedStatus || selectedStatus === ticket?.status) return;
    try {
      const updatedTicket = await updateTicketStatus(id, selectedStatus);
      setTicket(updatedTicket);
      toastSuccess(`Ticket status updated to ${updatedTicket.status}.`);
    } catch (err: any) {
      handleApiErrorToast(err, 'Failed to update status.');
      setSelectedStatus(ticket?.status || ''); // Revert dropdown on error
    }
  };

  const handleAssignTicket = async () => {
    if(!id || !assignToAgentId) {
      toastInfo("Please enter or select an agent ID."); return;
    }
    const agentIdNum = parseInt(assignToAgentId, 10);
    if(isNaN(agentIdNum)) {
      toastError("Invalid Agent ID format."); return;
    }
    try {
        const updatedTicket = await assignTicketToAgent(id, agentIdNum);
        setTicket(updatedTicket);
        toastSuccess(`Ticket assigned to agent ID: ${agentIdNum}`);
        setAssignToAgentId('');
    } catch (err:any) {
        handleApiErrorToast(err, 'Failed to assign ticket.');
    }
  };

  if (loading) return <p className="text-center mt-8">Loading ticket details...</p>;
  if (pageError) return <p className="text-center text-red-500 mt-8">{pageError}</p>;
  if (!ticket) return <p className="text-center mt-8">Ticket not found.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{ticket.subject}</h1>
                <p className="text-sm text-gray-500">Ticket ID: #{ticket.id} by {ticket.client_name}</p>
            </div>
            <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(ticket.updated_at).toLocaleString()}</p>
            <p><strong>Client Email:</strong> {ticket.client_email}</p>
            <p><strong>Assigned Agent:</strong> {ticket.assigned_agent_name || 'Unassigned'}</p>
        </div>
        <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-semibold">Description:</h3><p className="whitespace-pre-wrap">{ticket.description}</p>
        </div>

        <div className="border-t pt-4 mt-4 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
            <div className="flex items-center space-x-2">
                <label htmlFor="status" className="font-semibold text-sm">Status:</label>
                <select id="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as Ticket['status'])} className="input-field py-1 text-sm">
                    <option value="Open">Open</option>
                    <option value="In Process">In Process</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                </select>
                <button onClick={handleStatusChange} className="btn-primary py-1 px-3 text-sm" disabled={selectedStatus === ticket.status}>Update Status</button>
            </div>
             <div className="flex items-center space-x-2">
                <label htmlFor="assignAgent" className="font-semibold text-sm">Assign to Agent ID:</label>
                <input type="text" id="assignAgent" value={assignToAgentId} onChange={(e) => setAssignToAgentId(e.target.value)} placeholder="Agent ID" className="input-field py-1 w-24 text-sm"/>
                <button onClick={handleAssignTicket} className="btn-secondary py-1 px-3 text-sm">Assign</button>
            </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Conversation</h2>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id}
                 className={`p-3 rounded-lg max-w-xl clear-both
                            ${comment.user_id === user?.id ? 'bg-sky-100 ml-auto' : 'bg-slate-100 mr-auto'}
                            ${comment.is_internal_note ? 'border-l-4 border-orange-400' : ''}`}>
              <p className="font-semibold text-sm text-gray-700">
                {comment.user_name} <span className="text-xs text-gray-500">({comment.user_role})</span>
                {comment.is_internal_note && <span className="text-xs text-orange-600 font-bold ml-2">[INTERNAL NOTE]</span>}
              </p>
              <p className="text-gray-800 whitespace-pre-wrap">{comment.comment}</p>
              <p className="text-xs text-gray-400 text-right mt-1">{new Date(comment.created_at).toLocaleString()}</p>
            </div>
          ))}
          {comments.length === 0 && <p>No comments yet.</p>}
        </div>
        <form onSubmit={handleAddComment}>
          <textarea rows={4} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Type your comment..." className="input-field w-full mb-2" required disabled={submittingComment} />
          <div className="flex justify-between items-center">
            <button type="submit" className="btn-primary" disabled={submittingComment}>
              {submittingComment ? 'Adding...' : 'Add Comment'}
            </button>
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="form-checkbox h-4 w-4 text-orange-600"/>
              <span>Internal Note</span>
            </label>
          </div>
          {/* {commentError && <p className="text-red-500 text-sm mt-2">{commentError}</p>} Replaced by toast */}
        </form>
      </div>
      <div className="mt-6">
        <Link to="/support/dashboard" className="link-style">
            &larr; Back to Support Dashboard
        </Link>
      </div>
    </div>
  );
};
export default SupportTicketDetailPage;
