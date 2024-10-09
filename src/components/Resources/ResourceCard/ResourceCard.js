import React, { useState } from "react";
import { toast } from "react-toastify"; 
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
import DirectionsIcon from "@mui/icons-material/Directions";
import ShareIcon from "@mui/icons-material/Share";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CommentIcon from "@mui/icons-material/Comment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
} from "firebase/database";
import { auth } from "../../../firebase";
import Googlemap from "../../GoogleMap/GoogleMap";

const ResourceCard = ({ resource }) => {
  const user = auth.currentUser; // Get current logged-in user

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentResource, setCurrentResource] = useState(null);
  const [showHours, setShowHours] = useState(null);
  const [editComment, setEditComment] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [directionsVisible, setDirectionsVisible] = useState({});

  const handleClickOpen = (resource) => {
    setCurrentResource(resource);
    setOpen(true);

    // Fetch comments for the selected resource from Firebase
    const db = getDatabase();
    const commentsRef = ref(db, `comments/${resource.name}`);
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedComments = data
        ? Object.entries(data).map(([key, value]) => ({ id: key, ...value }))
        : [];
      setComments(fetchedComments);
    });
  };

  const handleClose = () => {
    setOpen(false);
    setComment("");
    setEditComment(false);
    setCurrentCommentId(null);
  };

  const handleSubmit = () => {
    const db = getDatabase();

    if (user) {
      if (editComment && currentCommentId) {
        const commentRef = ref(
          db,
          `comments/${currentResource.name}/${currentCommentId}`
        );
        set(commentRef, {
          userName: user.displayName || "Anonymous",
          comment,
          time: new Date().toLocaleString(),
        })
          .then(() => {
            toast.success("Comment Updated Successfully!");
            handleClose();
          })
          .catch((error) => {
            toast.error("Failed To Update Comment: " + error.message);
          });
      } else {
        const commentsRef = ref(db, `comments/${currentResource.name}`);
        const newCommentRef = push(commentsRef);

        set(newCommentRef, {
          userName: user.displayName || "Anonymous",
          comment,
          time: new Date().toLocaleString(),
        })
          .then(() => {
            toast.success("Comment Added Successfully!");
            handleClose();
          })
          .catch((error) => {
            toast.error("Failed To Add Comment: " + error.message);
          });
      }
    } else {
      toast.info("Please LogIn To Submit A Comment.");
    }
  };

  const handleDelete = (commentId) => {
    const db = getDatabase();
    const commentRef = ref(db, `comments/${currentResource.name}/${commentId}`);
    remove(commentRef)
      .then(() => {
        toast.success("Comment Deleted Successfully!");
      })
      .catch((error) => {
        toast.error("Error Deleting Comment: " + error.message);
      });
  };

  const handleEdit = (item) => {
    setComment(item.comment);
    setCurrentCommentId(item.id);
    setEditComment(true);
  };

  const handleDirections = (resourceId) => {
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
              <IconButton color={"error"}>
                <FavoriteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Comments">
              <IconButton onClick={() => handleClickOpen(resource)}>
                <CommentIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Operating Hours">
              <IconButton onClick={() => setShowHours(index)}>
                <AccessTimeIcon color="warning" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton>
                <ShareIcon color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Directions">
              <IconButton onClick={() => handleDirections(index)}>
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

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle
          sx={{ bgcolor: "#f5f5f5", color: "#333", textAlign: "center" }}
        >
          {editComment ? "Edit Your Comment" : "Add a Comment"}
        </DialogTitle>

        <Divider />

        <DialogContent dividers sx={{ py: 3 }}>
          <Box sx={{ mb: 3 }}>
            {comments.length > 0 ? (
              comments.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 2,
                    bgcolor: "#f9f9f9",
                    p: 2,
                    borderRadius: 1,
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label="resource"
                          sx={{ bgcolor: "#8e24aa" }}
                        >
                          {item.userName?.charAt(0)}
                        </Avatar>
                      }
                    />
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {item.userName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 1 }}
                      >
                        {item.comment}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      gap: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {user && user.displayName === item.userName && (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
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
            value={comment}
            variant="outlined"
            label={editComment ? "Edit Your Comment" : "Your Comment"}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editComment ? "Update Comment" : "Add Comment"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResourceCard;
