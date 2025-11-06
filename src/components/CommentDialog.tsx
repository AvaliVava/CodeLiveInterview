import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

// --- CommentDialog Component ---
// Displays a dialog allowing users to view/add comments & ratings for a specific interview.
function CommentDialog({ interviewId }: { interviewId: Id<"interviews"> }) {
  // Dialog open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Comment text input
  const [comment, setComment] = useState("");

  // Selected rating (1–5 stars)
  const [rating, setRating] = useState("3");

  // Convex mutation & queries
  const addComment = useMutation(api.comments.addComment); // To add a new comment
  const users = useQuery(api.users.getUsers); // Fetch all users (for displaying commenter info)
  const existingComments = useQuery(api.comments.getComments, { interviewId }); // Fetch comments for this interview

  // --- Handle form submission ---
  const handleSubmit = async () => {
    if (!comment.trim()) return toast.error("Please enter comment"); // Prevent empty comments

    try {
      // Call Convex mutation to save comment
      await addComment({
        interviewId,
        content: comment.trim(),
        rating: parseInt(rating),
      });

      // Reset form and close dialog
      toast.success("Comment submitted");
      setComment("");
      setRating("3");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit comment");
    }
  };

  // --- Helper function: renders filled/unfilled stars based on rating ---
  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <StarIcon
          key={starValue}
          className={`h-4 w-4 ${
            starValue <= rating ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );

  // Show nothing while data is loading
  if (existingComments === undefined || users === undefined) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* --- TRIGGER BUTTON --- */}
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          <MessageSquareIcon className="h-4 w-4 mr-2" />
          Add Comment
        </Button>
      </DialogTrigger>

      {/* --- DIALOG CONTENT --- */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Interview Comment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* --- EXISTING COMMENTS SECTION --- */}
          {existingComments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Previous Comments</h4>
                {/* Display total comment count */}
                <Badge variant="outline">
                  {existingComments.length} Comment
                  {existingComments.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {/* --- COMMENTS LIST --- */}
              <ScrollArea className="h-[240px]">
                <div className="space-y-4">
                  {existingComments.map((comment, index) => {
                    // Get interviewer info using helper
                    const interviewer = getInterviewerInfo(users, comment.interviewerId);
                    return (
                      <div key={index} className="rounded-lg border p-4 space-y-3">
                        {/* Comment header: avatar, name, date, rating */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={interviewer.image} />
                              <AvatarFallback>{interviewer.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{interviewer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(comment._creationTime, "MMM d, yyyy • h:mm a")}
                              </p>
                            </div>
                          </div>
                          {renderStars(comment.rating)}
                        </div>
                        {/* Comment content */}
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* --- ADD NEW COMMENT SECTION --- */}
          <div className="space-y-4">
            {/* Rating Dropdown */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      <div className="flex items-center gap-2">{renderStars(value)}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comment Textarea */}
            <div className="space-y-2">
              <Label>Your Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed comment about the candidate..."
                className="h-32"
              />
            </div>
          </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default CommentDialog;



