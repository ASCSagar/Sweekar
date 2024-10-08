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
  Collapse,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ResourceCard = ({ resource, onResourceUpdated }) => {
  const [likes, setLikes] = useState(resource.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showHours, setShowHours] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [directionsVisible, setDirectionsVisible] = useState(false);

  const fetchComments = useCallback(async () => {
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
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert(`Resource: ${resource.name} copied to clipboard!`);
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
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
    }
  };

  useEffect(() => {
    fetchComments();
    // Check if user has liked this resource (optional, based on your implementation)
    setLiked(false); // Assuming you have logic to determine if the user liked it
  }, [fetchComments]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: "auto",
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.03)",
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
        subheader={resource.status}
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
        <Typography variant="body2" color="textSecondary">
          {resource.address}
        </Typography>
        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
          <PhoneIcon sx={{ mr: 1 }} color="action" />
          <Typography variant="body2">{resource.phone}</Typography>
        </Box>
        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
          <EmailIcon sx={{ mr: 1 }} color="action" />
          <Typography variant="body2">{resource.email}</Typography>
        </Box>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pl: 2,
          pb: 1,
          pr: 2,
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Tooltip title="Like">
            <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Comments">
            <IconButton onClick={() => setCommentDialogOpen(true)}>
              <CommentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Operating Hours">
            <IconButton onClick={() => setShowHours(true)}>
              <AccessTimeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Directions">
            <IconButton onClick={() => setDirectionsVisible(!directionsVisible)}>
              <DirectionsIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Operating Hours:</Typography>
          {resource.time ? (
            resource.time.split(", ").map((time, index) => (
              <Typography key={index} variant="body2" color="textSecondary">
                {time}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No operating hours available.
            </Typography>
          )}
        </CardContent>
      </Collapse>
      {directionsVisible && (
        <Box sx={{ mt: 2 }}>
          <Googlemap
            center={{ lat: resource.lat, lng: resource.lng }}
            destination={{ lat: resource.lat, lng: resource.lng }}
            directions={true}
          />
        </Box>
      )}

      {/* Comments Dialog */}
      <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)}>
        <DialogTitle>{editComment ? "Edit Comment" : "Add a Comment"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            label="Your Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            rows={4}
          />
          <Box sx={{ mt: 2 }}>
            {comments.map((comment) => (
              <Box key={comment.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{comment.user}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {comment.text}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => handleEditComment(comment)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleDeleteComment(comment.id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            color="primary"
          >
            {editComment ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Operating Hours Dialog */}
      <Dialog open={showHours} onClose={() => setShowHours(false)}>
        <DialogTitle>Operating Hours</DialogTitle>
        <DialogContent>
          {resource.time ? (
            resource.time.split(", ").map((time, index) => (
              <Typography key={index}>{time}</Typography>
            ))
          ) : (
            <Typography>No operating hours available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHours(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ResourceCard;
