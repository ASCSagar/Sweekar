import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DirectionsIcon from "@mui/icons-material/Directions";
import ShareIcon from "@mui/icons-material/Share";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CommentIcon from "@mui/icons-material/Comment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Googlemap from "../../GoogleMap/GoogleMap";

const ResourceCard = ({ resource, onResourceUpdated }) => {
  const [likes, setLikes] = useState(resource.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showHours, setShowHours] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [directionsVisible, setDirectionsVisible] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const commentsSnapshot = await getDocs(
        collection(db, `resources/${resource.id}/comments`)
      );
      const commentsList = commentsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setComments(commentsList);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [resource.id]);

  const handleLike = async () => {
    try {
      const resourceRef = doc(db, "resources", resource.id);
      const newLikes = liked ? likes - 1 : likes + 1;
      await updateDoc(resourceRef, { likes: newLikes });
      setLikes(newLikes);
      setLiked(!liked);
      if (onResourceUpdated) onResourceUpdated(resource.id, newLikes);
    } catch (error) {
      console.error("Error updating likes:", error);
      setError("Failed to update likes.");
    }
  };

  const handleShare = () => {
    const shareData = {
      title: resource.name,
      text: `Check out this resource: ${resource.name} located at ${resource.address}.`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Resource shared successfully."))
        .catch((error) => {
          console.error("Error sharing:", error);
          setError("Failed to share resource.");
        });
    } else {
      alert(`Resource: ${resource.name} copied to clipboard!`);
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
    setLoading(true);
    try {
      if (editComment) {
        await updateDoc(
          doc(db, `resources/${resource.id}/comments`, editComment.id),
          { text: newComment }
        );
        setEditComment(null);
      } else {
        await addDoc(collection(db, `resources/${resource.id}/comments`), {
          text: newComment,
          user: auth.currentUser?.displayName || "Anonymous",
          createdAt: new Date().toISOString(),
        });
      }
      setNewComment("");
      fetchComments();
      setCommentDialogOpen(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditComment(comment);
    setNewComment(comment.text);
    setCommentDialogOpen(true);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, `resources/${resource.id}/comments`, commentId));
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    setLiked(false);
  }, [fetchComments]);

  const toggleDirections = (resourceId) => {
    setDirectionsVisible((prev) => ({
      ...prev,
      [resourceId]: !prev[resourceId],
    }));
  };

  return (
    <>
      {resource?.map((resource, index) => (
        <Card
          key={index}
          sx={{
            maxWidth: 345,
            margin: "auto",
            borderRadius: "10px",
            backgroundColor: "#f5f5f5",
            boxShadow: "5px 5px 10px #d3d3d3 ",
            "&:hover": {
              transform: "scale(1.05)",
              transition: "0.3s",
            },
          }}
        >
          <CardHeader
            avatar={
              <Avatar aria-label="resource" sx={{ bgcolor: "#8e24aa" }}>
                {resource.name.charAt(0)}
              </Avatar>
            }
            title={resource.name}
          />
          {resource.photoUrl ? (
            <CardMedia
              component="img"
              height="194"
              image={resource.photoUrl}
              alt={resource.name}
            />
          ) : (
            <CardMedia
              component="img"
              height="194"
              image="https://via.placeholder.com/400x300.png?text=No+Image+Available"
              alt={resource.name}
            />
          )}

          <CardContent>
            <Typography
              variant="body2"
              sx={{ mt: 1, mb: 1, textAlign: "left" }}
            >
              <strong>Address : </strong> {resource.address}
            </Typography>
            <Divider />

            <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
              <EmailIcon sx={{ mr: 1 }} color="error" />
              {resource.email}
            </Box>

            <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
              <PhoneIcon sx={{ mr: 1 }} />
              {resource.phone}
            </Box>
          </CardContent>

          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title="Like">
              <IconButton
                onClick={handleLike}
                color={liked ? "error" : "default"}
              >
                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Comments"
              onClick={() => setCommentDialogOpen(true)}
            >
              <IconButton>
                <CommentIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Operating Hours">
              <IconButton onClick={() => setShowHours(index)}>
                <AccessTimeIcon color="warning" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton onClick={handleShare}>
                <ShareIcon color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Directions">
              <IconButton onClick={() => toggleDirections(index)}>
                <DirectionsIcon color="info" />
              </IconButton>
            </Tooltip>
          </Box>

          {directionsVisible[index] && (
            <Box sx={{ mt: 2 }}>
              <Googlemap
                center={{ lat: resource.lat, lng: resource.lng }}
                destination={{ lat: resource.lat, lng: resource.lng }}
                directions={true}
              />
            </Box>
          )}
          <Dialog
            fullWidth
            open={commentDialogOpen}
            onClose={() => {
              setCommentDialogOpen(false);
              setNewComment("");
              setEditComment(false);
            }}
          >
            <DialogTitle
              sx={{ bgcolor: "#f5f5f5", color: "#333", textAlign: "center" }}
            >
              {editComment ? "Edit Comment" : "Add a Comment"}
            </DialogTitle>

            <Divider />

            <DialogContent dividers sx={{ py: 3 }}>
              <Box sx={{ mb: 3 }}>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{
                        mb: 2,
                        bgcolor: "#f9f9f9",
                        p: 2,
                        borderRadius: 1,
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {comment.user}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 1 }}
                      >
                        {comment.text}
                      </Typography>
                      <Box
                        sx={{
                          gap: 1,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleEditComment(comment)}
                          variant="outlined"
                          sx={{ textTransform: "none" }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleDeleteComment(comment.id)}
                          color="error"
                          variant="outlined"
                          sx={{ textTransform: "none" }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: "center" }}
                  >
                    No Comments Available
                  </Typography>
                )}
              </Box>

              <TextField
                rows={4}
                fullWidth
                multiline
                sx={{ mb: 2 }}
                variant="outlined"
                value={newComment}
                label="Your Comment"
                onChange={(e) => setNewComment(e.target.value)}
              />
            </DialogContent>

            <Divider />

            <DialogActions sx={{ py: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setCommentDialogOpen(false);
                }}
                sx={{ color: "#333", textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleCommentSubmit}
                sx={{ textTransform: "none" }}
              >
                {editComment ? "Update" : "Submit"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            fullWidth
            open={showHours === index}
            onClose={() => setShowHours(null)}
          >
            <DialogTitle
              sx={{
                bgcolor: "#f5f5f5",
                color: "#333",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {resource.name} Operating Hours
            </DialogTitle>

            <Divider />

            <DialogContent dividers sx={{ py: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {resource.time.split(", ").map((time, idx) => (
                  <Typography
                    key={idx}
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: "#555",
                      textAlign: "center",
                    }}
                  >
                    {time}
                  </Typography>
                ))}
              </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ py: 2 }}>
              <Button
                onClick={() => setShowHours(null)}
                variant="contained"
                sx={{
                  bgcolor: "#1976d2",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "#115293",
                  },
                  px: 4,
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      ))}
    </>
  );
};

export default ResourceCard;
